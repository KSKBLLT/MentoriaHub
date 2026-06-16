import { describe, it, expect } from "vitest";
import { locationBadge } from "./locationBadge";
import type { Opportunity, Profile } from "./types";

const profile = { region: "Turkistan", city: "Turkistan" } as Profile;

function opp(over: Partial<Opportunity>): Opportunity {
  return { format: "online", region: null, city: null, ...over } as Opportunity;
}

describe("locationBadge", () => {
  it("labels online opportunities", () => {
    expect(locationBadge(profile, opp({ format: "online" }))).toBe("🌐 Онлайн");
  });

  it("labels offline opportunities in the student's region as nearby", () => {
    const b = locationBadge(profile, opp({ format: "offline", region: "Turkistan", city: "Shymkent" }));
    expect(b).toContain("Рядом");
    expect(b).toContain("Shymkent");
  });

  it("labels offline opportunities in another region with just the city", () => {
    const b = locationBadge(profile, opp({ format: "offline", region: "Almaty", city: "Almaty" }));
    expect(b).not.toContain("Рядом");
    expect(b).toContain("Almaty");
  });

  it("labels hybrid opportunities as hybrid", () => {
    const b = locationBadge(profile, opp({ format: "hybrid", region: "Astana", city: "Astana" }));
    expect(b.toLowerCase()).toContain("гибрид");
  });
});
