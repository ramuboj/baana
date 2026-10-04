const { pool } = require('./pool');

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      date_of_birth DATE,
      place_of_birth VARCHAR(255),
      current_location VARCHAR(255),
      city VARCHAR(255),
      country VARCHAR(100),
      current_country VARCHAR(100),
      father_name VARCHAR(255),
      mother_name VARCHAR(255),
      contact_number VARCHAR(50),
      region VARCHAR(2),
      role VARCHAR(20) NOT NULL DEFAULT 'user',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)');
  await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS current_country VARCHAR(100)');
  await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS region VARCHAR(2)');
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user'");
  await pool.query(`
    UPDATE users SET region = CASE
      WHEN current_country = 'India' THEN 'IN'
      WHEN current_country = 'United States' THEN 'US'
      WHEN country = 'India' THEN 'IN'
      WHEN country = 'United States' THEN 'US'
      ELSE NULL
    END
    WHERE region IS NULL
  `);
  await pool.query(`
    DO $$ BEGIN
      ALTER TABLE users ADD CONSTRAINT users_region_check CHECK (region IN ('IN', 'US'));
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `);
  await pool.query(`
    DO $$ BEGIN
      ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `);
  await pool.query(`
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
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
      registration_enabled BOOLEAN NOT NULL DEFAULT TRUE,
      homepage_notice TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query('INSERT INTO site_settings (id) VALUES (TRUE) ON CONFLICT (id) DO NOTHING');
  await seedRegionalContent();

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (adminEmail) {
    await pool.query(
      "UPDATE users SET role = 'admin' WHERE lower(email) = $1",
      [adminEmail]
    );
  }
}

async function seedRegionalContent() {
  const content = [
    ['IN', 'news', 'Festival calendar', 'India holiday observances', 'Plan ahead', 'Families are preparing for Ugadi, Diwali, and other sacred holidays with prayer, temple visits, and community meals. Watch this space for local gathering details.'],
    ['IN', 'news', 'Family gathering', 'Spring break family picnic', 'Registration opening soon', 'Join fellow families for a spring break picnic with devotional songs, traditional games, shared food, and children’s activities. India-region members will receive the venue and schedule by email.'],
    ['IN', 'news', 'Temple life', 'Gathering in devotion', 'Community update', 'Members and families continue to preserve prayer, festival, and temple traditions across Andhra Pradesh and Telangana.'],
    ['IN', 'news', 'Community', 'Passing wisdom forward', 'Community update', 'Elders and young members are creating new opportunities to share Telugu heritage, stories, and sacred customs.'],
    ['US', 'news', 'Holiday calendar', 'USA holiday observances', 'Plan ahead', 'Members are planning community gatherings around Independence Day, Thanksgiving, and the holiday season while honoring our shared religious traditions.'],
    ['US', 'news', 'Family gathering', 'Spring break family picnic', 'Registration opening soon', 'Bring the family for a spring break picnic with prayer, cultural activities, traditional games, and a community potluck. USA-region members will receive the venue and schedule by email.'],
    ['US', 'news', 'Community', 'Growing together', 'Community update', 'Our US members are building welcoming gatherings that keep family, devotion, and cultural memory close to home.'],
    ['US', 'news', 'Service', 'A spirit of seva', 'Community update', 'Community volunteers are connecting families through service, hospitality, and celebrations throughout the year.'],
    ['IN', 'announcement', 'Community gathering', 'Spring break family picnic', 'Registration opening soon', 'Join us for devotional songs, family games, shared food, and a joyful day of community togetherness.'],
    ['US', 'announcement', 'Community gathering', 'Spring break family picnic', 'Registration opening soon', 'Join us for devotional songs, family games, shared food, and a joyful day of community togetherness.'],
  ];
  for (const [region, kind, label, title, dateLabel, body] of content) {
    await pool.query(
      `INSERT INTO regional_content (region, kind, label, title, date_label, body)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (region, kind, title) DO NOTHING`,
      [region, kind, label, title, dateLabel, body]
    );
  }
}

module.exports = { initializeDatabase };
