import { NextRequest, NextResponse } from 'next/server';
import { query, isPostgreSQLConfigured } from '@/lib/database';
import { createServerSupabaseClient } from '@/lib/supabase';

// Rate limiting implementation
const RATE_LIMIT = 30; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const ipRequestCounts = new Map<string, { count: number, resetTime: number }>();

function getRateLimitInfo(ip: string): { count: number, resetTime: number } {
  const now = Date.now();
  let info = ipRequestCounts.get(ip);
  
  if (!info || now > info.resetTime) {
    info = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    ipRequestCounts.set(ip, info);
  }
  
  return info;
}

function isRateLimited(ip: string): boolean {
  const info = getRateLimitInfo(ip);
  info.count++;
  
  return info.count > RATE_LIMIT;
}

interface ChefIARequest {
  recipeId: string;
  stepNumber: number;
  question: string;
}

interface OllamaResponse {
  response: string;
  done: boolean;
  context?: number[];
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
        },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
          }
        }
      );
    }

    // Authenticate user
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body: ChefIARequest = await request.json();
    const { recipeId, stepNumber, question } = body;

    // Validation des paramètres
    if (!recipeId || !stepNumber || !question) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing parameters: recipeId, stepNumber and question are required',
        },
        { status: 400 }
      );
    }

    if (!isPostgreSQLConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database not configured',
        },
        { status: 503 }
      );
    }

    // Récupérer les détails de la recette depuis la base de données
    const recipeQuery = `
      SELECT 
        r.*,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'name', i.name,
              'amount', i.amount,
              'unit', i.unit,
              'optional', i.optional,
              'order_index', i.order_index
            ) ORDER BY i.order_index
          ) FILTER (WHERE i.id IS NOT NULL), 
          '[]'
        ) as ingredients,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'step_number', inst.step_number,
              'description', inst.description,
              'duration', inst.duration,
              'title', inst.title
            ) ORDER BY inst.step_number
          ) FILTER (WHERE inst.id IS NOT NULL), 
          '[]'
        ) as steps
      FROM recipes r
      LEFT JOIN ingredients i ON r.id = i.recipe_id
      LEFT JOIN instructions inst ON r.id = inst.recipe_id
      WHERE r.id = $1 AND r.is_public = true
      GROUP BY r.id
    `;

    const recipeResult = await query(recipeQuery, [recipeId]);

    if (recipeResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Recipe not found',
        },
        { status: 404 }
      );
    }

    const recipe = recipeResult.rows[0];
    const currentStep = recipe.steps.find((step: any) => step.step_number === stepNumber);

    if (!currentStep) {
      return NextResponse.json(
        {
          success: false,
          error: `Step ${stepNumber} not found for this recipe`,
        },
        { status: 404 }
      );
    }

    // Construire le prompt structuré pour l'IA
    const prompt = buildChefIAPrompt(recipe, currentStep, stepNumber, question);

    // Appeler l'API Ollama
    const aiResponse = await callOllamaAPI(prompt);

    // Log the interaction for analytics
    if (user) {
      await supabase.from('ai_interactions').insert({
        user_id: user.id,
        recipe_id: recipeId,
        step_number: stepNumber,
        question,
        answer: aiResponse,
        created_at: new Date().toISOString()
      }).catch(() => {
        // Silently fail if logging fails
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        question,
        answer: aiResponse,
        context: {
          recipeTitle: recipe.title,
          currentStep: stepNumber,
          totalSteps: recipe.steps.length,
          stepDescription: currentStep.description,
        },
      },
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
        fallback: 'I\'m sorry, I can\'t answer your question at the moment. Please check the written recipe instructions.',
      },
      { status: 500 }
    );
  }
}

function buildChefIAPrompt(recipe: any, currentStep: any, stepNumber: number, question: string): string {
  const ingredients = recipe.ingredients.map((ing: any) => 
    `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim()
  ).join('\n');

  const prompt = `You are Chefito, an intelligent and supportive culinary assistant specialized in helping beginners in the kitchen.

RECIPE CONTEXT:
Recipe: ${recipe.title}
Total time: ${recipe.prep_time + recipe.cook_time} minutes
Servings: ${recipe.servings}
Difficulty: ${recipe.difficulty}

INGREDIENTS:
${ingredients}

CURRENT STEP:
Step ${stepNumber} of ${recipe.steps.length}: ${currentStep.description}
${currentStep.duration ? `Estimated duration: ${currentStep.duration} minutes` : ''}

USER QUESTION:
"${question}"

INSTRUCTIONS:
- Answer only based on the context of this recipe and this step
- Be precise, encouraging and educational
- If the question is not about this step or recipe, politely redirect to the instructions
- Give practical tips and beginner advice
- Use a friendly and reassuring tone
- Limit your response to 150 words maximum
- If you cannot answer with certainty, clearly say so

Now answer the user's question:`;

  return prompt;
}

async function callOllamaAPI(prompt: string): Promise<string> {
  const ollamaEndpoint = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434/api/generate';
  const ollamaModel = process.env.OLLAMA_MODEL || 'llama3:8b-instruct-q4_K_M';

  try {
    const response = await fetch(ollamaEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: ollamaModel,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 200,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data: OllamaResponse = await response.json();
    
    if (!data.response) {
      throw new Error('Empty response from Ollama API');
    }

    return data.response.trim();

  } catch (error: any) {
    // Fallback response
    return "I'm sorry, I can't answer your question at the moment. Please check the written recipe instructions or try again in a few moments.";
  }
}