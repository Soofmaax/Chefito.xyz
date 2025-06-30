/*
  # Seed additional recipes for Chefito
  Adds three demo recipes: Spaghetti Aglio e Olio, Herb Omelette, and Chickpea & Cucumber Salad.
*/

-- Insert new recipes
INSERT INTO recipes (id, title, description, image_url, prep_time, cook_time, servings, difficulty, category, cuisine, tags) VALUES
  ('d3bfd424-7598-4951-846d-84926e086106', 'Spaghetti Aglio e Olio', 'A quick and flavorful Italian pasta made with garlic, olive oil, and chili flakes. Minimal effort, maximum taste.', 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg', 10, 10, 2, 'beginner', 'main', 'italian', ARRAY['pasta','quick']),
  ('76c3967f-d42c-4d70-aac9-c7e50172f02f', 'Herb Omelette', 'A fluffy, herby omelette that\'s perfect for breakfast or a quick meal. Simple, fast, and delicious.', 'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg', 5, 5, 1, 'beginner', 'breakfast', 'international', ARRAY['breakfast','quick']),
  ('e720d219-acbe-4823-85a6-97b013c862c4', 'Chickpea & Cucumber Salad', 'A fresh, healthy salad you can throw together in minutes. Vegan-friendly and full of flavor.', 'https://images.pexels.com/photos/5938/food-salad-healthy-vegetables.jpg', 10, 0, 2, 'beginner', 'salad', 'mediterranean', ARRAY['healthy','vegan']);

-- Ingredients for Spaghetti Aglio e Olio
INSERT INTO ingredients (recipe_id, name, amount, unit, optional, order_index) VALUES
('d3bfd424-7598-4951-846d-84926e086106', 'spaghetti', 200, 'g', false, 1),
('d3bfd424-7598-4951-846d-84926e086106', 'garlic cloves', 3, NULL, false, 2),
('d3bfd424-7598-4951-846d-84926e086106', 'olive oil', 3, 'tbsp', false, 3),
('d3bfd424-7598-4951-846d-84926e086106', 'chili flakes', 1, 'pinch', true, 4),
('d3bfd424-7598-4951-846d-84926e086106', 'salt', NULL, NULL, false, 5),
('d3bfd424-7598-4951-846d-84926e086106', 'fresh parsley', NULL, NULL, true, 6);

-- Instructions for Spaghetti Aglio e Olio
INSERT INTO instructions (recipe_id, step_number, description, duration) VALUES
('d3bfd424-7598-4951-846d-84926e086106', 1, 'Boil a pot of salted water and cook the spaghetti.', 10),
('d3bfd424-7598-4951-846d-84926e086106', 2, 'Slice the garlic and heat olive oil in a pan.', 2),
('d3bfd424-7598-4951-846d-84926e086106', 3, 'Add garlic and chili flakes, gently stirring.', 1),
('d3bfd424-7598-4951-846d-84926e086106', 4, 'Drain pasta and toss with the flavored oil.', 1),
('d3bfd424-7598-4951-846d-84926e086106', 5, 'Serve hot with optional parsley.', 0);

-- Ingredients for Herb Omelette
INSERT INTO ingredients (recipe_id, name, amount, unit, optional, order_index) VALUES
('76c3967f-d42c-4d70-aac9-c7e50172f02f', 'eggs', 3, NULL, false, 1),
('76c3967f-d42c-4d70-aac9-c7e50172f02f', 'milk', 1, 'tbsp', false, 2),
('76c3967f-d42c-4d70-aac9-c7e50172f02f', 'salt', NULL, NULL, false, 3),
('76c3967f-d42c-4d70-aac9-c7e50172f02f', 'pepper', NULL, NULL, false, 4),
('76c3967f-d42c-4d70-aac9-c7e50172f02f', 'butter', 1, 'small knob', false, 5),
('76c3967f-d42c-4d70-aac9-c7e50172f02f', 'fresh herbs (chives, parsley)', 1, 'tbsp', false, 6);

-- Instructions for Herb Omelette
INSERT INTO instructions (recipe_id, step_number, description, duration) VALUES
('76c3967f-d42c-4d70-aac9-c7e50172f02f', 1, 'Beat eggs with milk, salt, and pepper.', 1),
('76c3967f-d42c-4d70-aac9-c7e50172f02f', 2, 'Add chopped herbs to the mixture.', 1),
('76c3967f-d42c-4d70-aac9-c7e50172f02f', 3, 'Heat butter in a non-stick pan.', 1),
('76c3967f-d42c-4d70-aac9-c7e50172f02f', 4, 'Pour in eggs and gently stir.', 2),
('76c3967f-d42c-4d70-aac9-c7e50172f02f', 5, 'Fold omelette and slide onto a plate.', 1);

-- Ingredients for Chickpea & Cucumber Salad
INSERT INTO ingredients (recipe_id, name, amount, unit, optional, order_index) VALUES
('e720d219-acbe-4823-85a6-97b013c862c4', 'cooked chickpeas', 1, 'can (400g)', false, 1),
('e720d219-acbe-4823-85a6-97b013c862c4', 'cucumber', 0.5, NULL, false, 2),
('e720d219-acbe-4823-85a6-97b013c862c4', 'cherry tomatoes', 10, NULL, false, 3),
('e720d219-acbe-4823-85a6-97b013c862c4', 'lemon juice', 1, 'tbsp', false, 4),
('e720d219-acbe-4823-85a6-97b013c862c4', 'olive oil', 2, 'tbsp', false, 5),
('e720d219-acbe-4823-85a6-97b013c862c4', 'salt', NULL, NULL, false, 6),
('e720d219-acbe-4823-85a6-97b013c862c4', 'pepper', NULL, NULL, false, 7),
('e720d219-acbe-4823-85a6-97b013c862c4', 'mint or parsley', NULL, NULL, true, 8);

-- Instructions for Chickpea & Cucumber Salad
INSERT INTO instructions (recipe_id, step_number, description, duration) VALUES
('e720d219-acbe-4823-85a6-97b013c862c4', 1, 'Drain and rinse the chickpeas.', 1),
('e720d219-acbe-4823-85a6-97b013c862c4', 2, 'Chop cucumber and halve cherry tomatoes.', 2),
('e720d219-acbe-4823-85a6-97b013c862c4', 3, 'Combine vegetables with chickpeas in a bowl.', 1),
('e720d219-acbe-4823-85a6-97b013c862c4', 4, 'Add lemon juice and olive oil, season with salt and pepper.', 1),
('e720d219-acbe-4823-85a6-97b013c862c4', 5, 'Optional: mix in mint or parsley and chill.', 10);
