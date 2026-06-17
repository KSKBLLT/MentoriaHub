"use client";

import Link from "next/link";

export default function Welcome() {
  return (
    <main>
      <div className="workspace-topbar">
        <div><span>Dashboard</span><span>/</span><b>Overview</b></div>
        <div className="top-actions" aria-hidden="true">
          <span />
          <span />
          <span className="profile-dot" />
        </div>
      </div>

      <div className="hero-grid">
        <section className="card hero-panel">
          <h1 className="hero-title"><span className="accent">Make learning</span> feel simple</h1>
          <p className="hero-copy">
            Узнай, какие возможности подходят именно тебе. Собери план подготовки и покажи прогресс через портфолио.
          </p>
          <div className="row hero-actions">
            <Link href="/onboarding" className="btn lg">Начать</Link>
            <Link href="/dashboard" className="btn lg secondary">Открыть кабинет</Link>
          </div>
        </section>

        <aside className="side-stack">
          <div className="card note-card">
            <b>Today note</b>
            <p className="muted" style={{ marginTop: 10 }}>
              Начни с профиля, затем сохрани 2-3 возможности и построи первый roadmap.
            </p>
            <Link className="btn secondary" href="/opportunities">Найти возможности</Link>
          </div>
          <div className="card">
            <b>My files</b>
            <p className="muted" style={{ marginTop: 10 }}>
              Сертификаты и черновики заявок появятся здесь после первых действий.
            </p>
            <Link className="btn ghost" href="/portfolio">Портфолио</Link>
          </div>
          <div className="card activity-card">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <b>Activity</b>
              <span className="tag">demo</span>
            </div>
            <div className="sparkline" />
          </div>
        </aside>
      </div>

      <section className="recommended-section">
        <div className="row section-heading">
          <h2>Recommended for you</h2>
          <Link href="/opportunities">View all opportunities</Link>
        </div>
        <div className="recommendation-grid">
          <div className="card recommendation-card">
            <span className="tag">eligible</span>
            <b>Google Developer Student Clubs</b>
            <p className="muted">Open source contributor</p>
            <div className="muted">Remote / May 20 - Jul 20, 2025</div>
            <div className="mini-progress"><span style={{ width: "75%" }} /></div>
            <Link className="btn secondary" href="/opportunities">View opportunity</Link>
          </div>
          <div className="card recommendation-card">
            <span className="tag">eligible</span>
            <b>Microsoft Learn Student Ambassadors</b>
            <p className="muted">Campus ambassador</p>
            <div className="muted">Hybrid / May 15 - Aug 15, 2025</div>
            <div className="mini-progress"><span style={{ width: "66%" }} /></div>
            <Link className="btn secondary" href="/opportunities">View opportunity</Link>
          </div>
          <div className="card recommendation-card">
            <span className="tag">high match</span>
            <b>Amazon Future Engineer Scholarship</b>
            <p className="muted">SDE track</p>
            <div className="muted">Remote / Jun 01 - Sep 30, 2025</div>
            <div className="mini-progress"><span style={{ width: "25%" }} /></div>
            <Link className="btn secondary" href="/opportunities">View opportunity</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
