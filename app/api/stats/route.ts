import { db, usingSupabase } from "@/lib/db";

// GET /api/stats  -> operator/admin scaling stats
export async function GET() {
  return Response.json({ stats: await db.stats(), source: usingSupabase ? "supabase" : "memory" });
}
