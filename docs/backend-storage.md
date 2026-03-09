# Backend storage – Cast community registration

## API: `POST /auth/signup`

- **Request body:** All fields optional except `email` and `password`.

| Field              | Type   | Required | Description           |
|--------------------|--------|----------|-----------------------|
| `email`            | string | Yes      | Unique; stored lowercased |
| `password`         | string | Yes      | Min 8 characters; stored as bcrypt hash |
| `first_name`       | string | No       | First name               |
| `last_name`        | string | No       | Last name                |
| `date_of_birth`    | string | No       | ISO date (YYYY-MM-DD)  |
| `place_of_birth`   | string | No       | City / town            |
| `current_location` | string | No       | State / region        |
| `city`             | string | No       | City                  |
| `father_name`      | string | No       | Father’s name         |
| `mother_name`      | string | No       | Mother’s name         |
| `contact_number`   | string | No       | Phone / mobile        |
| `country`          | string | No       | Country name (from dropdown) |

- **Response (201):** `{ "message": "User created", "user": { ...profile fields... }, "token": "JWT" }`
- **Errors:** 400 (validation), 409 (email already registered), 500 (server error)

## API: `POST /auth/login`

- **Response (200):** Same `user` shape as signup (includes all stored profile fields, no `password_hash`).

## Database: `users` table (PostgreSQL)

| Column             | Type         | Description                    |
|--------------------|--------------|--------------------------------|
| `id`               | SERIAL       | Primary key                    |
| `email`            | VARCHAR(255) | NOT NULL, UNIQUE; lowercased   |
| `password_hash`    | VARCHAR(255) | NOT NULL; bcrypt (10 rounds)   |
| `first_name`       | VARCHAR(255) | Nullable                       |
| `last_name`        | VARCHAR(255) | Nullable                       |
| `date_of_birth`    | DATE         | Nullable                       |
| `place_of_birth`   | VARCHAR(255) | Nullable                       |
| `current_location` | VARCHAR(255) | Nullable                       |
| `city`             | VARCHAR(255) | Nullable                       |
| `country`          | VARCHAR(100) | Nullable                       |
| `father_name`      | VARCHAR(255) | Nullable                       |
| `mother_name`      | VARCHAR(255) | Nullable                       |
| `contact_number`   | VARCHAR(50)  | Nullable                       |
| `created_at`       | TIMESTAMPTZ  | NOT NULL, default NOW()        |

- Index: `idx_users_email` on `email`.

## Schema and migrations

- **New database:**  
  `psql -U postgres -d baana -f src/db/schema.sql`

- **Existing `users` table (add new columns only):**  
  `psql -U postgres -d baana -f src/db/migrations/001_cast_community_fields.sql`
