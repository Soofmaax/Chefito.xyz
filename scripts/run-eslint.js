const { execSync } = require('child_process');

try {
  require.resolve('eslint/package.json');
  execSync('npx eslint .', { stdio: 'inherit' });
} catch (err) {
  console.log('eslint not installed, skipping');
}
