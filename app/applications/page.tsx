"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDrafts, deleteDraft, type Draft } from "@/lib/client";

export default function Applications() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  useEffect(() => { setDrafts(getDrafts()); }, []);

  function del(id: string) { deleteDraft(id); setDrafts(getDrafts()); }
  const wc = (t: string) => t.split(/\s+/).filter(Boolean).length;

  return (
    <main>
      <h1>Мои заявки</h1>
      <p className="muted">AI-ментор разберёт твоё письмо и подскажет, как усилить его под конкретную цель.</p>
      <Link className="btn" href="/applications/new">+ Новая заявка</Link>
      <div style={{ marginTop: 12 }}>
        {drafts.length === 0 && <p className="muted">Пока нет черновиков.</p>}
        {drafts.map((d) => {
          const score = (d.result as { total?: number } | undefined)?.total;
          return (
            <div className="card row" key={d.id}>
              <div style={{ flex: 1 }}>
                <Link href={`/applications/${d.id}`}><b>{d.target || "Без названия"}</b></Link>
                <div className="muted">{d.type} · {wc(d.text)} слов{score != null ? ` · балл ${score}/100` : ""}</div>
              </div>
              <button className="btn ghost" onClick={() => del(d.id)}>Удалить</button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
