import { db } from "@/lib/db";
import { recommend } from "@/lib/recommend";
import { enrichOpportunity, resolveProfile } from "@/lib/enrich";

// GET /api/recommendations?profileId=&limit=6
export async function GET(req: Request) {
  const url = new URL(req.url);
  const profile = await resolveProfile(url.searchParams.get("profileId"));
  const limit = Number(url.searchParams.get("limit") ?? "6");
  const today = new Date();
  const saved = await db.listSaved(profile.id);

  const top = recommend(profile, await db.listOpportunities(), { today, limit });
  const opportunities = top.map((o) => enrichOpportunity(profile, o, today, saved));

  return Response.json({ opportunities });
}
