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

// ---- Local persistence (drafts + roadmap outcomes) -------------------------
export interface Draft {
  id: string;
  target: string;
  type: string;
  text: string;
  result?: unknown;
  updatedAt: number;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, val: unknown) {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(val));
}

const draftsKey = () => `mh_apps_${getProfileId()}`;
export const getDrafts = (): Draft[] => read<Draft[]>(draftsKey(), []);
export const getDraft = (id: string): Draft | undefined => getDrafts().find((d) => d.id === id);
export function saveDraft(d: Draft) {
  const all = getDrafts().filter((x) => x.id !== d.id);
  all.unshift({ ...d, updatedAt: Date.now() });
  write(draftsKey(), all);
}
export function deleteDraft(id: string) {
  write(draftsKey(), getDrafts().filter((d) => d.id !== id));
}

const outcomesKey = () => `mh_roadmap_outcomes_${getProfileId()}`;
export const getOutcomes = (): Record<string, string> => read(outcomesKey(), {});
export function setOutcome(stepId: string, outcome: string) {
  write(outcomesKey(), { ...getOutcomes(), [stepId]: outcome });
}
