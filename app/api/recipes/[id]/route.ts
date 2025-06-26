import { NextRequest, NextResponse } from 'next/server';
import { query, isPostgreSQLConfigured } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isPostgreSQLConfigured()) {
      // Return demo recipe if PostgreSQL is not configured
      const demoRecipe = {
        id: params.id,
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
        ingredients: ['3 large eggs', '1 tablespoon butter', 'Salt to taste', 'Black pepper to taste'],
        steps: [
          'Crack 3 eggs into a bowl',
          'Add a pinch of salt and pepper',
          'Whisk eggs until well combined',
          'Heat butter in a non-stick pan over low heat',
          'Pour eggs into the pan',
          'Gently stir with a spatula as eggs cook',
          'Remove from heat when eggs are still slightly wet',
          'Serve immediately'
        ],
        rating: 4.5,
        rating_count: 12,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        data: demoRecipe,
      });
    }

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

    const result = await query(recipeQuery, [params.id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Recipe not found',
        },
        { status: 404 }
      );
    }

    const recipe = result.rows[0];

    // Transform the data to match the expected format
    const transformedRecipe = {
      ...recipe,
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.map((ing: any) => 
        `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim()
      ) : [],
      steps: Array.isArray(recipe.steps) ? recipe.steps.map((step: any) => step.description) : []
    };

    return NextResponse.json({
      success: true,
      data: transformedRecipe,
    });
  } catch (error: any) {
    console.error('Error fetching recipe:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch recipe',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Update recipe
    const updateFields = [];
    const queryParams = [];
    let paramIndex = 1;

    const allowedFields = ['title', 'description', 'image_url', 'prep_time', 'cook_time', 'servings', 'difficulty', 'category', 'cuisine', 'tags'];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`);
        queryParams.push(body[field]);
        paramIndex++;
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid fields to update',
        },
        { status: 400 }
      );
    }

    updateFields.push(`updated_at = NOW()`);
    queryParams.push(params.id);

    const updateQuery = `
      UPDATE recipes 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND is_public = true
      RETURNING *
    `;

    const result = await query(updateQuery, queryParams);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Recipe not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error('Error updating recipe:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update recipe',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isPostgreSQLConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'PostgreSQL not configured',
        },
        { status: 503 }
      );
    }

    const result = await query(
      'DELETE FROM recipes WHERE id = $1 AND is_public = true RETURNING id',
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Recipe not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Recipe deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting recipe:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete recipe',
      },
      { status: 500 }
    );
  }
}