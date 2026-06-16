import type {
  Certificate,
  Course,
  Enrollment,
  Opportunity,
  Profile,
  SavedItem,
  SavedStatus,
} from "./types";
import { DEMO_PROFILE, OPPORTUNITIES } from "./data/seed";
import { COURSES } from "./data/courses";
import { mintCertificate } from "./certificate";

export interface Stats {
  students: number;
  opportunities: number;
  courses: number;
  totalSaves: number;
  completions: number;
}

export type NewOpportunity = Omit<Opportunity, "id" | "save_count"> & { save_count?: number };

/**
 * In-memory data store seeded from the static data files.
 * Holds mutable state (profiles, saves, enrollments, certificates, admin CRUD on opportunities)
 * for the lifetime of the running server — admin writes reflect live in the catalog.
 */
export function createStore() {
  const opportunities: Opportunity[] = OPPORTUNITIES.map((o) => ({ ...o }));
  const courses: Course[] = COURSES;
  const profiles = new Map<string, Profile>();
  profiles.set(DEMO_PROFILE.id, structuredClone(DEMO_PROFILE));
  const saved: SavedItem[] = [];
  const enrollments: Enrollment[] = [];
  const certificates: Certificate[] = [];

  let seq = 0;
  const newId = (prefix: string) => `${prefix}-${seq++}-${Math.random().toString(36).slice(2, 7)}`;

  function issueCertificateIfMissing(profileId: string, courseId: string, issuedAt: string) {
    const exists = certificates.some((c) => c.profile_id === profileId && c.course_id === courseId);
    if (!exists) {
      certificates.push(
        mintCertificate({
          id: newId("cert"),
          profile_id: profileId,
          course_id: courseId,
          issued_at: issuedAt,
        }),
      );
    }
  }

  return {
    // ---- profiles ----
    getProfile: (id: string) => profiles.get(id),
    saveProfile: (p: Profile) => {
      profiles.set(p.id, p);
      return p;
    },

    // ---- opportunities (admin CRUD) ----
    listOpportunities: () => [...opportunities],
    getOpportunity: (id: string) => opportunities.find((o) => o.id === id),
    createOpportunity: (data: NewOpportunity): Opportunity => {
      const opp: Opportunity = { ...data, id: newId("opp"), save_count: data.save_count ?? 0 };
      opportunities.push(opp);
      return opp;
    },
    updateOpportunity: (id: string, patch: Partial<Opportunity>) => {
      const opp = opportunities.find((o) => o.id === id);
      if (opp) Object.assign(opp, patch, { id });
      return opp;
    },
    deleteOpportunity: (id: string) => {
      const idx = opportunities.findIndex((o) => o.id === id);
      if (idx >= 0) opportunities.splice(idx, 1);
      return idx >= 0;
    },

    // ---- courses ----
    listCourses: () => courses,
    getCourse: (id: string) => courses.find((c) => c.id === id),

    // ---- saved items / pipeline ----
    listSaved: (profileId: string) => saved.filter((s) => s.profile_id === profileId),
    toggleSave: (profileId: string, oppId: string): boolean => {
      const idx = saved.findIndex((s) => s.profile_id === profileId && s.opportunity_id === oppId);
      if (idx >= 0) {
        saved.splice(idx, 1);
        return false;
      }
      saved.push({ profile_id: profileId, opportunity_id: oppId, status: "saved" });
      return true;
    },
    setSavedStatus: (profileId: string, oppId: string, status: SavedStatus) => {
      const item = saved.find((s) => s.profile_id === profileId && s.opportunity_id === oppId);
      if (item) item.status = status;
      return item;
    },

    // ---- enrollments / progress ----
    listEnrollments: (profileId: string) => enrollments.filter((e) => e.profile_id === profileId),
    enroll: (profileId: string, courseId: string): Enrollment => {
      let e = enrollments.find((x) => x.profile_id === profileId && x.course_id === courseId);
      if (!e) {
        e = { profile_id: profileId, course_id: courseId, progress: 0, completed_at: null };
        enrollments.push(e);
      }
      return e;
    },
    setProgress: (profileId: string, courseId: string, progress: number): Enrollment => {
      let e = enrollments.find((x) => x.profile_id === profileId && x.course_id === courseId);
      if (!e) {
        e = { profile_id: profileId, course_id: courseId, progress: 0, completed_at: null };
        enrollments.push(e);
      }
      e.progress = Math.max(0, Math.min(100, progress));
      if (e.progress >= 100 && !e.completed_at) {
        e.completed_at = new Date().toISOString();
        issueCertificateIfMissing(profileId, courseId, e.completed_at);
      }
      return e;
    },

    // ---- certificates ----
    listCertificates: (profileId: string) => certificates.filter((c) => c.profile_id === profileId),
    getCertificateByHash: (hash: string) => certificates.find((c) => c.hash === hash),

    // ---- stats ----
    stats: (): Stats => ({
      students: profiles.size,
      opportunities: opportunities.length,
      courses: courses.length,
      totalSaves: opportunities.reduce((a, o) => a + o.save_count, 0) + saved.length,
      completions: enrollments.filter((e) => e.completed_at).length,
    }),
  };
}

export type Store = ReturnType<typeof createStore>;

// App-wide singleton (survives Next dev hot-reloads via globalThis).
const g = globalThis as unknown as { __mentoriaStore?: Store };
export const store: Store = g.__mentoriaStore ?? (g.__mentoriaStore = createStore());
