const jwt = require('jsonwebtoken');
const { pool } = require('../db/pool');

function getCookieToken(req) {
  const cookies = req.headers.cookie || '';
  const match = cookies.match(/(?:^|;\s*)baana_token=([^;]+)/);
  return match ? match[1] : null;
}

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : getCookieToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  try {
    const result = await pool.query(
      'SELECT id, email, region, role FROM users WHERE id = $1',
      [payload.sub]
    );
    if (!result.rows[0]) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = result.rows[0];
    next();
  } catch (err) {
    next(err);
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Administrator access required' });
  }
  next();
}

function requireRegionAccess(req, res, next) {
  const requestedRegion = req.params.region;
  if (requestedRegion !== 'IN' && requestedRegion !== 'US') {
    return res.status(400).json({ error: 'Region must be IN or US' });
  }
  if (req.user?.role !== 'admin' && req.user?.region !== requestedRegion) {
    return res.status(403).json({ error: 'This region is not available for your account' });
  }
  next();
}

module.exports = { authenticate, requireAdmin, requireRegionAccess };
