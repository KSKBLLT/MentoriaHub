import type { EligibilityResult, EnglishLevel, Opportunity, Profile } from "./types";

const ENGLISH_ORDER: EnglishLevel[] = ["none", "A2", "B1", "B2", "C1"];

function englishRank(level: EnglishLevel): number {
  return ENGLISH_ORDER.indexOf(level);
}

/**
 * Deterministic eligibility engine (SPEC §3).
 * Compares a student profile against an opportunity's requirements and returns
 * a status (qualify / soon / locked) plus plain-language reasons.
 */
export function evaluateEligibility(profile: Profile, opp: Opportunity): EligibilityResult {
  const met: string[] = [];
  const missing: string[] = [];
  let hardLock = false;

  const req = opp.req ?? {};

  // Grade: above max => aged out (hard lock); below min => will qualify later (soon)
  if (req.max_grade !== undefined && profile.grade > req.max_grade) {
    hardLock = true;
    missing.push(`только для ${req.max_grade} класса и младше`);
  } else if (req.min_grade !== undefined && profile.grade < req.min_grade) {
    missing.push(`откроется в ${req.min_grade} классе`);
  } else if (req.min_grade !== undefined || req.max_grade !== undefined) {
    met.push("класс ✓");
  }

  // Citizenship: mismatch is a hard lock
  if (req.citizenship !== undefined && req.citizenship !== profile.citizenship) {
    hardLock = true;
    missing.push(`нужно гражданство ${req.citizenship}`);
  } else if (req.citizenship !== undefined) {
    met.push("гражданство ✓");
  }

  // English: below requirement is a closeable gap (soon), not a lock
  if (req.min_english !== undefined && englishRank(profile.english_level) < englishRank(req.min_english)) {
    missing.push(`нужен English ${req.min_english}`);
  } else if (req.min_english !== undefined) {
    met.push("English ✓");
  }

  const status = hardLock ? "locked" : missing.length > 0 ? "soon" : "qualify";

  return { status, met, missing };
}
