import { db } from "@/lib/db";
import { enrichOpportunity, resolveProfile } from "@/lib/enrich";

// GET /api/opportunities?profileId=&format=online|offline|all&near=1
export async function GET(req: Request) {
  const url = new URL(req.url);
  const profile = await resolveProfile(url.searchParams.get("profileId"));
  const format = url.searchParams.get("format");
  const near = url.searchParams.get("near");

  const saved = await db.listSaved(profile.id);
  let list = await db.listOpportunities();

  if (format === "online") list = list.filter((o) => o.format === "online" || o.format === "hybrid");
  else if (format === "offline") list = list.filter((o) => o.format === "offline" || o.format === "hybrid");

  if (near === "1") list = list.filter((o) => o.format !== "online" && o.region === profile.region);

  const today = new Date();
  const opportunities = list
    .map((o) => enrichOpportunity(profile, o, today, saved))
    .sort((a, b) => b.score - a.score);

  return Response.json({ profileId: profile.id, count: opportunities.length, opportunities });
}

// POST /api/opportunities  (admin create)
export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.title) return Response.json({ error: "title is required" }, { status: 400 });
  const opportunity = await db.createOpportunity(body);
  return Response.json({ opportunity }, { status: 201 });
}
