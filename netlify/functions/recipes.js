const recipes = [
  {
    id: '1',
    title: 'Chickpea & Cucumber Salad',
    description: 'A refreshing salad that introduces simple chopping and seasoning techniques.',
    image_url: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
    prep_time: 10,
    cook_time: 0,
    servings: 2,
    difficulty: 'beginner',
    tags: ['salad', 'healthy', 'quick'],
    ingredients: [
      '1 can chickpeas, rinsed',
      '1 cucumber, diced',
      'Handful of cherry tomatoes, halved',
      '2 tbsp olive oil',
      '1 tbsp lemon juice',
      'Salt and pepper to taste',
      'Fresh parsley (optional)'
    ],
    steps: [
      'Combine chickpeas, cucumber and tomatoes in a bowl',
      'Drizzle with olive oil and lemon juice',
      'Season with salt and pepper',
      'Toss to coat and garnish with parsley',
      'Serve chilled'
    ],
    video_url: 'https://tavus.video/474a913761'
  },
  {
    id: '2',
    title: 'Omelette du Soleil',
    description: 'A light omelette filled with colorful vegetables and melted cheese.',
    image_url: 'https://images.pexels.com/photos/4109129/pexels-photo-4109129.jpeg',
    prep_time: 5,
    cook_time: 5,
    servings: 1,
    difficulty: 'beginner',
    tags: ['breakfast', 'eggs'],
    ingredients: [
      '2 eggs',
      'Diced bell pepper',
      'Cherry tomatoes, halved',
      'Shredded cheese',
      'Salt and pepper',
      'Butter or oil'
    ],
    steps: [
      'Whisk eggs with salt and pepper',
      'Heat butter in a skillet and cook vegetables briefly',
      'Pour in the eggs',
      'When nearly set, sprinkle with cheese',
      'Fold and serve hot'
    ],
    video_url: 'https://tavus.video/47d08150fd'
  },
  {
    id: '3',
    title: 'Pasta Pomodoro',
    description: 'Classic tomato pasta showcasing basic sauce making.',
    image_url: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg',
    prep_time: 10,
    cook_time: 20,
    servings: 2,
    difficulty: 'beginner',
    tags: ['pasta', 'italian'],
    ingredients: [
      'Pasta of choice',
      'Crushed tomatoes',
      '2 garlic cloves, minced',
      'Olive oil',
      'Fresh basil leaves',
      'Salt and pepper'
    ],
    steps: [
      'Cook pasta until al dente',
      'Saute garlic in olive oil',
      'Add tomatoes and simmer',
      'Toss pasta with the sauce',
      'Season and garnish with basil',
      'Serve warm'
    ],
    video_url: 'https://tavus.video/fefe3b3e98'
  }
];

exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: cors, body: '' };
  }

  const parts = event.path.split('/');
  const id = parts[parts.length - 1];

  if (event.httpMethod === 'GET') {
    if (id && id !== 'recipes') {
      const recipe = recipes.find(r => r.id === id);
      return {
        statusCode: recipe ? 200 : 404,
        headers: cors,
        body: JSON.stringify({ data: recipe })
      };
    }
    return { statusCode: 200, headers: cors, body: JSON.stringify({ data: recipes }) };
  }

  return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Method not allowed' }) };
};
