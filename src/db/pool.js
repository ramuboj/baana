const { Pool } = require('pg');

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        connectionTimeoutMillis: 5000,
      }
    : {
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT, 10) || 5432,
        user: process.env.PGUSER || process.env.USER || 'postgres',
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE || 'baana',
        connectionTimeoutMillis: 5000,
      }
);

module.exports = { pool };
