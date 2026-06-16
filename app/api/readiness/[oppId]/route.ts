import { db } from "@/lib/db";
import { resolveProfile } from "@/lib/enrich";
import { evaluateReadiness } from "@/lib/readiness";

type Ctx = { params: Promise<{ oppId: string }> };

// GET /api/readiness/[oppId]?profileId=  -> readiness + suggested gap-course
export async function GET(req: Request, { params }: Ctx) {
  const { oppId } = await params;
  const opp = await db.getOpportunity(oppId);
  if (!opp) return Response.json({ error: "not found" }, { status: 404 });

  const url = new URL(req.url);
  const profile = await resolveProfile(url.searchParams.get("profileId"));
  const readiness = evaluateReadiness(profile, opp);

  const courses = await db.listCourses();
  const gapCourse = courses.find((c) => c.topic_tags.some((t) => readiness.gaps.includes(t)));

  return Response.json({
    readiness,
    suggestedCourseId: gapCourse?.id ?? null,
    suggestedCourseTitle: gapCourse?.title ?? null,
  });
}
