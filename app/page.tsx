"use client";

import Link from "next/link";

export default function Welcome() {
  return (
    <main>
      <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
        <h1>Welcome to Mentoria Hub</h1>
        <p className="muted" style={{ fontSize: 16 }}>
          Узнай, что тебе подходит. Подготовься. Докажи.
        </p>
        <div className="row" style={{ justifyContent: "center", marginTop: 20 }}>
          <Link href="/onboarding" className="btn lg">Я тут впервые</Link>
          <Link href="/dashboard" className="btn lg secondary">У меня уже есть аккаунт</Link>
        </div>
      </div>
      <div className="grid">
        <div className="card"><b>🔎 Discover</b><div className="muted">Покажем, на что ты <b>проходишь</b> по условиям — и почему.</div></div>
        <div className="card"><b>📈 Prepare</b><div className="muted">Проверим готовность и соберём мини-курс под твои пробелы.</div></div>
        <div className="card"><b>🏅 Prove</b><div className="muted">Выдадим проверяемый сертификат для вуза.</div></div>
      </div>
    </main>
  );
}
