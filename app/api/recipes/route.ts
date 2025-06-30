import { NextRequest, NextResponse } from 'next/server';
import { query, isPostgreSQLConfigured } from '@/lib/database';
import { rateLimit } from '@/lib/rateLimit';

interface RecipeRow {
  id: string;
  title: string;
  description: string;
  image_url: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: string;
  category: string;
  cuisine: string;
  tags: string[];
  rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  ingredients: any[];
  steps: any[];
}

interface IngredientData {
  name: string;
  amount?: string;
  unit?: string;
  optional?: boolean;
  order_index: number;
}

interface StepData {
  step_number: number;
  description: string;
  duration?: number;
  title?: string;
}

export function isAdmin(request: NextRequest): boolean {
  const auth = request.headers.get('authorization');
  const token = auth?.replace('Bearer ', '');
  return token === process.env.ADMIN_SECRET_KEY;
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip)) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    
    const offset = (page - 1) * limit;

    // Check if PostgreSQL is configured
    if (!isPostgreSQLConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database not configured. Please configure PostgreSQL connection.',
        },
        { status: 503 }
      );
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
    const recipes = result.rows.map((row: RecipeRow) => ({
      ...row,
      ingredients: Array.isArray(row.ingredients) ? row.ingredients.map((ing: IngredientData) => 
        `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim()
      ) : [],
      steps: Array.isArray(row.steps) ? row.steps.map((step: StepData) => step.description) : []
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
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip)) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }
    if (!isAdmin(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    
    if (!isPostgreSQLConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database not configured. Please configure PostgreSQL connection.',
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
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create recipe',
      },
      { status: 500 }
    );
  }
}