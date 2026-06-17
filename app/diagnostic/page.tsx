"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getProfileId } from "@/lib/client";

type Section = { topic: string; questions: { q: string; options: string[] }[] };

export default function Diagnostic() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [done, setDone] = useState<{ topic: string; level: string; score: number }[] | null>(null);

  useEffect(() => {
    api<{ sections: Section[] }>(`/api/diagnostic?profileId=${getProfileId()}`).then((d) => setSections(d.sections));
  }, []);

  const pick = (topic: string, qi: number, oi: number) =>
    setAnswers((a) => {
      const arr = [...(a[topic] ?? [])];
      arr[qi] = oi;
      return { ...a, [topic]: arr };
    });

  async function submit() {
    const res = await api<{ topic_levels: { topic: string; level: string; score: number }[] }>("/api/diagnostic", {
      method: "POST",
      body: { profileId: getProfileId(), answers },
    });
    setDone(res.topic_levels);
  }

  if (done) {
    return (
      <main>
        <h1>Твой уровень</h1>
        {done.map((t) => (
          <div className="card row" key={t.topic}>
            <b>{t.topic}</b>
            <span className={`elig-${t.level === "strong" ? "qualify" : t.level === "mid" ? "soon" : "locked"}`}>{t.level}</span>
            <span className="muted">{t.score}%</span>
          </div>
        ))}
        <button className="btn" onClick={() => router.push("/opportunities")}>К возможностям</button>
      </main>
    );
  }

  return (
    <main>
      <h1>Диагностика</h1>
      <p className="muted">Ответь на вопросы, и мы подберём курс под твои пробелы. Можно <a href="/opportunities">пропустить</a>.</p>
      {sections.map((s) => (
        <div className="card" key={s.topic}>
          <h2>{s.topic}</h2>
          {s.questions.map((q, qi) => (
            <div key={qi} style={{ marginBottom: 10 }}>
              <div><b>{qi + 1}.</b> {q.q}</div>
              <div className="row">
                {q.options.map((o, oi) => (
                  <button key={oi} className={`chip ${answers[s.topic]?.[qi] === oi ? "on" : ""}`} onClick={() => pick(s.topic, qi, oi)}>{o}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
      <button className="btn" disabled={sections.length === 0} onClick={submit}>Завершить тест</button>
    </main>
  );
}
