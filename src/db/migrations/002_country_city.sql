-- Run if you have an existing users table (adds city, widens country if present)
-- psql -U postgres -d baana -f src/db/migrations/002_country_city.sql

ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'country'
  ) THEN
    ALTER TABLE users ALTER COLUMN country TYPE VARCHAR(100);
  END IF;
END $$;
