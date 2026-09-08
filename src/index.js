require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./db/pool');
const { signup, login, logout, me, updateProfile } = require('./routes/auth');
const { authenticate } = require('./middleware/auth');
const { chat } = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3001')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());

app.post('/auth/signup', signup);
app.post('/auth/login', login);
app.post('/auth/logout', logout);
app.get('/auth/me', authenticate, me);
app.patch('/auth/me', authenticate, updateProfile);
app.post('/chat', chat);

app.get('/health/live', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/health', async (_req, res) => {
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
  }

  res.json({
    status: 'healthy',
    startedAt,
    checks,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
