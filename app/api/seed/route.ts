import { db, usingSupabase } from "@/lib/db";

// POST /api/seed  -> idempotent upsert of seed data into the configured store.
// Meaningful when Supabase is configured (populates the cloud DB).
export async function POST() {
  const result = await db.seed();
  return Response.json({ ok: true, source: usingSupabase ? "supabase" : "memory", ...result });
}

export async function GET() {
  return Response.json({ hint: "POST to this endpoint to seed the database", source: usingSupabase ? "supabase" : "memory" });
}
