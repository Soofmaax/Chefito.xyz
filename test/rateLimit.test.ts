import { strict as assert } from 'assert';
import { rateLimit } from '../src/lib/rateLimit';

describe('rateLimit utility', () => {
  it('blocks after exceeding limit', () => {
    const ip = '127.0.0.1';
    for (let i = 0; i < 60; i++) {
      assert.equal(rateLimit(ip), true);
    }
    assert.equal(rateLimit(ip), false);
  });
});
