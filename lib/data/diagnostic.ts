import type { QuizQuestion } from "../types";

// Diagnostic question banks per topic (answers checked server-side).
export const DIAGNOSTIC_BANK: Record<string, QuizQuestion[]> = {
  sat_math: [
    { q: "f(x) = 2x + 3. Чему равно f(4)?", options: ["8", "11", "10", "14"], correctIndex: 1 },
    { q: "Реши: 5x = 20", options: ["x=2", "x=4", "x=5", "x=100"], correctIndex: 1 },
    { q: "Площадь прямоугольника 4×5 =", options: ["9", "20", "18", "45"], correctIndex: 1 },
    { q: "30% от 200 =", options: ["6", "60", "30", "70"], correctIndex: 1 },
  ],
  ent_math: [
    { q: "10% от 350 =", options: ["35", "3.5", "30", "350"], correctIndex: 0 },
    { q: "Реши: x + 7 = 12", options: ["x=4", "x=5", "x=19", "x=6"], correctIndex: 1 },
    { q: "Сколько будет 12 × 8?", options: ["86", "96", "104", "92"], correctIndex: 1 },
    { q: "Корень из 81 =", options: ["7", "8", "9", "18"], correctIndex: 2 },
  ],
  ielts_reading: [
    { q: "Synonym of 'significant'?", options: ["minor", "important", "fast", "round"], correctIndex: 1 },
    { q: "'Skim' a text means…", options: ["read every word", "read quickly for gist", "translate", "memorize"], correctIndex: 1 },
    { q: "Antonym of 'increase'?", options: ["rise", "grow", "decrease", "expand"], correctIndex: 2 },
  ],
};

// Maps onboarding goals to diagnostic topics.
const GOAL_TO_TOPICS: Record<string, string[]> = {
  sat: ["sat_math"],
  ent: ["ent_math"],
  ielts: ["ielts_reading"],
  math: ["sat_math", "ent_math"],
};

export function topicsForGoals(goals: string[]): string[] {
  const set = new Set<string>();
  for (const g of goals) for (const t of GOAL_TO_TOPICS[g] ?? []) set.add(t);
  // Always offer at least one topic so the diagnostic is never empty.
  if (set.size === 0) set.add("sat_math");
  return [...set].filter((t) => DIAGNOSTIC_BANK[t]);
}
