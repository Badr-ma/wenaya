/**
 * Patient-auth client helpers.
 *
 * Typed wrappers over the SAME-ORIGIN BFF routes (`/api/auth/*`) only — no
 * backend URL, no token, no session logic, no localStorage persistence lives
 * here. The browser's Sanctum cookies (set through `/api/auth/csrf`) travel
 * with each request via `credentials: "same-origin"`.
 *
 * The server guards the state-changing routes (`PATIENT_AUTH_ENABLED`,
 * `PATIENT_REGISTER_ENABLED`); while a flag is off the route answers
 * `{ type: "not-enabled" }` and no session/account change happens.
 */

export interface PatientUser {
  id?: string | number;
  name?: string;
  email?: string;
}

export type PatientAuthSuccess = { success: true; type: "success"; user?: PatientUser };

export type PatientAuthFailure =
  | { success: false; type: "validation-error"; fields?: Record<string, string> }
  | { success: false; type: "unauthenticated" }
  | { success: false; type: "csrf-error" }
  | { success: false; type: "backend-error" }
  | { success: false; type: "timeout" }
  | { success: false; type: "not-enabled" }
  | { success: false; type: "invalid-payload" };

export type PatientAuthResult = PatientAuthSuccess | PatientAuthFailure;

/** Result of the full read-only profile seam (`/api/account/profile`). */
export type PatientProfileResult =
  | { success: true; type: "success"; profile: import("@/lib/patient-auth/profile").PatientProfile }
  | PatientAuthFailure;

/** Parse the normalized BFF envelope; network failures surface as backend-error. */
async function patientFetch<T = PatientAuthResult>(path: string, init: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, { credentials: "same-origin", ...init });
  } catch {
    return { success: false, type: "backend-error" } as T;
  }
  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return { success: false, type: "backend-error" } as T;
  }
  if (!json || typeof json !== "object") {
    return { success: false, type: "backend-error" } as T;
  }
  return json as T;
}

/** Seed the Sanctum session cookie(s) for the current visitor. */
export async function seedPatientCsrf(): Promise<PatientAuthResult> {
  return patientFetch("/api/auth/csrf", { method: "GET" });
}

/** Resolve the current patient session; anonymous visitors get `unauthenticated`. */
export async function getCurrentPatient(): Promise<PatientAuthResult> {
  return patientFetch("/api/auth/me", { method: "GET" });
}

/** Resolve the full read-only PatientProfile via `/api/account/profile`
 *  (the real seam — Laravel getCustomerInformations through the BFF).
 *  Anonymous visitors get the same normalized 401 `unauthenticated`. */
export async function getPatientProfile(): Promise<PatientProfileResult> {
  return patientFetch<PatientProfileResult>("/api/account/profile", { method: "GET" });
}

/** Start a patient session. Server is guarded — false until `PATIENT_AUTH_ENABLED`. */
export async function loginPatient(email: string, password: string): Promise<PatientAuthResult> {
  return patientFetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Create a patient account. Server is guarded — inactive until
 * `PATIENT_REGISTER_ENABLED`. The BFF injects `role: "patient"` and applies the
 * probe-verified defaults for missing countryCode/timezone/currency; on success
 * Laravel auto-authenticates and the caller resolves the session via
 * `getCurrentPatient()`.
 */
export async function registerPatient(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}): Promise<PatientAuthResult> {
  return patientFetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

/** End the patient session. Server is guarded until `PATIENT_AUTH_ENABLED`. */
export async function logoutPatient(): Promise<PatientAuthResult> {
  return patientFetch("/api/auth/logout", { method: "POST" });
}