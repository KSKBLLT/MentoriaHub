import { evaluateEligibility } from "./eligibility";
import type { EligibilityStatus, Opportunity, Profile } from "./types";

const ELIGIBILITY_WEIGHT: Record<EligibilityStatus, number> = {
  qualify: 1.0,
  soon: 0.6,
  locked: 0.1,
};

const DAY_MS = 86_400_000;

function tagOverlap(profile: Profile, opp: Opportunity): number {
  if (!opp.tags || opp.tags.length === 0) return 0;
  const goals = new Set(profile.goals);
  const shared = opp.tags.filter((t) => goals.has(t)).length;
  return shared / opp.tags.length;
}

/** city match 1.0 | region match 0.7 | online 0.5 | offline elsewhere 0.1; hybrid = max(0.5, location) */
function locationScore(profile: Profile, opp: Opportunity): number {
  if (opp.format === "online") return 0.5;
  const loc =
    opp.city && opp.city === profile.city
      ? 1.0
      : opp.region && opp.region === profile.region
        ? 0.7
        : 0.1;
  if (opp.format === "hybrid") return Math.max(0.5, loc);
  return loc;
}

/** 1.0 within ~60 days, fades to 0 by ~one year, 0 if already passed */
function deadlineProximity(opp: Opportunity, today: Date): number {
  const deadline = new Date(`${opp.deadline}T00:00:00Z`).getTime();
  const days = Math.floor((deadline - today.getTime()) / DAY_MS);
  if (days <= 0) return 0;
  if (days <= 60) return 1.0;
  return Math.max(0, 1 - (days - 60) / 305);
}

/** Recommendation score 0..100 (SPEC §4): eligibility 40 + tags 25 + location 20 + deadline 15. */
export function scoreOpportunity(profile: Profile, opp: Opportunity, today: Date): number {
  const status = evaluateEligibility(profile, opp).status;
  const score =
    40 * ELIGIBILITY_WEIGHT[status] +
    25 * tagOverlap(profile, opp) +
    20 * locationScore(profile, opp) +
    15 * deadlineProximity(opp, today);
  return Math.round(score);
}

export interface RecommendOptions {
  today?: Date;
  limit?: number;
}

/** Returns opportunities sorted by score descending, optionally limited to top N. */
export function recommend(
  profile: Profile,
  opps: Opportunity[],
  options: RecommendOptions = {},
): Opportunity[] {
  const today = options.today ?? new Date();
  const sorted = [...opps].sort(
    (a, b) => scoreOpportunity(profile, b, today) - scoreOpportunity(profile, a, today),
  );
  return options.limit ? sorted.slice(0, options.limit) : sorted;
}
