export interface MentorInput {
  target: string;
  type: string;
  text: string;
}
export interface MentorFix {
  before?: string;
  after?: string;
  why: string;
}
export interface MentorResult {
  scores: { relevance: number; specificity: number; structure: number; language: number };
  total: number;
  strengths: string[];
  fixes: MentorFix[];
  verdict: string;
  source?: "ai" | "rubric";
}

const CLICHES = ["very passionate", "since childhood", "dream come true", "i believe i am", "с детства", "очень хочу"];
const clamp = (n: number, lo = 0, hi = 25) => Math.max(lo, Math.min(hi, Math.round(n)));

/** Deterministic letter analysis used as a fallback when the LLM is unavailable. */
export function analyzeLetterDeterministic(input: MentorInput): MentorResult {
  const text = (input.text ?? "").trim();
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Relevance — how much the letter ties to the target.
  const targetWords = (input.target ?? "").toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  let relevance: number;
  if (targetWords.length === 0) relevance = 12;
  else relevance = clamp((targetWords.filter((w) => lower.includes(w)).length / targetWords.length) * 25);

  // Specificity — numbers, results, concrete facts.
  const numbers = (text.match(/\d+/g) ?? []).length;
  const specificity = clamp(5 + numbers * 4);

  // Structure — sentences and paragraphs.
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  const structure = clamp(sentences * 3 + paragraphs * 4);

  // Language — adequacy of length, minus clichés.
  const base = wordCount >= 120 ? 25 : wordCount >= 60 ? 18 : wordCount >= 25 ? 10 : 5;
  const clichePenalty = CLICHES.filter((c) => lower.includes(c)).length * 3;
  const language = clamp(base - clichePenalty);

  const scores = { relevance, specificity, structure, language };
  const total = relevance + specificity + structure + language;

  const strengths: string[] = [];
  if (relevance >= 18) strengths.push("Письмо явно связано с целью.");
  if (specificity >= 18) strengths.push("Есть конкретика: цифры и результаты.");
  if (structure >= 18) strengths.push("Хорошая структура: абзацы и логика.");
  if (language >= 18) strengths.push("Достаточный объём и чистый язык.");
  if (strengths.length === 0) strengths.push("Есть основа. Дальше усиливаем.");

  const fixes: MentorFix[] = [];
  if (relevance < 18)
    fixes.push({ why: `Свяжи письмо с целью «${input.target || "заявка"}»: упомяни программу и почему именно она.` });
  if (specificity < 18)
    fixes.push({ why: "Добавь конкретику: цифры, результаты, факты (баллы, места, проекты) вместо общих слов." });
  if (structure < 18)
    fixes.push({ before: "Один сплошной текст", after: "Вступление, достижения, цель/вывод", why: "Раздели на 3 абзаца с чёткой логикой." });
  if (language < 18)
    fixes.push({ why: "Раскрой мысль подробнее (целься в ~150–250 слов) и убери клише." });

  const verdict =
    total >= 80
      ? "Сильное письмо. Готово к подаче с мелкими правками."
      : total >= 50
        ? "Неплохо, но под цель стоит усилить конкретику и связь."
        : `Пока слабо для «${input.target || "этой цели"}». Нужно больше конкретики и связи с целью.`;

  return { scores, total, strengths, fixes, verdict, source: "rubric" };
}
