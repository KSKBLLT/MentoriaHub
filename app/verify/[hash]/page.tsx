"use client";

import { use, useEffect, useState } from "react";
import { api } from "@/lib/client";

type Result = { valid: boolean; course_title?: string; student_name?: string; certificate?: { issued_at: string }; error?: string };

export default function Verify({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = use(params);
  const [r, setR] = useState<Result | null>(null);
  useEffect(() => { api<Result>(`/api/verify/${hash}`).then(setR); }, [hash]);

  if (!r) return <main><p className="muted">Проверка…</p></main>;

  return (
    <main>
      <h1>Проверка сертификата</h1>
      <div className="card" style={{ textAlign: "center", padding: 30 }}>
        {r.valid ? (
          <>
            <div style={{ fontSize: 48 }}>✅</div>
            <h2 className="elig-qualify">Подлинный сертификат</h2>
            <p><b>{r.student_name}</b> завершил(а) курс</p>
            <p style={{ fontSize: 18 }}><b>«{r.course_title}»</b></p>
            {r.certificate && <p className="muted">Выдан {new Date(r.certificate.issued_at).toLocaleDateString("ru-RU")}</p>}
            <p className="muted">Mentoria Hub · хеш {hash.slice(0, 24)}…</p>
          </>
        ) : (
          <>
            <div style={{ fontSize: 48 }}>❌</div>
            <h2 className="elig-locked">Сертификат не найден или недействителен</h2>
          </>
        )}
      </div>
    </main>
  );
}
