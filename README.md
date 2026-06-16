# Mentoria Hub — from eligibility to acceptance

> **Find what fits you. Get ready. Prove it.** / **Узнай, что тебе подходит. Подготовься. Докажи.**

**Hackathon:** Mentoria — Round 1, "Working MVP Challenge"
**Deadline:** 18 June 2026, 00:00 → `mentoriaorganization@gmail.com`
**Live demo:** _<add Vercel URL>_ · **Repo:** _<add GitHub URL>_

---

## The concept (team-chosen: ideas 1 + 3 + 4 fused into one spine)

One student journey, three acts — **Discover → Prepare → Prove**:

1. **DISCOVER — Eligibility engine (idea 1).** Match the student's profile against each opportunity's *requirements* → ✅ **You qualify** / 🟡 **Qualify in ~1 year** / 🔒 **Locked**, each *explained*. Solves the brief's literal hero pain: *"students struggle to know what fits their age/interests/goals/level."*
2. **PREPARE — Readiness + Squads (ideas 1 + 3).** A 5-question readiness check → gauge + gap-radar → an auto-assembled **async-as-mentor** mini-course you do *with a squad* (peer cohort) that keeps you going — mentoring that scales without mentors.
3. **PROVE — Verified portfolio (idea 4).** Completed courses & applied opportunities mint a **verifiable credential** (hash + QR + public verify page) → a portfolio you show universities and Mentoria shows sponsors.

**Why this wins:** it stacks on the two criteria most teams underserve — **Impact (20%, the swing vote)** via the live scaling counter + Squads + Proof, and **Innovation (15%, the tie-breaker)** via four *interactive, explainable* mechanics with zero chatbot. Full reasoning in [`JUDGE_INTEL.md`](JUDGE_INTEL.md); the full journey + strategy in [`USER_FLOW.md`](USER_FLOW.md).

## Required features (A–F) — all real, woven into the spine
| # | Feature | In this product |
|---|---------|-----------------|
| A | Homepage | Discover→Prepare→Prove value prop + CTAs |
| B | Catalog | cards w/ **requirements** field + filters + Save + **eligibility badges** |
| C | Courses | 2–3 incl. one full **async-as-mentor** lesson + quiz + progress; gap-courses auto-built |
| D | Dashboard | **application pipeline** (Saved→Preparing→Ready→Applied) + readiness + squad + portfolio-in-progress + deadlines |
| E | Recommendation | **the eligibility engine** (onboarding → qualify/soon/locked, explained) |
| F | Admin | CRUD + **live scaling counter** + stats (reach, squad completion lift, credentials minted) |

## Tech stack
Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui · **Supabase** behind `lib/db.ts` (mock-JSON fallback) · deterministic `lib/eligibility.ts` + `lib/readiness.ts` (no live LLM on the critical path) · `next-intl` (EN/RU/KZ) · **Vercel** deploy.

## Seed data
25–35 real KZ-relevant opportunities, **each with a structured requirements field** so eligibility computes — Daryn/Zhautykov olympiads, NIS/BIL, nFactorial, Decentrathon, ISEF, Polygence, Erasmus+, British Council IELTS, KazNU & Nazarbayev University, Bolashak-prep. 3 courses incl. **"English for Academic Success"** (the brief's own example noun) as the full async-as-mentor course. Pre-seed student **"Aruzhan", grade 10, Turkistan region** with a half-finished course, a squad, and one opportunity in "Preparing."

## Docs
[`USER_FLOW.md`](USER_FLOW.md) — journey + requirements compliance + strategy · [`JUDGE_INTEL.md`](JUDGE_INTEL.md) — judges + Mentoria · [`PITCH.md`](PITCH.md) · [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md) · [`JUDGE_RUBRIC.md`](JUDGE_RUBRIC.md)

> Note: `PITCH.md` / `DEMO_SCRIPT.md` / `JUDGE_RUBRIC.md` currently describe the pure-eligibility (idea 1) version; they need a refresh to add the Squad + Proof beats.
