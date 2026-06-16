import type { TopicLevel, TopicLevelValue } from "./types";

export function scoreToLevel(score: number): TopicLevelValue {
  if (score >= 80) return "strong";
  if (score >= 50) return "mid";
  return "weak";
}

export interface DiagnosticAnswer {
  topic: string;
  correct: number; // number of correct answers
  total: number; // total questions for the topic
}

/** Turns per-topic diagnostic results into TopicLevel entries (deterministic). */
export function gradeDiagnostic(answers: DiagnosticAnswer[]): TopicLevel[] {
  return answers
    .filter((a) => a.total > 0)
    .map((a) => {
      const score = Math.round((100 * a.correct) / a.total);
      return { topic: a.topic, score, level: scoreToLevel(score) };
    });
}
