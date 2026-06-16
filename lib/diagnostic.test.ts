import { describe, it, expect } from "vitest";
import { gradeDiagnostic, scoreToLevel } from "./diagnostic";

describe("scoreToLevel", () => {
  it("maps scores to levels by threshold", () => {
    expect(scoreToLevel(90)).toBe("strong");
    expect(scoreToLevel(80)).toBe("strong");
    expect(scoreToLevel(65)).toBe("mid");
    expect(scoreToLevel(50)).toBe("mid");
    expect(scoreToLevel(40)).toBe("weak");
  });
});

describe("gradeDiagnostic", () => {
  it("computes a level per topic from correct/total", () => {
    const levels = gradeDiagnostic([
      { topic: "sat_math", correct: 1, total: 4 }, // 25 -> weak
      { topic: "ent_math", correct: 4, total: 4 }, // 100 -> strong
      { topic: "ielts_reading", correct: 2, total: 3 }, // 67 -> mid
    ]);
    expect(levels).toEqual([
      { topic: "sat_math", score: 25, level: "weak" },
      { topic: "ent_math", score: 100, level: "strong" },
      { topic: "ielts_reading", score: 67, level: "mid" },
    ]);
  });

  it("ignores topics with zero questions", () => {
    expect(gradeDiagnostic([{ topic: "x", correct: 0, total: 0 }])).toEqual([]);
  });
});
