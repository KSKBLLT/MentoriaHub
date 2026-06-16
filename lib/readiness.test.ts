import { describe, it, expect } from "vitest";
import { evaluateReadiness } from "./readiness";
import type { Opportunity, Profile, TopicLevel } from "./types";

function profileWith(levels: TopicLevel[]): Profile {
  return {
    id: "p1",
    name: "Aruzhan",
    grade: 10,
    region: "Turkistan",
    city: "Turkistan",
    language: "ru",
    citizenship: "KZ",
    role: "student",
    english_level: "B1",
    goals: [],
    diagnostic_status: "done",
    topic_levels: levels,
  };
}

function oppWithTargets(target_levels: Record<string, "mid" | "strong">): Opportunity {
  return {
    id: "o1",
    title: "SAT",
    org: "Org",
    category: "prep",
    direction: "STEM",
    format: "online",
    region: null,
    city: null,
    deadline: "2026-09-01",
    description: "",
    apply_url: "#",
    tags: [],
    req: { target_levels },
    save_count: 0,
  };
}

describe("evaluateReadiness", () => {
  it("is 100% with no gaps when all required topics meet or exceed their level", () => {
    const profile = profileWith([
      { topic: "sat_math", score: 90, level: "strong" },
      { topic: "functions", score: 80, level: "strong" },
    ]);
    const r = evaluateReadiness(profile, oppWithTargets({ sat_math: "strong", functions: "mid" }));
    expect(r.percent).toBe(100);
    expect(r.gaps).toHaveLength(0);
  });

  it("lists topics below their required level as gaps", () => {
    const profile = profileWith([
      { topic: "sat_math", score: 40, level: "weak" },
      { topic: "functions", score: 35, level: "weak" },
    ]);
    const r = evaluateReadiness(profile, oppWithTargets({ sat_math: "strong", functions: "strong" }));
    expect(r.gaps).toContain("sat_math");
    expect(r.gaps).toContain("functions");
    expect(r.percent).toBe(0);
  });

  it("computes a partial percent when some topics are met", () => {
    const profile = profileWith([
      { topic: "sat_math", score: 90, level: "strong" },
      { topic: "geometry", score: 30, level: "weak" },
    ]);
    const r = evaluateReadiness(profile, oppWithTargets({ sat_math: "strong", geometry: "strong" }));
    expect(r.percent).toBe(50);
    expect(r.gaps).toEqual(["geometry"]);
  });

  it("treats a topic missing from the profile as a gap (level none)", () => {
    const profile = profileWith([{ topic: "sat_math", score: 90, level: "strong" }]);
    const r = evaluateReadiness(profile, oppWithTargets({ sat_math: "strong", reading: "mid" }));
    expect(r.gaps).toEqual(["reading"]);
    expect(r.percent).toBe(50);
  });

  it("is 100% when the opportunity defines no target levels", () => {
    const r = evaluateReadiness(profileWith([]), oppWithTargets({}));
    expect(r.percent).toBe(100);
    expect(r.gaps).toHaveLength(0);
  });
});
