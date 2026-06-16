"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/client";

type Course = { id: string; title: string; description: string; level: string; lessonCount: number };

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => { api<{ courses: Course[] }>("/api/courses").then((d) => setCourses(d.courses)); }, []);
  return (
    <main>
      <h1>Курсы Mentoria</h1>
      <div className="grid">
        {courses.map((c) => (
          <div className="card col" key={c.id}>
            <Link href={`/courses/${c.id}`}><b>{c.title}</b></Link>
            <div className="muted">{c.description}</div>
            <div className="row"><span className="tag">{c.level}</span><span className="tag">{c.lessonCount} уроков</span></div>
          </div>
        ))}
      </div>
    </main>
  );
}
