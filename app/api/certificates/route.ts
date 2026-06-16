import { db } from "@/lib/db";
import { resolveProfile } from "@/lib/enrich";

// GET /api/certificates?profileId=
export async function GET(req: Request) {
  const url = new URL(req.url);
  const profile = await resolveProfile(url.searchParams.get("profileId"));
  const certs = await db.listCertificates(profile.id);
  const certificates = await Promise.all(
    certs.map(async (c) => ({
      ...c,
      course_title: (await db.getCourse(c.course_id))?.title ?? c.course_id,
    })),
  );
  return Response.json({ certificates });
}
