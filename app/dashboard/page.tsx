"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, getProfileId } from "@/lib/client";

const STAGES = ["saved", "preparing", "ready", "applied"];
const STAGE_LABEL: Record<string, string> = { saved: "Сохранено", preparing: "Готовлюсь", ready: "Готов", applied: "Подал" };
const BADGE: Record<string, string> = { qualify: "✅", soon: "🟡", locked: "🔒" };

type Data = {
  profile: { name: string; grade: number; region: string; diagnostic_status: string; goals: string[] };
  saved: { opportunity_id: string; status: string; title: string; deadline: string | null }[];
  enrollments: { course_id: string; title: string; progress: number; completed_at: string | null }[];
  certificates: { hash: string; course_title: string }[];
  recommendations: { id: string; title: string; location_badge: string; eligibility: { status: string } }[];
};

export default function Dashboard() {
  const [d, setD] = useState<Data | null>(null);
  useEffect(() => { api<Data>(`/api/dashboard?profileId=${getProfileId()}`).then(setD); }, []);
  if (!d) return <main><p className="muted">Загрузка…</p></main>;

  return (
    <main>
      <h1>Кабинет — {d.profile.name || "Гость"}</h1>
      <p className="muted">{d.profile.grade} класс · {d.profile.region} · цели: {d.profile.goals.join(", ") || "—"}</p>

      <div className="row">
        <Link className="btn" href="/roadmap">🗺️ Мой роадмап</Link>
        <Link className="btn secondary" href="/applications">✍️ Мои заявки (AI-ментор)</Link>
      </div>

      {d.profile.diagnostic_status !== "done" && (
        <div className="card row">
          <span>🎯 Уровень не проверен.</span><Link className="btn" href="/diagnostic">Пройти диагностику (2 мин)</Link>
        </div>
      )}

      <h2>Заявки (воронка)</h2>
      {d.saved.length === 0 ? <p className="muted">Пока ничего не сохранено. <Link href="/opportunities">Найти возможности →</Link></p> : (
        <div className="grid">
          {d.saved.map((s) => (
            <div className="card col" key={s.opportunity_id}>
              <Link href={`/opportunities/${s.opportunity_id}`}><b>{s.title}</b></Link>
              <div className="row">
                {STAGES.map((st) => (
                  <span key={st} className={`tag ${s.status === st ? "" : ""}`} style={{ opacity: STAGES.indexOf(s.status) >= STAGES.indexOf(st) ? 1 : 0.4 }}>{STAGE_LABEL[st]}</span>
                ))}
              </div>
              {s.deadline && <div className="muted">⏳ дедлайн {s.deadline}</div>}
            </div>
          ))}
        </div>
      )}

      <h2>Курсы</h2>
      {d.enrollments.length === 0 ? <p className="muted">Нет активных курсов. <Link href="/courses">Каталог курсов →</Link></p> : (
        d.enrollments.map((e) => (
          <div className="card col" key={e.course_id}>
            <div className="row"><Link href={`/courses/${e.course_id}`}><b>{e.title}</b></Link>{e.completed_at && <span className="elig-qualify">✓</span>}</div>
            <div className="bar"><span style={{ width: `${e.progress}%` }} /></div>
            <div className="muted">{e.progress}%</div>
          </div>
        ))
      )}

      <h2>Сертификаты</h2>
      {d.certificates.length === 0 ? <p className="muted">Пока нет. Заверши курс — получишь проверяемый сертификат.</p> : (
        d.certificates.map((c) => (
          <div className="card row" key={c.hash}>🏅 <b>{c.course_title}</b> <Link href={`/verify/${c.hash}`}>проверить ↗</Link></div>
        ))
      )}

      <h2>Рекомендуем тебе</h2>
      <div className="grid">
        {d.recommendations.map((r) => (
          <div className="card row" key={r.id}>
            <span className={`elig-${r.eligibility.status}`}>{BADGE[r.eligibility.status]}</span>
            <Link href={`/opportunities/${r.id}`}>{r.title}</Link>
            <span className="tag">{r.location_badge}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
