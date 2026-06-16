import type { Opportunity, Profile } from "./types";

/** Human-readable location badge for an opportunity, relative to the student (SPEC §5). */
export function locationBadge(profile: Profile, opp: Opportunity): string {
  if (opp.format === "online") return "🌐 Онлайн";

  const place = opp.city || opp.region || "";
  const nearby = opp.region && opp.region === profile.region;

  if (opp.format === "hybrid") {
    return `🌐+📍 Гибрид${place ? ` · ${place}` : ""}`;
  }
  // offline
  return nearby ? `📍 Рядом · ${place}` : `📍 ${place}`;
}
