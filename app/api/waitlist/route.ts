import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// Reuses the same DATABASE_URL env var pattern as your dashboard project.
// This needs a WRITE-capable connection string (not the read-only role
// used for the dashboard) — set it as DATABASE_URL_WRITE in Vercel env vars.
//
// max: 1 matters here — on Vercel, each serverless invocation can spin up
// its own instance of this module. An unbounded pool multiplied across
// concurrent invocations can exhaust your Postgres connection limit fast,
// especially on free-tier DBs (Neon/Supabase/RDS small instances).
const pool = new Pool({
  connectionString: process.env.DATABASE_URL_WRITE,
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 5_000,
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body?.email ?? "").trim().toLowerCase();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await pool.query(
      `insert into waitlist (email) values ($1)
       on conflict (email) do nothing`,
      [email]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Waitlist signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
