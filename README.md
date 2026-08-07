# Conduit Waitlist

Live landing page + email capture for the Conduit waitlist.

**Live:** https://conduitwaitlist.vercel.app

## What's in here

- `app/page.tsx` — landing page + email capture form (Anton headline font, JetBrains Mono body/labels)
- `app/layout.tsx`, `app/globals.css` — required App Router root layout + Tailwind
- `app/api/waitlist/route.ts` — API route that writes signups to Postgres
- `public/conduit-icon.png` — logo mark, cropped and keyed to transparent
- `schema.sql` — run once against the database to create the `waitlist` table
- `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.js`, `postcss.config.js` — full project config

## Stack

- **Frontend/hosting:** Next.js, deployed on Vercel
- **Database:** Supabase (Postgres), connected via the pooled connection string (port `6543`, transaction mode) — required since Vercel functions are serverless and a direct connection can exhaust the connection limit fast
- **Free tier:** no built-in scheduled backups on this plan, so backups are handled manually (see below)

## Local dev / testing

\`\`\`
npm install
npm run dev
\`\`\`
Visit `http://localhost:3000`. Requires `DATABASE_URL_WRITE` set in a `.env.local` file (same pooled Supabase connection string used in production) for the form to actually write to the DB locally.

## Deploying changes

Push to `main` — Vercel is connected to this repo and auto-redeploys on push.

\`\`\`
git add .
git commit -m "your message"
git push
\`\`\`

## Backups

Supabase's free tier doesn't include automatic project backups, so the `waitlist` table is backed up manually via `pg_dump` and stored in Google Drive (`Conduit / Backups`).

\`\`\`
/usr/lib/postgresql/17/bin/pg_dump "postgresql://postgres.[project-ref]:[password]@aws-0-eu-west-2.pooler.supabase.com:6543/postgres" -t waitlist -f waitlist_backup_$(date +%Y%m%d).sql
\`\`\`

Re-run this and re-upload (replacing the existing file) whenever a fresh snapshot is needed. `waitlist_backup_*.sql` is git-ignored — never commit these, they contain real user emails.

## Notes
- The Postgres pool is capped at `max: 1` connection in `route.ts` — intentional for serverless, since an unbounded pool multiplied across concurrent function invocations can exhaust the DB's connection limit fast on free tiers.
- Duplicate email submissions are silently ignored (`on conflict do nothing`), so resubmits don't error.
- To check signups: `select email, created_at from waitlist order by created_at desc;`
