-- Cast community site – users table
-- Run: psql -U postgres -d baana -f src/db/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  first_name      VARCHAR(255),
  last_name       VARCHAR(255),
  date_of_birth   DATE,
  place_of_birth  VARCHAR(255),
  current_location VARCHAR(255),
  city            VARCHAR(255),
  country         VARCHAR(100),
  father_name     VARCHAR(255),
  mother_name     VARCHAR(255),
  contact_number  VARCHAR(50),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
