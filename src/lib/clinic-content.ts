/**
 * Clinic Content — typed, API-ready data for the Clinic/B2C page.
 *
 * Sources: live wenaya.com homepage content (2026-09-03).
 * All copy is faithfully imported from the live site. Encoding cleaned,
 * spacing normalized, but medical meaning preserved as-is.
 *
 * Future: replace with API/CMS fetch. Components consume this adapter.
 */

export interface ClinicMetric {
  value: string;
  label: string;
}

export interface ClinicFeature {
  title: string;
  description: string;
}

export const clinicMetrics = (locale: "fr" | "en"): ClinicMetric[] =>
  locale === "en"
    ? [
        { value: "4,7 ★", label: "Google Maps reviews" },
        { value: "+148", label: "Google reviews" },
        { value: "9", label: "care disciplines" },
        { value: "1", label: "multidisciplinary center" },
      ]
    : [
        { value: "4,7 ★", label: "avis Google Maps" },
        { value: "+148", label: "avis Google" },
        { value: "9", label: "disciplines de soin" },
        { value: "1", label: "centre pluridisciplinaire" },
      ];
