"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, setProfileId } from "@/lib/client";

const REGIONS = ["Turkistan", "Almaty", "Astana", "Shymkent", "Karaganda", "Aktobe", "Other"];
const ROLES = [
  { label: "Школьник", value: "student" },
  { label: "Студент", value: "student" },
  { label: "Преподаватель", value: "mentor" },
  { label: "Другое", value: "student" },
];
const GOALS = [
  { label: "ЕНТ", value: "ent" },
  { label: "SAT", value: "sat" },
  { label: "IELTS", value: "ielts" },
  { label: "Математика", value: "math" },
  { label: "Английский", value: "english" },
  { label: "Программирование", value: "coding" },
  { label: "Бизнес", value: "business" },
  { label: "Наука", value: "science" },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [roleIdx, setRoleIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    grade: 10,
    region: "Turkistan",
    city: "",
    citizenship: "KZ",
    english_level: "B1",
    role: "student",
    goals: [] as string[],
  });

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const toggleGoal = (g: string) =>
    setForm((f) => ({ ...f, goals: f.goals.includes(g) ? f.goals.filter((x) => x !== g) : [...f.goals, g] }));

  async function finish() {
    setSaving(true);
    const res = await api<{ profile: { id: string } }>("/api/profile", {
      method: "POST",
      body: { ...form, grade: Number(form.grade), language: "ru" },
    });
    setProfileId(res.profile.id);
    setSaving(false);
    setStep(3);
  }

  return (
    <main>
      <h1>Создай профиль</h1>
      <p className="muted">Шаг {Math.min(step + 1, 3)} из 3</p>

      {step === 0 && (
        <div className="card col">
          <div><label>Имя</label><input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Аружан" /></div>
          <div className="row">
            <div style={{ flex: 1 }}><label>Класс</label>
              <select value={form.grade} onChange={(e) => set("grade", e.target.value)}>
                {[8, 9, 10, 11].map((g) => <option key={g} value={g}>{g} класс</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}><label>Регион</label>
              <select value={form.region} onChange={(e) => set("region", e.target.value)}>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="row">
            <div style={{ flex: 1 }}><label>Город</label><input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Turkistan" /></div>
            <div style={{ flex: 1 }}><label>Английский</label>
              <select value={form.english_level} onChange={(e) => set("english_level", e.target.value)}>
                {["none", "A2", "B1", "B2", "C1"].map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}><label>Гражданство</label>
              <select value={form.citizenship} onChange={(e) => set("citizenship", e.target.value)}>
                <option value="KZ">KZ</option><option value="other">Другое</option>
              </select>
            </div>
          </div>
          <button className="btn" onClick={() => setStep(1)}>Далее</button>
        </div>
      )}

      {step === 1 && (
        <div className="card col">
          <label>Кто ты?</label>
          <div className="row">
            {ROLES.map((r, i) => (
              <button key={i} className={`chip ${roleIdx === i ? "on" : ""}`}
                onClick={() => { setRoleIdx(i); set("role", r.value); }}>
                {r.label}
              </button>
            ))}
          </div>
          <div className="row"><button className="btn ghost" onClick={() => setStep(0)}>Назад</button><button className="btn" onClick={() => setStep(2)}>Далее</button></div>
        </div>
      )}

      {step === 2 && (
        <div className="card col">
          <label>Цели и интересы (можно несколько)</label>
          <div className="row">
            {GOALS.map((g) => (
              <button key={g.value} className={`chip ${form.goals.includes(g.value) ? "on" : ""}`} onClick={() => toggleGoal(g.value)}>
                {g.label}
              </button>
            ))}
          </div>
          <div className="row">
            <button className="btn ghost" onClick={() => setStep(1)}>Назад</button>
            <button className="btn" disabled={saving || form.goals.length === 0} onClick={finish}>
              {saving ? "Сохраняю…" : "Готово"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card col">
          <h2>Проверим твой уровень?</h2>
          <p className="muted">Короткая диагностика по темам — 5 вопросов, ~2 минуты. Можно пропустить.</p>
          <div className="row">
            <button className="btn" onClick={() => router.push("/diagnostic")}>Пройти диагностику</button>
            <button className="btn secondary" onClick={() => router.push("/opportunities")}>Пропустить</button>
          </div>
        </div>
      )}
    </main>
  );
}
