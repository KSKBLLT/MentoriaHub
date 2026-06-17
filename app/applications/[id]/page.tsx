"use client";

import { use, useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { api, getDraft, saveDraft } from "@/lib/client";
import type { MentorResult } from "@/lib/mentorRubric";

const TYPES = ["мотивационное письмо", "эссе", "personal statement", "сопроводительное письмо"];

export default function Editor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [draftId, setDraftId] = useState(id);
  const [target, setTarget] = useState("");
  const [type, setType] = useState(TYPES[0]);
  const [text, setText] = useState("");
  const [result, setResult] = useState<MentorResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id === "new") {
      const t = new URLSearchParams(window.location.search).get("target");
      if (t) setTarget(t);
      setDraftId(`app-${Date.now().toString(36)}`);
    } else {
      const d = getDraft(id);
      if (d) { setTarget(d.target); setType(d.type); setText(d.text); setResult((d.result as MentorResult) ?? null); }
    }
  }, [id]);

  const words = text.split(/\s+/).filter(Boolean).length;

  function persist(res?: MentorResult | null) {
    saveDraft({ id: draftId, target, type, text, result: res ?? result ?? undefined, updatedAt: Date.now() });
  }

  async function importFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setText(await f.text());
  }

  async function analyze() {
    setLoading(true);
    const res = await api<MentorResult & { error?: string }>("/api/mentor", { method: "POST", body: { target, type, text } });
    setLoading(false);
    if (res.error) { alert(res.error); return; }
    setResult(res);
    saveDraft({ id: draftId, target, type, text, result: res, updatedAt: Date.now() });
  }

  const Bar = ({ label, v }: { label: string; v: number }) => (
    <div style={{ marginBottom: 6 }}>
      <div className="row" style={{ justifyContent: "space-between" }}><span>{label}</span><span className="muted">{v}/25</span></div>
      <div className="bar"><span style={{ width: `${(v / 25) * 100}%` }} /></div>
    </div>
  );

  return (
    <main>
      <p className="muted"><Link href="/applications">← Мои заявки</Link></p>
      <h1>AI-ментор заявки</h1>

      <div className="card col">
        <div className="row">
          <div style={{ flex: 2 }}><label>Куда подаёшься (цель)</label><input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Напр. Bolashak Scholarship" /></div>
          <div style={{ flex: 1 }}><label>Тип</label><select value={type} onChange={(e) => setType(e.target.value)}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
        </div>
        <div>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <label>Текст письма</label>
            <label className="btn ghost" style={{ cursor: "pointer", padding: "4px 10px" }}>Импорт .txt<input type="file" accept=".txt,.md" hidden onChange={importFile} /></label>
          </div>
          <textarea rows={12} value={text} onChange={(e) => setText(e.target.value)} placeholder="Вставь или напиши текст письма…" />
          <div className="muted">{words} слов</div>
        </div>
        <div className="row">
          <button className="btn" disabled={loading || text.trim().length < 5} onClick={analyze}>{loading ? "Анализирую…" : "Разобрать как ментор"}</button>
          <button className="btn ghost" onClick={() => persist()}>Сохранить черновик</button>
        </div>
      </div>

      {result && (
        <div className="card col">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h2 style={{ margin: 0 }}>Разбор · {result.total}/100</h2>
            <span className="tag">{result.source === "ai" ? "Gemini AI" : "правила"}</span>
          </div>
          <Bar label="Связь с целью" v={result.scores.relevance} />
          <Bar label="Конкретика" v={result.scores.specificity} />
          <Bar label="Структура" v={result.scores.structure} />
          <Bar label="Язык" v={result.scores.language} />
          {result.strengths?.length > 0 && (
            <div><b className="elig-qualify">Сильные стороны:</b><ul>{result.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
          )}
          {result.fixes?.length > 0 && (
            <div><b className="elig-soon">Что исправить:</b>
              {result.fixes.map((f, i) => (
                <div className="card" key={i}>
                  {f.before && <div className="muted">было: {f.before}</div>}
                  {f.after && <div className="elig-qualify">стало: {f.after}</div>}
                  <div>{f.why}</div>
                </div>
              ))}
            </div>
          )}
          <div className="card"><b>Вердикт ментора:</b> {result.verdict}</div>
          <p className="muted">Поправь текст выше и нажми «Разобрать» снова. Так ты увидишь, как растёт балл.</p>
        </div>
      )}
    </main>
  );
}
