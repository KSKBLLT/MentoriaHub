import { db, usingSupabase } from "@/lib/db";
import { enrichOpportunity, resolveProfile } from "@/lib/enrich";

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, string> = { qualify: "✅", soon: "🟡", locked: "🔒" };

// Server component: proves the backend end-to-end (eligibility + location + score).
export default async function Home() {
  const profile = await resolveProfile(null); // demo student
  const today = new Date();
  const saved = await db.listSaved(profile.id);
  const opportunities = (await db.listOpportunities())
    .map((o) => enrichOpportunity(profile, o, today, saved))
    .sort((a, b) => b.score - a.score);
  const stats = await db.stats();

  return (
    <main>
      <h1>Mentoria Hub</h1>
      <p className="muted">
        Backend MVP · from eligibility to acceptance · store: <code>{usingSupabase ? "supabase" : "memory"}</code>
      </p>

      <div className="card">
        <b>Профиль:</b> {profile.name}, {profile.grade} класс, {profile.region} · English {profile.english_level}
        <div className="row" style={{ marginTop: 6 }}>
          {profile.goals.map((g) => (
            <span className="tag" key={g}>{g}</span>
          ))}
        </div>
      </div>

      <p className="muted">
        Возможностей: {stats.opportunities} · курсов: {stats.courses} · учеников: {stats.students} ·
        API: <code>/api/opportunities</code>, <code>/api/stats</code>, <code>/api/recommendations</code>
      </p>

      <h2>Возможности ({opportunities.length})</h2>
      {opportunities.map((o) => (
        <div className="card" key={o.id}>
          <div className="row">
            <span>{STATUS_BADGE[o.eligibility.status]}</span>
            <b>{o.title}</b>
            <span className="tag">{o.location_badge}</span>
            <span className="muted">score {o.score}</span>
          </div>
          <div className="muted">
            {o.category} · дедлайн {o.deadline} ·{" "}
            {[...o.eligibility.met, ...o.eligibility.missing].join(", ") || "без требований"}
          </div>
        </div>
      ))}
    </main>
  );
}
