"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, getProfileId } from "@/lib/client";

type Cert = { hash: string; course_title: string; issued_at: string };

export default function Portfolio() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [copied, setCopied] = useState("");
  useEffect(() => { api<{ certificates: Cert[] }>(`/api/certificates?profileId=${getProfileId()}`).then((d) => setCerts(d.certificates)); }, []);

  function share(hash: string) {
    const url = `${window.location.origin}/verify/${hash}`;
    navigator.clipboard?.writeText(url);
    setCopied(hash);
  }

  return (
    <main>
      <h1>🎓 Паспорт достижений</h1>
      <p className="muted">Проверяемые сертификаты — можно приложить к заявке в вуз.</p>
      {certs.length === 0 ? (
        <p className="muted">Пока пусто. Заверши курс в разделе <Link href="/courses">Курсы</Link>.</p>
      ) : (
        certs.map((c) => (
          <div className="card col" key={c.hash}>
            <div className="row"><b>🏅 {c.course_title}</b><span className="muted">{new Date(c.issued_at).toLocaleDateString("ru-RU")}</span></div>
            <div className="muted">Верификация: <code>{c.hash.slice(0, 16)}…</code></div>
            <div className="row">
              <Link className="btn secondary" href={`/verify/${c.hash}`}>Открыть проверку ↗</Link>
              <button className="btn ghost" onClick={() => share(c.hash)}>{copied === c.hash ? "✓ Ссылка скопирована" : "Поделиться"}</button>
            </div>
          </div>
        ))
      )}
    </main>
  );
}
