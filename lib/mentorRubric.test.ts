import { describe, it, expect } from "vitest";
import { analyzeLetterDeterministic } from "./mentorRubric";

const poor = { target: "Bolashak scholarship", type: "motivation", text: "I want it. Please give me." };
const good = {
  target: "Bolashak scholarship abroad",
  type: "motivation",
  text: `I am applying for the Bolashak scholarship to study abroad.

Over the past 2 years I won 3 regional olympiads in mathematics and led a team of 5 students in a coding hackathon. My goal is to study computer science and bring these skills back to my region.

I have prepared with concrete results: my IELTS score is 7.0 and my GPA is 4.8. This scholarship is the next step toward that plan.`,
};

describe("analyzeLetterDeterministic", () => {
  it("keeps each score within 0..25 and total within 0..100", () => {
    const r = analyzeLetterDeterministic(good);
    for (const v of Object.values(r.scores)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(25);
    }
    expect(r.total).toBeGreaterThanOrEqual(0);
    expect(r.total).toBeLessThanOrEqual(100);
    expect(r.total).toBe(r.scores.relevance + r.scores.specificity + r.scores.structure + r.scores.language);
  });

  it("scores a strong, on-target letter higher than a weak one", () => {
    expect(analyzeLetterDeterministic(good).total).toBeGreaterThan(analyzeLetterDeterministic(poor).total);
  });

  it("rates relevance higher when the text matches the target", () => {
    expect(analyzeLetterDeterministic(good).scores.relevance).toBeGreaterThan(
      analyzeLetterDeterministic(poor).scores.relevance,
    );
  });

  it("gives actionable fixes for a weak letter", () => {
    const r = analyzeLetterDeterministic(poor);
    expect(r.fixes.length).toBeGreaterThan(0);
    expect(r.verdict.length).toBeGreaterThan(0);
  });
});
