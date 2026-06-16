import { db } from "@/lib/db";

// GET /api/courses  -> list (without full lesson bodies)
export async function GET() {
  const courses = (await db.listCourses()).map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    level: c.level,
    topic_tags: c.topic_tags,
    lessonCount: c.lessons.length,
  }));
  return Response.json({ courses });
}
