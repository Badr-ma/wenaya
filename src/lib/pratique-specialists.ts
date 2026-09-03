/**
 * Pratique → Specialists relation layer (single source of truth).
 *
 * Each relationship comes from the actual specialist records in
 * `src/lib/specialistes.ts` — a specialist's declared `specialty` / `role`
 * string matches the practice it genuinely covers. No invented relationships.
 *
 *   kinesitherapie   → Nadine Kita        (specialty "Kinésithérapie")
 *   osteopathie      → Khalid Ouazzani    (specialty "Ostéopathie")
 *   psychologie      → Nadia Tazi         (role "Psychologue Clinicienne")
 *   nutrition        → Yassine El Amrani & Fatima Zahra Alami (specialty "Nutrition")
 *   orthophonie      → Mehdi Irzi         (role "Orthophoniste")
 *   naturopathie     → Najat Berrada      (role "Naturopathe")
 *   psychomotricite  → Sara Mansouri      (role "Psychomotricienne")
 *
 * The remaining live practices (massotherapie, sophrologie, cupping-therapy-hijama,
 * sexologie, psychotherapie, coaching-sportif, meditation, art-martial-therapie,
 * sono-therapie, yoga, infirmerie and neuropsychologie) have no matching
 * specialist record in the current dataset — they intentionally map to none so
 * no orphan links are ever rendered.
 *
 * This is the ONE source of truth for the practice ↔ specialist relationship.
 * Consume the exported helpers — never read `pratiqueSpecialistMap` directly in
 * components — so a future API can replace this layer without touching page UI.
 */
import { specialists, type Specialist } from "./specialistes";
import { getPratiqueBySlug, type Pratique } from "./pratiques";

const pratiqueSpecialistMap: Record<string, string[]> = {
  kinesitherapie: ["nadine-kita"],
  osteopathie: ["khalid-ouazzani"],
  psychologie: ["nadia-tazi"],
  neuropsychologie: [],
  nutrition: ["yassine-el-amrani", "fatima-zahra-alami"],
  orthophonie: ["mehdi-irzi"],
  naturopathie: ["najat-berrada"],
  psychomotricite: ["sara-mansouri"],
};

/** Reverse index — the designated practice slugs for each specialist slug. */
function buildPracticeIndex(): Record<string, string[]> {
  const index: Record<string, string[]> = {};
  for (const [practiceSlug, specialistSlugs] of Object.entries(pratiqueSpecialistMap)) {
    for (const specialistSlug of specialistSlugs) {
      (index[specialistSlug] ??= []).push(practiceSlug);
    }
  }
  return index;
}

/**
 * Specialist records that genuinely cover a given practice.
 * Empty array → the practice has no mapped specialist.
 */
export function getSpecialistsForPractice(practiceSlug: string): Specialist[] {
  const slugs = pratiqueSpecialistMap[practiceSlug] ?? [];
  return slugs
    .map((slug) => specialists.find((s) => s.slug === slug))
    .filter((s): s is Specialist => Boolean(s));
}

/**
 * Practices (as resolved Pratique records) that a given specialist genuinely offers.
 * Empty array → the specialist is not mapped to any practice.
 */
export function getPracticesForSpecialist(specialistSlug: string, locale: string = "fr"): Pratique[] {
  const practiceIndex = buildPracticeIndex();
  const practiceSlugs = practiceIndex[specialistSlug] ?? [];
  return practiceSlugs
    .map((slug) => getPratiqueBySlug(slug, locale))
    .filter((p): p is Pratique => Boolean(p));
}

/**
 * The designated practice slugs for a given specialist (raw, no Pratique resolution).
 * Useful for lightweight reverse lookups.
 */
export function getPracticeSlugsForSpecialist(specialistSlug: string): string[] {
  return buildPracticeIndex()[specialistSlug] ?? [];
}
