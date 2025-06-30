const test = require('node:test');
const assert = require('assert/strict');
const { spawnSync } = require('child_process');
const path = require('path');

test('readRecipe CLI shows usage when no id provided', () => {
  const cliPath = path.resolve(__dirname, '../src/cli/readRecipe.js');
  const res = spawnSync('node', [cliPath], { encoding: 'utf8' });
  assert.ok(res.stderr.includes('Usage'));
});
