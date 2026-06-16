import { db } from "@/lib/db";
import { recommend } from "@/lib/recommend";
import { enrichOpportunity, resolveProfile } from "@/lib/enrich";

// GET /api/dashboard?profileId=  -> bundle for the student dashboard
export async function GET(req: Request) {
  const url = new URL(req.url);
  const profile = await resolveProfile(url.searchParams.get("profileId"));
  const today = new Date();

  const savedRaw = await db.listSaved(profile.id);
  const saved = await Promise.all(
    savedRaw.map(async (s) => {
      const o = await db.getOpportunity(s.opportunity_id);
      return { ...s, title: o?.title ?? s.opportunity_id, deadline: o?.deadline ?? null };
    }),
  );

  const enrRaw = await db.listEnrollments(profile.id);
  const enrollments = await Promise.all(
    enrRaw.map(async (e) => ({ ...e, title: (await db.getCourse(e.course_id))?.title ?? e.course_id })),
  );

  const certsRaw = await db.listCertificates(profile.id);
  const certificates = await Promise.all(
    certsRaw.map(async (c) => ({ ...c, course_title: (await db.getCourse(c.course_id))?.title ?? c.course_id })),
  );

  const top = recommend(profile, await db.listOpportunities(), { today, limit: 4 });
  const recommendations = top.map((o) => enrichOpportunity(profile, o, today, savedRaw));

  return Response.json({ profile, saved, enrollments, certificates, recommendations });
}
