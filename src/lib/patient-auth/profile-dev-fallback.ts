/**
 * DEV-ONLY mock PatientProfile — FRONTEND VISUAL DEVELOPMENT FALLBACK.
 *
 * ⚠️ THIS MODULE MUST NEVER REACH PRODUCTION ⚠️
 *
 * The real patient-data path is `GET /api/account/profile` → Laravel
 * `getCustomerInformations`, which today answers `unauthenticated` because the
 * DEV upstream session semantics are blocked (see wenaya-patient-account-v1-report.md).
 * This module exists ONLY so the account UI can be built and visually QA'd
 * against a deterministic, obviously-synthetic identity while that blocker is
 * live. It is:
 *
 *   - never imported by any production-only code path;
 *   - activated ONLY when `PROFILE_DEV_FALLBACK=true` AND `NODE_ENV !== "production"`
 *     (the page's compile-time gate, mirrored by DEV_PROFILE_FALLBACK below);
 *   - never persisted, never sent to any backend, never treated as a real patient;
 *   - isolated from the real seam: `CompteClient` always resolves
 *     `/api/account/profile` FIRST and only falls back when the BFF answers
 *     `unauthenticated` *and* the dev fallback is armed.
 *
 * The identity is a neutral QA value (Badr Patient, sample@wenaya.com) — it must
 * not be mistaken for a real patient and must be rotated/replaced when the
 * upstream session is fixed.
 */

import type { PatientProfile } from "./profile";

/** Belt-and-suspenders compile-time arm switch for the dev fallback.
 *  Inlined at build time; read-only in both prod & dev builds. */
export const PROFILE_DEV_FALLBACK_ENABLED: boolean =
  process.env.NODE_ENV !== "production" && process.env.PROFILE_DEV_FALLBACK === "true";

/** The dev fallback is a QA/demo-only artifact. Persisting or relaying it is a bug. */
export const PROFILE_DEV_FALLBACK_SOURCE = "dev-fallback";

/**
 * Synthetic, read-only PatientProfile used to render the ACCOUNT UI in dev when
 * the real authenticated seam is unavailable. `avatar` is intentionally null
 * (the UI renders initials instead). Each field is the exact view-model shape
 * consumed by CompteClient — nothing extra, nothing upstream.
 */
export function getDevFallbackProfile(): PatientProfile {
  const profile: PatientProfile = {
    id: 0,
    firstName: "Badr",
    lastName: "Patient",
    fullName: "Badr Patient",
    avatar: "",
    email: "sample@wenaya.com",
    countryCode: "MA",
    phone: "+212 6 00 00 00 00",
    gender: "Homme",
    birthDate: "1998-01-01",
    createdAt: "2026-09-20",
    formattedCreatedAt: "20 septembre 2026",
    hasLegalGuardian: false,
    city: "Casablanca",
  };
  return profile;
}