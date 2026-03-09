const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db/pool');

const SALT_ROUNDS = 10;

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
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

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      `INSERT INTO users (
        email, password_hash, first_name, last_name, date_of_birth, place_of_birth,
        current_location, city, country, father_name, mother_name, contact_number
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, email, first_name, last_name, date_of_birth, place_of_birth, current_location,
        city, country, father_name, mother_name, contact_number, created_at`,
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
        trimStr(father_name) || null,
        trimStr(mother_name) || null,
        trimStr(contact_number) || null,
      ]
    );
    const user = result.rows[0];
    const token = signToken(user);
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
      `SELECT id, email, password_hash, first_name, last_name, date_of_birth, place_of_birth,
        current_location, city, country, father_name, mother_name, contact_number, created_at
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
    res.json({
      message: 'Login successful',
      user: toUserResponse(user),
      token,
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
}

module.exports = { signup, login };
