import { NextRequest, NextResponse } from 'next/server';
import { query, isPostgreSQLConfigured } from '@/lib/database';
import { rateLimit } from '@/lib/rateLimit';

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
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip)) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }
    const body: ChefIARequest = await request.json();
    const { recipeId, stepNumber, question } = body;

    // Validation des paramètres
    if (!recipeId || !stepNumber || !question) {
      return NextResponse.json(
        {
          success: false,
          error: 'Paramètres manquants: recipeId, stepNumber et question sont requis',
        },
        { status: 400 }
      );
    }

    if (!isPostgreSQLConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Base de données non configurée',
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
          error: 'Recette non trouvée',
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
          error: `Étape ${stepNumber} non trouvée pour cette recette`,
        },
        { status: 404 }
      );
    }

    // Construire le prompt structuré pour l'IA
    const prompt = buildChefIAPrompt(recipe, currentStep, stepNumber, question);

    // Appeler l'API Ollama
    const aiResponse = await callOllamaAPI(prompt);

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
        error: error.message || 'Erreur interne du serveur',
        fallback: 'Je suis désolé, je ne peux pas répondre à votre question pour le moment. Veuillez consulter les instructions écrites de la recette.',
      },
      { status: 500 }
    );
  }
}

function buildChefIAPrompt(recipe: any, currentStep: any, stepNumber: number, question: string): string {
  const ingredients = recipe.ingredients.map((ing: any) => 
    `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim()
  ).join('\n');

  const prompt = `Tu es Chefito, un assistant culinaire intelligent et bienveillant spécialisé dans l'aide aux débutants en cuisine.

CONTEXTE DE LA RECETTE:
Recette: ${recipe.title}
Temps total: ${recipe.prep_time + recipe.cook_time} minutes
Portions: ${recipe.servings}
Difficulté: ${recipe.difficulty}

INGRÉDIENTS:
${ingredients}

ÉTAPE ACTUELLE:
Étape ${stepNumber} sur ${recipe.steps.length}: ${currentStep.description}
${currentStep.duration ? `Durée estimée: ${currentStep.duration} minutes` : ''}

QUESTION DE L'UTILISATEUR:
"${question}"

INSTRUCTIONS:
- Réponds uniquement en te basant sur le contexte de cette recette et de cette étape
- Sois précis, encourageant et pédagogique
- Si la question ne concerne pas cette étape ou cette recette, redirige poliment vers les instructions
- Donne des conseils pratiques et des astuces de débutant
- Utilise un ton amical et rassurant
- Limite ta réponse à 150 mots maximum
- Si tu ne peux pas répondre avec certitude, dis-le clairement

Réponds maintenant à la question de l'utilisateur:`;

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
      throw new Error('Réponse vide de l\'API Ollama');
    }

    return data.response.trim();

  } catch (error: any) {
    
    // Fallback response
    return "Je suis désolé, je ne peux pas répondre à votre question pour le moment. Veuillez consulter les instructions écrites de la recette ou réessayer dans quelques instants.";
  }
}