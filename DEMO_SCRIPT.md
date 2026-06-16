# Demo Script — Mentoria Hub (Eligibility + Readiness Engine, ≈95 seconds)

**Golden rule:** one student journey + one operator moment, zero detours. The wow (eligibility reveal) must play in one unbroken screen action in <15s. Rehearse 5+ times.

## Pre-load before the demo
- Start **logged-out on the homepage** so the eligibility reveal is live.
- Seed data loaded (25–35 opportunities with requirements fields; 3 courses incl. "English for Academic Success").
- Demo student **"Aruzhan", grade 10, Turkistan** pre-seeded with a half-finished course + 1 opportunity in "Preparing" (so no screen is empty).
- **Admin panel open & authenticated in a second tab** for the live-add beat.
- One theme chosen; mobile view rehearsed; readiness gauge + counter animations verified on the demo machine.

## The path
1. **[0:00] Homepage** — "Find what you actually qualify for." Click **"What do I qualify for?"**
2. **[0:08] Onboarding** — grade **10** → region **Turkistan** → interests **STEM + Medicine** → English **B2 / IELTS in progress** → goal **study abroad.** Finish.
3. **[0:20] ELIGIBILITY REVEAL — THE WOW.** Catalog renders with badges: ✅ **You qualify (7)** · 🟡 **Qualify in ~1 year (4)** · 🔒 **Locked (2)**. Hover one → explanation chip: *"matched: grade ✓, English B2 ✓, citizenship ✓."* Say: *"Not 'you might like this' — 'you qualify for this, here's why.'"*
4. **[0:38] Readiness check** — open a ✅ research program → **5-question readiness check** → gauge sweeps to **68%**, radar highlights **2 red gaps.**
5. **[0:52] Auto gap-course** — click **"Close my gaps"** → a 3-lesson mini-course is assembled from the gaps. Open **lesson 1 = async-as-mentor**: concept → worked example → **"your turn" task → instant feedback** → mini-quiz → **progress bar moves.**
6. **[1:08] Dashboard** — **application pipeline** (Saved → Preparing → Ready → Applied), readiness score per saved opp, upcoming deadlines, eligible recommendations.
7. **[1:20] (optional) Two-student proof** — quick toggle to a grade-9 Social-Impact profile → the **same catalog renders different badges.** "It's real, not hardcoded."
8. **[1:30] OPERATOR MOMENT** — second tab: **Admin → Add opportunity** (a new olympiad) → **live scaling counter: "now reaching 1,240 eligible students across 14 regions."** Switch back to catalog → it appears for eligible students. *"Mentoria adds one thing, no developer, it reaches everyone who qualifies — instantly."*
9. **[1:40] End on stats** — admin stats: students reached, eligibility distribution, completions.

## NEVER click during the demo
- Any unfinished/"coming soon" screen or empty state.
- Admin **edit/delete** — only **Add** (deletes can break the live catalog mid-demo).
- A readiness/eligibility case you didn't rehearse (use the seeded profiles only).
- Any KZ-language screen whose strings you didn't QA that morning.
- **Not on this list = doesn't exist for the demo.**

## Backup plan
- **Recorded video is the primary artifact** — a live glitch never costs the score.
- Supabase down → `lib/db.ts` mock fallback keeps everything working.
- Eligibility/readiness are **deterministic rules** (no live LLM on the critical path) — they cannot "fail to respond."
- Wi-Fi dies → phone hotspot + the recorded video.
