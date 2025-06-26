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

const seedData = async () => {
  try {
    console.log('🌱 Seeding database with sample recipes...');

    // Insert sample recipes
    const recipes = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Perfect Scrambled Eggs',
        description: 'Learn the fundamentals of cooking with this beginner-friendly scrambled eggs recipe. Master the basics of heat control and timing.',
        image_url: 'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg',
        prep_time: 5,
        cook_time: 5,
        servings: 1,
        difficulty: 'beginner',
        category: 'breakfast',
        cuisine: 'international',
        tags: ['breakfast', 'quick', 'protein', 'beginner-friendly']
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        title: 'Simple Pasta with Garlic Oil',
        description: 'A classic Italian dish that teaches you about pasta cooking and flavor building. Perfect for building confidence in the kitchen.',
        image_url: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
        prep_time: 10,
        cook_time: 15,
        servings: 4,
        difficulty: 'beginner',
        category: 'main',
        cuisine: 'italian',
        tags: ['pasta', 'italian', 'vegetarian', 'quick']
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        title: 'Basic Vegetable Stir-Fry',
        description: 'Master the art of stir-frying with this colorful and nutritious vegetable dish. Learn about high-heat cooking and timing.',
        image_url: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg',
        prep_time: 15,
        cook_time: 10,
        servings: 2,
        difficulty: 'intermediate',
        category: 'main',
        cuisine: 'asian',
        tags: ['vegetables', 'healthy', 'asian', 'quick']
      }
    ];

    for (const recipe of recipes) {
      await pool.query(`
        INSERT INTO recipes (id, title, description, image_url, prep_time, cook_time, servings, difficulty, category, cuisine, tags)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO NOTHING
      `, [
        recipe.id, recipe.title, recipe.description, recipe.image_url,
        recipe.prep_time, recipe.cook_time, recipe.servings, recipe.difficulty,
        recipe.category, recipe.cuisine, recipe.tags
      ]);
    }

    // Insert ingredients for scrambled eggs
    const eggsIngredients = [
      { name: '3 large eggs', amount: 3, unit: 'pieces', optional: false, order_index: 1 },
      { name: 'Butter', amount: 1, unit: 'tablespoon', optional: false, order_index: 2 },
      { name: 'Salt', amount: 1, unit: 'pinch', optional: false, order_index: 3 },
      { name: 'Black pepper', amount: 1, unit: 'pinch', optional: false, order_index: 4 },
      { name: 'Chives', amount: 1, unit: 'tablespoon', optional: true, order_index: 5 }
    ];

    for (const ingredient of eggsIngredients) {
      await pool.query(`
        INSERT INTO ingredients (recipe_id, name, amount, unit, optional, order_index)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
      `, [
        '550e8400-e29b-41d4-a716-446655440001',
        ingredient.name, ingredient.amount, ingredient.unit,
        ingredient.optional, ingredient.order_index
      ]);
    }

    // Insert instructions for scrambled eggs
    const eggsInstructions = [
      { step: 1, description: 'Crack 3 eggs into a bowl', duration: 1 },
      { step: 2, description: 'Add a pinch of salt and pepper', duration: 1 },
      { step: 3, description: 'Whisk eggs until well combined', duration: 1 },
      { step: 4, description: 'Heat butter in a non-stick pan over low heat', duration: 2 },
      { step: 5, description: 'Pour eggs into the pan', duration: 1 },
      { step: 6, description: 'Gently stir with a spatula as eggs cook', duration: 3 },
      { step: 7, description: 'Remove from heat when eggs are still slightly wet', duration: 1 },
      { step: 8, description: 'Serve immediately', duration: 1 }
    ];

    for (const instruction of eggsInstructions) {
      await pool.query(`
        INSERT INTO instructions (recipe_id, step_number, description, duration)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [
        '550e8400-e29b-41d4-a716-446655440001',
        instruction.step, instruction.description, instruction.duration
      ]);
    }

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seedData();