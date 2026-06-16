import { db } from "@/lib/db";
import { verifyCertificate } from "@/lib/certificate";

type Ctx = { params: Promise<{ hash: string }> };

// GET /api/verify/[hash]  -> public credential verification
export async function GET(_req: Request, { params }: Ctx) {
  const { hash } = await params;
  const certificate = await db.getCertificateByHash(hash);
  if (!certificate) return Response.json({ valid: false, error: "not found" }, { status: 404 });

  return Response.json({
    valid: verifyCertificate(certificate),
    certificate,
    course_title: (await db.getCourse(certificate.course_id))?.title ?? certificate.course_id,
    student_name: (await db.getProfile(certificate.profile_id))?.name ?? "Student",
  });
}
