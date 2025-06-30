import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { query } from '../lib/database';

interface RecipeCSV {
  title: string;
  description: string;
  image_url: string;
  prep_time: string;
  cook_time: string;
  servings: string;
  difficulty: string;
  category: string;
  cuisine: string;
  tags: string;
  ingredients: string;
  steps: string;
}

interface RecipeDB {
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
  is_public: boolean;
}

async function main() {
  const csvFilePath = process.argv[2];
  if (!csvFilePath) {
    console.error('Usage: npm run import-recipes <csv-file-path>');
    process.exit(1);
  }

  try {
    // Read and parse CSV file
    const fileContent = fs.readFileSync(path.resolve(csvFilePath), 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as RecipeCSV[];

    console.log(`Found ${records.length} recipes in CSV file`);

    // Process recipes in batches to avoid overwhelming the database
    const batchSize = 10;
    const batches = Math.ceil(records.length / batchSize);

    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, records.length);
      const batch = records.slice(start, end);
      
      console.log(`Processing batch ${i + 1}/${batches} (${start + 1}-${end} of ${records.length})`);
      
      // Process each recipe in the batch
      for (const record of batch) {
        await processRecipe(record);
      }
      
      // Small delay between batches to avoid rate limits
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

async function processRecipe(record: RecipeCSV) {
  try {
    // Validate and transform the record
    const recipe: RecipeDB = {
      title: record.title.trim(),
      description: record.description.trim(),
      image_url: record.image_url.trim(),
      prep_time: parseInt(record.prep_time, 10) || 10,
      cook_time: parseInt(record.cook_time, 10) || 20,
      servings: parseInt(record.servings, 10) || 4,
      difficulty: ['beginner', 'intermediate', 'advanced'].includes(record.difficulty) 
        ? record.difficulty 
        : 'beginner',
      category: record.category.trim() || 'main',
      cuisine: record.cuisine.trim() || 'international',
      tags: record.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      is_public: true,
    };

    // Validate required fields
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
      recipe.tags, recipe.is_public
    ]);

    const recipeId = recipeResult.rows[0].id;
    
    // Process ingredients
    const ingredients = record.ingredients.split('\n')
      .map(line => line.trim())
      .filter(Boolean);
    
    for (let i = 0; i < ingredients.length; i++) {
      await query(`
        INSERT INTO ingredients (recipe_id, name, order_index)
        VALUES ($1, $2, $3)
      `, [recipeId, ingredients[i], i + 1]);
    }
    
    // Process steps
    const steps = record.steps.split('\n')
      .map(line => line.trim())
      .filter(Boolean);
    
    for (let i = 0; i < steps.length; i++) {
      await query(`
        INSERT INTO instructions (recipe_id, step_number, description)
        VALUES ($1, $2, $3)
      `, [recipeId, i + 1, steps[i]]);
    }

    console.log(`✅ Imported: ${recipe.title}`);
    return recipeId;
  } catch (err: any) {
    console.error(`❌ Failed to import recipe "${record.title}":`, err.message);
    throw err;
  }
}

main();