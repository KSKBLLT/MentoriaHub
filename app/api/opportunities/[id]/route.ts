import { db } from "@/lib/db";
import { enrichOpportunity, resolveProfile } from "@/lib/enrich";
import { evaluateReadiness } from "@/lib/readiness";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const { id } = await params;
  const opp = await db.getOpportunity(id);
  if (!opp) return Response.json({ error: "not found" }, { status: 404 });

  const url = new URL(req.url);
  const profile = await resolveProfile(url.searchParams.get("profileId"));
  const saved = await db.listSaved(profile.id);
  const opportunity = enrichOpportunity(profile, opp, new Date(), saved);
  const readiness = evaluateReadiness(profile, opp);

  return Response.json({ opportunity, readiness });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const patch = await req.json();
  const opportunity = await db.updateOpportunity(id, patch);
  if (!opportunity) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({ opportunity });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const ok = await db.deleteOpportunity(id);
  return Response.json({ ok });
}
