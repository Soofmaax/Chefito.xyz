import fs from 'fs';
import path from 'path';
import { stringify } from 'csv-stringify/sync';

// Create a template CSV file for recipes
async function main() {
  const outputPath = process.argv[2] || 'recipes-template.csv';
  
  // Define the CSV headers
  const headers = [
    'title',
    'description',
    'image_url',
    'prep_time',
    'cook_time',
    'servings',
    'difficulty',
    'category',
    'cuisine',
    'tags',
    'ingredients',
    'steps'
  ];
  
  // Create sample data
  const sampleData = [
    {
      title: 'Pasta Carbonara',
      description: 'A classic Italian pasta dish with eggs, cheese, and pancetta',
      image_url: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
      prep_time: '15',
      cook_time: '15',
      servings: '4',
      difficulty: 'beginner',
      category: 'main',
      cuisine: 'italian',
      tags: 'pasta,italian,quick,eggs',
      ingredients: '400g spaghetti\n150g pancetta or guanciale, diced\n2 large eggs\n2 egg yolks\n50g pecorino romano cheese, grated\n50g parmesan cheese, grated\nFreshly ground black pepper\nSalt',
      steps: 'Bring a large pot of salted water to boil\nCook pasta according to package instructions\nWhile pasta cooks, fry pancetta in a large pan until crispy\nIn a bowl, whisk eggs, egg yolks, and grated cheeses\nDrain pasta, reserving some cooking water\nAdd hot pasta to the pan with pancetta, remove from heat\nQuickly stir in the egg mixture, adding pasta water as needed\nSeason with black pepper and serve immediately'
    },
    {
      title: 'Simple Green Salad',
      description: 'A refreshing and easy green salad perfect for beginners',
      image_url: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg',
      prep_time: '10',
      cook_time: '0',
      servings: '2',
      difficulty: 'beginner',
      category: 'side',
      cuisine: 'international',
      tags: 'salad,healthy,vegetarian,quick',
      ingredients: 'Mixed salad greens\n1 cucumber, sliced\n1 carrot, grated\n1 bell pepper, sliced\n2 tablespoons olive oil\n1 tablespoon balsamic vinegar\nSalt and pepper to taste',
      steps: 'Wash and dry all vegetables\nCombine salad greens, cucumber, carrot, and bell pepper in a bowl\nIn a small bowl, whisk together olive oil and balsamic vinegar\nDrizzle dressing over salad\nSeason with salt and pepper\nToss gently and serve'
    }
  ];
  
  // Generate the CSV content
  const csvContent = stringify([
    headers,
    ...sampleData.map(recipe => headers.map(header => recipe[header as keyof typeof recipe]))
  ]);
  
  // Write to file
  fs.writeFileSync(path.resolve(outputPath), csvContent);
  
  console.log(`✅ Template CSV created at: ${outputPath}`);
  console.log('Fill this template with your recipes and then import using:');
  console.log('npm run import-recipes your-recipes.csv');
}

main();