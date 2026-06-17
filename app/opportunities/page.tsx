"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api, getProfileId } from "@/lib/client";

const BADGE: Record<string, string> = { qualify: "Ready", soon: "Soon", locked: "Locked" };
const LABEL: Record<string, string> = { qualify: "Проходишь", soon: "Скоро", locked: "Закрыто" };

type Opp = {
  id: string; title: string; org: string; category: string; deadline: string;
  location_badge: string; score: number; saved: boolean;
  eligibility: { status: string; met: string[]; missing: string[] };
};

export default function Catalog() {
  const [opps, setOpps] = useState<Opp[]>([]);
  const [format, setFormat] = useState("all");
  const [near, setNear] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams({ profileId: getProfileId() });
    if (format !== "all") qs.set("format", format);
    if (near) qs.set("near", "1");
    const d = await api<{ opportunities: Opp[] }>(`/api/opportunities?${qs}`);
    setOpps(d.opportunities);
    setLoading(false);
  }, [format, near]);

  useEffect(() => { load(); }, [load]);

  async function toggleSave(id: string) {
    await api("/api/saved", { method: "POST", body: { profileId: getProfileId(), opportunityId: id } });
    load();
  }

  return (
    <main>
      <h1>Возможности</h1>
      <div className="row" style={{ marginBottom: 8 }}>
        {[["all", "Все"], ["online", "Онлайн"], ["offline", "Оффлайн"]].map(([v, l]) => (
          <button key={v} className={`chip ${format === v ? "on" : ""}`} onClick={() => setFormat(v)}>{l}</button>
        ))}
        <button className={`chip ${near ? "on" : ""}`} onClick={() => setNear((n) => !n)}>Рядом</button>
      </div>
      {loading && <p className="muted">Загрузка…</p>}
      <div className="grid">
        {opps.map((o) => (
          <div className="card col" key={o.id}>
            <div className="row">
              <span className={`elig-${o.eligibility.status}`}>{BADGE[o.eligibility.status]} {LABEL[o.eligibility.status]}</span>
              <span className="muted">score {o.score}</span>
            </div>
            <Link href={`/opportunities/${o.id}`}><b>{o.title}</b></Link>
            <div className="muted">{o.org} · {o.category}</div>
            <div className="row"><span className="tag">{o.location_badge}</span><span className="tag">deadline {o.deadline}</span></div>
            <div className="muted">{[...o.eligibility.met, ...o.eligibility.missing].join(", ") || "без требований"}</div>
            <button className={`btn ${o.saved ? "ghost" : "secondary"}`} onClick={() => toggleSave(o.id)}>
              {o.saved ? "Сохранено" : "Сохранить"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
