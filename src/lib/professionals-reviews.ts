/**
 * Professional reviews adapter — defensive normalization of backend review
 * items into the frontend `SpecialistReview` shape, plus the single fetch seam
 * used by the detail resolver.
 *
 * Decoding rules (see `wenaya-professionals-reviews-report.md`, §4):
 *   - id      <- `id` || `review_id` ?? positional fallback
 *   - name    <- `user.name` || `patient.name` || `client.name` || `name`;
 *                missing or email-like values -> neutral `FALLBACK_REVIEWER_NAME`
 *                (no PII, no invented identities)
 *   - rating  <- `rate` ?? `rating` ?? `note`, coerced to an integer clamped
 *                1..5 (out-of-range numerics are clamped, e.g. 0→1, 9→5);
 *                non-numeric ratings drop the item
 *   - date    <- `created_at` || `date`, normalized to YYYY-MM-DD (else "")
 *   - text    <- `comment` || `message` || `text` || `content`, trimmed;
 *                empty comments are dropped; never rendered as HTML
 *   - specialty <- `specialty` || `practice`, trimmed
 *   - verified <- `verified` ?? `is_verified`, boolean-coerced
 *   Empty-string fields fall through to the next candidate (`||` semantics),
 *   so a blank `specialty` can still resolve to `practice`.
 *
 * Missing/malformed fields are dropped or defaulted rather than fabricated.
 */

import type { SpecialistReview } from "./specialistes";
import {
  fetchProfessionalReviewsApi,
  type ApiReviewItem,
} from "./professionals-reviews-api";

/** Neutral, non-PII display label for reviewers without a usable name. */
export const FALLBACK_REVIEWER_NAME = "Patient Wenaya";

function str(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function nestedName(owner: unknown): string {
  if (!owner || typeof owner !== "object") return "";
  const name = (owner as Record<string, unknown>).name;
  return str(name);
}

function coerceRating(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const clamped = Math.round(Math.min(5, Math.max(1, n)));
  return clamped;
}

function coerceBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === "1" || value === "true";
}

/** Normalize any backend date to YYYY-MM-DD ("" when unparseable). */
function normalizeDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value !== "string" && typeof value !== "number") return "";
  const s = String(value).trim();
  if (!s) return "";
  // "YYYY-MM-DD..." (take the date part)
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  // "DD/MM/YYYY" or "DD-MM-YYYY"
  const eu = /^(\d{2})[/-](\d{2})[/-](\d{4})/.exec(s);
  if (eu) return `${eu[3]}-${eu[2]}-${eu[1]}`;
  const parsed = Date.parse(s);
  if (!Number.isNaN(parsed)) return new Date(parsed).toISOString().slice(0, 10);
  return "";
}

/** Defensive decode of one raw review item; null when not a valid review. */
export function toSpecialistReview(
  raw: ApiReviewItem,
  index: number,
): SpecialistReview | null {
  const rating = coerceRating(raw.rate ?? raw.rating ?? raw.note);
  if (rating === null) return null;

  const text = str(raw.comment || raw.message || raw.text || raw.content);
  if (!text) return null;

  let name =
    nestedName(raw.user) ||
    nestedName(raw.patient) ||
    nestedName(raw.client) ||
    str(raw.name);
  if (!name || /@/.test(name)) name = FALLBACK_REVIEWER_NAME;

  return {
    id: str(raw.id || raw.review_id) || `review-${index + 1}`,
    name,
    rating,
    date: normalizeDate(raw.created_at || raw.date || raw.createdAt),
    text,
    specialty: str(raw.specialty || raw.practice),
    verified: coerceBoolean(raw.verified ?? raw.is_verified),
  };
}

/**
 * Normalize a raw page of review items into `SpecialistReview[]`, dropping
 * malformed (invalid rating) and empty-comment entries. Order is preserved.
 */
export function toProfessionalReviews(items: ApiReviewItem[]): SpecialistReview[] {
  const reviews: SpecialistReview[] = [];
  items.forEach((item, index) => {
    const review = toSpecialistReview(item, index);
    if (review) reviews.push(review);
  });
  return reviews;
}

/**
 * Fetch + normalize reviews for a professional by slug/username.
 * Throws on transport/validation failure so the caller decides fallback
 * semantics (legacy local reviews vs authoritative empty set). A valid
 * success envelope with zero reviews returns `[]`.
 */
export async function fetchProfessionalReviews(
  userName: string,
): Promise<SpecialistReview[]> {
  const { items } = await fetchProfessionalReviewsApi(userName);
  return toProfessionalReviews(items);
}