const assert = require('node:assert/strict');
const { test } = require('node:test');
const jwt = require('jsonwebtoken');
const { pool } = require('../db/pool');
const { authenticate, requireAdmin, requireRegionAccess } = require('./auth');

function invoke(middleware, req) {
  return new Promise((resolve, reject) => {
    const res = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        this.body = body;
        resolve({ response: this });
        return this;
      },
    };
    Promise.resolve(middleware(req, res, () => resolve({ next: true }))).catch(reject);
  });
}

test('authentication uses the current database role, not stale JWT role claims', async () => {
  const previousSecret = process.env.JWT_SECRET;
  const previousQuery = pool.query;
  process.env.JWT_SECRET = 'test-secret';
  pool.query = async () => ({
    rows: [{ id: 7, email: 'member@example.org', region: 'IN', role: 'user' }],
  });

  try {
    const token = jwt.sign({ sub: 7, role: 'admin' }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` }, params: {} };
    const result = await invoke(authenticate, req);

    assert.deepEqual(result, { next: true });
    assert.equal(req.user.role, 'user');
    const adminResult = await invoke(requireAdmin, req);
    assert.equal(adminResult.response.statusCode, 403);

    pool.query = async () => ({
      rows: [{ id: 7, email: 'member@example.org', region: 'IN', role: 'admin' }],
    });
    const promotedToken = jwt.sign({ sub: 7, role: 'user' }, process.env.JWT_SECRET);
    const promotedReq = { headers: { authorization: `Bearer ${promotedToken}` }, params: {} };
    await invoke(authenticate, promotedReq);
    assert.equal(promotedReq.user.role, 'admin');
    assert.deepEqual(await invoke(requireAdmin, promotedReq), { next: true });
  } finally {
    pool.query = previousQuery;
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  }
});

test('regional access rejects another region and permits admins', async () => {
  const denied = await invoke(
    requireRegionAccess,
    { params: { region: 'US' }, user: { region: 'IN', role: 'user' } }
  );
  assert.equal(denied.response.statusCode, 403);

  const sameRegion = await invoke(
    requireRegionAccess,
    { params: { region: 'IN' }, user: { region: 'IN', role: 'user' } }
  );
  assert.deepEqual(sameRegion, { next: true });

  const invalid = await invoke(
    requireRegionAccess,
    { params: { region: 'CA' }, user: { region: 'IN', role: 'user' } }
  );
  assert.equal(invalid.response.statusCode, 400);

  const allowed = await invoke(
    requireRegionAccess,
    { params: { region: 'US' }, user: { region: 'IN', role: 'admin' } }
  );
  assert.deepEqual(allowed, { next: true });
});
