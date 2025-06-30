const recipes = [
  { id: '1', title: 'Scrambled Eggs', steps: ['Beat eggs', 'Cook in pan'] },
  { id: '2', title: 'Simple Pasta', steps: ['Boil water', 'Cook pasta'] },
  { id: '3', title: 'Fresh Salad', steps: ['Chop veggies', 'Mix and serve'] }
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
