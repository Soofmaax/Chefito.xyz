// AI Cooking Assistant function for Netlify
const { Pool } = require('pg');
const https = require('https');

// PostgreSQL connection
let pool;
try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
} catch (error) {
  console.error('Error initializing database pool:', error);
}

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

  try {
    // Check if database is configured
    if (!pool) {
      return {
        statusCode: 503,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false, 
          error: 'Database not configured' 
        }),
      };
    }

    const body = JSON.parse(event.body);
    const { recipeId, stepNumber, question } = body;

    // Validation
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
        SELECT * FROM recipes WHERE id = $1 AND is_public = true
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
      
      // Get ingredients
      const ingredientsQuery = `
        SELECT name, amount, unit, optional, order_index
        FROM ingredients
        WHERE recipe_id = $1
        ORDER BY order_index
      `;
      
      const ingredientsResult = await pool.query(ingredientsQuery, [recipeId]);
      ingredients = ingredientsResult.rows.map(ing => 
        `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim()
      );
      
      // Get instructions
      const instructionsQuery = `
        SELECT step_number, description, duration, title
        FROM instructions
        WHERE recipe_id = $1
        ORDER BY step_number
      `;
      
      const instructionsResult = await pool.query(instructionsQuery, [recipeId]);
      steps = instructionsResult.rows.map(step => step.description);
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // Demo recipe if database query fails
      recipe = {
        id: recipeId,
        title: 'Perfect Scrambled Eggs',
        description: 'Learn the fundamentals of cooking with this beginner-friendly scrambled eggs recipe.',
        difficulty: 'beginner',
        prep_time: 5,
        cook_time: 5,
        servings: 1,
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
    
    // Build the prompt for Ollama
    const prompt = buildChefIAPrompt(recipe, currentStep, stepNumber, steps.length, ingredients, question);

    // Generate AI response
    const aiResponse = await generateAIResponse(prompt);

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        data: {
          question,
          answer: aiResponse,
          context: {
            recipeTitle: recipe.title,
            currentStep: stepNumber,
            totalSteps: steps.length,
            stepDescription: currentStep,
          },
        },
      }),
    };
  } catch (error) {
    console.error('Error in chef-ia function:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
        fallback: "I'm sorry, I can't answer your question at the moment. Please check the written recipe instructions.",
      }),
    };
  }
};

function buildChefIAPrompt(recipe, currentStep, stepNumber, totalSteps, ingredients, question) {
  return `You are Chefito, an intelligent and supportive culinary assistant specialized in helping beginners in the kitchen.

RECIPE CONTEXT:
Recipe: ${recipe.title}
Total time: ${recipe.prep_time + recipe.cook_time} minutes
Servings: ${recipe.servings}
Difficulty: ${recipe.difficulty}

INGREDIENTS:
${ingredients.join('\n')}

CURRENT STEP:
Step ${stepNumber} of ${totalSteps}: ${currentStep}

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
}

async function generateAIResponse(prompt) {
  const ollamaEndpoint = process.env.OLLAMA_ENDPOINT;
  const ollamaModel = process.env.OLLAMA_MODEL || 'llama3:8b-instruct-q4_K_M';
  
  if (!ollamaEndpoint) {
    return "I'm sorry, I can't answer your question at the moment. Please check the written recipe instructions or try again in a few moments.";
  }
  
  try {
    // Extract hostname and path from endpoint
    const url = new URL(ollamaEndpoint);
    
    const requestData = JSON.stringify({
      model: ollamaModel,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 200,
      },
    });
    
    const response = await new Promise((resolve, reject) => {
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestData),
        },
      };
      
      const req = (url.protocol === 'https:' ? https : require('http')).request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          if (res.statusCode !== 200) {
            return reject(new Error(`Ollama API error: ${res.statusCode}`));
          }
          resolve(data);
        });
      });
      
      req.on('error', reject);
      req.write(requestData);
      req.end();
    });
    
    const data = JSON.parse(response);
    
    if (!data.response) {
      throw new Error('Empty response from Ollama API');
    }
    
    return data.response.trim();
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    return "I'm sorry, I can't answer your question at the moment. Please check the written recipe instructions or try again in a few moments.";
  }
}