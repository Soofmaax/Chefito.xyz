import fs from 'fs';
import path from 'path';
import { query } from '../lib/database';

interface Recipe {
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
  ingredients: string[];
  steps: string[];
}

async function main() {
  const jsonFilePath = process.argv[2];
  if (!jsonFilePath) {
    console.error('Usage: npm run bulk-import <json-file-path>');
    process.exit(1);
  }

  try {
    // Read and parse JSON file
    const fileContent = fs.readFileSync(path.resolve(jsonFilePath), 'utf-8');
    const recipes = JSON.parse(fileContent) as Recipe[];

    console.log(`Found ${recipes.length} recipes in JSON file`);

    // Process recipes in batches
    const batchSize = 10;
    const batches = Math.ceil(recipes.length / batchSize);

    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, recipes.length);
      const batch = recipes.slice(start, end);
      
      console.log(`Processing batch ${i + 1}/${batches} (${start + 1}-${end} of ${recipes.length})`);
      
      // Process each recipe in the batch
      for (const recipe of batch) {
        await importRecipe(recipe);
      }
      
      // Small delay between batches
      if (i < batches - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('All recipes imported successfully');
  } catch (err: any) {
    console.error('Error importing recipes:', err.message);
    process.exit(1);
  }
}

async function importRecipe(recipe: Recipe) {
  try {
    // Validate recipe
    if (!recipe.title || !recipe.description || !recipe.image_url) {
      throw new Error(`Recipe "${recipe.title}" is missing required fields`);
    }

    // Insert recipe
    const recipeResult = await query(`
      INSERT INTO recipes (
        title, description, image_url, prep_time, cook_time, 
        servings, difficulty, category, cuisine, tags, is_public
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `, [
      recipe.title, recipe.description, recipe.image_url, 
      recipe.prep_time, recipe.cook_time, recipe.servings, 
      recipe.difficulty, recipe.category, recipe.cuisine, 
      recipe.tags, true
    ]);

    const recipeId = recipeResult.rows[0].id;
    
    // Insert ingredients
    for (let i = 0; i < recipe.ingredients.length; i++) {
      await query(`
        INSERT INTO ingredients (recipe_id, name, order_index)
        VALUES ($1, $2, $3)
      `, [recipeId, recipe.ingredients[i], i + 1]);
    }
    
    // Insert steps
    for (let i = 0; i < recipe.steps.length; i++) {
      await query(`
        INSERT INTO instructions (recipe_id, step_number, description)
        VALUES ($1, $2, $3)
      `, [recipeId, i + 1, recipe.steps[i]]);
    }

    console.log(`✅ Imported: ${recipe.title}`);
    return recipeId;
  } catch (err: any) {
    console.error(`❌ Failed to import recipe "${recipe.title}":`, err.message);
    throw err;
  }
}

main();