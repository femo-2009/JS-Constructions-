# JS Constructions

Bilingual (English / Arabic) construction company website with an admin CMS, image uploads, auto-sliders, and a clients gallery. Data is stored in Appwrite (TablesDB + Storage).

## Tech

- Vite + React + TypeScript
- Tailwind CSS v4
- Appwrite (Auth, TablesDB, Storage)

## Local development

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:3000`.

## Configuration

Copy `.env.example` to `.env` and fill in your Appwrite values:

| Variable | Description |
| --- | --- |
| `VITE_APPWRITE_ENDPOINT` | Appwrite endpoint (e.g. `https://fra.cloud.appwrite.io/v1`) |
| `VITE_APPWRITE_PROJECT_ID` | Appwrite project ID |
| `VITE_APPWRITE_DATABASE_ID` | TablesDB database ID |
| `VITE_APPWRITE_BUCKET_ID` | Storage bucket ID (e.g. `js-media`) |

These are **public** client identifiers — the Appwrite API key must never be placed in the frontend or in `.env`.

## Admin panel

Open the site and click the small `admin` button at the bottom-right of the footer to reach the login. Log in with the admin email/password registered in Appwrite (Auth → Users). Any logged-in database user is treated as the admin.

## Build / typecheck

```bash
npm run build   # production build to dist/
npm run lint    # TypeScript typecheck (tsc --noEmit)
```

## Deploy to Cloudflare Pages

The site is a static SPA and deploys directly to Cloudflare Pages.

1. Push this repository to GitHub/GitLab.
2. In the Cloudflare dashboard go to **Workers & Pages → Create → Pages → Connect to Git**, and pick the repo.
3. Build settings:
   - **Framework preset**: Vite (or None)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Under **Settings → Environment variables**, add these for both **Production** and **Preview** (copy values from your Appwrite console / local `.env`):
   - `VITE_APPWRITE_ENDPOINT`
   - `VITE_APPWRITE_PROJECT_ID`
   - `VITE_APPWRITE_DATABASE_ID`
   - `VITE_APPWRITE_BUCKET_ID`
5. Save and deploy. `public/_redirects` is included so SPA client-side routing works on refresh.
