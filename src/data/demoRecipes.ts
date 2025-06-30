import { Recipe } from '@/types';

export const demoRecipes: Recipe[] = [
  {
    id: 'd3bfd424-7598-4951-846d-84926e086106',
    title: 'Spaghetti Aglio e Olio',
    description: 'A quick and flavorful Italian pasta made with garlic, olive oil, and chili flakes. Minimal effort, maximum taste.',
    image_url: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    steps: [
      "Let's start by boiling a big pot of salted water. Once it boils, drop in the spaghetti.",
      'While the pasta cooks, slice your garlic and heat the olive oil in a pan over medium heat.',
      "Add the garlic and chili flakes to the hot oil. Stir gently and don't let the garlic burn.",
      'Drain the cooked spaghetti and add it directly to the pan. Toss everything together until well coated.',
      "Serve hot, and sprinkle fresh parsley if you'd like. Bon appétit, chef!",
    ],
    video_url: 'https://tavus.video/fefe3b3e98',
    ingredients: [
      '200 g spaghetti',
      '3 garlic cloves',
      '3 tbsp olive oil',
      '1 pinch chili flakes',
      'salt to taste',
      'fresh parsley (optional)',
    ],
    difficulty: 'beginner',
    prep_time: 10,
    cook_time: 10,
    servings: 2,
    tags: ['pasta', 'quick'],
    category: 'main',
    cuisine: 'italian',
    created_at: '2025-06-30T12:00:00Z',
    updated_at: '2025-06-30T12:00:00Z',
  },
  {
    id: '76c3967f-d42c-4d70-aac9-c7e50172f02f',
    title: 'Herb Omelette',
    description: "A fluffy, herby omelette that's perfect for breakfast or a quick meal. Simple, fast, and delicious.",
    image_url: 'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg',
    steps: [
      'Crack the eggs into a bowl. Add milk, salt, pepper, and beat it gently with a fork.',
      'Add chopped herbs to your egg mix. We\u2019re adding flavor like a pro.',
      'Heat a small non-stick pan and melt the butter over medium heat.',
      'Pour the egg mixture in. Let it sit for a few seconds, then gently stir with a spatula.',
      'Fold the omelette in half when it\u2019s almost set. Slide it onto a plate and serve right away.',
    ],
    video_url: 'https://tavus.video/47d08150fd',
    ingredients: [
      '3 eggs',
      '1 tbsp milk',
      'salt to taste',
      'pepper to taste',
      '1 small knob butter',
      '1 tbsp fresh herbs (chives, parsley)',
    ],
    difficulty: 'beginner',
    prep_time: 5,
    cook_time: 5,
    servings: 1,
    tags: ['breakfast', 'quick'],
    category: 'breakfast',
    cuisine: 'international',
    created_at: '2025-06-30T12:00:00Z',
    updated_at: '2025-06-30T12:00:00Z',
  },
  {
    id: 'e720d219-acbe-4823-85a6-97b013c862c4',
    title: 'Chickpea & Cucumber Salad',
    description: 'A fresh, healthy salad you can throw together in minutes. Vegan-friendly and full of flavor.',
    image_url: 'https://images.pexels.com/photos/5938/food-salad-healthy-vegetables.jpg',
    steps: [
      'Drain and rinse the chickpeas. This will make them less salty and easier to digest.',
      'Chop the cucumber and cut the cherry tomatoes in halves.',
      'In a large bowl, mix the chickpeas, cucumber, and tomatoes.',
      'Add lemon juice, olive oil, salt, and pepper. Stir everything gently to coat.',
      'Optional: add fresh mint or parsley. Let the salad rest for 10 minutes before serving cold.',
    ],
    video_url: 'https://tavus.video/474a913761',
    ingredients: [
      '1 can (400g) cooked chickpeas',
      '1/2 cucumber',
      '10 cherry tomatoes',
      '1 tbsp lemon juice',
      '2 tbsp olive oil',
      'salt to taste',
      'pepper to taste',
      'mint or parsley (optional)',
    ],
    difficulty: 'beginner',
    prep_time: 10,
    cook_time: 0,
    servings: 2,
    tags: ['healthy', 'vegan'],
    category: 'salad',
    cuisine: 'mediterranean',
    created_at: '2025-06-30T12:00:00Z',
    updated_at: '2025-06-30T12:00:00Z',
  },
];

export function getDemoRecipeBySlug(slug: string) {
  return demoRecipes.find(r => slugify(r.title) === slug);
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
