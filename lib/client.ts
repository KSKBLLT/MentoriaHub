"use client";

export const DEMO_ID = "demo-aruzhan";

export function getProfileId(): string {
  if (typeof window === "undefined") return DEMO_ID;
  return localStorage.getItem("mh_profile_id") || DEMO_ID;
}

export function setProfileId(id: string) {
  if (typeof window !== "undefined") localStorage.setItem("mh_profile_id", id);
}

/** fetch JSON helper. GET by default; pass body for POST/PATCH/DELETE. */
export async function api<T = unknown>(
  path: string,
  opts: { method?: string; body?: unknown } = {},
): Promise<T> {
  const res = await fetch(path, {
    method: opts.method ?? "GET",
    headers: { "content-type": "application/json" },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    cache: "no-store",
  });
  return res.json();
}
