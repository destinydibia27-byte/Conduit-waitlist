import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_WRITE,
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 5_000,
});

export async function GET() {
  try {
    await pool.query("select 1");
    return NextResponse.json({ ok: true, pingedAt: new Date().toISOString() });
  } catch (err) {
    console.error("Keep-alive ping failed:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}