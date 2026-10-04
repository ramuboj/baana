# baana
Bukka Ayyavarlu community site 

## Production deployment

The API is configured for Render with [render.yaml](./render.yaml). Create the
Render Blueprint from the repository, set `CORS_ORIGIN` to the deployed Vercel
URL, and initialize the database with `src/db/schema.sql`.

For Vercel, import the repository with the project root set to `frontend` and
set `NEXT_PUBLIC_API_URL` to the public Render API URL. Redeploy the frontend
after setting that variable.

## Regional access and administrators

Members receive a fixed India or US region at registration. Regional news and
announcements are served only by API routes that verify the signed-in account's
region; regional contact sections are shown only to matching signed-in members.
Administrator permissions are enforced by the API, not only by the frontend.

To bootstrap the first administrator, register the account normally while
`ADMIN_EMAIL` is unset, then set `ADMIN_EMAIL` on the Render API service to that
existing account's email address and restart the service. Startup promotes the
matching existing account; signup will not create a new account for the reserved
admin email. Admins can
then use `/admin` to manage member roles and regions, publish regional news and
announcements, and update site settings. Do not expose `ADMIN_EMAIL` as a
frontend environment variable.
