# User Flow & Winning Strategy — Mentoria Hub

**Concept (team-chosen, ideas 1+3+4 fused):** **From eligibility to acceptance** — one spine, three acts:
- **DISCOVER** (idea 1) — eligibility engine: what you qualify for, and why.
- **PREPARE** (ideas 1+3) — readiness diagnostic → auto gap-course, done *with a squad*.
- **PROVE** (idea 4) — verified portfolio/credential for universities & sponsors.

Persona used to validate: **Aruzhan, grade 10, Turkistan region, prepping ЕНТ + SAT + IELTS, on a phone.**

---

## The journey — step by step (Student POV ↔ Platform POV)

### 0. Welcome — choice of door
- **Student:** Two big buttons, I instantly get it. I tap **"I'm new here."** *Would bail if it demanded email/SMS code up front.*
- **Platform:** Show "I'm new here" / "I already have an account." New → onboarding; returning → login → straight to dashboard. *(tech: `is_new_user` flag routes `/onboarding` vs `/dashboard`.)* → **Feature A**

### 1. Basic profile
- **Student:** Name, grade 10, region — *happy Turkistan region is even in the list (we usually get forgotten)*. Language rus/kaz/eng. No email asked = relief.
- **Platform:** One question per screen, gentle. Save to profile; grade + region feed eligibility rules later. → **Feature D**

### 2. "Who are you?"
- **Student:** Tap **"Школьник"** — one touch, no thinking.
- **Platform:** Role tunes recommendations + visible features. *(tech: `role=student` is a filter tag.)* → **Features E, D**

### 3. Goals & interests
- **Student:** I light up — I can pick **several at once: ЕНТ, SAT, IELTS** + subjects. *⚠️ If ЕНТ/SAT aren't there as explicit buttons (only abstract "STEM/Business"), I doubt the site is for me.*
- **Platform:** Tappable chips incl. **explicit ЕНТ / SAT / IELTS**. Saved as goal-tags — the key for eligibility + the diagnostic. → **Features E, B**

### 4. Offer the diagnostic (optional)
- **Student:** Honestly, first time I'll likely **Skip** (phone, break time, "test" sounds scary). I'm relieved the **Skip button is visible**. A small later nudge saying **"2 minutes / 5 questions"** — I'll tap it eventually. A pop-up every screen — I'll start ignoring it.
- **Platform:** Card "Check your level by topic?" with equal **"Take"** / **"Skip"** buttons — never forced. If skipped → remember + gentle re-offer (a dashboard card + "level not checked" badge), **not** a blocking pop-up. *(tech: `diagnostic_status = offered/skipped/done`.)* → **Features C, E**
  - **With test:** precise level bars per topic; 🟡/🔒 explained concretely; gap-course is pinpoint.
  - **Without:** coarser eligibility (grade + goals only), more cautious 🟡 "needs checking", a "level not checked" badge.

### 5. Diagnostic (if taken)
- **Student:** A few questions **per topic** (ЕНТ-math, SAT Math, IELTS Reading) — not one mush. Seeing my level per topic is a **wow: I finally see where I'm strong/weak without a teacher.** *Keep it ≤5–6 questions or I quit; show weak areas softly ("can improve"), not red "F".*
- **Platform:** Short blocks per chosen topic → score → level (e.g. <50% weak / 50–79% mid / ≥80% strong) saved to `topic_levels`. → **Feature C**

### 6. DISCOVER — catalog with eligibility badges (THE WOW)
- **Student:** **This is why I stay.** Each opportunity has ✅ "you qualify" / 🟡 "in ~1 year" / 🔒 "locked" + a plain reason ("matched: grade ✓, English ✓"). First time anyone tells me *what I'm actually good for.* *Green ✅ = my dopamine. ⚠️ If there's almost no green for a 10th-grader, I feel "I qualify for nothing" — make sure she sees some ✅.*
- **Platform:** Compare each opportunity's requirement-tags vs profile + levels by **deterministic rules**: all met → ✅; only time/grade/year missing → 🟡; hard unmet condition → 🔒. Recs = ✅/🟡 sorted by tag match. *(no live AI.)* → **Features B, E**

### 7. Save + deadlines
- **Student:** I bookmark a ✅ grant; love seeing the **deadline right on the card** (my dates are a mess). "I'll show mom tonight" → I'll come back.
- **Platform:** Save → `saved_items`; deadlines surface in the dashboard sorted by date. → **Features B, D**

### 8. Readiness for a target → gaps → "close them"
- **Student:** I hit "check readiness" on SAT Math → "68%" + two red gaps. Stung for a sec, but the **"close my gaps" button** right there = relief: not just "you're not ready" but *what to do.*
- **Platform:** Gap = topic where target's required level > my level; one tap auto-assembles a mini-course from those topics. → **Features E, C**

### 9. Lesson (async-as-mentor) + squad
- **Student:** The course is built **for my gaps** — feels personal. Explanation → example → my task → hint if I'm stuck → mini-quiz → progress bar grows (I love watching it). I'm in a **squad** with peers — "I'm not alone, I'd be embarrassed to fall behind" → I return tomorrow.
- **Platform:** Step-by-step lesson; each correct answer moves `progress`; assign to a squad by topic+region/language. → **Features C, D**

### 10. Dashboard
- **Student:** Everything in one place: **application funnel (Saved → Preparing → Ready → Applied)**, progress, my squad, deadlines. *Pride: seeing I'm already "Preparing", not at zero.* If I skipped the test, a small non-annoying "check your level" card.
- **Platform:** Reads saved items, progress, squad, deadlines, levels; funnel status computed from progress; shows the diagnostic nudge only if skipped. → **Features D, E**

### 11. PROVE — certificate / portfolio
- **Student:** Finish the course → a **verified certificate** with a check link/QR. **Second wow:** I finally have *proof*, not a random internet badge. "I'll put it in my uni portfolio / show my homeroom teacher / send to mom."
- **Platform:** On 100% → mint `certificates` (hash + course + date), public `/verify/{hash}` page + QR. Shows in dashboard. → **Features C, D**

### 12. Returning visit
- **Student:** Next day I tap **"I already have an account"** → straight to my dashboard. *If it forced me through onboarding again, I'd rage-quit.*
- **Platform:** Login → read profile → `/dashboard`; if diagnostic still skipped, gently re-offer. → **Features A, D, E**

---

## UX guardrails (locked from the student simulation — do NOT violate)
1. **Always show explicit ЕНТ / SAT / IELTS** in goals — not only abstract directions. (Core audience must see their exact goal.)
2. **The diagnostic Skip button is visible**, framed "5 questions / 2 minutes". Re-offer as a **gentle card**, never a per-screen pop-up.
3. **A 10th-grader must see some ✅ green** in the catalog (seed eligible items for grade 10), or it demotivates.
4. **Never show a bare readiness % without a "close my gaps" action** next to it. Show weak levels softly ("can improve"), not red failure.
5. **Returning users skip onboarding** entirely.
6. **No email/SMS wall at the start**; demo-mode profile is enough.
7. **Mobile-first** (region pick from a list, not free text; big tap targets).

---

## Requirements compliance (A–F) — all must be real
| Req | Brief demand | Where | Real? |
|-----|--------------|-------|-------|
| A | Homepage + CTAs | `/` (Welcome + value prop) | ✅ |
| B | Catalog: cards (req. field) + filters + Save | `/opportunities` | ✅ + eligibility badges |
| C | 2–3 courses, lessons, quiz, progress | `/courses` (+ diagnostic) | ✅ course 1 full async-as-mentor |
| D | Dashboard: saved, progress, deadlines, recs | `/dashboard` | ✅ + application funnel |
| E | Recommendation onboarding → recs | onboarding → engine | ✅ = eligibility engine (explained) |
| F | Admin CRUD + stats, shows scaling | `/admin` | ✅ writes live + scaling counter |

**Bonus (15%) included:** explainable eligibility · readiness diagnostic · squads · verified credentials · EN/RU/KZ on demo path. **Deferred:** email/Telegram reminders, leaderboard, full mentor portal.

---

## Winning strategy (short)
- **Problem 20%:** open on the "is this for me?" pain; ship explicit ЕНТ/SAT/IELTS; mirror the brief's example course noun.
- **MVP 25%:** all A–F real on one spine; admin write → catalog reflects live; dense seed data; state persists.
- **UX 20%:** the 7 guardrails above; eligibility reveal + portfolio = the two delight moments; mobile-first.
- **Impact 20% (swing):** scaling counter + squads + proof, *shown not claimed*; operator vocabulary.
- **Innovation 15% (tie-break):** explainable eligibility + readiness diagnostic + verified credentials + squad mechanics — interactive, zero chatbot.

### Scope (3 days)
- **Real (demo path):** welcome → onboarding → (optional diagnostic) → eligibility catalog + Save → readiness → ONE full async-as-mentor course → dashboard funnel → squad → certificate + verify page → admin CRUD + scaling counter.
- **Mock/light:** live squad activity (seeded peers), courses 2–3 partial, "verifiable" = hash + verify page (no blockchain), auth = demo role switch, reminders = UI only.
- **Deterministic** eligibility/readiness (no live LLM on the critical path).

### Where each beat hits
Eligibility reveal → Innovation+Problem (P2) · readiness→gap-course → Innovation+MVP · async-as-mentor → MVP+Problem ("even those who can't attend live") · squad → Impact+UX (retention) · proof → Impact+UX (P5 sponsors/universities) · admin scaling counter → Impact swing (P1 scaling).
