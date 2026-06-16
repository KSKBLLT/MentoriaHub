import { describe, it, expect } from "vitest";
import { evaluateEligibility } from "./eligibility";
import type { Opportunity, Profile } from "./types";

const baseProfile: Profile = {
  id: "p1",
  name: "Aruzhan",
  grade: 10,
  region: "Turkistan",
  city: "Turkistan",
  language: "ru",
  citizenship: "KZ",
  role: "student",
  english_level: "B1",
  goals: ["sat", "ielts", "ent", "math"],
  diagnostic_status: "done",
  topic_levels: [],
};

function opp(req: Opportunity["req"]): Opportunity {
  return {
    id: "o1",
    title: "Test",
    org: "Org",
    category: "scholarship",
    direction: "STEM",
    format: "online",
    region: null,
    city: null,
    deadline: "2026-09-01",
    description: "",
    apply_url: "#",
    tags: [],
    req,
    save_count: 0,
  };
}

describe("evaluateEligibility", () => {
  it("returns qualify when grade, citizenship and english are all met", () => {
    const r = evaluateEligibility(baseProfile, opp({ min_grade: 10, citizenship: "KZ", min_english: "B1" }));
    expect(r.status).toBe("qualify");
    expect(r.missing).toHaveLength(0);
    expect(r.met.length).toBeGreaterThan(0);
  });

  it("returns soon when the student is younger than the minimum grade", () => {
    const r = evaluateEligibility(baseProfile, opp({ min_grade: 11 }));
    expect(r.status).toBe("soon");
    expect(r.missing.join(" ")).toContain("11");
  });

  it("returns soon when english level is below the requirement (closeable gap)", () => {
    const r = evaluateEligibility(baseProfile, opp({ min_english: "B2" }));
    expect(r.status).toBe("soon");
    expect(r.missing.join(" ")).toContain("B2");
  });

  it("returns locked when the student has aged out (above max grade)", () => {
    const younger = opp({ max_grade: 9 });
    const r = evaluateEligibility(baseProfile, younger);
    expect(r.status).toBe("locked");
  });

  it("returns locked when citizenship does not match", () => {
    const r = evaluateEligibility(baseProfile, opp({ citizenship: "other" }));
    expect(r.status).toBe("locked");
    expect(r.missing.join(" ").toLowerCase()).toContain("граждан");
  });

  it("locked takes precedence over a soon-type gap", () => {
    const r = evaluateEligibility(baseProfile, opp({ citizenship: "other", min_english: "B2" }));
    expect(r.status).toBe("locked");
  });

  it("qualifies when an opportunity has no requirements", () => {
    const r = evaluateEligibility(baseProfile, opp({}));
    expect(r.status).toBe("qualify");
  });
});
