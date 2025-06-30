import { query } from '../lib/database';

async function main() {
  const id = process.argv[2];
  if (!id) {
    console.error('Usage: npm run read-recipe <id>');
    process.exit(1);
  }

  try {
    const { rows } = await query('SELECT * FROM recipes WHERE id = $1', [id]);
    if (rows.length === 0) {
      console.error('Recipe not found');
      process.exit(1);
    }
    console.log(JSON.stringify(rows[0], null, 2));
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
}

main();
