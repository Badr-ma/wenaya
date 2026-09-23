/**
 * Normalized patient profile (read-only V1).
 *
 * SERVER + CLIENT-SAFE value type. The BFF route (`/api/account/profile`) maps
 * the upstream Laravel envelope into this shape and is the ONLY place that ever
 * sees the raw transport payload. Everything downstream renders ONLY these
 * keys; every renderer MUST `?? ""`-fallback (the model itself uses `?? ""`
 * defaults so a card/grid never sees `null`/`undefined`).
 *
 * Shape derived from the byte-verified DEV upstream probe:
 * `wenaya-patient-profile-dev-shape.md` (2026-09-19) — flat 17-key envelope
 * (`id, first_name, last_name, avatar, email, wallet, country_code, phone,
 * gender, birth_date, created_at, legal_guardian_id, has_legal_guardian,
 * formattedCreatedAt, addresses, destinations, legal_guardians`).
 *
 * NEVER forwarded (stripped at the BFF boundary):
 *   - `wallet`            — financial data
 *   - `legal_guardian_id` — internal FK
 *   - `addresses` / `destinations` / `legal_guardians` — raw arrays (item shape
 *     not yet observed; a future V2 may add a dedicated, normalized model)
 *   - any raw upstream field name; `formattedCreatedAt` is already localized
 *     upstream — reuse it verbatim, never reformat.
 */
export interface PatientProfile {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
  email: string;
  countryCode: string;
  phone: string;
  gender: string;
  birthDate: string;
  createdAt: string;
  formattedCreatedAt: string;
  hasLegalGuardian: boolean;
  /** Display-only city/address (empty string when upstream provides none). */
  city: string;
}

/* Upstream snake_case keys — intentionally DUCK-typed, never imported from any
 * "use client" module. */
interface UpstreamProfileEnvelope {
  id?: number | null;
  first_name?: string | null;
  last_name?: string | null;
  avatar?: string | null;
  email?: string | null;
  country_code?: string | null;
  phone?: string | null;
  gender?: string | null;
  birth_date?: string | null;
  created_at?: string | null;
  formattedCreatedAt?: string | null;
  has_legal_guardian?: boolean | null;
}

/** Best-effort string fallback (PII-safe empty string, never `null`/`undefined`). */
const str = (v: string | null | undefined): string => v ?? "";

/**
 * Normalize the flat upstream envelope into the read-only `PatientProfile`.
 * Every optional/nullable key falls back to `""`/`false`; `fullName` is
 * derived as `[firstName, lastName].filter(Boolean).join(" ")` when the
 * upstream doesn't provide a combined name. No upstream field name, wallet,
 * FK or raw array ever survives this boundary.
 */
export function normalizePatientProfile(
  envelope: UpstreamProfileEnvelope | null | undefined,
): PatientProfile {
  const first = str(envelope?.first_name);
  const last = str(envelope?.last_name);
  const full = [first, last].filter(Boolean).join(" ");

  return {
    id: envelope?.id ?? 0,
    firstName: first,
    lastName: last,
    fullName: full,
    avatar: str(envelope?.avatar),
    email: str(envelope?.email),
    countryCode: str(envelope?.country_code),
    phone: str(envelope?.phone),
    gender: str(envelope?.gender),
    birthDate: str(envelope?.birth_date),
    createdAt: str(envelope?.created_at),
    formattedCreatedAt: str(envelope?.formattedCreatedAt),
    hasLegalGuardian: envelope?.has_legal_guardian ?? false,
    city: "",
  };
}
