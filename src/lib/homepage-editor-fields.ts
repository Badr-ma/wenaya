/**
 * Data-driven field definitions for the Homepage admin editor.
 *
 * Each section type lists the simple top-level text fields it can edit —
 * mirroring the typed content contracts in homepage-types.ts. For every field
 * the editor can resolve the "effective" value currently displayed by the
 * website using the priority: draft CMS value > published CMS value > default
 * i18n value.
 *
 * The `i18nPath` points at the translation key that is the default source of
 * truth for that field (same key the section component falls back to). Fields
 * whose default lives as hardcoded component text instead of i18n (YOLO) use
 * `defaultText` instead.
 *
 * Arrays, pricing plans, comparison rows, footer navigation, cards and other
 * nested objects are intentionally NOT exposed here — they remain managed
 * elsewhere / unchanged for now.
 */
import type { SectionType } from "./homepage-types";

export interface HomepageFieldDef {
  label: string;
  /** Content key stored on the section's content object. */
  key: string;
  /** i18n key used as the default fallback (e.g. "hero.eyebrow"). */
  i18nPath?: string;
  /** Literal fallback for fields whose default is hardcoded in the component. */
  defaultText?: string;
  /** Render a <textarea> with this many rows. */
  rows?: number;
  /** Input placeholder for legacy fields that have no default text. */
  placeholder?: string;
}

export interface HomepageSectionEditorDef {
  helper?: string;
  fields: HomepageFieldDef[];
}

/**
 * Maps each editable section type to its editor fields.
 * Sections without an entry (disease-marquee) keep their specialized note.
 */
export const SECTION_EDITOR_DEFS: Partial<Record<SectionType, HomepageSectionEditorDef>> = {
  banner: {
    helper: "Text is managed through i18n translation files.",
    fields: [{ label: "Banner text override", key: "bannerText", i18nPath: "banner.text" }],
  },

  hero: {
    helper: "Default content is managed through i18n. Override fields below:",
    fields: [
      { label: "Eyebrow text", key: "eyebrow", i18nPath: "hero.eyebrow" },
      { label: "Heading line 1", key: "heading1", i18nPath: "hero.vousMéritez" },
      { label: "Heading line 2", key: "heading2", i18nPath: "hero.complete" },
      { label: "Description", key: "sub", i18nPath: "hero.sub", rows: 2 },
      { label: "Primary CTA label", key: "ctaLabel", i18nPath: "hero.cta" },
      { label: "Primary CTA URL", key: "ctaUrl" },
      { label: "Video URL", key: "videoUrl" },
    ],
  },

  "how-it-works": {
    helper: "The 4 step cards are managed through i18n. Override fields below:",
    fields: [
      { label: "Badge text", key: "badge", i18nPath: "howItWorks.badge" },
      { label: "Heading line 1", key: "heading1", i18nPath: "howItWorks.heading1" },
      { label: "Heading line 2", key: "heading2", i18nPath: "howItWorks.heading2" },
      { label: "Description", key: "sub", i18nPath: "howItWorks.sub", rows: 2 },
      { label: "Primary CTA label", key: "cta1", i18nPath: "howItWorks.cta1" },
      { label: "Secondary CTA label", key: "cta2", i18nPath: "howItWorks.cta2" },
    ],
  },

  biomarkers: {
    helper: "The 3 pillar cards are managed through i18n. Override fields below:",
    fields: [
      { label: "Badge text", key: "badge", i18nPath: "biomarkers.badge" },
      { label: "Heading line 1", key: "heading1", i18nPath: "biomarkers.heading1" },
      { label: "Heading line 2", key: "heading2", i18nPath: "biomarkers.heading2" },
      { label: "Description", key: "sub", i18nPath: "biomarkers.sub", rows: 2 },
      { label: "Care count label", key: "soins", i18nPath: "biomarkers.soins" },
      { label: "Bottom description", key: "bottom", i18nPath: "biomarkers.bottom", rows: 2 },
      { label: "CTA label", key: "cta", i18nPath: "biomarkers.cta" },
    ],
  },

  testimonials: {
    helper: "Testimonial cards are managed through i18n. Override the heading fields below:",
    fields: [
      { label: "Heading line 1", key: "heading1", i18nPath: "testimonialsSection.heading1" },
      { label: "Heading line 2", key: "heading2", i18nPath: "testimonialsSection.heading2" },
      { label: "Description", key: "sub", i18nPath: "testimonialsSection.sub", rows: 2 },
    ],
  },

  expertise: {
    helper: "Specialist cards are managed through i18n. Override fields below:",
    fields: [
      { label: "Badge text", key: "badge", i18nPath: "expertiseSection.badge" },
      { label: "Heading line 1", key: "heading1", i18nPath: "expertiseSection.heading1" },
      { label: "Heading line 2", key: "heading2", i18nPath: "expertiseSection.heading2" },
      { label: "Description", key: "p1", i18nPath: "expertiseSection.p1", rows: 2 },
      { label: "CTA label", key: "cta", i18nPath: "expertiseSection.cta" },
    ],
  },

  "comparison-table": {
    helper: "Default content is managed through i18n. Override fields below:",
    fields: [
      { label: "Badge text", key: "badge", i18nPath: "comparisonTable.badge" },
      { label: "Heading line 1", key: "heading1", i18nPath: "comparisonTable.heading1" },
      { label: "Heading line 2", key: "heading2", i18nPath: "comparisonTable.heading2" },
      { label: "Description", key: "sub", i18nPath: "comparisonTable.sub", rows: 2 },
    ],
  },

  pricing: {
    helper: "Default content is managed through i18n. Override fields below:",
    fields: [
      { label: "Eyebrow text", key: "eyebrow", i18nPath: "pricing.eyebrow" },
      { label: "Heading line 1", key: "heading1", i18nPath: "pricing.heading1" },
      { label: "Heading line 2", key: "heading2", i18nPath: "pricing.heading2" },
      { label: "Description", key: "sub", i18nPath: "pricing.sub", rows: 2 },
    ],
  },

  "cours-ateliers": {
    helper: "Default content is managed through i18n. Override fields below:",
    fields: [
      { label: "Badge text", key: "badge", i18nPath: "coursAteliers.badge" },
      { label: "Heading line 1", key: "heading1", i18nPath: "coursAteliers.heading1" },
      { label: "Heading line 2", key: "heading2", i18nPath: "coursAteliers.heading2" },
      { label: "CTA label", key: "cta", i18nPath: "coursAteliers.cta" },
      { label: "Swipe label", key: "swipe", i18nPath: "coursAteliers.swipe" },
    ],
  },

  cta: {
    helper: "Default content is managed through i18n.",
    fields: [
      { label: "Heading line 1 override", key: "heading1", i18nPath: "ctaSection.heading1" },
      { label: "Heading line 2 override", key: "heading2", i18nPath: "ctaSection.heading2" },
      { label: "Description override", key: "sub", i18nPath: "ctaSection.sub", rows: 2 },
      { label: "CTA label", key: "ctaLabel", i18nPath: "ctaSection.cta" },
      { label: "CTA URL", key: "ctaUrl" },
    ],
  },

  blog: {
    helper: "Blog section automatically shows the latest 3 posts.",
    fields: [
      { label: "Heading line 1 override", key: "heading1", i18nPath: "blog.heading1" },
      { label: "Heading line 2 override", key: "heading2", i18nPath: "blog.heading2" },
      { label: "Description override", key: "sub", i18nPath: "blog.sub", rows: 2 },
      { label: "View all label", key: "voirTous", i18nPath: "blog.voirTous" },
    ],
  },

  footer: {
    helper: "Default content is managed through i18n. Override fields below:",
    fields: [
      { label: "Description", key: "desc", i18nPath: "footer.desc", rows: 3 },
      { label: "Opening hours", key: "hours", i18nPath: "footer.hours" },
    ],
  },

  yolo: {
    helper:
      "Defaults below are the hardcoded component text (no i18n fallback exists for this section yet).",
    fields: [
      { label: "Title", key: "title", defaultText: "YOLO" },
      {
        label: "Subtitle",
        key: "subtitle",
        defaultText: "The AI Agent Dedicated to Longevity.",
      },
      {
        label: "Description",
        key: "desc",
        defaultText:
          "A continuous intelligence layer designed to help individuals understand their health, anticipate risks, and make better decisions over time.",
        rows: 3,
      },
    ],
  },

  "image-text": {
    helper: "No default content exists for this section yet. Fields start empty.",
    fields: [
      { label: "Heading", key: "heading" },
      { label: "Text", key: "text", rows: 3 },
      { label: "Image URL", key: "imageUrl" },
      { label: "CTA label", key: "ctaLabel" },
      { label: "CTA URL", key: "ctaUrl" },
    ],
  },

  "full-width-cta": {
    helper: "No default content exists for this section yet. Fields start empty.",
    fields: [
      { label: "Heading", key: "heading" },
      { label: "Description", key: "sub", rows: 2 },
      { label: "CTA label", key: "ctaLabel" },
      { label: "CTA URL", key: "ctaUrl" },
      { label: "Background image URL", key: "bgImage" },
    ],
  },
};
