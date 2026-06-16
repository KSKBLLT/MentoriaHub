import type { Opportunity, Profile, ReadinessResult, TopicLevelValue } from "./types";

const LEVEL_ORDER: (TopicLevelValue | "none")[] = ["none", "weak", "mid", "strong"];

function rank(level: TopicLevelValue | "none"): number {
  return LEVEL_ORDER.indexOf(level);
}

/**
 * Deterministic readiness engine (SPEC §6).
 * Compares the student's per-topic mastery against an opportunity's target levels.
 * Returns a percent (each required topic weighted equally), the list of gap topics,
 * and a per-topic breakdown.
 */
export function evaluateReadiness(profile: Profile, opp: Opportunity): ReadinessResult {
  const targets = opp.req?.target_levels ?? {};
  const topics = Object.keys(targets);

  if (topics.length === 0) {
    return { percent: 100, gaps: [], perTopic: [] };
  }

  const gaps: string[] = [];
  const perTopic: ReadinessResult["perTopic"] = [];

  for (const topic of topics) {
    const need = targets[topic];
    const have = profile.topic_levels.find((t) => t.topic === topic)?.level ?? "none";
    const ok = rank(have) >= rank(need);
    perTopic.push({ topic, have, need, ok });
    if (!ok) gaps.push(topic);
  }

  const metCount = topics.length - gaps.length;
  const percent = Math.round((100 * metCount) / topics.length);

  return { percent, gaps, perTopic };
}
