// Recipe API function for Netlify
const { Pool } = require('pg');

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
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

    const { httpMethod, path } = event;
    
    // Parse the path to get recipe ID if present
    const pathParts = path.split('/');
    const recipeId = pathParts[pathParts.length - 1];
    const isRecipeDetail = recipeId && recipeId !== 'recipes';

    // Handle different HTTP methods
    switch (httpMethod) {
      case 'GET':
        if (isRecipeDetail) {
          return await getRecipe(recipeId);
        } else {
          return await getRecipes(event.queryStringParameters || {});
        }
      
      default:
        return {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
    };
  }
};

async function getRecipes(params) {
  const { page = '1', limit = '12', search } = params;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    // Build query
    let queryText = `
      SELECT id, title, description, image_url, prep_time, cook_time, 
             servings, difficulty, category, cuisine, tags, rating
      FROM recipes 
      WHERE is_public = true
    `;
    
    const queryParams = [];
    
    if (search) {
      queryText += ` AND (title ILIKE $1 OR description ILIKE $1)`;
      queryParams.push(`%${search}%`);
    }
    
    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM recipes WHERE is_public = true`,
      search ? [`%${search}%`] : []
    );
    
    const total = parseInt(countResult.rows[0].count);
    
    // Get recipes with pagination
    queryText += ` ORDER BY created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(parseInt(limit), offset);
    
    const result = await pool.query(queryText, queryParams);
    
    // Return formatted response
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        data: result.rows,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        has_more: total > offset + parseInt(limit),
      }),
    };
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch recipes' 
      }),
    };
  }
}

async function getRecipe(id) {
  try {
    const recipeQuery = `
      SELECT * FROM recipes WHERE id = $1 AND is_public = true
    `;
    
    const result = await pool.query(recipeQuery, [id]);
    
    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false, 
          error: 'Recipe not found' 
        }),
      };
    }
    
    // Get ingredients
    const ingredientsQuery = `
      SELECT name, amount, unit, optional, order_index
      FROM ingredients
      WHERE recipe_id = $1
      ORDER BY order_index
    `;
    
    const ingredientsResult = await pool.query(ingredientsQuery, [id]);
    
    // Get instructions
    const instructionsQuery = `
      SELECT step_number, description, duration, title
      FROM instructions
      WHERE recipe_id = $1
      ORDER BY step_number
    `;
    
    const instructionsResult = await pool.query(instructionsQuery, [id]);
    
    // Combine data
    const recipe = {
      ...result.rows[0],
      ingredients: ingredientsResult.rows.map(ing => 
        `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim()
      ),
      steps: instructionsResult.rows.map(step => step.description)
    };
    
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        data: recipe,
      }),
    };
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch recipe' 
      }),
    };
  }
}