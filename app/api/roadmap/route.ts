import { db } from "@/lib/db";
import { resolveProfile } from "@/lib/enrich";
import { evaluateEligibility } from "@/lib/eligibility";
import { llmJSON } from "@/lib/llm";
import { planRoadmapDeterministic, type RoadmapContext, type RoadmapStep, type StepStatus } from "@/lib/roadmapPlanner";

// POST /api/roadmap  {profileId, outcomes?} -> adaptive branching plan (AI, deterministic fallback)
export async function POST(req: Request) {
  const { profileId, outcomes = {} } = await req.json().catch(() => ({}));
  const profile = await resolveProfile(profileId);
  const today = new Date().toISOString().slice(0, 10);

  const enriched = (await db.listOpportunities()).map((o) => ({
    id: o.id,
    title: o.title,
    category: o.category,
    deadline: o.deadline,
    eligibility: evaluateEligibility(profile, o).status,
  }));
  const ctx: RoadmapContext = { today, opportunities: enriched, outcomes };

  const eligible = enriched
    .filter((o) => o.eligibility !== "locked")
    .sort((a, b) => a.deadline.localeCompare(b.deadline));

  const prompt = `Ты — наставник по поступлению. Построй АДАПТИВНЫЙ план-роадмап ученика НА РУССКОМ.
Профиль: ${profile.grade} класс, регион ${profile.region}, цели: ${profile.goals.join(", ") || "—"}, английский ${profile.english_level}.
Сегодня: ${today}.
Доступные возможности (id|название|категория|дедлайн|статус допуска):
${eligible.map((o) => `${o.id}|${o.title}|${o.category}|${o.deadline}|${o.eligibility}`).join("\n")}
Отмеченные исходы (id -> исход): ${JSON.stringify(outcomes)}
Верни СТРОГО JSON: {"steps":[{"id","title","date","type","status":"todo|passed|failed|done","onPass","onFail","why"}]}.
Правила: упорядочь по датам, ближайший шаг первым; для КАЖДОГО шага дай ветки onPass и onFail (что делать если прошёл/не прошёл); учитывай отмеченные исходы в поле status; используй id из списка, где шаг основан на возможности; максимум 8 шагов, конкретно.`;

  const ai = await llmJSON<{ steps: RoadmapStep[] }>(prompt);
  if (ai && Array.isArray(ai.steps) && ai.steps.length > 0) {
    const steps: RoadmapStep[] = ai.steps.slice(0, 8).map((s, i) => ({
      id: s.id || `step-${i}`,
      title: String(s.title ?? "Шаг"),
      date: s.date ?? null,
      type: String(s.type ?? "step"),
      status: (["todo", "passed", "failed", "done", "skipped"].includes(s.status) ? s.status : "todo") as StepStatus,
      onPass: String(s.onPass ?? "Переходи к следующему шагу."),
      onFail: String(s.onFail ?? "Подтяни пробелы и попробуй позже."),
      why: String(s.why ?? ""),
    }));
    return Response.json({ steps, source: "ai" });
  }

  return Response.json({ steps: planRoadmapDeterministic(ctx), source: "rubric" });
}
