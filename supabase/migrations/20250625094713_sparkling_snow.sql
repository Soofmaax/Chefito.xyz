/*
  # Initial Schema for Chefito Platform

  1. New Tables
    - `profiles` - User profiles with cooking preferences
    - `recipes` - Recipe collection with all details
    - `ingredients` - Recipe ingredients with measurements
    - `instructions` - Step-by-step cooking instructions
    - `cooking_sessions` - User cooking progress tracking
    - `favorites` - User favorite recipes
    - `reviews` - Recipe reviews and ratings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access patterns

  3. Functions
    - Recipe search functionality
    - User statistics
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  skill_level text DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'professional')),
  dietary_restrictions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  prep_time integer NOT NULL CHECK (prep_time > 0),
  cook_time integer NOT NULL CHECK (cook_time > 0),
  servings integer NOT NULL CHECK (servings > 0),
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category text NOT NULL,
  cuisine text NOT NULL,
  tags text[] DEFAULT '{}',
  rating numeric(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  rating_count integer DEFAULT 0,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount numeric(10,2),
  unit text,
  notes text,
  optional boolean DEFAULT false,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Instructions table
CREATE TABLE IF NOT EXISTS instructions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  title text,
  description text NOT NULL,
  duration integer, -- in minutes
  temperature integer, -- in celsius
  image_url text,
  voice_url text,
  created_at timestamptz DEFAULT now()
);

-- Cooking sessions table
CREATE TABLE IF NOT EXISTS cooking_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  current_step integer DEFAULT 1,
  status text DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'paused', 'completed')),
  started_at timestamptz,
  completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Recipes policies
CREATE POLICY "Anyone can read public recipes"
  ON recipes FOR SELECT
  TO authenticated
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create recipes"
  ON recipes FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own recipes"
  ON recipes FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete own recipes"
  ON recipes FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Ingredients policies
CREATE POLICY "Users can read ingredients for accessible recipes"
  ON ingredients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = ingredients.recipe_id 
      AND (recipes.is_public = true OR recipes.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can manage ingredients for own recipes"
  ON ingredients FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = ingredients.recipe_id 
      AND recipes.created_by = auth.uid()
    )
  );

-- Instructions policies
CREATE POLICY "Users can read instructions for accessible recipes"
  ON instructions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = instructions.recipe_id 
      AND (recipes.is_public = true OR recipes.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can manage instructions for own recipes"
  ON instructions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = instructions.recipe_id 
      AND recipes.created_by = auth.uid()
    )
  );

-- Cooking sessions policies
CREATE POLICY "Users can manage own cooking sessions"
  ON cooking_sessions FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Favorites policies
CREATE POLICY "Users can manage own favorites"
  ON favorites FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Reviews policies
CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  TO authenticated;

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_recipes_created_by ON recipes(created_by);
CREATE INDEX IF NOT EXISTS idx_recipes_rating ON recipes(rating DESC);
CREATE INDEX IF NOT EXISTS idx_ingredients_recipe_id ON ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_instructions_recipe_id ON instructions(recipe_id);
CREATE INDEX IF NOT EXISTS idx_cooking_sessions_user_id ON cooking_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_recipe_id ON reviews(recipe_id);

-- Functions
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

-- Triggers
CREATE TRIGGER update_recipe_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_recipe_rating();

-- Update timestamps function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update timestamp triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cooking_sessions_updated_at
  BEFORE UPDATE ON cooking_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();