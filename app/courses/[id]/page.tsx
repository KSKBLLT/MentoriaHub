"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { api, getProfileId } from "@/lib/client";

type Lesson = { id: string; ord: number; title: string };
type Course = { id: string; title: string; description: string; lessons: Lesson[] };
type Enrollment = { progress: number; completed_at: string | null } | null;

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [enr, setEnr] = useState<Enrollment>(null);

  async function load() {
    const d = await api<{ course: Course; enrollment: Enrollment }>(`/api/courses/${id}?profileId=${getProfileId()}`);
    setCourse(d.course);
    setEnr(d.enrollment);
  }
  useEffect(() => { load(); }, [id]);

  async function enroll() {
    await api("/api/enroll", { method: "POST", body: { profileId: getProfileId(), courseId: id } });
    load();
  }

  if (!course) return <main><p className="muted">Загрузка…</p></main>;
  const progress = enr?.progress ?? 0;

  return (
    <main>
      <h1>{course.title}</h1>
      <p className="muted">{course.description}</p>
      <div className="card">
        <div className="row"><b>Прогресс: {progress}%</b>{enr?.completed_at && <span className="elig-qualify">✓ завершён</span>}</div>
        <div className="bar"><span style={{ width: `${progress}%` }} /></div>
        {!enr && <button className="btn" style={{ marginTop: 10 }} onClick={enroll}>Записаться</button>}
      </div>
      <h2>Уроки</h2>
      {course.lessons.map((l) => (
        <div className="card row" key={l.id}>
          <span className="muted">{l.ord}.</span>
          <Link href={`/courses/${id}/${l.id}`}>{l.title}</Link>
        </div>
      ))}
    </main>
  );
}
