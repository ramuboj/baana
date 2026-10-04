const assert = require('node:assert/strict');
const { test } = require('node:test');
const { getAllowedOrigins, isAllowedOrigin } = require('./cors');

test('allows the Vercel site and both canonical community domains', () => {
  const allowedOrigins = getAllowedOrigins('http://localhost:3001');

  assert.equal(isAllowedOrigin('https://baana-main.vercel.app', allowedOrigins), true);
  assert.equal(isAllowedOrigin('https://bukkaayyavarlu.org', allowedOrigins), true);
  assert.equal(isAllowedOrigin('https://www.bukkaayyavarlu.org', allowedOrigins), true);
  assert.equal(isAllowedOrigin('http://localhost:3001', allowedOrigins), true);
});

test('keeps unconfigured origins blocked and allows non-browser requests', () => {
  const allowedOrigins = getAllowedOrigins('https://staging.example.org');

  assert.equal(isAllowedOrigin('https://staging.example.org', allowedOrigins), true);
  assert.equal(isAllowedOrigin('https://untrusted.example.org', allowedOrigins), false);
  assert.equal(isAllowedOrigin(undefined, allowedOrigins), true);
});
