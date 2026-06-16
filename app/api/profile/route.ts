import { db } from "@/lib/db";
import { emptyProfile } from "@/lib/data/seed";

// POST /api/profile  -> upsert (onboarding). Body: partial profile fields.
export async function POST(req: Request) {
  const body = await req.json();
  const id: string = body.id || `student-${Date.now().toString(36)}`;
  const base = (await db.getProfile(id)) ?? emptyProfile(id);
  const profile = { ...base, ...body, id };
  await db.saveProfile(profile);
  return Response.json({ profile }, { status: body.id ? 200 : 201 });
}
