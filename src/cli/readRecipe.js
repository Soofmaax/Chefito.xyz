function main() {
  const id = process.argv[2];
  if (!id) {
    process.stderr.write('Usage: npm run read-recipe <id>\n');
    process.exit(1);
  }

  process.stdout.write(`Recipe ${id}\n`);
}

main();
