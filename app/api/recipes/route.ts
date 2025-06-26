import { NextRequest, NextResponse } from 'next/server';
import { query, isPostgreSQLConfigured } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    
    const offset = (page - 1) * limit;

    // Check if PostgreSQL is configured
    if (!isPostgreSQLConfigured()) {
      // Return demo data if PostgreSQL is not configured
      const demoRecipes = [
        {
          id: '1',
          title: 'Perfect Scrambled Eggs',
          description: 'Learn the fundamentals of cooking with this beginner-friendly scrambled eggs recipe.',
          image_url: 'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg',
          prep_time: 5,
          cook_time: 5,
          servings: 1,
          difficulty: 'beginner',
          category: 'breakfast',
          cuisine: 'international',
          tags: ['breakfast', 'quick', 'protein'],
          rating: 4.5,
          rating_count: 12,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      return NextResponse.json({
        success: true,
        data: demoRecipes,
        total: 1,
        page: 1,
        limit: 12,
        has_more: false,
      });
    }

    // Build WHERE clause
    let whereClause = 'WHERE is_public = true';
    const queryParams: any[] = [];
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
    const countResult = await query(countQuery, queryParams);
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

    queryParams.push(limit, offset);
    const result = await query(recipesQuery, queryParams);

    // Transform the data to match the expected format
    const recipes = result.rows.map(row => ({
      ...row,
      ingredients: Array.isArray(row.ingredients) ? row.ingredients.map((ing: any) => 
        `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim()
      ) : [],
      steps: Array.isArray(row.steps) ? row.steps.map((step: any) => step.description) : []
    }));

    const hasMore = total > offset + limit;

    return NextResponse.json({
      success: true,
      data: recipes,
      total,
      page,
      limit,
      has_more: hasMore,
    });
  } catch (error: any) {
    console.error('Error fetching recipes:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch recipes',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!isPostgreSQLConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'PostgreSQL not configured',
        },
        { status: 503 }
      );
    }

    // Validate required fields
    const requiredFields = ['title', 'description', 'image_url', 'prep_time', 'cook_time', 'servings', 'difficulty', 'category', 'cuisine'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Insert recipe
    const recipeQuery = `
      INSERT INTO recipes (title, description, image_url, prep_time, cook_time, servings, difficulty, category, cuisine, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const recipeResult = await query(recipeQuery, [
      body.title,
      body.description,
      body.image_url,
      body.prep_time,
      body.cook_time,
      body.servings,
      body.difficulty,
      body.category,
      body.cuisine,
      body.tags || []
    ]);

    const recipe = recipeResult.rows[0];

    // Insert ingredients if provided
    if (body.ingredients && Array.isArray(body.ingredients)) {
      for (let i = 0; i < body.ingredients.length; i++) {
        const ingredient = body.ingredients[i];
        await query(
          'INSERT INTO ingredients (recipe_id, name, order_index) VALUES ($1, $2, $3)',
          [recipe.id, ingredient, i + 1]
        );
      }
    }

    // Insert steps if provided
    if (body.steps && Array.isArray(body.steps)) {
      for (let i = 0; i < body.steps.length; i++) {
        const step = body.steps[i];
        await query(
          'INSERT INTO instructions (recipe_id, step_number, description) VALUES ($1, $2, $3)',
          [recipe.id, i + 1, step]
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: recipe,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating recipe:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create recipe',
      },
      { status: 500 }
    );
  }
}