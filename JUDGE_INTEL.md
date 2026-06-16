# Judge & Mentoria Intel — where to hit

The goal: know exactly who is scoring us and what makes them *feel* something, so every screen and every sentence of the pitch lands on a nerve.

---

## A. Mentoria (the organization) — read the customer, not "users"

**Who they almost certainly are:** an international, mission-driven mentoring community — likely founded by young alumni / current top-university students (NIS/BIL grads, Bolashak/abroad admits) paying it forward. Runs today on **Telegram channels + live online sessions**. Warm, peer-to-peer, hopeful tone — **NOT** corporate/Crimson-luxury. Growing fast → the wheels are coming off the manual model.
> ⚠️ Verify any org-specific number (members, mentors, students) with the organizer before stating it. Build the persona, assert only what's confirmed.

**Their real pains, ranked (this is the target list):**

| # | Pain | What the brief says | What PROVES to them we solved it |
|---|------|---------------------|----------------------------------|
| P1 | **Can't scale past manual Telegram + live** (existential) | "needs a scalable digital system beyond manual Telegram updates and live sessions" | Admin adds an opportunity in 15s, no developer → **live scaling counter** ticks up, it's instantly visible to every eligible student |
| P2 | **The "is this for me?" problem** | "students struggle to know what fits their age/interests/goals/level" | Eligibility engine: ✅qualify / 🟡soon / 🔒locked, **explained** |
| P3 | **Fragmentation** across channels/sites/chats | "scattered across sites/channels/chats/docs" | One dense, filterable, deduped catalog with provenance |
| P4 | **Retention / drop-off** (live-only has no fallback) | Impact criterion: "improve retention" | **Squads** (peer accountability) + a dashboard that gives a reason to return |
| P5 | **Looking professional to partners/schools/sponsors** | Impact criterion, verbatim | **Proof** verified portfolio + a sponsor/school-facing stats surface |

**The emotional core:** *"Mentoria's mission already works — Telegram is just the ceiling. We remove the ceiling."* Use their vocabulary: ментор, когорта, грант, олимпиада, наставничество.

---

## B. The 4 judges — what wins, what kills, the hard question

Judges are almost certainly **Mentoria's own operators**, watching 20+ four-minute videos, probably in RU/KZ. They reward *"the thing we'd deploy Monday to stop drowning."*

### 1. Technical / MVP judge — 25%
Clicks the live link mid-video and tries to break it.
- **Wins:** state that persists (save → refresh → still there); admin and student app are the **same data**, shown live.
- **Kills:** hardcoded arrays faking a backend; a read-only "CRUD"; filters that don't filter; a quiz that's always "correct."
- **Hard Q:** *"Add a course/opportunity in admin right now — let's watch it appear on the student side."*
- **We hit it with:** real Supabase writes, live add→appear loop, deterministic eligibility over dense data.

### 2. UX / design judge — 20%
On a phone, at 1.5x, after 15 ugly demos.
- **Wins:** one coherent calm system; real empty/loading states; mobile-first; onboarding that feels *guided*, not a form.
- **Kills:** default shadcn gray with no identity; desktop-only; clutter.
- **Hard Q:** *"What does a confused 9th-grader see in the first 20 seconds — how does design reduce their anxiety?"*
- **We hit it with:** the Discover→Prepare→Prove guided arc + the **Proof portfolio** as the beauty shot.

### 3. Impact / operator judge — 20% — **THE SWING VOTE**
Personally feels the Telegram pain.
- **Wins:** the product visibly removes a thing that used to need a human mentor; gives operators **visibility they never had**; a believable migration story.
- **Kills:** generic "EdTech for students" that never says *Mentoria* or *Telegram*; impact as a vanity TAM number with nothing on screen.
- **Hard Q:** *"We run on Telegram today. What stops happening once we adopt this — and what can we now see that we couldn't?"*
- **We hit it with:** live scaling counter (P1), Squads = mentoring-as-network-effect (P4), Proof = professional to sponsors (P5). **Our 1+3+4 combo dominates the swing vote.**

### 4. Innovation judge — 15% — **THE TIE-BREAKER**
Has seen "we added an AI chatbot" 10 times tonight.
- **Wins:** interactive, on-screen-in-<15s smart behavior + **explainability** ("matched because grade 11 ✓ + Math ✓ + IELTS-in-progress"); a non-obvious mechanic tied to the case.
- **Kills:** "AI-powered" as a slide claim; a chatbot wrapper; invisible backend cleverness.
- **Hard Q:** *"Strip the AI label — what does it do that a filter dropdown doesn't?"*
- **We hit it with:** explainable eligibility + readiness gauge/gap-radar + verifiable credentials + squad mechanics = four *interactive* innovations, none of them a chatbot.

---

## C. Why 1+3+4 is the right bet
- **Impact (swing, 20%)** is won three ways at once: scaling counter, Squads, Proof.
- **Innovation (tie-breaker, 15%)** has four interactive, explainable mechanics — zero chatbot risk.
- **Problem understanding (20%)** is anchored on the brief's literal hero pain ("is this for me?").
- **Risk:** combining three concepts can sprawl. Mitigation: one spine (Discover→Prepare→Prove), depth-first on the demo path, the rest mocked. See `USER_FLOW.md` and `JUDGE_RUBRIC.md`.

## D. Anchor facts (cite or cut)
~112K state grants 2024-25 (~80K bachelor's), **concentrated by field** → knowing what fits you is decisive · **41.7% of KZ is rural** · fragmentation (stated in the brief) · info spans KZ/RU/EN. ⚠️ Do NOT use the old "186K vs 94K / 35:1" — factually shaky.
