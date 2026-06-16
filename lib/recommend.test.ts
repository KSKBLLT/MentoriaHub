import { describe, it, expect } from "vitest";
import { scoreOpportunity, recommend } from "./recommend";
import type { Opportunity, Profile } from "./types";

const TODAY = new Date("2026-07-01T00:00:00Z");

const profile: Profile = {
  id: "p1",
  name: "Aruzhan",
  grade: 10,
  region: "Turkistan",
  city: "Turkistan",
  language: "ru",
  citizenship: "KZ",
  role: "student",
  english_level: "B1",
  goals: ["sat", "math"],
  diagnostic_status: "done",
  topic_levels: [],
};

function make(over: Partial<Opportunity>): Opportunity {
  return {
    id: over.id ?? "o",
    title: over.title ?? "T",
    org: "Org",
    category: "prep",
    direction: "STEM",
    format: over.format ?? "online",
    region: over.region ?? null,
    city: over.city ?? null,
    deadline: over.deadline ?? "2026-07-31", // 30 days out
    description: "",
    apply_url: "#",
    tags: over.tags ?? ["sat", "math"],
    req: over.req ?? {},
    save_count: 0,
  };
}

describe("scoreOpportunity", () => {
  it("scores a perfect match (qualify + full tags + same city + near deadline) at 100", () => {
    const opp = make({ format: "offline", region: "Turkistan", city: "Turkistan", tags: ["sat", "math"] });
    expect(scoreOpportunity(profile, opp, TODAY)).toBe(100);
  });

  it("scores a locked opportunity lower than an otherwise identical qualifying one", () => {
    const ok = make({ id: "ok" });
    const locked = make({ id: "lk", req: { citizenship: "other" } });
    expect(scoreOpportunity(profile, locked, TODAY)).toBeLessThan(scoreOpportunity(profile, ok, TODAY));
  });

  it("ranks an online opportunity above an offline one in another region (location)", () => {
    const online = make({ id: "on", format: "online" });
    const farOffline = make({ id: "off", format: "offline", region: "Almaty", city: "Almaty" });
    expect(scoreOpportunity(profile, online, TODAY)).toBeGreaterThan(scoreOpportunity(profile, farOffline, TODAY));
  });

  it("gives no deadline credit when the deadline has already passed", () => {
    const future = make({ id: "f", deadline: "2026-07-31" });
    const passed = make({ id: "p", deadline: "2026-01-01" });
    expect(scoreOpportunity(profile, future, TODAY)).toBeGreaterThan(scoreOpportunity(profile, passed, TODAY));
  });

  it("gives zero tag credit when there is no overlap", () => {
    const noOverlap = make({ tags: ["biology", "art"], format: "online" });
    const fullOverlap = make({ tags: ["sat", "math"], format: "online" });
    expect(scoreOpportunity(profile, noOverlap, TODAY)).toBeLessThan(scoreOpportunity(profile, fullOverlap, TODAY));
  });
});

describe("recommend", () => {
  it("returns opportunities sorted by score descending", () => {
    const best = make({ id: "best", format: "offline", region: "Turkistan", city: "Turkistan", tags: ["sat", "math"] });
    const worst = make({ id: "worst", format: "offline", region: "Almaty", city: "Almaty", tags: ["art"], req: { citizenship: "other" } });
    const result = recommend(profile, [worst, best], { today: TODAY });
    expect(result[0].id).toBe("best");
    expect(result[1].id).toBe("worst");
  });

  it("respects the limit option", () => {
    const opps = [make({ id: "a" }), make({ id: "b" }), make({ id: "c" })];
    expect(recommend(profile, opps, { today: TODAY, limit: 2 })).toHaveLength(2);
  });
});
