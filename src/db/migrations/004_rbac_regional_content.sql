ALTER TABLE users ADD COLUMN IF NOT EXISTS region VARCHAR(2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user';

UPDATE users SET region = CASE
  WHEN current_country = 'India' THEN 'IN'
  WHEN current_country = 'United States' THEN 'US'
  WHEN country = 'India' THEN 'IN'
  WHEN country = 'United States' THEN 'US'
  ELSE NULL
END
WHERE region IS NULL;

DO $$ BEGIN
  ALTER TABLE users ADD CONSTRAINT users_region_check CHECK (region IN ('IN', 'US'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS regional_content (
  id SERIAL PRIMARY KEY,
  region VARCHAR(2) NOT NULL CHECK (region IN ('IN', 'US')),
  kind VARCHAR(20) NOT NULL CHECK (kind IN ('news', 'announcement')),
  label VARCHAR(120) NOT NULL DEFAULT '',
  title VARCHAR(255) NOT NULL,
  date_label VARCHAR(120) NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (region, kind, title)
);

CREATE TABLE IF NOT EXISTS site_settings (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
  registration_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  homepage_notice TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_settings (id) VALUES (TRUE) ON CONFLICT (id) DO NOTHING;
