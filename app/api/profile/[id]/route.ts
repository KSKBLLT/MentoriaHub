import { db } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const profile = await db.getProfile(id);
  if (!profile) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({ profile });
}
