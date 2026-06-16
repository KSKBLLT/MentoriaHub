"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, getProfileId } from "@/lib/client";

type Q = { q: string; options: string[]; correctIndex: number };
type Lesson = { id: string; ord: number; title: string; content_md: string; task_md?: string; quiz: Q[] };
type Course = { id: string; title: string; lessons: Lesson[] };

export default function LessonPage({ params }: { params: Promise<{ id: string; lesson: string }> }) {
  const { id, lesson: lessonId } = use(params);
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [picks, setPicks] = useState<number[]>([]);
  const [result, setResult] = useState<{ correct: number; progress: number; cert: boolean } | null>(null);

  useEffect(() => {
    api<{ course: Course }>(`/api/courses/${id}?profileId=${getProfileId()}`).then((d) => setCourse(d.course));
  }, [id]);

  if (!course) return <main><p className="muted">Загрузка…</p></main>;
  const lesson = course.lessons.find((l) => l.id === lessonId);
  if (!lesson) return <main><p>Урок не найден. <Link href={`/courses/${id}`}>← к курсу</Link></p></main>;
  const next = course.lessons.find((l) => l.ord === lesson.ord + 1);

  async function complete() {
    if (!course || !lesson) return;
    const correct = lesson.quiz.reduce((a, q, i) => a + (picks[i] === q.correctIndex ? 1 : 0), 0);
    const progress = Math.round((lesson.ord / course.lessons.length) * 100);
    const res = await api<{ enrollment: { progress: number }; certificate: unknown }>(
      "/api/progress", { method: "POST", body: { profileId: getProfileId(), courseId: id, progress } });
    setResult({ correct, progress: res.enrollment.progress, cert: Boolean(res.certificate) });
  }

  return (
    <main>
      <p className="muted"><Link href={`/courses/${id}`}>← {course.title}</Link></p>
      <h1>{lesson.ord}. {lesson.title}</h1>
      <div className="card"><div style={{ whiteSpace: "pre-wrap" }}>{lesson.content_md}</div></div>
      <div className="card"><b>🎬 Видео-урок</b><div className="muted" style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", background: "#eef0f3", borderRadius: 8 }}>video placeholder</div></div>
      {lesson.task_md && <div className="card"><b>✍️ Задание:</b> {lesson.task_md}</div>}

      {lesson.quiz.length > 0 && (
        <div className="card">
          <h2>Мини-тест</h2>
          {lesson.quiz.map((q, qi) => (
            <div key={qi} style={{ marginBottom: 10 }}>
              <div><b>{qi + 1}.</b> {q.q}</div>
              <div className="row">
                {q.options.map((o, oi) => {
                  const chosen = picks[qi] === oi;
                  return (
                    <button key={oi} className={`chip ${chosen ? "on" : ""}`} disabled={!!result}
                      onClick={() => setPicks((p) => { const n = [...p]; n[qi] = oi; return n; })}>
                      {result && oi === q.correctIndex ? "✓ " : ""}{o}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {!result ? (
        <button className="btn" onClick={complete}>Завершить урок</button>
      ) : (
        <div className="card col">
          <b className="elig-qualify">Урок засчитан! Правильно: {result.correct}/{lesson.quiz.length}. Прогресс курса: {result.progress}%</b>
          {result.cert && <b>🏅 Курс завершён — сертификат выдан! <Link href="/portfolio">Открыть портфолио →</Link></b>}
          <div className="row">
            {next ? <button className="btn" onClick={() => { setResult(null); setPicks([]); router.push(`/courses/${id}/${next.id}`); }}>Следующий урок →</button>
                  : <Link className="btn" href="/dashboard">В кабинет →</Link>}
          </div>
        </div>
      )}
    </main>
  );
}
