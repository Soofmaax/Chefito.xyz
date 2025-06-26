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
    const { httpMethod, path, queryStringParameters, body } = event;
    
    // Parse the path to get recipe ID if present
    const pathParts = path.split('/');
    const recipeId = pathParts[pathParts.length - 1];
    const isRecipeDetail = recipeId && recipeId !== 'recipes';

    switch (httpMethod) {
      case 'GET':
        if (isRecipeDetail) {
          return await getRecipe(recipeId);
        } else {
          return await getRecipes(queryStringParameters || {});
        }
      
      case 'POST':
        return await createRecipe(JSON.parse(body || '{}'));
      
      case 'PUT':
        if (isRecipeDetail) {
          return await updateRecipe(recipeId, JSON.parse(body || '{}'));
        }
        break;
      
      case 'DELETE':
        if (isRecipeDetail) {
          return await deleteRecipe(recipeId);
        }
        break;
      
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
  const { page = '1', limit = '12', search, category, difficulty } = params;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    // Build WHERE clause
    let whereClause = 'WHERE is_public = true';
    const queryParams = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (category) {
      whereClause += ` AND category = $${paramIndex}`;
      queryParams.push(category);
      paramIndex++;
    }

    if (difficulty) {
      whereClause += ` AND difficulty = $${paramIndex}`;
      queryParams.push(difficulty);
      paramIndex++;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM recipes ${whereClause}`;
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Get recipes with pagination
    const recipesQuery = `
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
      ${whereClause}
      GROUP BY r.id
      ORDER BY r.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(parseInt(limit), offset);
    const result = await pool.query(recipesQuery, queryParams);

    // Transform the data
    const recipes = result.rows.map(row => ({
      ...row,
      ingredients: Array.isArray(row.ingredients) ? row.ingredients.map((ing) => 
        `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim()
      ) : [],
      steps: Array.isArray(row.steps) ? row.steps.map((step) => step.description) : []
    }));

    const hasMore = total > offset + parseInt(limit);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: recipes,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        has_more: hasMore,
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

    const recipe = result.rows[0];

    // Transform the data
    const transformedRecipe = {
      ...recipe,
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.map((ing) => 
        `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim()
      ) : [],
      steps: Array.isArray(recipe.steps) ? recipe.steps.map((step) => step.description) : []
    };

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: transformedRecipe,
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

async function createRecipe(recipeData) {
  try {
    // Validate required fields
    const requiredFields = ['title', 'description', 'image_url', 'prep_time', 'cook_time', 'servings', 'difficulty', 'category', 'cuisine'];
    for (const field of requiredFields) {
      if (!recipeData[field]) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ 
            success: false, 
            error: `Missing required field: ${field}` 
          }),
        };
      }
    }

    // Insert recipe
    const recipeQuery = `
      INSERT INTO recipes (title, description, image_url, prep_time, cook_time, servings, difficulty, category, cuisine, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const recipeResult = await pool.query(recipeQuery, [
      recipeData.title,
      recipeData.description,
      recipeData.image_url,
      recipeData.prep_time,
      recipeData.cook_time,
      recipeData.servings,
      recipeData.difficulty,
      recipeData.category,
      recipeData.cuisine,
      recipeData.tags || []
    ]);

    const recipe = recipeResult.rows[0];

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: recipe,
      }),
    };
  } catch (error) {
    console.error('Error creating recipe:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to create recipe' 
      }),
    };
  }
}

async function updateRecipe(id, updates) {
  try {
    const updateFields = [];
    const queryParams = [];
    let paramIndex = 1;

    const allowedFields = ['title', 'description', 'image_url', 'prep_time', 'cook_time', 'servings', 'difficulty', 'category', 'cuisine', 'tags'];
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`);
        queryParams.push(updates[field]);
        paramIndex++;
      }
    }

    if (updateFields.length === 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false, 
          error: 'No valid fields to update' 
        }),
      };
    }

    updateFields.push(`updated_at = NOW()`);
    queryParams.push(id);

    const updateQuery = `
      UPDATE recipes 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND is_public = true
      RETURNING *
    `;

    const result = await pool.query(updateQuery, queryParams);

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

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: result.rows[0],
      }),
    };
  } catch (error) {
    console.error('Error updating recipe:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to update recipe' 
      }),
    };
  }
}

async function deleteRecipe(id) {
  try {
    const result = await pool.query(
      'DELETE FROM recipes WHERE id = $1 AND is_public = true RETURNING id',
      [id]
    );

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
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Recipe deleted successfully',
      }),
    };
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to delete recipe' 
      }),
    };
  }
}