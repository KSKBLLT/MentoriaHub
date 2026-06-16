"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getProfileId } from "@/lib/client";

const BADGE: Record<string, string> = { qualify: "✅ Проходишь", soon: "🟡 Скоро", locked: "🔒 Закрыто" };

type Opp = {
  id: string; title: string; org: string; description: string; deadline: string; apply_url: string;
  location_badge: string; saved: boolean; saved_status: string | null;
  eligibility: { status: string; met: string[]; missing: string[] };
};
type Readiness = { percent: number; gaps: string[] };

export default function OppDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [opp, setOpp] = useState<Opp | null>(null);
  const [readiness, setReadiness] = useState<Readiness | null>(null);
  const [suggested, setSuggested] = useState<{ id: string | null; title: string | null }>({ id: null, title: null });

  async function load() {
    const d = await api<{ opportunity: Opp }>(`/api/opportunities/${id}?profileId=${getProfileId()}`);
    setOpp(d.opportunity);
    const r = await api<{ readiness: Readiness; suggestedCourseId: string | null; suggestedCourseTitle: string | null }>(
      `/api/readiness/${id}?profileId=${getProfileId()}`);
    setReadiness(r.readiness);
    setSuggested({ id: r.suggestedCourseId, title: r.suggestedCourseTitle });
  }
  useEffect(() => { load(); }, [id]);

  async function save() {
    await api("/api/saved", { method: "POST", body: { profileId: getProfileId(), opportunityId: id } });
    load();
  }
  async function setStatus(status: string) {
    await api("/api/saved", { method: "PATCH", body: { profileId: getProfileId(), opportunityId: id, status } });
    load();
  }
  async function closeGaps() {
    if (!suggested.id) return;
    await api("/api/enroll", { method: "POST", body: { profileId: getProfileId(), courseId: suggested.id } });
    router.push(`/courses/${suggested.id}`);
  }

  if (!opp) return <main><p className="muted">Загрузка…</p></main>;

  return (
    <main>
      <h1>{opp.title}</h1>
      <div className="row"><span className={`elig-${opp.eligibility.status}`}>{BADGE[opp.eligibility.status]}</span>
        <span className="tag">{opp.location_badge}</span><span className="tag">⏳ {opp.deadline}</span></div>
      <div className="card">
        <div className="muted">{opp.org}</div>
        <p>{opp.description}</p>
        {opp.eligibility.met.length > 0 && <div className="elig-qualify">✓ {opp.eligibility.met.join(", ")}</div>}
        {opp.eligibility.missing.length > 0 && <div className="elig-soon">✗ {opp.eligibility.missing.join(", ")}</div>}
        <div className="row" style={{ marginTop: 10 }}>
          <button className={`btn ${opp.saved ? "ghost" : "secondary"}`} onClick={save}>{opp.saved ? "✓ Сохранено" : "☆ Сохранить"}</button>
          {opp.saved && (
            <select value={opp.saved_status ?? "saved"} onChange={(e) => setStatus(e.target.value)} style={{ width: "auto" }}>
              <option value="saved">Сохранено</option>
              <option value="preparing">Готовлюсь</option>
              <option value="ready">Готов</option>
              <option value="applied">Подал</option>
            </select>
          )}
          <a className="btn secondary" href={opp.apply_url} target="_blank">Подать заявку ↗</a>
        </div>
      </div>

      {readiness && (
        <div className="card">
          <h2>Готовность к этой возможности</h2>
          <div className="gauge">{readiness.percent}%</div>
          <div className="bar"><span style={{ width: `${readiness.percent}%` }} /></div>
          {readiness.gaps.length > 0 ? (
            <>
              <p className="elig-soon">Пробелы: {readiness.gaps.join(", ")}</p>
              {suggested.id && <button className="btn" onClick={closeGaps}>Закрыть пробелы → курс «{suggested.title}»</button>}
            </>
          ) : <p className="elig-qualify">Ты готов! 🎉</p>}
        </div>
      )}
    </main>
  );
}
