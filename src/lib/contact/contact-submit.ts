/**
 * Contact submission writer — normalizes caller payloads into the backend
 * contract (`fullname`, `email`, `message`), forwards to the DEV contact API
 * through the server config, and maps every outcome to a narrow result union
 * the BFF route can translate into an HTTP response.
 *
 * Deliberately framework-free (no `next/server`, no Request/Response): this
 * module runs unchanged under a plain Node harness during QA.
 *
 * Result contract (used by `src/app/api/contact/route.ts`):
 *   - success           upstream 2xx AND `{error:false}`
 *   - validation-error  caller payload failed normalization OR upstream 400
 *   - backend-error     upstream non-2xx/non-400, or 2xx with `error:true`
 *   - timeout           fetch aborted by the AbortController timer
 *   - network-error     fetch threw without aborting
 */
import { CONTACT_API_BASE, CONTACT_API_PATH, CONTACT_TIMEOUT_MS } from "./config";

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
 * context (source/phone/bookingCategory/teamSize/programmeLevel/specialty/
 * service/type/subject/journey). Context lines are lower-precision but let
 * flows without a user-editable message (corporate quote, recruitment,
 * booking) still satisfy Laravel's presence-only `message` rule. Values are
 * echoed only, never invented, and non-string fields are dropped.
 */
function assembleMessage(input: Record<string, unknown>): string {
  const userText = toTrimmedString(input.message);
  const lines = [
    contextLine("Source", input.source),
    contextLine("Phone", input.phone),
    contextLine("Booking category", input.bookingCategory),
    contextLine("Team size", input.teamSize),
    contextLine("Programme level", input.programmeLevel),
    contextLine("Specialty", input.specialty),
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

type Normalized =
  | { ok: true; payload: { fullname: string; email: string; message: string } }
  | { ok: false; fields: Record<string, string> };

function normalizePayload(input: unknown): Normalized {
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

/** Flattens a Laravel 400 validation envelope (`message: {field: [...]}`). */
async function extractValidationFields(res: Response): Promise<Record<string, string> | undefined> {
  const body: unknown = await res.json().catch(() => null);
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

async function forward(payload: {
  fullname: string;
  email: string;
  message: string;
}): Promise<ContactSubmitResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CONTACT_TIMEOUT_MS);
  try {
    const res = await fetch(`${CONTACT_API_BASE}${CONTACT_API_PATH}`, {
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
      if (res.status === 400) {
        const fields = await extractValidationFields(res);
        return fields ? { kind: "validation-error", fields } : { kind: "validation-error" };
      }
      return { kind: "backend-error" };
    }
    const body: unknown = await res.json().catch(() => null);
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

/** Normalize + forward a parsed contact submission. */
export async function submitContact(input: unknown): Promise<ContactSubmitResult> {
  const normalized = normalizePayload(input);
  if (!normalized.ok) return { kind: "validation-error", fields: normalized.fields };
  return forward(normalized.payload);
}