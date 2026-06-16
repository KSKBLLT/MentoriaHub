# Mentoria Hub — SPEC (build-ready, no vagueness)

Concept: **Discover → Prepare → Prove** (ideas 1+3+4). Persona: Aruzhan, grade 10, Turkistan region, ЕНТ+SAT+IELTS, mobile.
This document is the single source of truth for the build. Field names are final.

---

## 1. Pages / routes (exact)
| Route | Screen | Required feature |
|-------|--------|------------------|
| `/` | Welcome (2 buttons: "I'm new here" / "I have an account") + value prop | A |
| `/onboarding` | 4 steps: basics → role → goals → (offer diagnostic) | E |
| `/diagnostic` | Optional topic test (skippable) | C/E |
| `/opportunities` | Catalog: eligibility badges + filters + Save | B, E |
| `/opportunities/[id]` | Detail: requirements, deadline, Apply, "Check readiness" | B |
| `/readiness/[oppId]` | Readiness gauge + gaps + "Close gaps" | E |
| `/courses` | Course list | C |
| `/courses/[id]` | Course: lessons + progress | C |
| `/courses/[id]/[lesson]` | Lesson: explain → example → task → feedback → quiz | C |
| `/squads/[id]` | Squad: shared progress, streak, peers | (bonus) |
| `/dashboard` | Funnel, progress, squad, deadlines, recs, diagnostic nudge | D, E |
| `/u/[handle]` | Public portfolio (badges + verified) | (bonus) |
| `/verify/[hash]` | Credential verification page | (bonus) |
| `/admin` | CRUD opportunities/courses + stats + scaling counter | F |

Auth = demo role switch (Student / Admin). No real email/SMS.

---

## 2. Data model (Supabase / Postgres — final tables & fields)

```
profiles
  id, name, grade (8..11), region, city, language ('ru'|'kk'|'en'),
  citizenship ('KZ'|'other'), role ('student'|'mentor'|'admin'),
  english_level ('none'|'A2'|'B1'|'B2'|'C1'),
  goals text[]   -- e.g. {'ent','sat','ielts','math','english'}
  diagnostic_status ('offered'|'skipped'|'done')

opportunities
  id, title, org, category ('scholarship'|'olympiad'|'hackathon'|'research'|'internship'|'summer_school'|'prep'),
  direction ('STEM'|'business'|'social'|'finance'|'coding'|'science'|'languages'),
  format ('online'|'offline'|'hybrid'),
  region (nullable), city (nullable),   -- for offline/hybrid
  deadline (date),
  description, apply_url,
  tags text[],                          -- e.g. {'sat','math','coding'}
  req jsonb { min_grade, max_grade, citizenship, min_english, subjects[] }
  save_count int                        -- seeded 0..340 so stats look alive

courses
  id, title, description, level ('beginner'|'intermediate'),
  topic_tags text[]                     -- e.g. {'sat_math','functions'}

lessons
  id, course_id, ord, title, content_md, video_url (placeholder),
  task_md, quiz jsonb [{q, options[], correctIndex}]

topic_levels
  id, profile_id, topic, score (0..100), level ('weak'|'mid'|'strong')

saved_items
  id, profile_id, opportunity_id, status ('saved'|'preparing'|'ready'|'applied')

enrollments
  id, profile_id, course_id, progress (0..100), completed_at (nullable)

squads
  id, name, topic, region

squad_members
  id, squad_id, profile_id (nullable for seeded mock peers), display_name, progress

certificates
  id, profile_id, course_id, hash, issued_at
```

All reads/writes go through `lib/db.ts`; a `MOCK=true` flag swaps Supabase for in-memory JSON + localStorage so the app runs with zero backend.

---

## 3. Eligibility engine — `lib/eligibility.ts` (deterministic, exact)

```
english order: none<A2<B1<B2<C1

eligibility(profile, opp) -> { status, met[], missing[] }
  met = []; missing = []; hardLock = false

  // grade
  if opp.req.max_grade && profile.grade > opp.req.max_grade:
      hardLock = true; missing.push("только для " + opp.req.max_grade + " класса и младше")
  if opp.req.min_grade && profile.grade < opp.req.min_grade:
      missing.push("откроется в " + opp.req.min_grade + " классе")      // SOON
  else if opp.req.min_grade: met.push("класс ✓")

  // citizenship
  if opp.req.citizenship && opp.req.citizenship !== profile.citizenship:
      hardLock = true; missing.push("нужно гражданство " + opp.req.citizenship)
  else if opp.req.citizenship: met.push("гражданство ✓")

  // english
  if opp.req.min_english && order(profile.english_level) < order(opp.req.min_english):
      missing.push("нужен English " + opp.req.min_english)              // SOON (closeable)
  else if opp.req.min_english: met.push("English ✓")

  status =
     hardLock                 -> 'locked'   🔒
     else missing.length>0    -> 'soon'     🟡
     else                     -> 'qualify'  ✅
```
The card shows `met` and `missing` as plain-language chips. **This explanation is the innovation — never show a badge without the reason.**

---

## 4. Recommendation score — `lib/recommend.ts` (exact weights, sums to 100)

```
score(profile, opp) =
    40 * eligibilityWeight   // qualify 1.0 | soon 0.6 | locked 0.1
  + 25 * tagOverlap          // |profile.goals ∩ opp.tags| / |opp.tags|
  + 20 * locationScore       // city match 1.0 | region match 0.7 | online 0.5 | other-region offline 0.1
  + 15 * deadlineProximity   // 1.0 if 7–60 days left, fades to 0 if far or passed
Catalog default sort = score desc. "Recommended for you" = top 6.
```

---

## 5. Location feature (new — region/city → offline + online)

- `opp.format`: `online` | `offline` | `hybrid`; offline/hybrid carry `region` + `city`.
- **Badges:** online → `🌐 Онлайн` · offline in your region → `📍 Рядом · {city}` · offline elsewhere → `📍 {city}` · hybrid → `🌐+📍 Гибрид`.
- **Filter chips on `/opportunities`:** Формат = `Все | 🌐 Онлайн | 📍 Оффлайн рядом`. "Рядом" = `opp.region == profile.region`.
- **Effect:** a Turkistan student sees regional olympiads/hackathons boosted to the top (locationScore 0.7–1.0) **plus** every online opportunity (0.5) — directly serves the rural-access angle.

---

## 6. Readiness engine — `lib/readiness.ts` (exact)

```
opp.req may include target_levels { topic: 'mid'|'strong' }
gaps = topics where level(profile.topic_levels[topic]) < required
readinessPct = round(100 * metWeight / totalWeight)   // each topic weight 1
"Close gaps" -> create enrollment in a course whose topic_tags ⊇ gaps
Show gauge (readinessPct) + radar (per-topic) + a "Close gaps" button (always paired).
```
If no diagnostic taken: readiness shows "?" with CTA "Пройти диагностику (5 вопросов · 2 мин)".

---

## 7. Seed data (concrete — `lib/seed.ts`)

**Opportunities (14). Last column = Aruzhan's badge (grade 10, Turkistan, English B2-in-progress=B1, KZ).**

| # | Title | Category | Format | Region/City | Deadline | req | Aruzhan |
|---|-------|----------|--------|-------------|----------|-----|---------|
| 1 | Daryn Republican Math Olympiad | olympiad | offline | all regions / Shymkent host | 2026-10-01 | grade≥8 | ✅ |
| 2 | Turkistan Regional Science Fair | research | offline | Turkistan / Turkistan | 2026-08-15 | grade≥8 | ✅ 📍 Рядом |
| 3 | Shymkent Teen IT Hackathon | hackathon | offline | Turkistan / Shymkent | 2026-08-20 | grade≥9 | ✅ 📍 Рядом |
| 4 | nFactorial Teen Incubator | hackathon | offline | Almaty / Almaty | 2026-08-20 | grade 10–11 | ✅ 📍 Almaty |
| 5 | Decentrathon Youth Track | hackathon | hybrid | Astana + online | 2026-08-10 | grade≥10 | ✅ 🌐+📍 |
| 6 | SAT Prep Online Cohort | prep | online | — | 2026-07-15 | grade≥10 | ✅ 🌐 |
| 7 | British Council IELTS Prep | prep | online | — | 2026-09-20 | grade≥10 | ✅ 🌐 |
| 8 | Polygence Research Mentorship | research | online | — | 2026-08-20 | grade≥10, Eng B1 | ✅ 🌐 |
| 9 | Bolashak Undergrad Prep Track | scholarship | online | — | 2026-09-15 | grade≥10, KZ | ✅ 🌐 |
| 10 | Kazakh Model UN | program | hybrid | Almaty + online | 2026-09-05 | grade≥9 | ✅ 🌐+📍 |
| 11 | Nazarbayev Univ. Foundation Day | program | offline | Astana | 2026-07-30 | grade 11 | 🟡 откроется в 11 классе |
| 12 | Erasmus+ EU Summer School | summer_school | offline | Europe | 2026-09-01 | grade≥10, Eng B2 | 🟡 нужен English B2 |
| 13 | Coca-Cola Scholars (US) | scholarship | online | — | 2026-10-01 | citizenship US | 🔒 нужно гражданство US |
| 14 | Quantum STEM Camp | summer_school | offline | Almaty | 2026-07-15 | grade 8–10 | ✅ 📍 Almaty |

Result for Aruzhan: **10 ✅ (incl. 2 «рядом»), 2 🟡, 1 🔒** → she always sees green. ✓ guardrail.

**Courses (3):**
1. **"SAT Math Essentials"** — topic_tags: sat_math, functions, geometry — 5 lessons, full async-as-mentor (this is the gap-course target for opp #6/#12). *Lesson 1 fully built.*
2. **"IELTS in 30 Days"** — topic_tags: ielts_reading, ielts_writing — 4 lessons (lighter).
3. **"ЕНТ Математика: База"** — topic_tags: ent_math, percentages, equations — 4 lessons (lighter).

**Demo student** "Aruzhan": grade 10, Turkistan, English B1, goals {ent,sat,ielts,math}, diagnostic_status='done', topic_levels {sat_math:'weak'(40), functions:'weak'(35), ielts_reading:'mid'(65), ent_math:'strong'(82)}, 1 saved opp (#9, status 'preparing'), enrolled in course 1 at 40%, in squad "SAT Math · Юг".

**Diagnostic question bank:** 5 questions per topic for {ent_math, sat_math, ielts_reading} (15 total), each `{q, options[4], correctIndex}`.

---

## 8. Tech stack (final)
- Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui
- Supabase (Postgres) OR mock — single switch in `lib/db.ts`
- `next-intl` (ru/kk/en); demo path strings in all three
- framer-motion for the gauge + badge reveal only
- Deploy: Vercel (`vercel --prod`), env in dashboard + `.env.example`
- All engine logic deterministic (no live LLM on the critical path)

---

## 9. Scope — REAL vs MOCK (no ambiguity)
**REAL (must work end-to-end on the demo path):** Welcome routing · onboarding · eligibility engine + badges + explanations · catalog filters (incl. format/near-me) + Save · readiness gauge + gaps + close-gaps · course 1 (5 lessons, quiz, progress) · dashboard funnel · admin CRUD (writes to same DB) + live scaling counter · certificate mint + `/verify/[hash]`.
**MOCK / LIGHT:** squad peers (seeded names + scripted progress) · courses 2–3 (lesson lists, lesson 1 only) · "verifiable" = SHA-256 hash of record fields (no blockchain) · reminders = UI toggle only · email/SMS = none · kk/en full translation = demo-path strings only.

---

## 10. The demo path (exact clicks — rehearse 5×)
1. `/` → "I'm new here".
2. Onboarding: grade 10 → region Turkistan → Школьник → goals ЕНТ+SAT+IELTS → **Skip diagnostic** (show the visible skip).
3. `/opportunities` → badges render; filter `📍 Оффлайн рядом` → #2 & #3 (Turkistan) appear; hover a 🔒 → reason shown. Save #9.
4. Back to all → open #6 SAT Prep → `/readiness/6` → gauge **40%**, gaps (functions, geometry) → "Close gaps".
5. Course "SAT Math Essentials" → Lesson 1 (explain→example→task→feedback→quiz) → progress moves; squad join toast.
6. `/dashboard` → funnel (saved→preparing), progress, squad, deadlines; the skipped-diagnostic nudge card.
7. `/admin` (2nd tab) → add opportunity → **scaling counter ticks** → back to `/opportunities`, it appears.
8. Finish course → certificate → `/verify/[hash]` resolves. Toggle language KZ for 2s.

**Never click:** unbuilt course depth, admin delete, unrehearsed readiness case, un-QA'd KZ screen.

---

## 11. Build order (3 days)
**Day 1:** Next.js + Tailwind + shadcn; `lib/db.ts` + seed; deploy hello to Vercel. Onboarding + profile. Catalog + eligibility engine + badges + filters + Save. ✅ catalog live.
**Day 2:** Readiness engine + gauge/radar. Course 1 (5 lessons + quiz + progress). Dashboard funnel. Squad screen (seeded). i18n demo strings. ✅ full student path works; record rough video.
**Day 3:** Admin CRUD + scaling counter + stats. Certificate + verify page. Polish (mobile, dark/light, empty states). H30 freeze. Rehearse demo 5×, final video, deck refresh, submit with 2h buffer before 18 June 00:00.
