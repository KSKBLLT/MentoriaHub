import { db } from "@/lib/db";
import { resolveProfile } from "@/lib/enrich";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/courses/[id]?profileId=  -> full course + this student's progress
export async function GET(req: Request, { params }: Ctx) {
  const { id } = await params;
  const course = await db.getCourse(id);
  if (!course) return Response.json({ error: "not found" }, { status: 404 });

  const url = new URL(req.url);
  const profile = await resolveProfile(url.searchParams.get("profileId"));
  const enrollment = (await db.listEnrollments(profile.id)).find((e) => e.course_id === id) ?? null;

  return Response.json({ course, enrollment });
}
