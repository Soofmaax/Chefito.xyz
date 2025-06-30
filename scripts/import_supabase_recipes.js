const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function migrate() {
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('*, ingredients(*), instructions(*)');
  if (error) {
    process.exit(1);
  }
  for (const recipe of recipes || []) {
    await pool.query(
      `INSERT INTO recipes (
        id, title, description, image_url, prep_time, cook_time, servings,
        difficulty, category, cuisine, tags, rating, rating_count, is_public,
        created_at, updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16
      ) ON CONFLICT (id) DO NOTHING`,
      [
        recipe.id,
        recipe.title,
        recipe.description,
        recipe.image_url,
        recipe.prep_time,
        recipe.cook_time,
        recipe.servings,
        recipe.difficulty,
        recipe.category,
        recipe.cuisine,
        recipe.tags || [],
        recipe.rating || 0,
        recipe.rating_count || 0,
        recipe.is_public !== false,
        recipe.created_at,
        recipe.updated_at,
      ]
    );

    if (Array.isArray(recipe.ingredients)) {
      for (const ing of recipe.ingredients) {
        await pool.query(
          `INSERT INTO ingredients (
            id, recipe_id, name, amount, unit, notes, optional, order_index, created_at
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9
          ) ON CONFLICT (id) DO NOTHING`,
          [
            ing.id,
            recipe.id,
            ing.name,
            ing.amount,
            ing.unit,
            ing.notes || null,
            ing.optional || false,
            ing.order_index,
            ing.created_at,
          ]
        );
      }
    }

    if (Array.isArray(recipe.instructions)) {
      for (const step of recipe.instructions) {
        await pool.query(
          `INSERT INTO instructions (
            id, recipe_id, step_number, title, description, duration, temperature, image_url, voice_url, created_at
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
          ) ON CONFLICT (id) DO NOTHING`,
          [
            step.id,
            recipe.id,
            step.step_number,
            step.title,
            step.description,
            step.duration,
            step.temperature,
            step.image_url,
            step.voice_url,
            step.created_at,
          ]
        );
      }
    }
  }
  await pool.end();
  
}

migrate().catch(() => {
  process.exit(1);
});
