# Hosting the Bukka Ayyavarlu Application

This app has two parts:

- **Backend:** Node.js Express (API, auth, chat, PostgreSQL)
- **Frontend:** Next.js (runs on Node or static export)

Below are practical ways to host both on the internet.

---

## Option 1: Railway (simple all-in-one)

Good for: getting online quickly with backend + DB + frontend in one place.

### 1. Backend + PostgreSQL on Railway

1. Sign up at [railway.app](https://railway.app).
2. **New Project** → **Deploy from GitHub** (connect your repo).
3. Add **PostgreSQL** from the same project (Railway creates `DATABASE_URL`).
4. Add a **Service** for the backend:
   - **Root directory:** leave blank (or set to repo root if backend is at root).
   - **Build command:** `npm install` (for the backend folder; if backend is at repo root, same).
   - **Start command:** `npm start` or `node src/index.js`.
   - **Environment variables** (Settings → Variables):
     - `NODE_ENV=production`
     - `PORT` (Railway sets this; keep it)
     - `DATABASE_URL` – use the one Railway gives for the PostgreSQL service (often `POSTGRES_URL` or `DATABASE_URL`).
     - Copy from your `.env`: `JWT_SECRET`, `JWT_EXPIRES_IN`.  
     - If Railway exposes Postgres as `POSTGRES_URL`, your app expects `PGHOST`, `PGPORT`, etc. Easiest: use a single `DATABASE_URL` and change the backend to use it (see below).
5. Deploy. Railway will give a URL like `https://your-app.up.railway.app`. This is your **API URL**.

### 2. Run DB migrations

- In Railway’s PostgreSQL service, open **Connect** and use the connection string in a client (e.g. TablePlus, DBeaver), or use **Railway CLI** and run:
  - `psql $DATABASE_URL -f src/db/schema.sql`
- If the `users` table already exists, run:
  - `psql $DATABASE_URL -f src/db/migrations/001_cast_community_fields.sql`
  (and any later migrations).

### 3. Frontend on Railway (or Vercel)

**A. Same Railway project**

- Add another **Service** for the frontend.
- **Root directory:** `frontend`
- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`
- **Environment variable:** `NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app` (no trailing slash).
- Deploy. Use the frontend service URL as your public site.

**B. Vercel (recommended for Next.js)**

- Push code to GitHub.
- Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
- **Root Directory:** `frontend`
- **Environment variable:** `NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app`
- Deploy. Vercel gives you a URL and optional custom domain.

---

## Option 2: Render

- **Backend:** [Render](https://render.com) → New **Web Service** from GitHub. Build: `npm install`, Start: `npm start`. Add **PostgreSQL** from Render dashboard and use the provided `DATABASE_URL`.
- **Frontend:** Same repo → New **Static Site** or **Web Service**. Root: `frontend`, Build: `npm run build`, Publish: `out` if you use static export, or use **Web Service** with `npm start`.
- Set `NEXT_PUBLIC_API_URL` to the backend URL Render gives you.

---

## Option 3: Vercel (frontend) + backend elsewhere

- **Frontend:** Vercel, root `frontend`, set `NEXT_PUBLIC_API_URL` to your backend URL.
- **Backend:** Run on Railway, Render, Fly.io, or a VPS (see below). Must be HTTPS in production.

---

## Option 4: VPS (DigitalOcean, Linode, etc.)

Full control on one server (e.g. Ubuntu).

1. **Server:** Create a droplet/instance, SSH in.
2. **Install:** Node.js (v18+), PostgreSQL, and (optional) Nginx.
3. **PostgreSQL:** Create a DB and user; run `schema.sql` and migrations.
4. **Backend:** Clone repo, `npm install`, set `.env` (PORT, PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE, JWT_SECRET, JWT_EXPIRES_IN). Use **pm2**: `pm2 start src/index.js --name api`.
5. **Frontend:** In `frontend`, `npm run build`, then `npm start`, or use Nginx to serve the Next.js app (or run with Node and proxy).
6. **Nginx:** Reverse proxy so that:
   - `yourdomain.com` → frontend (Next.js or static)
   - `yourdomain.com/api` or `api.yourdomain.com` → Express (proxy to `http://localhost:3000`).
7. **SSL:** Use **Let’s Encrypt** (e.g. `certbot` with Nginx).

---

## Making the backend use `DATABASE_URL`

Many hosts (Railway, Render) give a single **PostgreSQL connection URL** (e.g. `postgresql://user:pass@host:5432/dbname`). Your app currently uses separate `PGHOST`, `PGPORT`, etc.

**Option A – Keep current env vars:** On the host, set each of `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` from the URL (or use the host’s UI to copy them).

**Option B – Use DATABASE_URL in code:** In `src/db/pool.js` you can do:

```js
const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false }
    : {
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT, 10) || 5432,
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE || 'baana',
      }
);
```

Then on Railway/Render you only set `DATABASE_URL` (and `JWT_SECRET`, etc.).

---

## Checklist before going live

- [ ] **Backend:** `NODE_ENV=production`, strong `JWT_SECRET`, correct DB URL or PG* vars.
- [ ] **Frontend:** `NEXT_PUBLIC_API_URL` = your backend URL (HTTPS, no trailing slash).
- [ ] **Database:** Schema and migrations run; no default/weak DB passwords.
- [ ] **CORS:** The backend already uses `cors`. For production, set `CORS_ORIGIN` to your frontend URL (e.g. `https://your-site.vercel.app`) to restrict origins; leave unset to allow any origin.
- [ ] **Contact page:** Update email, phone, and address in `app/contact/page.tsx`.

---

## Quick start (minimal)

1. Push the repo to **GitHub**.
2. **Railway:** New project → Add PostgreSQL → Add backend service (root = repo root, start = `npm start`) → add env vars and deploy → copy backend URL.
3. **Vercel:** New project from same repo, root = `frontend`, add `NEXT_PUBLIC_API_URL=<backend URL>` → deploy.
4. Run DB migrations against the Railway Postgres (using `DATABASE_URL` or PG* vars).
5. Open the Vercel URL; log in or register and test.

After that you can add a **custom domain** in both Railway and Vercel and point DNS as they instruct.
