-- Add cast community fields to existing users table (run if table already exists)
-- psql -U postgres -d baana -f src/db/migrations/001_cast_community_fields.sql

ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS place_of_birth VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_location VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS father_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS mother_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS contact_number VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100);
