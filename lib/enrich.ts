import { evaluateEligibility } from "./eligibility";
import { scoreOpportunity } from "./recommend";
import { locationBadge } from "./locationBadge";
import { db } from "./db";
import { DEMO_PROFILE } from "./data/seed";
import type { EligibilityResult, Opportunity, Profile, SavedItem, SavedStatus } from "./types";

export interface EnrichedOpportunity extends Opportunity {
  eligibility: EligibilityResult;
  score: number;
  location_badge: string;
  saved: boolean;
  saved_status: SavedStatus | null;
}

/** Resolve a profile id to a profile, falling back to the demo student. */
export async function resolveProfile(profileId: string | null | undefined): Promise<Profile> {
  if (profileId) {
    const p = await db.getProfile(profileId);
    if (p) return p;
  }
  return (await db.getProfile(DEMO_PROFILE.id)) ?? DEMO_PROFILE;
}

/** Attach eligibility, recommendation score, location badge and saved-state to an opportunity (pure). */
export function enrichOpportunity(
  profile: Profile,
  opp: Opportunity,
  today: Date,
  savedItems: SavedItem[],
): EnrichedOpportunity {
  const savedItem = savedItems.find((s) => s.opportunity_id === opp.id);
  return {
    ...opp,
    eligibility: evaluateEligibility(profile, opp),
    score: scoreOpportunity(profile, opp, today),
    location_badge: locationBadge(profile, opp),
    saved: Boolean(savedItem),
    saved_status: savedItem?.status ?? null,
  };
}
