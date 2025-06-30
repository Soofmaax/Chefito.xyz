import { spawnSync } from 'child_process';
import { strict as assert } from 'assert';
import path from 'path';

describe('readRecipe CLI', () => {
  const cliPath = path.resolve(__dirname, '../src/cli/readRecipe.ts');
  it('shows usage when no id provided', () => {
    const res = spawnSync('ts-node', [cliPath], { encoding: 'utf8' });
    assert(res.stderr.includes('Usage')); 
  });
});
