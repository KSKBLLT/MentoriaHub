import { db } from "@/lib/db";
import { resolveProfile } from "@/lib/enrich";
import type { SavedStatus } from "@/lib/types";

// GET /api/saved?profileId=
export async function GET(req: Request) {
  const url = new URL(req.url);
  const profile = await resolveProfile(url.searchParams.get("profileId"));
  const saved = await db.listSaved(profile.id);
  const items = await Promise.all(
    saved.map(async (s) => {
      const o = await db.getOpportunity(s.opportunity_id);
      return { ...s, title: o?.title ?? s.opportunity_id, deadline: o?.deadline ?? null };
    }),
  );
  return Response.json({ items });
}

// POST /api/saved  {profileId, opportunityId} -> toggle
export async function POST(req: Request) {
  const { profileId, opportunityId } = await req.json();
  if (!opportunityId) return Response.json({ error: "opportunityId required" }, { status: 400 });
  const saved = await db.toggleSave(profileId ?? "demo-aruzhan", opportunityId);
  return Response.json({ saved });
}

// PATCH /api/saved  {profileId, opportunityId, status} -> advance pipeline
export async function PATCH(req: Request) {
  const { profileId, opportunityId, status } = await req.json();
  const item = await db.setSavedStatus(profileId ?? "demo-aruzhan", opportunityId, status as SavedStatus);
  if (!item) return Response.json({ error: "not saved" }, { status: 404 });
  return Response.json({ item });
}
