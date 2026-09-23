/**
 * Professionals adapter — maps the live dev API professional listing to the
 * frontend `Specialist` interface. Falls back to Redis / hardcoded mock data
 * on any failure (network, shape validation, etc.).
 *
 * Server-side only — consumed by the listing pages, never by client components.
 *
 * Mapping rules (API → Specialist):
 *   slug       ← api.slug (NOT username)
 *   name       ← first_name + " " + last_name
 *   image      ← avatar (full URL)
 *   specialty  ← speciality_names[0] || ""
 *   role       ← speciality_names[0] || "" (FR fallback for listing display)
 *   All other fields get safe defaults (the listing UI degrades gracefully
 *   when rating/reviews/services/etc. are zero/empty).
 */

import type { Specialist } from "./specialistes";
import type { ApiProfessional } from "./professionals-api";
import { fetchProfessionals } from "./professionals-api";
import { getAllSpecialistsAsync } from "./specialistes";

/** Dummy image used when the API avatar is missing or unreachable. */
const DUMMY_IMAGE = "/images/dummy-man.png";

/**
 * Slugs excluded from the public listing. `introsens-sarl` is a corporate
 * account (no specialty, dummy avatar, empty profile) — not a practitioner.
 * Its detail page renders 404 (see `professionals-detail.ts`).
 */
const HIDDEN_SLUGS = new Set(["introsens-sarl"]);

/**
 * Map one API professional to the frontend Specialist shape.
 * Fields not available from the API get safe empty defaults.
 */
function toSpecialist(pro: ApiProfessional): Specialist {
  const name = `${pro.first_name} ${pro.last_name}`.trim();
  const primarySpecialty = pro.speciality_names[0] ?? "";

  return {
    slug: pro.slug,
    name: name || pro.username,
    role: primarySpecialty,
    roleEn: undefined,
    specialty: primarySpecialty,
    image: pro.avatar || DUMMY_IMAGE,
    rating: 0,
    reviewCount: 0,
    yearsExperience: 0,
    languages: [],
    orderNumber: "",
    bio: "",
    approach: "",
    specialtyTags: pro.speciality_names,
    certifications: [],
    services: [],
    availability: [],
    location: {
      lat: 0,
      lng: 0,
      city: "Casablanca",
      address: "",
      parking: "",
      access: "",
    },
    hours: "",
    clinicPhotos: [],
    reviews: [],
  };
}

/**
 * Fetch live professionals from the dev API, mapped to the Specialist
 * interface. On ANY failure (network, timeout, shape mismatch), falls
 * back to the existing Redis / hardcoded data.
 *
 * This is the primary data source for the listing pages.
 */
export async function getLiveSpecialists(): Promise<Specialist[]> {
  try {
    const apiProfessionals = await fetchProfessionals();

    if (apiProfessionals.length === 0) {
      console.warn("[professionals] API returned 0 professionals, falling back to local data");
      return getAllSpecialistsAsync();
    }

    return apiProfessionals
      .filter((pro) => !HIDDEN_SLUGS.has(pro.slug))
      .map(toSpecialist);
  } catch (error) {
    console.error("[professionals] API fetch failed, falling back to local data:", error);
    return getAllSpecialistsAsync();
  }
}

/**
 * Server-first team cards for the homepage "Nos experts" section.
 *
 * Pure API-order selection: the fetched listing keeps its exact backend order,
 * only established non-practitioner records (HIDDEN_SLUGS, e.g. introsens-sarl)
 * plus records with no specialty are excluded, and the first `limit` eligible
 * practitioners (default 6) in that API order are rendered — name, slug, specialty and
 * avatar exactly as returned by the API. No hardcoded names, no manual
 * curation, no specialty/avatar-health sorting.
 *
 * Reuses the SAME listing client + adapter as `/professional` (one call, Data
 * Cache ISR, no N+1 — no per-card detail fetches). Deliberately does NOT fall
 * back to the Redis/hardcoded local dataset: on ANY failure it returns an
 * empty list so the section renders without member cards instead of ever
 * showing demo names/photos.
 *
 * NOTE: if an API avatar URL returns 404 that is a backend/dev-API data issue;
 * the practitioner stays in their API position and is rendered as-is.
 */
export async function getHomepageSpecialists(limit = 6): Promise<Specialist[]> {
  try {
    const apiProfessionals = await fetchProfessionals();

    const featured = apiProfessionals
      .filter(
        (pro) =>
          !HIDDEN_SLUGS.has(pro.slug) &&
          !!pro.slug &&
          pro.speciality_names.length > 0,
      )
      .slice(0, limit)
      .map(toSpecialist);

    return featured;
  } catch (error) {
    console.error("[professionals] homepage featured fetch failed, rendering without team cards:", error);
    return [];
  }
}
