import { db } from "@/lib/db";

// POST /api/progress  {profileId, courseId, progress}
export async function POST(req: Request) {
  const { profileId, courseId, progress } = await req.json();
  const pid = profileId ?? "demo-aruzhan";
  if (!courseId || typeof progress !== "number") {
    return Response.json({ error: "courseId and numeric progress required" }, { status: 400 });
  }
  const enrollment = await db.setProgress(pid, courseId, progress);
  const certificate = enrollment.completed_at
    ? ((await db.listCertificates(pid)).find((c) => c.course_id === courseId) ?? null)
    : null;
  return Response.json({ enrollment, certificate });
}
