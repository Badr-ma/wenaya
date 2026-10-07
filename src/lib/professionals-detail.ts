/**
 * Professional detail adapter — maps the live API professional detail
 * (`getProfessionalBySlug/{slug}`) to the frontend `Specialist` interface.
 *
 * Server-side only — consumed by both `[slug]` pages, never by client
 * components.
 *
 * LIVE API ONLY: there is no local/Redis/demo fallback. A slug resolves
 * through the API or not at all (see `getLiveProfessionalBySlug`).
 *
 * Mapping rules (API → Specialist), only confirmed fields:
 *   name          ← first_name + " " + last_name
 *   role/specialty← specialities[].fr_name (FR) or [].en_name (EN)
 *   photo         ← user.avatar (fallback professional.logo)
 *   rating/count  ← professional.avg_rating / total_reviews
 *   bio           ← professional.about_profile (HTML → sanitized paragraphs)
 *   appointment   ← professional.appointment_information (HTML → paragraphs)
 *   address       ← user.address.address_street_1 / lat / long (+ "Casablanca")
 *   Everything the endpoint does NOT carry (services, availability,
 *   certifications, reviews, languages, yearsExperience, parking, hours,
 *   clinicPhotos, approach…) gets safe EMPTY defaults — never invented.
 */

import type {
  Specialist,
  SpecialistPackage,
  SpecialistService,
} from "./specialistes";
import type {
  ApiProfessionalDetail,
  ApiProfessionalDetailUser,
  ApiProfessionalDetailProfessional,
  ApiProfessionalDetailSpeciality,
  ApiCaresAndPacks,
} from "./professionals-detail-api";
import { fetchProfessionalDetail, fetchProfessionalCaresAndPacks } from "./professionals-detail-api";
import { sanitizeSafeHtml, htmlToParagraphs } from "./sanitize-html";
import { fetchProfessionalReviews } from "./professionals-reviews";
import { getProfessionalSpecialtySlugs, specialtyDisplayToSlug } from "./specialist-filters";
import { getAllPratiqueSlugs, getPratiqueBySlug, type Pratique } from "./pratiques";

export { htmlToParagraphs } from "./sanitize-html";

/**
 * Slugs excluded from the public site. Mirrors the listing-side HIDDEN_SLUGS
 * (`professionals.ts`): corporate accounts (no specialty, no avatar, empty
 * profile) are not practitioners and their detail pages render 404.
 */
const HIDDEN_SLUGS = new Set(["introsens-sarl"]);

export type ProfessionalLocale = "fr" | "en";

// ─── Entity decoder + sanitizer moved to ./sanitize-html.ts ───────────────

/** Lenient number coercion for API string|number|null numeric fields. */
function parseNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === "") return 0;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** First non-empty avatar/logo for the profile photo. */
function resolvePhoto(
  user: ApiProfessionalDetailUser,
  professional: ApiProfessionalDetailProfessional
): string {
  return user.avatar || professional.logo || "";
}

/**
 * Backend placeholder strings observed in `about_profile` /
 * `appointment_information` (e.g. `marouane-el-khattab`, `fadhel` return
 * the literal values below). Never rendered as real content — treated as
 * absent so the empty-state sections hide cleanly.
 */
const BIO_PLACEHOLDERS = new Set(["about you", "about you.", "bio", "your bio", "test"]);
const APPOINTMENT_PLACEHOLDERS = new Set([
  "your appointment info is here",
  "appointment info",
  "your appointment information",
]);

/** Returns the raw field when it carries real content, else "" (treats placeholders as empty). */
function stripPlaceholder(raw: string | null, placeholders: Set<string>): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return placeholders.has(trimmed.toLowerCase()) ? "" : raw;
}

/** Locale-aware specialty names (FR `fr_name`, EN `en_name`). */
function specialtyNames(
  specialities: ApiProfessionalDetailSpeciality[],
  locale: ProfessionalLocale
): string[] {
  const names = specialities.map((s) =>
    (locale === "en" ? s.en_name : s.fr_name) || s.fr_name || s.en_name
  );
  return names;
}

/**
 * Map one API professional detail to the frontend Specialist shape.
 * Fields not carried by the endpoint get safe empty defaults so every
 * conditionally-rendered section hides cleanly.
 */
export function toDetailSpecialist(
  detail: ApiProfessionalDetail,
  locale: ProfessionalLocale = "fr"
): Specialist {
  const { user, professional, specialities } = detail;
  const name = `${user.first_name} ${user.last_name}`.trim() || user.username;
  const tags = specialtyNames(specialities, locale);
  const primary = tags[0] ?? "";
  const aboutProfile = stripPlaceholder(professional.about_profile, BIO_PLACEHOLDERS);
  const appointmentInformation = stripPlaceholder(
    professional.appointment_information,
    APPOINTMENT_PLACEHOLDERS
  );
  const bioParagraphs = htmlToParagraphs(aboutProfile);
  const appointmentInfo = htmlToParagraphs(appointmentInformation);
  const bioHtml = sanitizeSafeHtml(aboutProfile);
  const appointmentInfoHtml = sanitizeSafeHtml(appointmentInformation);
  const rating = parseNumber(professional.avg_rating);
  const reviewCount = parseNumber(professional.total_reviews);
  const address = user.address;
  const lat = address?.lat ? parseFloat(address.lat) : Number.NaN;
  const lng = address?.long ? parseFloat(address.long) : Number.NaN;
  const phone = address?.phone ? String(address.phone).trim() : '';

  return {
    slug: professional.slug || user.slug,
    name,
    role: primary,
    roleEn: specialities.map((s) => s.en_name || s.fr_name)[0] || undefined,
    specialty: primary,
    image: resolvePhoto(user, professional),
    rating,
    reviewCount,
    yearsExperience: 0,
    languages: [],
    orderNumber: "",
    bio: bioParagraphs.join("\n\n"),
    bioParagraphs,
    appointmentInfo,
    bioHtml,
    appointmentInfoHtml,
    approach: "",
    specialtyTags: tags,
    phone: phone || undefined,
    // Canonical specialty slugs derived from the LIVE `specialities[]` list
    // (fr_name first, so FR + EN pages agree) via the SAME `specialtyDisplayToSlug`
    // the listing/search filters use — one slug system across the site. Used to
    // resolve a professional's real practices (`getSpecialistPractices`) without
    // any legacy/demo relationship map.
    specialtySlugs: specialities
      .map((s) => specialtyDisplayToSlug(s.fr_name || s.en_name || ""))
      .filter(Boolean),
    certifications: [],
    services: [],
    isApiSourced: true,
    availabilityApi: {
      // Availability endpoints key on user.id (int) and accept the routing
      // slug OR user.username for the unavailable-dates lookup.
      professionalId: user.id,
      userName: user.username || professional.slug || user.slug,
    },
    availability: [],
    location: {
      lat: Number.isFinite(lat) ? lat : 0,
      lng: Number.isFinite(lng) ? lng : 0,
      // Only fall back to "Casablanca" when the endpoint carried a real
      // address or coordinates. Otherwise stay empty so the UI hides the
      // location section cleanly instead of inventing a city (on partial
      // profiles the section must not render around fabricated data).
      city: address?.city || (address?.address_street_1 || (Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)) ? "Casablanca" : ""),
      address: address?.address_street_1 || "",
      parking: "",
      access: "",
    },
    hours: "",
    // Real API gallery images only. Anything that isn't an array of remote
    // image URLs yields an empty gallery — never the old demo Unsplash photos.
    clinicPhotos: resolveGalleryImages(professional.images),
    reviews: [],
  };
}

/** Format a backend price (number or numeric string) as `"<n> MAD"`. */
function formatPrice(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  const num = typeof value === "number" ? value : Number(value);
  return `${Number.isFinite(num) ? num : String(value)} MAD`;
}

/**
 * Map the backend cares+packs payload to the frontend SpecialistService[]
 * used by BookingPanel's service select. Only name/duration/price/type are
 * surfaced — the raw payload also embeds full `professional[]` user objects
 * (email/phone, PII) inside each service and those are NEVER mapped.
 * Services that repeat (same title/duration/price) are de-duplicated; a
 * service without a name is skipped (never fabricated).
 */
function toDetailServices(data: ApiCaresAndPacks): SpecialistService[] {
  const seen = new Map<string, SpecialistService>();
  for (const speciality of data.specialities || []) {
    for (const care of speciality.cares || []) {
      const source =
        (Array.isArray(care.services) && care.services.length > 0
          ? care.services
          : care.prices) || [];
      for (const svc of source) {
        const title = String(svc.name || care.name || "").trim();
        if (!title) continue;
        const duration = svc.duration ? `${svc.duration} min` : "";
        const price = formatPrice(svc.price);
        const delivery = String(svc.type || "").toLowerCase();
        const type: SpecialistService["type"] =
          delivery === "home" || delivery === "domicile" || delivery === "online" || delivery === "video"
            ? "ligne"
            : "presentiel";
        // Delivery mode is part of the identity: the same title/duration/price
        // can exist as distinct variants (live dev payload 2026-09-19: nadine-kita
        // "Séance Psychothérapie Adulte" 45 min 500 MAD appears both as `video`
        // and `practice`). Without the delivery in the key the first variant wins
        // and the other is silently dropped.
        const key = `${title}|${delivery}|${duration}|${price}`;
        if (seen.has(key)) continue;
        seen.set(key, {
          id: String(svc.id),
          title,
          duration,
          price,
          description: "",
          type,
        });
      }
    }
  }
  return [...seen.values()];
}

/** Map the backend `packs[]` to SpecialistPackage[] (name/price/description
 *  only). Empty-name packs are skipped, never synthesized. */
function toDetailPackages(data: ApiCaresAndPacks): SpecialistPackage[] {
  const packages: SpecialistPackage[] = [];
  for (const pack of data.packs || []) {
    const name = String(pack.name || "").trim();
    if (!name) continue;
    packages.push({
      id: String(pack.id),
      name,
      description: String(pack.description || "").trim(),
      price: formatPrice(pack.final_price ?? pack.price),
    });
  }
  return packages;
}

/**
 * Resolve one professional detail page's data.
 *
 * LIVE API ONLY — no local/Redis/demo dataset. A slug resolves exclusively
 * through `getProfessionalBySlug`; anything else (unknown slug, corporate
 * account, or the API being unreachable) yields `undefined` and the page calls
 * `notFound()`. The legacy demo dataset is a non-overlapping slug set and is
 * never served, so a listing card always has a matching profile page.
 *
 * Anything the endpoint does not carry is left at its safe empty default
 * (see `toDetailSpecialist`) — never invented.
 */
/**
 * A usable remote image URL — a real `https?://` source is kept, local
 * placeholders are treated as absent (returning "" so the UI renders empty).
 */
function isRealRemoteImage(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^https?:\/\//.test(value) &&
    !value.includes("dummy")
  );
}

/** Same ISR window as the detail payload itself — cached, never per-render. */
/**
 * Real gallery images from the API's `professional.images` field (typed
 * `unknown` on the endpoint). Anything that isn't an array of remote image
 * URLs yields an EMPTY gallery — the endpoint never justifies keeping demo
 * Unsplash photos.
 */
function resolveGalleryImages(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isRealRemoteImage);
}

/**
 * Best-effort real review fetch for a professional (by slug/username).
 *
 * Semantics (data-only wiring per brief §6):
 *   - valid API response (incl. zero reviews) → the authoritative set replaces
 *     any placeholder/mock reviews — an empty backend is a REAL empty, never
 *     synthesized
 *   - on fetch/validation failure → the caller's `fallback` set is kept
 *     (legacy local mock reviews for known legacy pros, `[]` for API-only pros)
 * A review-fetch failure never breaks the page.
 */
async function resolveDetailedReviews(
  userName: string,
  fallback: Specialist["reviews"]
): Promise<Specialist["reviews"]> {
  try {
    return await fetchProfessionalReviews(userName);
  } catch (error) {
    console.warn(
      `[professionals-detail] reviews unavailable for "${userName}", keeping fallback reviews:`,
      error instanceof Error ? error.message : error
    );
    return fallback;
  }
}

/**
 * Return a copy of `specialist` whose `reviews` are the real backend set when
 * available, keeping `fallbackReviews` otherwise. The underlying specialist
 * record is never mutated.
 */
async function withReviews(
  specialist: Specialist,
  userName: string,
  fallbackReviews: Specialist["reviews"]
): Promise<Specialist> {
  const reviews = await resolveDetailedReviews(userName, fallbackReviews);
  if (reviews === specialist.reviews) return specialist;
  return { ...specialist, reviews };
}

export async function getLiveProfessionalBySlug(
  slug: string,
  locale: ProfessionalLocale = "fr"
): Promise<Specialist | undefined> {
  if (HIDDEN_SLUGS.has(slug)) return undefined;

  try {
    const detail = await fetchProfessionalDetail(slug);
    const specialist = toDetailSpecialist(detail, locale);

    // Enrich with the lazy cares+packages endpoint (the old SPA loaded this
    // per professional-tab; it is the only source carrying real
    // services/prices/packs). A failure here must NOT break the page — leave
    // services/packages at their safe empty defaults.
    try {
      const caresAndPacks = await fetchProfessionalCaresAndPacks(detail.user.id);
      specialist.services = toDetailServices(caresAndPacks);
      specialist.packages = toDetailPackages(caresAndPacks);
    } catch (error) {
      console.warn(
        `[professionals-detail] services/packages unavailable for "${slug}":`,
        error instanceof Error ? error.message : error
      );
    }

    // Reviews from the dedicated endpoint (data-only §6): a valid response
    // (incl. zero reviews) is authoritative; on failure the profile keeps the
    // safe empty set from `toDetailSpecialist` (never invented).
    const userName = specialist.availabilityApi?.userName ?? slug;
    return withReviews(specialist, userName, specialist.reviews);
  } catch (error) {
    console.warn(
      `[professionals-detail] no live source for "${slug}":`,
      error instanceof Error ? error.message : error
    );
    return undefined;
  }
}

/**
 * Practices a professional genuinely offers, derived LIVE from their own API
 * specialities — there is NO local/demo relationship map, so a profile can
 * never surface a stale or fabricated practice↔professional pairing (the demo
 * map that used to live here wrongly tied `nadine-kita` to `kinesitherapie`,
 * while her live specialities are Naturopathie / Sophrologie / Psychothérapie).
 *
 * Each of the professional's specialty slugs (the canonical slugs set in
 * `toDetailSpecialist`) is kept ONLY when it exists in the canonical practice
 * set (`SLUG_ORDER`). Unknown or non-practice specialties are skipped — never
 * invented. Returns `[]` when the professional has no practice specialty, and
 * `SpecialistPractices` then renders nothing.
 */
export function getSpecialistPractices(
  specialist: Specialist,
  locale: ProfessionalLocale = "fr",
): Pratique[] {
  const canonical = new Set(getAllPratiqueSlugs());
  return getProfessionalSpecialtySlugs(specialist)
    .filter((slug) => canonical.has(slug))
    .map((slug) => getPratiqueBySlug(slug, locale))
    .filter((p): p is Pratique => Boolean(p));
}