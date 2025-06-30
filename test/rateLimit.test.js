const test = require('node:test');
const assert = require('assert/strict');
const { rateLimit } = require('../src/lib/rateLimit');

test('rateLimit utility blocks after exceeding limit', () => {
  const ip = '127.0.0.1';
  for (let i = 0; i < 60; i++) {
    assert.equal(rateLimit(ip), true);
  }
  assert.equal(rateLimit(ip), false);
});
