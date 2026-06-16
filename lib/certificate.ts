import { createHash } from "node:crypto";
import type { Certificate } from "./types";

type CertificateFields = Omit<Certificate, "hash">;

/**
 * Deterministic SHA-256 over the certificate's identity fields (SPEC §11). No blockchain.
 * `issued_at` is intentionally excluded: it is metadata, and timestamp columns get reformatted
 * on a database round-trip (e.g. `Z` -> `+00:00`), which would otherwise break verification.
 * The `id` is unique per mint, so identity is preserved.
 */
export function computeCertificateHash(fields: CertificateFields): string {
  const payload = `${fields.id}|${fields.profile_id}|${fields.course_id}`;
  return createHash("sha256").update(payload).digest("hex");
}

/** Creates a certificate record with its verification hash. */
export function mintCertificate(fields: CertificateFields): Certificate {
  return { ...fields, hash: computeCertificateHash(fields) };
}

/** Recomputes the hash and compares — detects any tampering with the record. */
export function verifyCertificate(cert: Certificate): boolean {
  const { hash, ...fields } = cert;
  return computeCertificateHash(fields) === hash;
}
