import { describe, it, expect } from "vitest";
import { mintCertificate, verifyCertificate, computeCertificateHash } from "./certificate";

const input = {
  id: "c1",
  profile_id: "p1",
  course_id: "course-sat-math",
  issued_at: "2026-07-01T10:00:00.000Z",
};

describe("certificate", () => {
  it("mints a certificate with a non-empty hash that verifies as authentic", () => {
    const cert = mintCertificate(input);
    expect(cert.hash).toBeTruthy();
    expect(verifyCertificate(cert)).toBe(true);
  });

  it("produces the same hash for identical fields (deterministic)", () => {
    expect(computeCertificateHash(input)).toBe(computeCertificateHash({ ...input }));
  });

  it("produces a different hash when any field changes", () => {
    expect(computeCertificateHash(input)).not.toBe(
      computeCertificateHash({ ...input, course_id: "course-ielts" }),
    );
  });

  it("fails verification when the certificate has been tampered with", () => {
    const cert = mintCertificate(input);
    const tampered = { ...cert, course_id: "course-ielts" };
    expect(verifyCertificate(tampered)).toBe(false);
  });

  it("stays valid when issued_at is re-serialized to an equivalent timestamp (DB round-trip)", () => {
    const cert = mintCertificate(input); // issued_at "...000Z"
    const roundTripped = { ...cert, issued_at: "2026-07-01T10:00:00+00:00" }; // same instant, Postgres format
    expect(verifyCertificate(roundTripped)).toBe(true);
  });
});
