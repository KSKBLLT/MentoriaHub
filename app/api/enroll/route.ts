import { db } from "@/lib/db";

// POST /api/enroll  {profileId, courseId}
export async function POST(req: Request) {
  const { profileId, courseId } = await req.json();
  if (!courseId) return Response.json({ error: "courseId required" }, { status: 400 });
  const enrollment = await db.enroll(profileId ?? "demo-aruzhan", courseId);
  return Response.json({ enrollment });
}
