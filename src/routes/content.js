const { pool } = require('../db/pool');

async function getPublicSettings(_req, res, next) {
  try {
    const result = await pool.query(
      'SELECT registration_enabled, homepage_notice FROM site_settings WHERE id = TRUE'
    );
    res.json(result.rows[0] || { registration_enabled: true, homepage_notice: '' });
  } catch (err) {
    next(err);
  }
}

async function getRegionalContent(req, res, next) {
  try {
    const { kind } = req.query;
    if (kind && kind !== 'news' && kind !== 'announcement') {
      return res.status(400).json({ error: 'Content kind must be news or announcement' });
    }
    const params = [req.params.region];
    const kindClause = kind ? 'AND kind = $2' : '';
    if (kind) params.push(kind);
    const result = await pool.query(
      `SELECT id, region, kind, label, title, date_label, body, sort_order
       FROM regional_content
       WHERE region = $1 AND is_published = TRUE ${kindClause}
       ORDER BY sort_order, created_at DESC`,
      params
    );
    res.json({ content: result.rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { getPublicSettings, getRegionalContent };
