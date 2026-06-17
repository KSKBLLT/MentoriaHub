export type StepStatus = "todo" | "passed" | "failed" | "done" | "skipped";

export interface RoadmapStep {
  id: string;
  title: string;
  date: string | null;
  type: string;
  status: StepStatus;
  onPass: string;
  onFail: string;
  why: string;
}

export interface RoadmapContext {
  today: string;
  opportunities: {
    id: string;
    title: string;
    category: string;
    deadline: string;
    eligibility: "qualify" | "soon" | "locked";
  }[];
  outcomes?: Record<string, StepStatus>;
}

/** Deterministic adaptive plan: eligible opportunities ordered by deadline, each with branches. */
export function planRoadmapDeterministic(ctx: RoadmapContext): RoadmapStep[] {
  const outcomes = ctx.outcomes ?? {};
  return ctx.opportunities
    .filter((o) => o.eligibility !== "locked")
    .slice()
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 8)
    .map((o) => ({
      id: o.id,
      title: o.title,
      date: o.deadline,
      type: o.category,
      status: outcomes[o.id] ?? "todo",
      onPass: "Прошёл: переходи к следующему этапу и фиксируй результат в портфолио.",
      onFail: "Не прошёл: подтяни пробелы курсом и попробуй похожую возможность позже.",
      why: o.eligibility === "soon" ? "Скоро станет доступно: начни готовиться заранее." : "Ты проходишь: это твой ближайший шаг.",
    }));
}
