# Judge Rubric Mapping — Mentoria Hub (Eligibility + Readiness Engine)

**Decisive fact:** judges are **Mentoria's own operators**, watching 20+ four-minute videos. They reward *"the thing we'd deploy Monday to stop drowning."* The generic demo (catalog + 2 courses + dashboard + bolted-on AI chat) caps at **~70**. We target **~93–95** via one connected spine + Mentoria-specificity + an *explained* engine + a human opener.

| Criterion | Weight | Our move (win points) | Trap (lose points) |
|-----------|--------|-----------------------|--------------------|
| **Problem understanding** | 20% | Separate the **student** pain (*"is this for me?"* — the brief's literal hero pain) from the **org** pain (can't scale Telegram), and solve both on screen. Quote the brief; ship its example noun ("English for Academic Success"). | Conflating the two pains; "info is scattered" framing; shaky stats (the dropped 186K/94K). |
| **MVP functionality** | 25% | **Real data layer**: admin write → catalog reflects live. Eligibility computes from a real **requirements** field over **dense** seed data (25–35 items) so filters/badges actually do something. Full example path persists across reload. | Faked admin; 3-card catalog so filters look broken; quiz/progress that resets on reload; broken happy path. |
| **UX & design** | 20% | One calm, coherent system; **populated** screens; mobile-credible (teens on phones); the eligibility reveal is the fast, delightful moment. Depth over breadth. | Default shadcn with no identity; empty states; desktop-only; many half-built pages. |
| **Impact for Mentoria** | 20% | **Live scaling counter** ("now reaching N students across K regions") makes scaling *shown, not claimed*; a sponsor/school-facing stats surface; an honest retention loop (the application pipeline). Operator vocabulary. | Asserting impact on a slide with nothing on screen; no stakeholder beyond the student; no return-loop. |
| **Innovation & creativity** | 15% | **Explainable eligibility** ("matched because…", ≥3 signals) + **readiness gauge/gap-radar** + **async-as-mentor** lesson — interactive, demoable in <15s, tied to the core problem. | Generic "AI chatbot" (now baseline + risky); multilingual toggle as the headline innovation; invisible backend cleverness. |

## Feature → criteria coverage
| Feature | Problem | MVP | UX | Impact | Innovation |
|---------|:------:|:---:|:--:|:------:|:----------:|
| Homepage (A) | ✓ | ✓ | ✓ | | |
| Catalog + requirements + eligibility badges (B) | ✓ | ✓ | ✓ | | ✓ |
| Courses + async-as-mentor lesson (C) | ✓ | ✓ | ✓ | ✓ | ✓ |
| Dashboard + application pipeline (D) | | ✓ | ✓ | ✓ | |
| Eligibility Engine (E) | ✓ | ✓ | ✓ | ✓ | ✓ |
| Admin + live scaling counter (F) | | ✓ | | ✓ | ✓ |

## Self-score vs the 12-point winning bar
Clears **11–12 / 12**: one connected spine ✓ · wow demoable <15s ✓ · state persists ✓ · scaling pain shown on screen ✓ · innovation interactive + explained ✓ · Mentoria-specific ✓ · real dated KZ seed data ✓ · features feel effortless ✓ · human cold-open ✓ · mobile-credible ✓ · closes impact loop on screen ✓ · bulletproof rehearsed path ✓.

| Criterion | Weight | Score | Note |
|-----------|--------|:-----:|------|
| Problem understanding | 20% | **20/20** | Builds on the brief's literal hero pain; defensible anchors only. |
| MVP functionality | 25% | **23/25** | All 6 woven into one spine; −2 for live admin-write / i18n edge risk. |
| UX & design | 20% | **18/20** | Coherent, populated, mobile; −2: 3 days caps visual originality. |
| Impact for Mentoria | 20% | **19/20** | Live scaling counter + sponsor surface = shown, not claimed. |
| Innovation | 15% | **14/15** | Explainable eligibility + readiness + async-as-mentor; −1: well-executed vs category-creating. |
| **TOTAL** | 100% | **~94/100** | |

## Instant-death flaws we explicitly avoid
1. Broken/empty live link → seeded data + rehearsed path + mock fallback.
2. Fake/read-only admin → the live add→appear loop is real (same tables).
3. Generic non-Mentoria pitch → operator vocabulary, Telegram named, the scaling counter.
4. `tag === tag` filter wearing an "AI" label → eligibility uses ≥3 signals and **explains itself**; readiness is deterministic, not a chatbot.
5. Team-intro / logo-splash opener → cold open is the Named Student; team names land on slide 7.

## Risks & mitigations
- **#1 live demo breaks:** feature-freeze H30; recorded video = primary artifact; deterministic rules (no live LLM on critical path); rehearse 5×; QA KZ strings; pre-seed Aruzhan.
- **#2 wrong stat in front of EdTech judges:** cite or cut every number; use verified rural/fragmentation/grant-concentration anchors only.
