# Conduit Waitlist

A complete, deployable Next.js project — not just loose files this time.

## What's in here

- `app/page.tsx` — landing page + email capture form (Anton headline font, JetBrains Mono body/labels)
- `app/layout.tsx`, `app/globals.css` — required App Router root layout + Tailwind
- `app/api/waitlist/route.ts` — API route that writes signups to Postgres
- `public/conduit-icon.png`, `public/conduit-wordmark.png` — actual logo assets, cropped and keyed to transparent
- `schema.sql` — run once against your database to create the `waitlist` table
- `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.js`, `postcss.config.js` — full project config

## Deploy to Vercel (own domain)

1. Unzip this, `cd` into it, push it to a new GitHub repo (or `vercel` CLI can deploy straight from the folder without git).
2. In Vercel: **New Project** → import the repo (or run `vercel` from the folder) → it auto-detects Next.js, no config needed.
3. Add an environment variable in the Vercel project settings: `DATABASE_URL_WRITE` — a **write-capable** Postgres connection string. Keep this separate from any read-only role used elsewhere (e.g. your dashboard project) — this route needs `INSERT` access.
4. Run `schema.sql` once against that same database (via `psql`, or your DB provider's SQL console) to create the `waitlist` table.
5. Deploy. Then attach your domain under **Settings → Domains** in the Vercel project.

## Local dev / testing first (recommended)

```
npm install
npm run dev
```
Visit `http://localhost:3000`. You'll need `DATABASE_URL_WRITE` set in a `.env.local` file for the form submission to actually write to a DB locally.

## Notes
- The Postgres pool is capped at `max: 1` connection in `route.ts` — intentional for serverless, since an unbounded pool multiplied across concurrent function invocations can exhaust your DB's connection limit fast (especially free-tier Neon/Supabase).
- Duplicate email submissions are silently ignored (`on conflict do nothing`), so resubmits don't error.
- To check signups: `select email, created_at from waitlist order by created_at desc;` — or ask me to build a quick `/admin` page later.

