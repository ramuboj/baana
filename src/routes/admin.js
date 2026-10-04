const express = require('express');
const { pool } = require('../db/pool');

const router = express.Router();

router.get('/users', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, region, role, created_at
       FROM users ORDER BY created_at DESC`
    );
    res.json({ users: result.rows });
  } catch (err) {
    next(err);
  }
});

router.patch('/users/:id', async (req, res, next) => {
  const userId = Number(req.params.id);
  const { role, region } = getBody(req);
  if (!Number.isSafeInteger(userId) || userId < 1) {
    return res.status(400).json({ error: 'Invalid user id' });
  }
  if (role !== undefined && role !== 'user' && role !== 'admin') {
    return res.status(400).json({ error: 'Role must be user or admin' });
  }
  if (region !== undefined && region !== 'IN' && region !== 'US') {
    return res.status(400).json({ error: 'Region must be IN or US' });
  }
  if (role === undefined && region === undefined) {
    return res.status(400).json({ error: 'Provide a role or region to update' });
  }
  if (userId === req.user.id && role !== undefined) {
    return res.status(400).json({ error: 'You cannot change your own role' });
  }

  let client;
  let transactionOpen = false;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    transactionOpen = true;
    if (role === 'user') {
      await client.query('SELECT id FROM users WHERE role = $1 ORDER BY id FOR UPDATE', ['admin']);
    }
    const current = await client.query(
      'SELECT id, role FROM users WHERE id = $1 FOR UPDATE',
      [userId]
    );
    if (!current.rows[0]) {
      await client.query('ROLLBACK');
      transactionOpen = false;
      return res.status(404).json({ error: 'User not found' });
    }
    if (current.rows[0].role === 'admin' && role === 'user') {
      const count = await client.query('SELECT COUNT(*)::int AS count FROM users WHERE role = $1', ['admin']);
      if (count.rows[0].count <= 1) {
        await client.query('ROLLBACK');
        transactionOpen = false;
        return res.status(409).json({ error: 'The last administrator cannot be removed' });
      }
    }
    const result = await client.query(
      `UPDATE users SET
         role = COALESCE($1, role),
         region = COALESCE($2, region)
       WHERE id = $3
       RETURNING id, email, first_name, last_name, region, role, created_at`,
      [role || null, region || null, userId]
    );
    await client.query('COMMIT');
    transactionOpen = false;
    res.json({ user: result.rows[0] });
  } catch (err) {
    if (transactionOpen && client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        next(rollbackError);
        return;
      }
    }
    next(err);
  } finally {
    client?.release();
  }
});

router.get('/content', async (req, res, next) => {
  const { region } = req.query;
  if (region !== 'IN' && region !== 'US') {
    return res.status(400).json({ error: 'Region must be IN or US' });
  }
  try {
    const result = await pool.query(
      `SELECT id, region, kind, label, title, date_label, body, is_published, sort_order
       FROM regional_content WHERE region = $1
       ORDER BY kind, sort_order, created_at DESC`,
      [region]
    );
    res.json({ content: result.rows });
  } catch (err) {
    next(err);
  }
});

router.post('/content', async (req, res, next) => {
  const { region, kind, label = '', title, date_label = '', body, is_published = true } = getBody(req);
  if (!isValidContent({ region, kind, label, title, date_label, body, is_published })) {
    return res.status(400).json({ error: 'Enter a valid region, content type, title, and body' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO regional_content (region, kind, label, title, date_label, body, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, region, kind, label, title, date_label, body, is_published, sort_order`,
      [region, kind, label.trim(), title.trim(), date_label.trim(), body.trim(), is_published]
    );
    res.status(201).json({ content: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'That title already exists in this region and content type' });
    }
    next(err);
  }
});

router.patch('/content/:id', async (req, res, next) => {
  const contentId = Number(req.params.id);
  const { kind, label, title, date_label, body, is_published } = getBody(req);
  if (!Number.isSafeInteger(contentId) || contentId < 1) {
    return res.status(400).json({ error: 'Invalid content id' });
  }
  if (
    (kind !== undefined && kind !== 'news' && kind !== 'announcement') ||
    (label !== undefined && (typeof label !== 'string' || label.length > 120)) ||
    (title !== undefined && (typeof title !== 'string' || title.length > 255 || !title.trim())) ||
    (date_label !== undefined && (typeof date_label !== 'string' || date_label.length > 120)) ||
    (body !== undefined && (typeof body !== 'string' || body.length > 10000 || !body.trim())) ||
    (is_published !== undefined && typeof is_published !== 'boolean')
  ) {
    return res.status(400).json({ error: 'Invalid content fields' });
  }
  const updates = { kind, label, title, date_label, body, is_published };
  const fields = Object.entries(updates).filter(([, value]) => value !== undefined);
  if (!fields.length) {
    return res.status(400).json({ error: 'No content fields to update' });
  }
  const allowedColumns = new Set(['kind', 'label', 'title', 'date_label', 'body', 'is_published']);
  if (fields.some(([field]) => !allowedColumns.has(field))) {
    return res.status(400).json({ error: 'Invalid content fields' });
  }
  const assignments = fields.map(([field], index) => `${field} = $${index + 1}`).join(', ');
  const values = fields.map(([field, value]) =>
    typeof value === 'string' && field !== 'kind' ? value.trim() : value
  );
  try {
    const result = await pool.query(
      `UPDATE regional_content SET ${assignments}, updated_at = NOW()
       WHERE id = $${values.length + 1}
       RETURNING id, region, kind, label, title, date_label, body, is_published, sort_order`,
      [...values, contentId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Content not found' });
    res.json({ content: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'That title already exists in this region and content type' });
    }
    next(err);
  }
});

router.delete('/content/:id', async (req, res, next) => {
  const contentId = Number(req.params.id);
  if (!Number.isSafeInteger(contentId) || contentId < 1) {
    return res.status(400).json({ error: 'Invalid content id' });
  }
  try {
    const result = await pool.query('DELETE FROM regional_content WHERE id = $1 RETURNING id', [contentId]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Content not found' });
    res.json({ message: 'Content deleted' });
  } catch (err) {
    next(err);
  }
});

router.get('/settings', async (_req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT registration_enabled, homepage_notice, updated_at FROM site_settings WHERE id = TRUE'
    );
    res.json({ settings: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

router.put('/settings', async (req, res, next) => {
  const { registration_enabled, homepage_notice } = getBody(req);
  if (
    typeof registration_enabled !== 'boolean' ||
    typeof homepage_notice !== 'string' ||
    homepage_notice.length > 500
  ) {
    return res.status(400).json({ error: 'Provide valid registration and homepage notice settings' });
  }
  try {
    const result = await pool.query(
      `UPDATE site_settings SET registration_enabled = $1, homepage_notice = $2, updated_at = NOW()
       WHERE id = TRUE
       RETURNING registration_enabled, homepage_notice, updated_at`,
      [registration_enabled, homepage_notice.trim()]
    );
    res.json({ settings: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

function isValidContent(content) {
  return (
    (content.region === 'IN' || content.region === 'US') &&
    (content.kind === 'news' || content.kind === 'announcement') &&
    typeof content.label === 'string' &&
    content.label.length <= 120 &&
    typeof content.title === 'string' &&
    content.title.length <= 255 &&
    Boolean(content.title.trim()) &&
    typeof content.date_label === 'string' &&
    content.date_label.length <= 120 &&
    typeof content.body === 'string' &&
    content.body.length <= 10000 &&
    Boolean(content.body.trim()) &&
    typeof content.is_published === 'boolean'
  );
}

function getBody(req) {
  return req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
}

module.exports = router;
