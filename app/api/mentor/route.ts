import { llmJSON } from "@/lib/llm";
import { analyzeLetterDeterministic, type MentorResult } from "@/lib/mentorRubric";

// POST /api/mentor  {target, type, text} -> mentor-style analysis (AI, deterministic fallback)
export async function POST(req: Request) {
  const { target = "", type = "мотивационное письмо", text = "" } = await req.json();

  if (!text || text.trim().length < 5) {
    return Response.json({ error: "Напиши текст письма (хотя бы пару предложений)." }, { status: 400 });
  }

  const prompt = `Ты — строгий, но доброжелательный ментор по поступлению (как опытный наставник Mentoria).
Проанализируй заявочное письмо ученика и дай разбор НА РУССКОМ.
Цель заявки: "${target}". Тип: "${type}".
Верни СТРОГО валидный JSON такого вида:
{"scores":{"relevance":0-25,"specificity":0-25,"structure":0-25,"language":0-25},
"total":0-100,"strengths":["..."],"fixes":[{"before":"...","after":"...","why":"..."}],"verdict":"..."}
Критерии: relevance — связь с целью; specificity — конкретика/цифры/результаты; structure — логика и абзацы; language — язык и объём.
Советы (fixes) — конкретные, с примерами «было → стало». 2–4 сильные стороны, 2–5 правок.
Письмо:
"""${text.slice(0, 6000)}"""`;

  const ai = await llmJSON<MentorResult>(prompt);
  if (ai && ai.scores && typeof ai.scores.relevance === "number") {
    const s = ai.scores;
    const total = (s.relevance ?? 0) + (s.specificity ?? 0) + (s.structure ?? 0) + (s.language ?? 0);
    return Response.json({ ...ai, total, source: "ai" } satisfies MentorResult);
  }

  // Fallback — deterministic, never fails.
  return Response.json(analyzeLetterDeterministic({ target, type, text }));
}
