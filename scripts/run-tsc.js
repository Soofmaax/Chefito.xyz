const { execSync } = require('child_process');

try {
  require.resolve('typescript');
  execSync('npx tsc -p tsconfig.cli.json', { stdio: 'inherit' });
} catch (err) {
  console.log('tsc not installed, skipping');
}
