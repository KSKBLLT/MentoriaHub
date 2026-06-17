"use client";

import { useCallback, useEffect, useState } from "react";
import { api, getProfileId, getOutcomes, setOutcome } from "@/lib/client";
import type { RoadmapStep } from "@/lib/roadmapPlanner";

const STATUS: Record<string, string> = { todo: "⏳", passed: "✅", failed: "↻", done: "✅", skipped: "—" };

export default function RoadmapPage() {
  const [steps, setSteps] = useState<RoadmapStep[]>([]);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);

  const build = useCallback(async () => {
    setLoading(true);
    const res = await api<{ steps: RoadmapStep[]; source: string }>("/api/roadmap", {
      method: "POST",
      body: { profileId: getProfileId(), outcomes: getOutcomes() },
    });
    setSteps(res.steps ?? []);
    setSource(res.source ?? "");
    setLoading(false);
  }, []);
  useEffect(() => { build(); }, [build]);

  async function mark(id: string, outcome: string) { setOutcome(id, outcome); await build(); }

  const firstTodoId = steps.find((s) => s.status === "todo")?.id;

  return (
    <main>
      <h1>🗺️ Мой роадмап</h1>
      <p className="muted">Живой план до поступления — ветвится по твоим результатам. Отметь исход шага, и план перестроится. {source && <span className="tag">{source === "ai" ? "Gemini AI" : "правила"}</span>}</p>
      <button className="btn" onClick={build} disabled={loading}>{loading ? "Строю…" : "↻ Перестроить план"}</button>

      <div style={{ marginTop: 12 }}>
        {steps.length === 0 && !loading && <p className="muted">Нет шагов. Заполни цели в онбординге и сохрани возможности.</p>}
        {steps.map((s, i) => (
          <div className="card col" key={s.id} style={firstTodoId === s.id ? { borderColor: "#1a56db", borderWidth: 2 } : undefined}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div className="row">
                <span style={{ fontSize: 20 }}>{STATUS[s.status] ?? "⏳"}</span>
                <b>{i + 1}. {s.title}</b>
                {firstTodoId === s.id && <span className="tag">сегодня / ближайшее</span>}
              </div>
              <span className="muted">{s.date ?? ""} · {s.type}</span>
            </div>
            {s.why && <div className="muted">{s.why}</div>}
            <div className="row" style={{ gap: 16 }}>
              <div className="elig-qualify">✓ если прошёл: <span style={{ color: "#111", fontWeight: 400 }}>{s.onPass}</span></div>
            </div>
            <div className="elig-soon">✗ если нет: <span style={{ color: "#111", fontWeight: 400 }}>{s.onFail}</span></div>
            {s.status === "todo" && (
              <div className="row">
                <button className="btn secondary" onClick={() => mark(s.id, "passed")}>Прошёл ✅</button>
                <button className="btn ghost" onClick={() => mark(s.id, "failed")}>Не прошёл ↻</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
