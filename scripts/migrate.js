const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const createTables = async () => {
  try {

    // Enable UUID extension
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Recipes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        prep_time INTEGER NOT NULL CHECK (prep_time > 0),
        cook_time INTEGER NOT NULL CHECK (cook_time > 0),
        servings INTEGER NOT NULL CHECK (servings > 0),
        difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
        category VARCHAR(50) NOT NULL,
        cuisine VARCHAR(50) NOT NULL,
        tags TEXT[] DEFAULT '{}',
        rating NUMERIC(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
        rating_count INTEGER DEFAULT 0,
        is_public BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Ingredients table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ingredients (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        amount NUMERIC(10,2),
        unit VARCHAR(50),
        notes TEXT,
        optional BOOLEAN DEFAULT false,
        order_index INTEGER NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Instructions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS instructions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
        step_number INTEGER NOT NULL,
        title VARCHAR(255),
        description TEXT NOT NULL,
        duration INTEGER,
        temperature INTEGER,
        image_url TEXT,
        voice_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Reviews table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
        user_id VARCHAR(255) NOT NULL,
        user_name VARCHAR(255),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Create indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_recipes_rating ON recipes(rating DESC)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_ingredients_recipe_id ON ingredients(recipe_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_instructions_recipe_id ON instructions(recipe_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_reviews_recipe_id ON reviews(recipe_id)');

    // Create function to update recipe rating
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_recipe_rating()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE recipes 
        SET 
          rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM reviews 
            WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
          ),
          rating_count = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
          )
        WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id);
        
        RETURN COALESCE(NEW, OLD);
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create trigger
    await pool.query(`
      DROP TRIGGER IF EXISTS update_recipe_rating_trigger ON reviews;
      CREATE TRIGGER update_recipe_rating_trigger
        AFTER INSERT OR UPDATE OR DELETE ON reviews
        FOR EACH ROW
        EXECUTE FUNCTION update_recipe_rating();
    `);

  } catch (error) {
    process.exit(1);
  } finally {
    await pool.end();
  }
};

createTables();