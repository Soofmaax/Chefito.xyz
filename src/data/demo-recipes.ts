import { Recipe } from '@/types';

export const demoRecipes: Recipe[] = [
  {
    id: '1',
    slug: 'chickpea-salad',
    title: 'Chickpea & Cucumber Salad',
    description: 'A refreshing salad that introduces simple chopping and seasoning techniques.',
    image_url: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
    image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
    video_url: 'https://tavus.video/474a913761',
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
    voice_url: '',
    created_at: '',
    updated_at: ''
  },
  {
    id: '2',
    slug: 'omelette-easy',
    title: 'Omelette du Soleil',
    description: 'A light omelette filled with colorful vegetables and melted cheese.',
    image_url: 'https://images.pexels.com/photos/4109129/pexels-photo-4109129.jpeg',
    image: 'https://images.pexels.com/photos/4109129/pexels-photo-4109129.jpeg',
    video_url: 'https://tavus.video/47d08150fd',
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
    voice_url: '',
    created_at: '',
    updated_at: ''
  },
  {
    id: '3',
    slug: 'pasta-pesto',
    title: 'Pasta Pomodoro',
    description: 'Classic tomato pasta showcasing basic sauce making.',
    image_url: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg',
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg',
    video_url: 'https://tavus.video/fefe3b3e98',
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
    voice_url: '',
    created_at: '',
    updated_at: ''
  }
];
