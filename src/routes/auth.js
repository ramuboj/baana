const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db/pool');

const SALT_ROUNDS = 10;
const REGION_BY_COUNTRY = {
  India: 'IN',
  'United States': 'US',
};
const USER_FIELDS = `id, email, first_name, last_name, date_of_birth, place_of_birth,
  current_location, city, country, current_country, father_name, mother_name, contact_number, created_at`;

function getUserRegion(user) {
  return REGION_BY_COUNTRY[user.current_country] || REGION_BY_COUNTRY[user.country] || null;
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, region: getUserRegion(user) },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function setSessionCookie(res, token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const sameSite = process.env.NODE_ENV === 'production' ? 'None' : 'Lax';
  res.setHeader(
    'Set-Cookie',
    `baana_token=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=604800; SameSite=${sameSite}${secure}`
  );
}

function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const sameSite = process.env.NODE_ENV === 'production' ? 'None' : 'Lax';
  res.setHeader('Set-Cookie', `baana_token=; HttpOnly; Path=/; Max-Age=0; SameSite=${sameSite}${secure}`);
}

function trimStr(val) {
  return val != null && typeof val === 'string' ? val.trim() : null;
}

async function signup(req, res) {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      date_of_birth,
      place_of_birth,
      current_location,
      city,
      country,
      current_country,
      father_name,
      mother_name,
      contact_number,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const emailNorm = String(email).trim().toLowerCase();
    if (!emailNorm) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (!REGION_BY_COUNTRY[country] || !REGION_BY_COUNTRY[current_country || country]) {
      return res.status(400).json({ error: 'Select India or United States as your region' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      `INSERT INTO users (
        email, password_hash, first_name, last_name, date_of_birth, place_of_birth,
        current_location, city, country, current_country, father_name, mother_name, contact_number
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id, email, first_name, last_name, date_of_birth, place_of_birth, current_location,
        city, country, current_country, father_name, mother_name, contact_number, created_at`,
      [
        emailNorm,
        passwordHash,
        trimStr(first_name) || null,
        trimStr(last_name) || null,
        date_of_birth || null,
        trimStr(place_of_birth) || null,
        trimStr(current_location) || null,
        trimStr(city) || null,
        trimStr(country) || null,
        trimStr(current_country) || trimStr(country) || null,
        trimStr(father_name) || null,
        trimStr(mother_name) || null,
        trimStr(contact_number) || null,
      ]
    );
    const user = result.rows[0];
    const token = signToken(user);
    setSessionCookie(res, token);
    res.status(201).json({
      message: 'User created',
      user: toUserResponse(user),
      token,
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Signup failed' });
  }
}

function toUserResponse(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    first_name: row.first_name,
    last_name: row.last_name,
    date_of_birth: row.date_of_birth,
    place_of_birth: row.place_of_birth,
    current_location: row.current_location,
    city: row.city,
    country: row.country,
    current_country: row.current_country,
    region: getUserRegion(row),
    father_name: row.father_name,
    mother_name: row.mother_name,
    contact_number: row.contact_number,
    created_at: row.created_at,
  };
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const emailNorm = String(email).trim().toLowerCase();

    const result = await pool.query(
      `SELECT ${USER_FIELDS}, password_hash
       FROM users WHERE email = $1`,
      [emailNorm]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user);
    setSessionCookie(res, token);
    res.json({
      message: 'Login successful',
      user: toUserResponse(user),
      token,
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
}

function logout(_req, res) {
  clearSessionCookie(res);
  res.json({ message: 'Logged out' });
}

async function me(req, res) {
  try {
    const result = await pool.query(`SELECT ${USER_FIELDS} FROM users WHERE id = $1`, [req.user.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: toUserResponse(result.rows[0]) });
  } catch (err) {
    res.status(500).json({ error: 'Unable to load profile' });
  }
}

async function updateProfile(req, res) {
  try {
    const fields = [
      'first_name', 'last_name', 'date_of_birth', 'place_of_birth',
      'current_location', 'city', 'current_country', 'father_name', 'mother_name', 'contact_number',
    ];
    const values = fields.map((field) => {
      if (field === 'date_of_birth') return req.body[field] || null;
      return trimStr(req.body[field]) || null;
    });
    const currentCountry = trimStr(req.body.current_country);
    if (!REGION_BY_COUNTRY[currentCountry]) {
      return res.status(400).json({ error: 'Current country must be India or United States' });
    }
    const assignments = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const result = await pool.query(
      `UPDATE users SET ${assignments} WHERE id = $${fields.length + 1}
       RETURNING ${USER_FIELDS}`,
      [...values, req.user.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'User not found' });
    }
    setSessionCookie(res, signToken(result.rows[0]));
    res.json({ message: 'Profile updated', user: toUserResponse(result.rows[0]) });
  } catch (err) {
    res.status(400).json({ error: 'Unable to update profile' });
  }
}

module.exports = { signup, login, logout, me, updateProfile };
