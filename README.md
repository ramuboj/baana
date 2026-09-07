# baana
Bukka Ayyavarlu community site 

## Production deployment

The API is configured for Render with [render.yaml](./render.yaml). Create the
Render Blueprint from the repository, set `CORS_ORIGIN` to the deployed Vercel
URL, and initialize the database with `src/db/schema.sql`.

For Vercel, import the repository with the project root set to `frontend` and
set `NEXT_PUBLIC_API_URL` to the public Render API URL. Redeploy the frontend
after setting that variable.
