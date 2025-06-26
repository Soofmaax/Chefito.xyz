/*
  # Seed Data for Chefito Platform

  1. Sample Recipes
    - Beginner-friendly recipes with complete data
    - Ingredients and instructions
    - Proper categorization

  2. Test Data
    - Sample user profiles
    - Recipe reviews and ratings
*/

-- Insert sample recipes
INSERT INTO recipes (id, title, description, image_url, prep_time, cook_time, servings, difficulty, category, cuisine, tags) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Perfect Scrambled Eggs',
  'Learn the fundamentals of cooking with this beginner-friendly scrambled eggs recipe. Master the basics of heat control and timing.',
  'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg',
  5,
  5,
  1,
  'beginner',
  'breakfast',
  'international',
  ARRAY['breakfast', 'quick', 'protein', 'beginner-friendly']
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Simple Pasta with Garlic Oil',
  'A classic Italian dish that teaches you about pasta cooking and flavor building. Perfect for building confidence in the kitchen.',
  'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
  10,
  15,
  4,
  'beginner',
  'main',
  'italian',
  ARRAY['pasta', 'italian', 'vegetarian', 'quick']
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Basic Vegetable Stir-Fry',
  'Master the art of stir-frying with this colorful and nutritious vegetable dish. Learn about high-heat cooking and timing.',
  'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg',
  15,
  10,
  2,
  'intermediate',
  'main',
  'asian',
  ARRAY['vegetables', 'healthy', 'asian', 'quick']
);

-- Insert ingredients for scrambled eggs
INSERT INTO ingredients (recipe_id, name, amount, unit, optional, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440001', '3 large eggs', 3, 'pieces', false, 1),
('550e8400-e29b-41d4-a716-446655440001', 'Butter', 1, 'tablespoon', false, 2),
('550e8400-e29b-41d4-a716-446655440001', 'Salt', 1, 'pinch', false, 3),
('550e8400-e29b-41d4-a716-446655440001', 'Black pepper', 1, 'pinch', false, 4),
('550e8400-e29b-41d4-a716-446655440001', 'Chives', 1, 'tablespoon', true, 5);

-- Insert instructions for scrambled eggs
INSERT INTO instructions (recipe_id, step_number, description, duration) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1, 'Crack 3 eggs into a bowl', 1),
('550e8400-e29b-41d4-a716-446655440001', 2, 'Add a pinch of salt and pepper', 1),
('550e8400-e29b-41d4-a716-446655440001', 3, 'Whisk eggs until well combined', 1),
('550e8400-e29b-41d4-a716-446655440001', 4, 'Heat butter in a non-stick pan over low heat', 2),
('550e8400-e29b-41d4-a716-446655440001', 5, 'Pour eggs into the pan', 1),
('550e8400-e29b-41d4-a716-446655440001', 6, 'Gently stir with a spatula as eggs cook', 3),
('550e8400-e29b-41d4-a716-446655440001', 7, 'Remove from heat when eggs are still slightly wet', 1),
('550e8400-e29b-41d4-a716-446655440001', 8, 'Serve immediately', 1);

-- Insert ingredients for pasta
INSERT INTO ingredients (recipe_id, name, amount, unit, optional, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Spaghetti or linguine', 400, 'grams', false, 1),
('550e8400-e29b-41d4-a716-446655440002', 'Garlic cloves, thinly sliced', 6, 'pieces', false, 2),
('550e8400-e29b-41d4-a716-446655440002', 'Extra virgin olive oil', 120, 'ml', false, 3),
('550e8400-e29b-41d4-a716-446655440002', 'Red pepper flakes', 1, 'teaspoon', true, 4),
('550e8400-e29b-41d4-a716-446655440002', 'Fresh parsley, chopped', 2, 'tablespoons', false, 5),
('550e8400-e29b-41d4-a716-446655440002', 'Salt and black pepper', 1, 'to taste', false, 6),
('550e8400-e29b-41d4-a716-446655440002', 'Parmesan cheese', 50, 'grams', true, 7);

-- Insert instructions for pasta
INSERT INTO instructions (recipe_id, step_number, description, duration) VALUES
('550e8400-e29b-41d4-a716-446655440002', 1, 'Bring a large pot of salted water to boil', 5),
('550e8400-e29b-41d4-a716-446655440002', 2, 'Add pasta and cook according to package directions', 10),
('550e8400-e29b-41d4-a716-446655440002', 3, 'While pasta cooks, heat olive oil in a large pan', 2),
('550e8400-e29b-41d4-a716-446655440002', 4, 'Add sliced garlic and cook until fragrant', 2),
('550e8400-e29b-41d4-a716-446655440002', 5, 'Drain pasta, reserving 1 cup pasta water', 1),
('550e8400-e29b-41d4-a716-446655440002', 6, 'Add pasta to the pan with garlic oil', 1),
('550e8400-e29b-41d4-a716-446655440002', 7, 'Toss with pasta water to create a silky sauce', 2),
('550e8400-e29b-41d4-a716-446655440002', 8, 'Season with salt, pepper, and red pepper flakes', 1),
('550e8400-e29b-41d4-a716-446655440002', 9, 'Garnish with parsley and serve', 1);

-- Insert ingredients for stir-fry
INSERT INTO ingredients (recipe_id, name, amount, unit, optional, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'Mixed vegetables (broccoli, carrots, bell peppers)', 500, 'grams', false, 1),
('550e8400-e29b-41d4-a716-446655440003', 'Vegetable oil', 2, 'tablespoons', false, 2),
('550e8400-e29b-41d4-a716-446655440003', 'Garlic, minced', 2, 'cloves', false, 3),
('550e8400-e29b-41d4-a716-446655440003', 'Fresh ginger, grated', 1, 'teaspoon', false, 4),
('550e8400-e29b-41d4-a716-446655440003', 'Soy sauce', 2, 'tablespoons', false, 5),
('550e8400-e29b-41d4-a716-446655440003', 'Sesame oil', 1, 'tablespoon', false, 6),
('550e8400-e29b-41d4-a716-446655440003', 'Honey or sugar', 1, 'teaspoon', false, 7),
('550e8400-e29b-41d4-a716-446655440003', 'Green onions', 2, 'stalks', true, 8);

-- Insert instructions for stir-fry
INSERT INTO instructions (recipe_id, step_number, description, duration) VALUES
('550e8400-e29b-41d4-a716-446655440003', 1, 'Prepare all vegetables by washing and cutting', 10),
('550e8400-e29b-41d4-a716-446655440003', 2, 'Heat oil in a wok or large pan over high heat', 2),
('550e8400-e29b-41d4-a716-446655440003', 3, 'Add harder vegetables first (carrots, broccoli)', 1),
('550e8400-e29b-41d4-a716-446655440003', 4, 'Stir-fry for 2-3 minutes', 3),
('550e8400-e29b-41d4-a716-446655440003', 5, 'Add softer vegetables (bell peppers, zucchini)', 1),
('550e8400-e29b-41d4-a716-446655440003', 6, 'Continue stir-frying for 2 minutes', 2),
('550e8400-e29b-41d4-a716-446655440003', 7, 'Add garlic and ginger, stir for 30 seconds', 1),
('550e8400-e29b-41d4-a716-446655440003', 8, 'Add sauce and toss everything together', 1),
('550e8400-e29b-41d4-a716-446655440003', 9, 'Serve immediately over rice', 1);