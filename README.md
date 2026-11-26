# CSL Seqirus · Video Hub

React + Vite front end, hosted on **Cloudflare Pages**, with **Pages Functions** for the API,
**D1** (SQLite) for video metadata and **R2** for video files.

```
src/            React UI (styles.css holds the brand tokens)
functions/      Pages Functions
  api/videos/         GET /api/videos, GET /api/videos/:slug  (D1)
  media/[[path]].ts   GET /media/<key> — streams from R2 with Range support (seeking)
migrations/     D1 schema + placeholder seed data
shared/         Types shared by the API and UI
```

## Local dev

```bash
npm install
npm run db:migrate:local      # creates the local D1 db + seed rows
npm run dev                   # Vite on :5173, proxying /api and /media to wrangler on :8788
```

Put a video into local R2 (key must match `video_key` in the DB):

```bash
npx wrangler r2 object put csl-seqirus-videos/videos/flu-season-explained.mp4 --file ./my.mp4 --local
```

## First deploy

```bash
npx wrangler login
npx wrangler d1 create csl-seqirus-db          # paste database_id into wrangler.toml
npx wrangler r2 bucket create csl-seqirus-videos
npm run db:migrate:remote
npx wrangler pages project create catchyourselfnotflu --production-branch main   # → catchyourselfnotflu.pages.dev
npm run deploy
```

Upload videos with `wrangler r2 object put ... --remote` (or the dashboard). Encode as
H.264/AAC MP4 with `-movflags +faststart` so playback starts before the whole file downloads.

## URLs

| Stage | URL |
|---|---|
| Now (free) | `https://catchyourselfnotflu.pages.dev` |
| Preview deploys | `https://<branch>.catchyourselfnotflu.pages.dev` |
| Launch | `https://www.catchyourselfnotflu.co.uk` (Pages → Custom domains once the domain is bought) |

## Editing content

Editors go to **`/edit`** (e.g. `https://catchyourselfnotflu.pages.dev/edit`), sign in with their email,
and click any outlined text to change it. Changes save to D1 when they click away and are live at once.

- Editable: page copy (`content` table) and each video's title, summary, description, category, and the
  featured flag (watch page). Every change is logged in the `edits` table with the editor's email.
- Sign-in is **Cloudflare Access** (email one-time code). `functions/_access.ts` verifies the Access token
  on every `/api/edit/*` request; with `ACCESS_TEAM_DOMAIN` / `ACCESS_AUD` empty, editing is off.
- Locally, `.dev.vars` sets `DEV_EDITOR_EMAIL` so `localhost:5173/edit` works without Access.

See who changed what:

```bash
npx wrangler d1 execute csl-seqirus-db --remote --command "SELECT at, editor, entity_id, field, new_value FROM edits ORDER BY id DESC LIMIT 20"
```

### One-time Access setup (Cloudflare dashboard)

1. **Zero Trust** → pick a team name (becomes `<team>.cloudflareaccess.com`) → Free plan.
2. **Workers & Pages → catchyourselfnotflu → Settings → General → Access policy → Enable.**
   This creates an Access application for the project.
3. **Zero Trust → Access → Applications →** open that application and edit it:
   - Domains: set to `catchyourselfnotflu.pages.dev` with path `edit`, and add a second entry with
     path `api/edit`. (Keep `*.catchyourselfnotflu.pages.dev` too if preview links should be private.)
   - Policy: **Allow**, Include → **Emails** → the editors' addresses.
   - Login methods: **One-time PIN**.
4. Copy the **Application Audience (AUD) tag** from the application's overview.
5. Put the team domain and AUD into `[vars]` in `wrangler.toml` and run `npm run deploy`.

To add or remove an editor later, edit the policy's email list. No redeploy is needed.

## Notes / next steps
- Brand colours in `src/styles.css` and the wordmark in `src/components/Logo.tsx` are placeholders —
  swap in the official values/SVG from the brand guidelines.
- For adaptive streaming (HLS, multiple bitrates) or very large libraries, consider Cloudflare Stream
  instead of serving MP4s from R2.
