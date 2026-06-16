"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/client";

type Stats = { students: number; opportunities: number; courses: number; completions: number; totalSaves: number };
type Opp = { id: string; title: string; category: string; format: string; region: string | null };

const empty = { title: "", org: "", category: "scholarship", direction: "STEM", format: "online", region: "", city: "", deadline: "2026-09-01", min_grade: 9, tags: "" };

export default function Admin() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [opps, setOpps] = useState<Opp[]>([]);
  const [f, setF] = useState({ ...empty });
  const [msg, setMsg] = useState("");

  async function load() {
    setStats((await api<{ stats: Stats }>("/api/stats")).stats);
    setOpps((await api<{ opportunities: Opp[] }>("/api/opportunities")).opportunities);
  }
  useEffect(() => { load(); }, []);

  async function create() {
    if (!f.title) return;
    await api("/api/opportunities", {
      method: "POST",
      body: {
        title: f.title, org: f.org, category: f.category, direction: f.direction, format: f.format,
        region: f.region || null, city: f.city || null, deadline: f.deadline,
        description: "", apply_url: "#", tags: f.tags ? f.tags.split(",").map((t) => t.trim()) : [],
        req: { min_grade: Number(f.min_grade) },
      },
    });
    setMsg(`Добавлено: ${f.title} → видно ученикам сразу`);
    setF({ ...empty });
    load();
  }
  async function del(id: string) {
    await api(`/api/opportunities/${id}`, { method: "DELETE" });
    load();
  }

  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

  return (
    <main>
      <h1>Админка Mentoria</h1>
      {stats && (
        <div className="card">
          <b>📊 Масштаб платформы</b>
          <div className="grid" style={{ marginTop: 8 }}>
            <div className="card">Учеников: <b>{stats.students}</b></div>
            <div className="card">Возможностей: <b>{stats.opportunities}</b></div>
            <div className="card">Курсов: <b>{stats.courses}</b></div>
            <div className="card">Завершений курсов: <b>{stats.completions}</b></div>
          </div>
          <p className="muted">Добавь возможность ниже — счётчик «возможностей» вырастет, и она сразу появится у учеников (та же БД).</p>
        </div>
      )}

      <h2>Добавить возможность</h2>
      <div className="card col">
        <div className="row">
          <div style={{ flex: 2 }}><label>Название</label><input value={f.title} onChange={(e) => set("title", e.target.value)} /></div>
          <div style={{ flex: 1 }}><label>Организатор</label><input value={f.org} onChange={(e) => set("org", e.target.value)} /></div>
        </div>
        <div className="row">
          <div style={{ flex: 1 }}><label>Категория</label>
            <select value={f.category} onChange={(e) => set("category", e.target.value)}>
              {["scholarship", "olympiad", "hackathon", "research", "internship", "summer_school", "prep", "program"].map((c) => <option key={c}>{c}</option>)}
            </select></div>
          <div style={{ flex: 1 }}><label>Формат</label>
            <select value={f.format} onChange={(e) => set("format", e.target.value)}>
              {["online", "offline", "hybrid"].map((c) => <option key={c}>{c}</option>)}
            </select></div>
          <div style={{ flex: 1 }}><label>Мин. класс</label>
            <select value={f.min_grade} onChange={(e) => set("min_grade", e.target.value)}>{[8, 9, 10, 11].map((g) => <option key={g}>{g}</option>)}</select></div>
        </div>
        <div className="row">
          <div style={{ flex: 1 }}><label>Регион</label><input value={f.region} onChange={(e) => set("region", e.target.value)} placeholder="Turkistan / пусто=онлайн" /></div>
          <div style={{ flex: 1 }}><label>Город</label><input value={f.city} onChange={(e) => set("city", e.target.value)} /></div>
          <div style={{ flex: 1 }}><label>Дедлайн</label><input value={f.deadline} onChange={(e) => set("deadline", e.target.value)} /></div>
        </div>
        <div><label>Теги (через запятую)</label><input value={f.tags} onChange={(e) => set("tags", e.target.value)} placeholder="coding, ai" /></div>
        <button className="btn" onClick={create}>Добавить → опубликовать</button>
        {msg && <div className="elig-qualify">{msg}</div>}
      </div>

      <h2>Все возможности ({opps.length})</h2>
      {opps.map((o) => (
        <div className="card row" key={o.id}>
          <b style={{ flex: 1 }}>{o.title}</b>
          <span className="tag">{o.category}</span>
          <span className="tag">{o.format}{o.region ? ` · ${o.region}` : ""}</span>
          <button className="btn ghost" onClick={() => del(o.id)}>Удалить</button>
        </div>
      ))}
    </main>
  );
}
