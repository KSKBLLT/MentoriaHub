import { describe, it, expect } from "vitest";
import { createStore } from "./store";
import { verifyCertificate } from "./certificate";

describe("store", () => {
  it("seeds opportunities, courses and the demo profile", () => {
    const s = createStore();
    expect(s.listOpportunities().length).toBeGreaterThanOrEqual(14);
    expect(s.listCourses().length).toBeGreaterThanOrEqual(3);
    expect(s.getProfile("demo-aruzhan")?.name).toBe("Аружан");
  });

  it("createOpportunity makes it immediately retrievable (admin write reflects in catalog)", () => {
    const s = createStore();
    const before = s.listOpportunities().length;
    const created = s.createOpportunity({
      title: "Astana Hub Youth Grant",
      org: "Astana Hub",
      category: "scholarship",
      direction: "coding",
      format: "online",
      deadline: "2026-09-30",
      description: "New grant",
      apply_url: "#",
      tags: ["coding"],
      req: { min_grade: 9 },
    });
    expect(s.listOpportunities().length).toBe(before + 1);
    expect(s.getOpportunity(created.id)?.title).toBe("Astana Hub Youth Grant");
  });

  it("updateOpportunity patches fields and deleteOpportunity removes it", () => {
    const s = createStore();
    const id = s.listOpportunities()[0].id;
    s.updateOpportunity(id, { title: "Renamed" });
    expect(s.getOpportunity(id)?.title).toBe("Renamed");
    s.deleteOpportunity(id);
    expect(s.getOpportunity(id)).toBeUndefined();
  });

  it("toggleSave adds a saved item, and toggling again removes it", () => {
    const s = createStore();
    const oppId = s.listOpportunities()[0].id;
    expect(s.toggleSave("demo-aruzhan", oppId)).toBe(true);
    expect(s.listSaved("demo-aruzhan").some((i) => i.opportunity_id === oppId)).toBe(true);
    expect(s.toggleSave("demo-aruzhan", oppId)).toBe(false);
    expect(s.listSaved("demo-aruzhan").some((i) => i.opportunity_id === oppId)).toBe(false);
  });

  it("setSavedStatus advances the application pipeline", () => {
    const s = createStore();
    const oppId = s.listOpportunities()[0].id;
    s.toggleSave("demo-aruzhan", oppId);
    s.setSavedStatus("demo-aruzhan", oppId, "preparing");
    expect(s.listSaved("demo-aruzhan").find((i) => i.opportunity_id === oppId)?.status).toBe("preparing");
  });

  it("completing a course issues a verifiable certificate exactly once", () => {
    const s = createStore();
    const courseId = s.listCourses()[0].id;
    s.enroll("demo-aruzhan", courseId);
    s.setProgress("demo-aruzhan", courseId, 100);

    const enrollment = s.listEnrollments("demo-aruzhan").find((e) => e.course_id === courseId);
    expect(enrollment?.completed_at).toBeTruthy();

    const certs = s.listCertificates("demo-aruzhan").filter((c) => c.course_id === courseId);
    expect(certs).toHaveLength(1);
    expect(verifyCertificate(certs[0])).toBe(true);

    // completing again must not mint a second certificate
    s.setProgress("demo-aruzhan", courseId, 100);
    expect(s.listCertificates("demo-aruzhan").filter((c) => c.course_id === courseId)).toHaveLength(1);
  });

  it("getCertificateByHash returns the issued certificate", () => {
    const s = createStore();
    const courseId = s.listCourses()[0].id;
    s.enroll("demo-aruzhan", courseId);
    s.setProgress("demo-aruzhan", courseId, 100);
    const cert = s.listCertificates("demo-aruzhan")[0];
    expect(s.getCertificateByHash(cert.hash)?.id).toBe(cert.id);
  });

  it("stats reports counts that grow when content is added", () => {
    const s = createStore();
    const before = s.stats().opportunities;
    s.createOpportunity({
      title: "X", org: "Y", category: "prep", direction: "STEM", format: "online",
      deadline: "2026-09-01", description: "", apply_url: "#", tags: [], req: {},
    });
    expect(s.stats().opportunities).toBe(before + 1);
    expect(s.stats().students).toBeGreaterThanOrEqual(1);
  });
});
