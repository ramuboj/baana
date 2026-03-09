require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./db/pool');
const { signup, login } = require('./routes/auth');
const { chat } = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Allow frontend on another origin (e.g. Vercel) to call the API
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(express.json());

app.post('/auth/signup', signup);
app.post('/auth/login', login);
app.post('/chat', chat);

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
