require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./db/pool');
const { initializeDatabase } = require('./db/initialize');
const { signup, login, logout, me, updateProfile } = require('./routes/auth');
const { authenticate, requireAdmin, requireRegionAccess } = require('./middleware/auth');
const { chat } = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const { getPublicSettings, getRegionalContent } = require('./routes/content');
const { getAllowedOrigins, isAllowedOrigin } = require('./middleware/cors');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = getAllowedOrigins(process.env.CORS_ORIGIN || 'http://localhost:3001');

app.use(cors({
  origin: (origin, callback) => callback(null, isAllowedOrigin(origin, allowedOrigins)),
  credentials: true,
}));
app.use(express.json());

app.post('/auth/signup', signup);
app.post('/auth/login', login);
app.post('/auth/logout', logout);
app.get('/auth/me', authenticate, me);
app.patch('/auth/me', authenticate, updateProfile);
app.get('/settings/public', getPublicSettings);
app.get('/regions/:region/content', authenticate, requireRegionAccess, getRegionalContent);
app.use('/admin', authenticate, requireAdmin, adminRoutes);
app.post('/chat', chat);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/health/ready', async (_req, res) => {
  const startedAt = new Date().toISOString();
  const checks = {
    server: 'ok',
    database: null,
  };

  try {
    await pool.query('SELECT 1');
    checks.database = 'ok';
  } catch (err) {
    checks.database = 'error';
    return res.status(503).json({
      status: 'unhealthy',
      startedAt,
      checks,
      error: err.message,
    });

    app.use((err, _req, res, _next) => {
      console.error('Request failed:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
  }

  res.json({
    status: 'healthy',
    startedAt,
    checks,
  });
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database initialization failed:', err);
    process.exitCode = 1;
  });
