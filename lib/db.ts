import { store, type NewOpportunity, type Stats } from "./store";
import { supabase, supabaseEnabled } from "./supabaseClient";
import { mintCertificate } from "./certificate";
import { OPPORTUNITIES, DEMO_PROFILE } from "./data/seed";
import { COURSES } from "./data/courses";
import type {
  Certificate,
  Course,
  Enrollment,
  Opportunity,
  Profile,
  SavedItem,
  SavedStatus,
} from "./types";

/** Async data interface. Two implementations: in-memory (tested) and Supabase. */
export interface DataStore {
  getProfile(id: string): Promise<Profile | null>;
  saveProfile(p: Profile): Promise<Profile>;
  listOpportunities(): Promise<Opportunity[]>;
  getOpportunity(id: string): Promise<Opportunity | null>;
  createOpportunity(data: NewOpportunity): Promise<Opportunity>;
  updateOpportunity(id: string, patch: Partial<Opportunity>): Promise<Opportunity | null>;
  deleteOpportunity(id: string): Promise<boolean>;
  listCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | null>;
  listSaved(profileId: string): Promise<SavedItem[]>;
  toggleSave(profileId: string, oppId: string): Promise<boolean>;
  setSavedStatus(profileId: string, oppId: string, status: SavedStatus): Promise<SavedItem | null>;
  listEnrollments(profileId: string): Promise<Enrollment[]>;
  enroll(profileId: string, courseId: string): Promise<Enrollment>;
  setProgress(profileId: string, courseId: string, progress: number): Promise<Enrollment>;
  listCertificates(profileId: string): Promise<Certificate[]>;
  getCertificateByHash(hash: string): Promise<Certificate | null>;
  stats(): Promise<Stats>;
  seed(): Promise<{ opportunities: number; courses: number }>;
}

// ---- In-memory adapter (wraps the tested singleton store) -------------------
const memory: DataStore = {
  getProfile: async (id) => store.getProfile(id) ?? null,
  saveProfile: async (p) => store.saveProfile(p),
  listOpportunities: async () => store.listOpportunities(),
  getOpportunity: async (id) => store.getOpportunity(id) ?? null,
  createOpportunity: async (data) => store.createOpportunity(data),
  updateOpportunity: async (id, patch) => store.updateOpportunity(id, patch) ?? null,
  deleteOpportunity: async (id) => store.deleteOpportunity(id),
  listCourses: async () => store.listCourses(),
  getCourse: async (id) => store.getCourse(id) ?? null,
  listSaved: async (pid) => store.listSaved(pid),
  toggleSave: async (pid, oid) => store.toggleSave(pid, oid),
  setSavedStatus: async (pid, oid, s) => store.setSavedStatus(pid, oid, s) ?? null,
  listEnrollments: async (pid) => store.listEnrollments(pid),
  enroll: async (pid, cid) => store.enroll(pid, cid),
  setProgress: async (pid, cid, p) => store.setProgress(pid, cid, p),
  listCertificates: async (pid) => store.listCertificates(pid),
  getCertificateByHash: async (h) => store.getCertificateByHash(h) ?? null,
  stats: async () => store.stats(),
  seed: async () => ({ opportunities: store.listOpportunities().length, courses: store.listCourses().length }),
};

// ---- Supabase adapter -------------------------------------------------------
const newId = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

function sbClient() {
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
}

const sb: DataStore = {
  async getProfile(id) {
    const { data } = await sbClient().from("profiles").select("*").eq("id", id).maybeSingle();
    return (data as Profile) ?? null;
  },
  async saveProfile(p) {
    await sbClient().from("profiles").upsert(p);
    return p;
  },
  async listOpportunities() {
    const { data } = await sbClient().from("opportunities").select("*");
    return (data as Opportunity[]) ?? [];
  },
  async getOpportunity(id) {
    const { data } = await sbClient().from("opportunities").select("*").eq("id", id).maybeSingle();
    return (data as Opportunity) ?? null;
  },
  async createOpportunity(data) {
    const opp: Opportunity = { ...data, id: newId("opp"), save_count: data.save_count ?? 0 };
    await sbClient().from("opportunities").insert(opp);
    return opp;
  },
  async updateOpportunity(id, patch) {
    const { data } = await sbClient()
      .from("opportunities")
      .update({ ...patch, id })
      .eq("id", id)
      .select("*")
      .maybeSingle();
    return (data as Opportunity) ?? null;
  },
  async deleteOpportunity(id) {
    const { error } = await sbClient().from("opportunities").delete().eq("id", id);
    return !error;
  },
  async listCourses() {
    const { data } = await sbClient().from("courses").select("*");
    return (data as Course[]) ?? [];
  },
  async getCourse(id) {
    const { data } = await sbClient().from("courses").select("*").eq("id", id).maybeSingle();
    return (data as Course) ?? null;
  },
  async listSaved(profileId) {
    const { data } = await sbClient().from("saved_items").select("*").eq("profile_id", profileId);
    return (data as SavedItem[]) ?? [];
  },
  async toggleSave(profileId, oppId) {
    const { data: existing } = await sbClient()
      .from("saved_items")
      .select("*")
      .eq("profile_id", profileId)
      .eq("opportunity_id", oppId)
      .maybeSingle();
    if (existing) {
      await sbClient().from("saved_items").delete().eq("profile_id", profileId).eq("opportunity_id", oppId);
      return false;
    }
    await sbClient().from("saved_items").insert({ profile_id: profileId, opportunity_id: oppId, status: "saved" });
    return true;
  },
  async setSavedStatus(profileId, oppId, status) {
    const { data } = await sbClient()
      .from("saved_items")
      .update({ status })
      .eq("profile_id", profileId)
      .eq("opportunity_id", oppId)
      .select("*")
      .maybeSingle();
    return (data as SavedItem) ?? null;
  },
  async listEnrollments(profileId) {
    const { data } = await sbClient().from("enrollments").select("*").eq("profile_id", profileId);
    return (data as Enrollment[]) ?? [];
  },
  async enroll(profileId, courseId) {
    const existing = await this.listEnrollments(profileId);
    const found = existing.find((e) => e.course_id === courseId);
    if (found) return found;
    const enrollment: Enrollment = { profile_id: profileId, course_id: courseId, progress: 0, completed_at: null };
    await sbClient().from("enrollments").upsert(enrollment);
    return enrollment;
  },
  async setProgress(profileId, courseId, progress) {
    const clamped = Math.max(0, Math.min(100, progress));
    const enrollments = await this.listEnrollments(profileId);
    const current = enrollments.find((e) => e.course_id === courseId);
    const completed_at =
      clamped >= 100 ? (current?.completed_at ?? new Date().toISOString()) : (current?.completed_at ?? null);
    const enrollment: Enrollment = { profile_id: profileId, course_id: courseId, progress: clamped, completed_at };
    await sbClient().from("enrollments").upsert(enrollment);

    if (clamped >= 100) {
      const certs = await this.listCertificates(profileId);
      if (!certs.some((c) => c.course_id === courseId)) {
        const cert = mintCertificate({
          id: newId("cert"),
          profile_id: profileId,
          course_id: courseId,
          issued_at: completed_at as string,
        });
        await sbClient().from("certificates").insert(cert);
      }
    }
    return enrollment;
  },
  async listCertificates(profileId) {
    const { data } = await sbClient().from("certificates").select("*").eq("profile_id", profileId);
    return (data as Certificate[]) ?? [];
  },
  async getCertificateByHash(hash) {
    const { data } = await sbClient().from("certificates").select("*").eq("hash", hash).maybeSingle();
    return (data as Certificate) ?? null;
  },
  async stats() {
    const c = sbClient();
    const [students, opps, courses, completions, savedRows, oppSaves] = await Promise.all([
      c.from("profiles").select("id", { count: "exact", head: true }),
      c.from("opportunities").select("id", { count: "exact", head: true }),
      c.from("courses").select("id", { count: "exact", head: true }),
      c.from("enrollments").select("course_id", { count: "exact", head: true }).not("completed_at", "is", null),
      c.from("saved_items").select("opportunity_id", { count: "exact", head: true }),
      c.from("opportunities").select("save_count"),
    ]);
    const baseSaves = ((oppSaves.data as { save_count: number }[]) ?? []).reduce((a, o) => a + (o.save_count ?? 0), 0);
    return {
      students: students.count ?? 0,
      opportunities: opps.count ?? 0,
      courses: courses.count ?? 0,
      completions: completions.count ?? 0,
      totalSaves: baseSaves + (savedRows.count ?? 0),
    };
  },
  async seed() {
    const c = sbClient();
    await c.from("opportunities").upsert(OPPORTUNITIES);
    await c.from("courses").upsert(COURSES);
    await c.from("profiles").upsert(DEMO_PROFILE);
    return { opportunities: OPPORTUNITIES.length, courses: COURSES.length };
  },
};

export const db: DataStore = supabaseEnabled ? sb : memory;
export const usingSupabase = supabaseEnabled;
