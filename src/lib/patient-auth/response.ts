/**
 * Normalized BFF ↔ client response contract for patient authentication.
 *
 * SERVER-ONLY module. `buildResponse` is pure (no `next/server` import) so the
 * mapping can be unit-tested against stub upstream responses directly.
 *
 * The BFF never forwards raw Laravel output: no stacks, no upstream URLs, no
 * backend messages/errors. Only the normalized `type` contract below reaches the
 * browser. Response bodies sent to the client contain at most non-sensitive
 * structural data plus the minimal user subset listed in `extractMinimalUser`.
 */

export type PatientAuthType =
  | "success"
  | "validation-error"
  | "unauthenticated"
  | "csrf-error"
  | "backend-error"
  | "timeout"
  | "not-enabled"
  | "invalid-payload";

export interface PatientAuthResponseBody {
  success: boolean;
  type: PatientAuthType;
  user?: { id?: string | number; name?: string; email?: string };
  fields?: Record<string, string>;
}

export interface BuiltResponse {
  status: number;
  body: PatientAuthResponseBody;
}

/** Raw upstream outcome handed to the mapper by the transport layer. */
export interface UpstreamOutcome {
  /** Non-null only when the upstream answered with an HTTP status. */
  status: number | null;
  /** Parsed upstream JSON body, when any (content is TYPED below, never emitted raw). */
  json: { data?: unknown; errors?: unknown; message?: unknown } | null;
  aborted: boolean;
  networkError: boolean;
}

/**
 * Extract the minimal stable user subset the current frontend needs (id, name,
 * email). Only fields actually carried by the upstream payload are copied; nothing
 * is invented and no broader PII (address, phone, medical data) is included.
 * Best-effort shape, documented as provisional until an authenticated DEV session
 * confirms the real `data` fields of `GET /api/v1/customer`.
 */
export function extractMinimalUser(payload: { data?: unknown } | null): PatientAuthResponseBody["user"] {
  const data = payload?.data ?? null;
  if (!data || typeof data !== "object" || Array.isArray(data)) return undefined;
  const src = data as Record<string, unknown>;
  const out: NonNullable<PatientAuthResponseBody["user"]> = {};
  if (src.id !== undefined && src.id !== null && (typeof src.id === "string" || typeof src.id === "number")) {
    out.id = src.id;
  }
  const first = typeof src.first_name === "string" ? src.first_name : undefined;
  const last = typeof src.last_name === "string" ? src.last_name : undefined;
  const name = [first, last].filter(Boolean).join(" ") || (typeof src.name === "string" ? src.name : undefined);
  if (name) out.name = name;
  if (typeof src.email === "string") out.email = src.email;
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Flatten Laravel `errors: { field: [msg, ...] }` into `{ field: firstMsg }`. */
function extractFields(errors: unknown): Record<string, string> | undefined {
  if (!errors || typeof errors !== "object" || Array.isArray(errors)) return undefined;
  const out: Record<string, string> = {};
  for (const [field, raw] of Object.entries(errors as Record<string, unknown>)) {
    const msg = Array.isArray(raw) ? raw[0] : raw;
    if (typeof msg === "string") out[field] = msg;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function success(user?: PatientAuthResponseBody["user"]): BuiltResponse {
  const body: PatientAuthResponseBody = { success: true, type: "success" };
  if (user) body.user = user;
  return { status: 200, body };
}

function failure(status: number, type: PatientAuthType, fields?: Record<string, string>): BuiltResponse {
  const body: PatientAuthResponseBody = { success: false, type };
  if (fields) body.fields = fields;
  return { status, body };
}

/**
 * Map an upstream outcome (GET /api/v1/customer, POST /customer/login|logout)
 * to the normalized contract. 400/422 → validation-error, 401 → unauthenticated,
 * 419 → csrf-error, 2xx → success, anything else → backend-error; timeouts and
 * network failures are resolved by the transport BEFORE reaching this mapper.
 * 2xx responses carrying `error:true` are NOT successes (Laravel fails logins
 * with HTTP 200 + `{error:true,message:...}`) — surfaced as `unauthenticated`.
 */
export function mapPatientOutcome(outcome: UpstreamOutcome): BuiltResponse {
  if (outcome.status === null) {
    return outcome.aborted
      ? failure(504, "timeout")
      : failure(502, "backend-error");
  }
  const status = outcome.status;
  if (status >= 200 && status < 300) {
    if (outcome.json && (outcome.json as { error?: unknown }).error === true) {
      return failure(401, "unauthenticated");
    }
    return success(extractMinimalUser(outcome.json));
  }
  if (status === 400 || status === 422) {
    return failure(status, "validation-error", extractFields(outcome.json?.errors));
  }
  if (status === 401) return failure(401, "unauthenticated");
  if (status === 419) return failure(419, "csrf-error");
  return failure(502, "backend-error");
}

/**
 * Map an upstream outcome of `POST /user/register` to the normalized contract.
 * Unlike login, a 409 from register means the account/email already exists —
 * surfaced as `validation-error` (duplicate handling is UI copy, backend field
 * messages never leak through). Register success auto-authenticates the new
 * patient (proven on DEV), so 2xx returns the minimal user subset the upstream
 * echoed and the client resolves the real session via `/api/auth/me`.
 */
export function mapRegisterOutcome(outcome: UpstreamOutcome): BuiltResponse {
  if (outcome.status === null) {
    return outcome.aborted
      ? failure(504, "timeout")
      : failure(502, "backend-error");
  }
  const status = outcome.status;
  if (status >= 200 && status < 300) {
    if (outcome.json && (outcome.json as { error?: unknown }).error === true) {
      return failure(409, "validation-error", extractFields(outcome.json?.errors));
    }
    return success(extractMinimalUser(outcome.json));
  }
  if (status === 400 || status === 422 || status === 409) {
    return failure(status, "validation-error", extractFields(outcome.json?.errors));
  }
  if (status === 401) return failure(401, "unauthenticated");
  if (status === 419) return failure(419, "csrf-error");
  return failure(502, "backend-error");
}

/** BFF-own guard for the state-changing routes while patient auth is disabled. */
export function notEnabledResponse(): BuiltResponse {
  return failure(403, "not-enabled");
}

/** BFF-own guard for an oversized / unparseable login payload. */
export function invalidPayloadResponse(): BuiltResponse {
  return failure(400, "invalid-payload");
}

/** BFF-own field-level validation-error for the register payload model. */
export function validationErrorResponse(fields: Record<string, string>): BuiltResponse {
  return failure(400, "validation-error", fields);
}