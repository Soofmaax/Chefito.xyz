function main() {
  const id = process.argv[2];
  if (!id) {
    console.error('Usage: npm run read-recipe <id>');
    process.exit(1);
  }

  console.log(`Recipe ${id}`);
}

main();
