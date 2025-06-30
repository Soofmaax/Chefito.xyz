// Netlify function for AI cooking assistant
const { Pool } = require('pg');

// PostgreSQL connection to your VPS
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { recipeId, stepNumber, question } = body;

    if (!recipeId || stepNumber === undefined || !question) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: recipeId, stepNumber, or question',
        }),
      };
    }

    // Get recipe data from database
    let recipe;
    let ingredients;
    let steps;

    try {
      // Fetch recipe from database
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

      const result = await pool.query(recipeQuery, [recipeId]);

      if (result.rows.length === 0) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: 'Recipe not found',
          }),
        };
      }

      recipe = result.rows[0];
      ingredients = Array.isArray(recipe.ingredients) 
        ? recipe.ingredients.map((ing) => `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim())
        : [];
      steps = Array.isArray(recipe.steps) 
        ? recipe.steps.map((step) => step.description) 
        : [];
    } catch (dbError) {
      
      // Demo recipe if database query fails
      recipe = {
        id: recipeId,
        title: 'Perfect Scrambled Eggs',
        description: 'Learn the fundamentals of cooking with this beginner-friendly scrambled eggs recipe.',
        difficulty: 'beginner',
      };
      ingredients = [
        '3 large eggs', 
        '1 tablespoon butter', 
        'Salt to taste', 
        'Black pepper to taste'
      ];
      steps = [
        'Crack 3 eggs into a bowl',
        'Add a pinch of salt and pepper',
        'Whisk eggs until well combined',
        'Heat butter in a non-stick pan over low heat',
        'Pour eggs into the pan',
        'Gently stir with a spatula as eggs cook',
        'Remove from heat when eggs are still slightly wet',
        'Serve immediately'
      ];
    }

    // Get the current step
    const currentStep = steps[stepNumber - 1] || 'Unknown step';
    
    // Common cooking tools
    const commonTools = [
      'knife', 'cutting board', 'spatula', 'whisk', 'bowl', 'pan', 'pot', 
      'measuring cup', 'measuring spoon', 'wooden spoon', 'tongs'
    ];

    // Build the prompt for Ollama
    const prompt = `
You are Chefito, a smart cooking assistant.
You only answer based on the following context:

Recipe: ${recipe.title}
Step ${stepNumber}/${steps.length}: ${currentStep}
Ingredients: ${ingredients.join(', ')}
Tools: ${commonTools.join(', ')}
Difficulty level: ${recipe.difficulty}

User question: "${question}"

Respond in a friendly, helpful tone. Keep your answer concise (under 150 words) and focused on the specific question.
If the question is not related to cooking or this recipe, politely redirect the user to ask about cooking.
`;

    // Call Ollama API
    try {
      const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3:8b-instruct-q4_K_M',
          prompt: prompt,
          stream: false
        }),
      });

      if (!ollamaResponse.ok) {
        throw new Error(`Ollama API error: ${ollamaResponse.statusText}`);
      }

      const data = await ollamaResponse.json();
      
      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          answer: data.response,
        }),
      };
    } catch (ollamaError) {
      
      // Fallback response if Ollama is not available
      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          answer: `Je suis désolé, j'ai du mal à me connecter à mon cerveau culinaire en ce moment. Pour votre question sur "${question}" concernant ${recipe.title}, je vous recommande de vérifier attentivement les instructions de la recette ou de faire une recherche rapide sur internet pour obtenir des conseils de cuisine spécifiques.`,
          error: ollamaError.message,
        }),
      };
    }
  } catch (error) {
    
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        error: error.message || 'Failed to process your question',
      }),
    };
  }
};