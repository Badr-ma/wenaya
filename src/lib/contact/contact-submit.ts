/**
 * Contact submission writer — normalizes caller payloads into the backend
 * contract, forwards to the DEV contact API through the server config, and maps
 * every outcome to a narrow result union the BFF route can translate into an
 * HTTP response.
 *
 * THREE upstream contracts, selected server-side by the caller's `source`:
 *
 *   1. DEFAULT — `POST /api/v1/contact-us`. Legacy contract: `fullname`,
 *      `email`, and a `message` carrying the user's text plus echoed context
 *      lines. Success requires 2xx AND `{error:false}` — the verified
 *      contact-us envelope. Used by the contact page (generic, booking,
 *      `?subject=recrutement`) and the group-session request flow.
 *
 *   2. CORPORATE — `POST /api/v1/sendBusinessEmail` (see
 *      {@link CORPORATE_BUSINESS_EMAIL_API_PATH}). Confirmed contract with
 *      dedicated `businessName` / `companySize` / `interestedLevel` fields,
 *      selected when the browser sends `source: "corporate-quote"`. Nothing is
 *      stuffed into `message` — it carries only the visitor's own description.
 *      Success is ANY 2xx: the legacy wrapper returned the parsed body and its
 *      call site treated a non-throwing call as success, and this endpoint's
 *      envelope was never observed server-side, so demanding `error:false`
 *      here could report an ACCEPTED lead as a failure (forcing the visitor to
 *      resubmit and losing the lead).
 *
 *   3. RECRUITMENT — `POST /api/v1/sendProEmail` (see
 *      {@link PRO_EMAIL_API_PATH}), selected when the browser sends
 *      `source: "practitioner-recruitment"` (the Clinic "Join the team" modal).
 *      Dedicated `firstName` / `lastName` / `email` / `phone` / `specialty`
 *      fields, so nothing is stuffed into `message` either. The recovered
 *      wrapper posted exactly this six-key body and its call site treated a
 *      non-throwing call as success, so success is ANY 2xx here too — same
 *      reasoning as the corporate branch, and the same reason the verified
 *      `contact-us` `{error:false}` envelope check must NOT be reused.
 *
 * Deliberately framework-free (no `next/server`, no Request/Response): this
 * module runs unchanged under a plain Node harness during QA.
 *
 * Result contract (used by `src/app/api/contact/route.ts`):
 *   - success           upstream 2xx (plus the envelope check on contact-us)
 *   - validation-error  caller payload failed normalization OR upstream 400/422
 *   - backend-error     upstream non-2xx / non-400 / non-422
 *   - timeout           fetch aborted by the AbortController timer
 *   - network-error     fetch threw without aborting
 */
import { applyReseedCookies } from "../patient-auth/cookies";
import { seedPatientCsrf } from "../patient-auth/transport";
import {
  getContactApiBase,
  CONTACT_API_PATH,
  CONTACT_TIMEOUT_MS,
  CORPORATE_BUSINESS_EMAIL_API_PATH,
  CORPORATE_CONTACT_SOURCE,
  CORPORATE_BUSINESS_EMAIL_SOURCE,
  PRO_EMAIL_API_PATH,
  RECRUITMENT_CONTACT_SOURCE,
} from "./config";

export type ContactSubmitResult =
  | { kind: "success" }
  | { kind: "validation-error"; fields?: Record<string, string> }
  | { kind: "backend-error" }
  | { kind: "timeout" }
  | { kind: "network-error" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** One `Label: value` context line, or null when the value is absent. */
function contextLine(label: string, value: unknown): string | null {
  const v = toTrimmedString(value);
  return v ? `${label}: ${v}` : null;
}

/**
 * Assembles the backend `message` from the user's own text plus any submitted
 * context (source/company/phone/bookingCategory/teamSize/programmeLevel/
 * service/type/subject/journey). Context lines are lower-precision but let
 * flows without a user-editable message (booking) still satisfy Laravel's
 * presence-only `message` rule. Values are echoed only, never invented, and
 * non-string fields are dropped.
 *
 * Scoped to the DEFAULT `contact-us` contract only. The corporate and
 * recruitment writers each own a dedicated endpoint with a real `message`
 * field, so they never reach this function — the previously echoed `specialty`
 * context line was therefore only ever fed by the recruitment modal, and was
 * dropped when that flow got its own writer.
 */
function assembleMessage(input: Record<string, unknown>): string {
  const userText = toTrimmedString(input.message);
  const lines = [
    contextLine("Source", input.source),
    contextLine("Company", input.companyName),
    contextLine("Phone", input.phone),
    contextLine("Booking category", input.bookingCategory),
    contextLine("Team size", input.teamSize),
    contextLine("Programme level", input.programmeLevel),
    contextLine("Service", input.service),
    contextLine("Type", input.type),
    contextLine("Subject", input.subject),
    contextLine("Journey", input.journey),
  ].filter((line): line is string => line !== null);

  const parts: string[] = [];
  if (userText) parts.push(userText);
  if (lines.length > 0) {
    if (userText) parts.push("---");
    parts.push(lines.join("\n"));
  }
  return parts.join("\n\n").trim();
}

type Normalized<T> =
  | { ok: true; payload: T }
  | { ok: false; fields: Record<string, string> };

type LegacyContactPayload = { fullname: string; email: string; message: string };

function normalizePayload(input: unknown): Normalized<LegacyContactPayload> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { ok: false, fields: { form: "Expected a JSON object payload." } };
  }
  const record = input as Record<string, unknown>;
  const rawFirstName = toTrimmedString(record.firstName);
  const rawLastName = toTrimmedString(record.lastName);
  const fullname = [rawFirstName, rawLastName].filter(Boolean).join(" ").trim();
  const email = toTrimmedString(record.email);
  const message = assembleMessage(record);

  const fields: Record<string, string> = {};
  if (!fullname) fields.fullname = "required";
  if (!email) fields.email = "required";
  else if (!EMAIL_RE.test(email)) fields.email = "invalid";
  if (!message) fields.message = "required";
  return Object.keys(fields).length > 0 ? { ok: false, fields } : { ok: true, payload: { fullname, email, message } };
}

/* -------------------------------------------------------------------------- *
 * Corporate quote form → `/api/v1/sendBusinessEmail`
 * -------------------------------------------------------------------------- */

/**
 * Exact body of the confirmed sendBusinessEmail contract. Nine keys, no more.
 * The backend requires `firstName`, `lastName`, `email`, `businessName` and
 * `companySize`; `phone`, `interestedLevel` and `message` are optional.
 * Absent optional inputs are sent as `""` — precisely what the legacy FormData
 * produced — never `null`, never omitted, never stuffed with context.
 */
interface CorporateBusinessEmailPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  companySize: string;
  interestedLevel: string;
  message: string;
  source: typeof CORPORATE_BUSINESS_EMAIL_SOURCE;
}

/** Enum values the corporate endpoint accepts (read off the deployed form). */
const CORPORATE_COMPANY_SIZE_VALUES = ["<50", "50-250", "250-1000", "1000+"] as const;
const CORPORATE_INTERESTED_LEVEL_VALUES = [
  "undecided",
  "decouverte",
  "programme-annuel",
  "transformation",
] as const;

/**
 * Select value → API value translations. Only the four values that actually
 * differ are listed; `50-250`, `250-1000`, `undecided` and `transformation` are
 * identical on both sides and pass through untouched.
 */
const CORPORATE_ENUM_TRANSLATIONS: Record<string, string> = {
  "less-than-50": "<50",
  "1000-plus": "1000+",
  discovery: "decouverte",
  "annual-programme": "programme-annuel",
};

/** Applies the translation table, then rejects anything outside `allowed`. */
function translateCorporateEnum(raw: string, allowed: readonly string[]): string | null {
  const mapped = CORPORATE_ENUM_TRANSLATIONS[raw] ?? raw;
  return allowed.includes(mapped) ? mapped : null;
}

/**
 * Maps the Corporate form's browser payload onto the corporate contract. Field
 * renames live here (server-side) so the form keeps posting its existing payload
 * to the same-origin BFF and its markup/i18n stay untouched.
 */
function normalizeCorporatePayload(input: unknown): Normalized<CorporateBusinessEmailPayload> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { ok: false, fields: { form: "Expected a JSON object payload." } };
  }
  const record = input as Record<string, unknown>;
  const firstName = toTrimmedString(record.firstName);
  const lastName = toTrimmedString(record.lastName);
  const email = toTrimmedString(record.email);
  const businessName = toTrimmedString(record.companyName);
  const rawCompanySize = toTrimmedString(record.teamSize);
  const rawInterestedLevel = toTrimmedString(record.programmeLevel);
  const phone = toTrimmedString(record.phone);
  const message = toTrimmedString(record.message);

  const fields: Record<string, string> = {};
  let companySize = "";
  let interestedLevel = "";

  if (!firstName) fields.firstName = "required";
  if (!lastName) fields.lastName = "required";
  if (!email) fields.email = "required";
  else if (!EMAIL_RE.test(email)) fields.email = "invalid";
  if (!businessName) fields.businessName = "required";
  if (!rawCompanySize) {
    fields.companySize = "required";
  } else {
    const translated = translateCorporateEnum(rawCompanySize, CORPORATE_COMPANY_SIZE_VALUES);
    if (translated === null) fields.companySize = "invalid";
    else companySize = translated;
  }
  // An unanswered optional question stays empty; a non-empty unrecognized value
  // is rejected here instead of being forwarded to an endpoint that would 400.
  if (rawInterestedLevel) {
    const translated = translateCorporateEnum(rawInterestedLevel, CORPORATE_INTERESTED_LEVEL_VALUES);
    if (translated === null) fields.interestedLevel = "invalid";
    else interestedLevel = translated;
  }

  if (Object.keys(fields).length > 0) return { ok: false, fields };
  return {
    ok: true,
    payload: {
      firstName,
      lastName,
      email,
      phone,
      businessName,
      companySize,
      interestedLevel,
      message,
      source: CORPORATE_BUSINESS_EMAIL_SOURCE,
    },
  };
}

/* -------------------------------------------------------------------------- *
 * Practitioner recruitment ("Join the team") → `/api/v1/sendProEmail`
 * -------------------------------------------------------------------------- */

/**
 * Exact body of the recovered sendProEmail contract. SIX keys, no more and no
 * fewer — recovered from the deployed legacy wrapper, which built the object
 * literally from these six FormData fields.
 *
 * The backend requires `firstName`, `lastName`, `email`, `phone` and
 * `specialty`; `message` is optional. An unanswered optional message is sent as
 * `""` (never `null`, never omitted) so the field is always a string, matching
 * the legacy FormData behaviour. There is deliberately NO `source` member: the
 * browser's `source` exists only to route this branch and is stripped here.
 */
interface ProEmailPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  message: string;
}

/**
 * Maps the recruitment modal's browser payload onto the sendProEmail contract.
 *
 * The modal already sends the six fields under exactly these names and already
 * enforces presence + email format client-side, so this is a validating mirror
 * rather than a renaming layer: it re-checks server-side (the BFF hop is
 * public, so client validation cannot be trusted) and trims before forwarding.
 * Nothing is invented — no `fullname`, no context-stuffing, no extra fields.
 */
function normalizeRecruitmentPayload(input: unknown): Normalized<ProEmailPayload> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { ok: false, fields: { form: "Expected a JSON object payload." } };
  }
  const record = input as Record<string, unknown>;
  const firstName = toTrimmedString(record.firstName);
  const lastName = toTrimmedString(record.lastName);
  const email = toTrimmedString(record.email);
  const phone = toTrimmedString(record.phone);
  const specialty = toTrimmedString(record.specialty);
  // Optional, but always forwarded as a string — `""` when left blank.
  const message = toTrimmedString(record.message);

  const fields: Record<string, string> = {};
  if (!firstName) fields.firstName = "required";
  if (!lastName) fields.lastName = "required";
  if (!email) fields.email = "required";
  else if (!EMAIL_RE.test(email)) fields.email = "invalid";
  if (!phone) fields.phone = "required";
  if (!specialty) fields.specialty = "required";

  if (Object.keys(fields).length > 0) return { ok: false, fields };
  return { ok: true, payload: { firstName, lastName, email, phone, specialty, message } };
}

/** Flattens a Laravel validation envelope (`message: {field: [...]}`). */
function extractValidationFields(body: unknown): Record<string, string> | undefined {
  if (!body || typeof body !== "object" || !("message" in body)) return undefined;
  const msg = (body as { message: unknown }).message;
  if (typeof msg !== "object" || msg === null || Array.isArray(msg)) return undefined;
  const fields: Record<string, string> = {};
  for (const [key, value] of Object.entries(msg)) {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
      fields[key] = value[0];
    } else if (typeof value === "string") {
      fields[key] = value;
    }
  }
  return Object.keys(fields).length > 0 ? fields : undefined;
}

/** Reads a response body without ever throwing on malformed JSON. */
async function readJsonBody(res: Response): Promise<unknown> {
  return res.json().catch(() => null);
}

async function forward(payload: LegacyContactPayload): Promise<ContactSubmitResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CONTACT_TIMEOUT_MS);
  try {
    const res = await fetch(`${getContactApiBase()}${CONTACT_API_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        company: "1",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) {
      if (res.status === 400 || res.status === 422) {
        const fields = extractValidationFields(await readJsonBody(res));
        return fields ? { kind: "validation-error", fields } : { kind: "validation-error" };
      }
      return { kind: "backend-error" };
    }
    const body = await readJsonBody(res);
    if (body && typeof body === "object" && "error" in body && (body as { error: unknown }).error === false) {
      return { kind: "success" };
    }
    return { kind: "backend-error" };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return { kind: "timeout" };
    return { kind: "network-error" };
  } finally {
    clearTimeout(timer);
  }
}

/** Sanctum session state for one upstream CSRF-protected POST. */
interface UpstreamCsrfState {
  cookieHeader?: string;
  xsrfToken: string | null;
}

interface UpstreamAttempt {
  status: number;
  aborted: boolean;
  networkError: boolean;
  /** Parsed body, read only for 400/422 so success stays body-independent. */
  validationBody?: unknown;
}

/**
 * Seeds a Sanctum CSRF cookie pair for a CSRF-protected upstream POST
 * (currently the corporate and recruitment writers).
 *
 * Deliberately seeded with NO inbound cookie jar: these are anonymous B2B /
 * recruiting leads, so they must never ride on — or forward — a visitor's
 * `we_session` patient cookie. Reuses the same `sanctum/csrf-cookie` seed the
 * patient routes use (`src/lib/patient-auth`), so there is a single
 * implementation of the CSRF handshake rather than a second copy that could
 * drift — which is precisely why this is shared by every protected branch
 * instead of being re-implemented per endpoint.
 */
async function seedUpstreamCsrf(): Promise<UpstreamCsrfState> {
  const seed = await seedPatientCsrf(undefined);
  return applyReseedCookies(undefined, seed.setCookies);
}

/** One upstream POST attempt, carrying whatever CSRF state we currently hold. */
async function postUpstreamEmail<T>(
  path: string,
  payload: T,
  csrf: UpstreamCsrfState,
): Promise<UpstreamAttempt> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CONTACT_TIMEOUT_MS);
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      // The deployed axios instance injected this header on every call; keep it
      // so the backend resolves company 1 exactly as it did in production.
      company: "1",
    };
    if (csrf.cookieHeader) headers.Cookie = csrf.cookieHeader;
    if (csrf.xsrfToken) headers["X-XSRF-TOKEN"] = csrf.xsrfToken;
    const res = await fetch(`${getContactApiBase()}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: controller.signal,
    });
    // Any 2xx is success, so the body is only worth parsing when Laravel is
    // rejecting the payload — reading it unconditionally would add a decode
    // to the happy path for no gain.
    const isValidation = res.status === 400 || res.status === 422;
    const validationBody = isValidation ? await readJsonBody(res) : undefined;
    return { status: res.status, aborted: false, networkError: false, validationBody };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return { status: 0, aborted: true, networkError: false };
    return { status: 0, aborted: false, networkError: true };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Shared write path for the CSRF-protected endpoints (corporate + recruitment).
 *
 * Seeds CSRF up front so the happy path costs only 2 upstream requests (GET
 * seed → POST) instead of burning a 419, and mirrors the documented "reseed
 * once, retry once" rule. Worst case is 4 requests: GET seed → POST → on 419
 * GET reseed → POST retry. ANY 2xx is success — see the module header for why
 * the `contact-us` `{error:false}` envelope check must not be reused here.
 */
async function forwardCsrfProtected<T>(path: string, payload: T): Promise<ContactSubmitResult> {
  let csrf = await seedUpstreamCsrf();
  let attempt = await postUpstreamEmail(path, payload, csrf);
  if (attempt.status === 419) {
    csrf = await seedUpstreamCsrf();
    attempt = await postUpstreamEmail(path, payload, csrf);
  }
  if (attempt.aborted) return { kind: "timeout" };
  if (attempt.networkError) return { kind: "network-error" };
  // Deliberately checked before the 400/422 branch: ANY 2xx is success, and
  // these endpoints' success bodies are not the `{error:false}` shape the
  // legacy `/contact-us` route returns.
  if (attempt.status >= 200 && attempt.status < 300) return { kind: "success" };
  if (attempt.status === 400 || attempt.status === 422) {
    const fields = extractValidationFields(attempt.validationBody);
    return fields ? { kind: "validation-error", fields } : { kind: "validation-error" };
  }
  return { kind: "backend-error" };
}

/** Forwards the corporate quote to `/api/v1/sendBusinessEmail`. */
function forwardCorporate(payload: CorporateBusinessEmailPayload): Promise<ContactSubmitResult> {
  return forwardCsrfProtected(CORPORATE_BUSINESS_EMAIL_API_PATH, payload);
}

/** Forwards the practitioner application to `/api/v1/sendProEmail`. */
function forwardRecruitment(payload: ProEmailPayload): Promise<ContactSubmitResult> {
  return forwardCsrfProtected(PRO_EMAIL_API_PATH, payload);
}

/** True only for the Corporate quote form; every other flow keeps contact-us. */
function isCorporateSubmission(input: unknown): boolean {
  return (
    typeof input === "object" &&
    input !== null &&
    !Array.isArray(input) &&
    (input as Record<string, unknown>).source === CORPORATE_CONTACT_SOURCE
  );
}

/**
 * True only for the Clinic "Join the team" modal (`RecruitmentModal`).
 *
 * Matches `RECRUITMENT_CONTACT_SOURCE` exactly, which is what keeps the contact
 * page's separate `"recrutement"` message flow (`?subject=recrutement`, no
 * `specialty` field) on the DEFAULT `contact-us` contract. A visitor who
 * hand-crafts `?source=practitioner-recruitment` on that page simply fails
 * validation below for the missing `specialty` — a 400, not a bad write.
 */
function isRecruitmentSubmission(input: unknown): boolean {
  return (
    typeof input === "object" &&
    input !== null &&
    !Array.isArray(input) &&
    (input as Record<string, unknown>).source === RECRUITMENT_CONTACT_SOURCE
  );
}

/** Normalize + forward a parsed contact submission. */
export async function submitContact(input: unknown): Promise<ContactSubmitResult> {
  if (isCorporateSubmission(input)) {
    const normalized = normalizeCorporatePayload(input);
    if (!normalized.ok) return { kind: "validation-error", fields: normalized.fields };
    return forwardCorporate(normalized.payload);
  }
  if (isRecruitmentSubmission(input)) {
    const normalized = normalizeRecruitmentPayload(input);
    if (!normalized.ok) return { kind: "validation-error", fields: normalized.fields };
    return forwardRecruitment(normalized.payload);
  }
  const normalized = normalizePayload(input);
  if (!normalized.ok) return { kind: "validation-error", fields: normalized.fields };
  return forward(normalized.payload);
}