import { db } from "@/lib/db";
import { resolveProfile } from "@/lib/enrich";
import { DIAGNOSTIC_BANK, topicsForGoals } from "@/lib/data/diagnostic";
import { gradeDiagnostic } from "@/lib/diagnostic";

// GET /api/diagnostic?profileId=  -> questions (no answers) for the profile's goals
export async function GET(req: Request) {
  const url = new URL(req.url);
  const profile = await resolveProfile(url.searchParams.get("profileId"));
  const sections = topicsForGoals(profile.goals).map((topic) => ({
    topic,
    questions: DIAGNOSTIC_BANK[topic].map((q) => ({ q: q.q, options: q.options })),
  }));
  return Response.json({ sections });
}

// POST /api/diagnostic  {profileId, answers: {topic: number[]}}  -> grade + save topic_levels
export async function POST(req: Request) {
  const { profileId, answers } = await req.json();
  const profile = await resolveProfile(profileId);

  const graded = Object.entries(answers ?? {}).map(([topic, picks]) => {
    const bank = DIAGNOSTIC_BANK[topic] ?? [];
    const arr = (picks as number[]) ?? [];
    const correct = bank.reduce((acc, q, i) => acc + (arr[i] === q.correctIndex ? 1 : 0), 0);
    return { topic, correct, total: bank.length };
  });

  const topic_levels = gradeDiagnostic(graded);
  await db.saveProfile({ ...profile, topic_levels, diagnostic_status: "done" });
  return Response.json({ topic_levels, diagnostic_status: "done" });
}
