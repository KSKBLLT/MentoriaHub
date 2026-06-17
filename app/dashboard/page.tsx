"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, getProfileId } from "@/lib/client";

const STAGES = ["saved", "preparing", "ready", "applied"];
const STAGE_LABEL: Record<string, string> = { saved: "Сохранено", preparing: "Готовлюсь", ready: "Готов", applied: "Подал" };
const BADGE: Record<string, string> = { qualify: "Ready", soon: "Soon", locked: "Locked" };

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
      <div className="dashboard-grid">
        <section>
          <div className="card hero-panel">
            <p className="muted">{d.profile.grade} класс / {d.profile.region} / цели: {d.profile.goals.join(", ") || "не выбраны"}</p>
            <h1 className="hero-title"><span className="accent">Кабинет</span> {d.profile.name || "Гость"}</h1>
            <p className="hero-copy">
              Здесь собраны сохраненные возможности, активные курсы, сертификаты и следующие шаги подготовки.
            </p>
            <div className="row hero-actions">
              <Link className="btn" href="/roadmap">Мой roadmap</Link>
              <Link className="btn secondary" href="/applications">Мои заявки</Link>
            </div>
          </div>

          {d.profile.diagnostic_status !== "done" && (
            <div className="card row" style={{ justifyContent: "space-between" }}>
              <span><b>Уровень не проверен</b><span className="muted"> - диагностика займет около 2 минут.</span></span>
              <Link className="btn" href="/diagnostic">Пройти диагностику</Link>
            </div>
          )}

          <h2>Заявки</h2>
          {d.saved.length === 0 ? (
            <div className="card">
              <p className="muted">Пока ничего не сохранено.</p>
              <Link className="btn secondary" href="/opportunities">Найти возможности</Link>
            </div>
          ) : (
            <div className="opportunity-list">
              {d.saved.map((s, i) => (
                <div className={`card opportunity-card ${i === 0 ? "featured" : ""}`} key={s.opportunity_id}>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <Link href={`/opportunities/${s.opportunity_id}`}><b>{s.title}</b></Link>
                    {s.deadline && <span className="tag">deadline {s.deadline}</span>}
                  </div>
                  <div className="row" style={{ marginTop: 14 }}>
                    {STAGES.map((st) => (
                      <span
                        key={st}
                        className="tag"
                        style={{ opacity: STAGES.indexOf(s.status) >= STAGES.indexOf(st) ? 1 : 0.38 }}
                      >
                        {STAGE_LABEL[st]}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="side-stack">
          <div className="card note-card">
            <b>Today note</b>
            <p className="muted" style={{ marginTop: 10 }}>
              Открой roadmap и отметь ближайший шаг. После этого рекомендации станут точнее.
            </p>
            <Link className="btn secondary" href="/roadmap">Открыть roadmap</Link>
          </div>

          <div className="card">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <b>Курсы</b>
              <span className="tag">{d.enrollments.length}</span>
            </div>
            {d.enrollments.length === 0 ? (
              <p className="muted" style={{ marginTop: 10 }}>Нет активных курсов. Каталог уже готов.</p>
            ) : (
              d.enrollments.map((e) => (
                <div className="col" key={e.course_id} style={{ marginTop: 14 }}>
                  <div className="row">
                    <Link href={`/courses/${e.course_id}`}><b>{e.title}</b></Link>
                    {e.completed_at && <span className="elig-qualify">done</span>}
                  </div>
                  <div className="bar"><span style={{ width: `${e.progress}%` }} /></div>
                  <div className="muted">{e.progress}%</div>
                </div>
              ))
            )}
            <Link className="btn ghost" href="/courses">Каталог курсов</Link>
          </div>

          <div className="card">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <b>Сертификаты</b>
              <span className="tag">{d.certificates.length}</span>
            </div>
            {d.certificates.length === 0 ? (
              <p className="muted" style={{ marginTop: 10 }}>Пока нет. Заверши курс, чтобы получить проверяемый сертификат.</p>
            ) : (
              d.certificates.map((c) => (
                <div className="row" key={c.hash} style={{ marginTop: 12 }}>
                  <b>{c.course_title}</b>
                  <Link href={`/verify/${c.hash}`}>проверить</Link>
                </div>
              ))
            )}
          </div>

          <div className="card activity-card">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <b>Рекомендуем</b>
              <div className="avatar-stack" aria-hidden="true">
                <span className="avatar">M</span>
                <span className="avatar">H</span>
                <span className="avatar">A</span>
              </div>
            </div>
            <div className="col" style={{ marginTop: 12 }}>
              {d.recommendations.slice(0, 3).map((r) => (
                <div className="row" key={r.id} style={{ justifyContent: "space-between" }}>
                  <Link href={`/opportunities/${r.id}`}>{r.title}</Link>
                  <span className={`elig-${r.eligibility.status}`}>{BADGE[r.eligibility.status]}</span>
                </div>
              ))}
            </div>
            <div className="sparkline" />
          </div>
        </aside>
      </div>
    </main>
  );
}
