import { describe, it, expect } from "vitest";
import { planRoadmapDeterministic, type RoadmapContext } from "./roadmapPlanner";

const ctx: RoadmapContext = {
  today: "2026-06-17",
  opportunities: [
    { id: "b", title: "B late", category: "scholarship", deadline: "2026-10-01", eligibility: "qualify" },
    { id: "a", title: "A soon", category: "olympiad", deadline: "2026-07-01", eligibility: "qualify" },
    { id: "loc", title: "Locked one", category: "scholarship", deadline: "2026-08-01", eligibility: "locked" },
    { id: "s", title: "Soon-eligible", category: "program", deadline: "2026-09-01", eligibility: "soon" },
  ],
};

describe("planRoadmapDeterministic", () => {
  it("orders steps by deadline ascending and excludes locked", () => {
    const steps = planRoadmapDeterministic(ctx);
    const ids = steps.map((s) => s.id);
    expect(ids).toEqual(["a", "s", "b"]);
  });

  it("gives each step a pass/fail branch and a reason", () => {
    const steps = planRoadmapDeterministic(ctx);
    for (const s of steps) {
      expect(s.onPass).toBeTruthy();
      expect(s.onFail).toBeTruthy();
      expect(s.why).toBeTruthy();
    }
  });

  it("applies recorded outcomes to step status", () => {
    const steps = planRoadmapDeterministic({ ...ctx, outcomes: { a: "passed" } });
    expect(steps.find((s) => s.id === "a")?.status).toBe("passed");
    expect(steps.find((s) => s.id === "s")?.status).toBe("todo");
  });

  it("returns empty when nothing is eligible", () => {
    expect(planRoadmapDeterministic({ today: "2026-06-17", opportunities: [] })).toEqual([]);
  });
});
