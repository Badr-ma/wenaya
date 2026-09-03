export type SectionType =
  | "banner"
  | "hero"
  | "how-it-works"
  | "disease-marquee"
  | "biomarkers"
  | "testimonials"
  | "expertise"
  | "comparison-table"
  | "pricing"
  | "cours-ateliers"
  | "cta"
  | "blog"
  | "yolo"
  | "footer"
  | "statistics"
  | "image-text"
  | "full-width-cta";

/**
 * Typed content contracts per homepage section type.
 *
 * Every field is optional: existing Redis configs store `content: {}` (or
 * legacy free-form keys) and must keep working without a migration. The
 * optional shape lets old stored data round-trip through the type system.
 *
 * Components consume overrides via `content?.field ?? t("i18n.key")` in a
 * later step; i18n remains the fallback default.
 */

export interface BannerContent {
  bannerText?: string;
}

export interface HeroContent {
  eyebrow?: string;
  heading1?: string;
  heading2?: string;
  sub?: string;
  ctaLabel?: string;
  /** Stored but not yet consumed — the Hero component does not render a CTA link today. */
  ctaUrl?: string;
  /** Stored but not yet consumed — the Hero component has no video element today. */
  videoUrl?: string;
}

export interface HowItWorksContent {
  badge?: string;
  heading1?: string;
  heading2?: string;
  sub?: string;
  cta1?: string;
  cta2?: string;
}

/**
 * Presentation overrides only. The 9 practice titles/descriptions come from the
 * shared practices adapter (i18n-driven, locale-aware) and are NOT stored here.
 */
export interface DiseaseMarqueeContent {
  badge?: string;
  heading1?: string;
  heading2?: string;
  sub?: string;
  cta?: string;
}

export interface BiomarkersContent {
  badge?: string;
  heading1?: string;
  heading2?: string;
  sub?: string;
  soins?: string;
  bottom?: string;
  cta?: string;
}

export interface TestimonialsContent {
  heading1?: string;
  heading2?: string;
  sub?: string;
}

export interface ExpertiseContent {
  badge?: string;
  heading1?: string;
  heading2?: string;
  p1?: string;
  cta?: string;
}

export interface ComparisonTableContent {
  badge?: string;
  heading1?: string;
  heading2?: string;
  sub?: string;
}

export interface PricingContent {
  eyebrow?: string;
  heading1?: string;
  heading2?: string;
  sub?: string;
}

export interface CoursAteliersContent {
  badge?: string;
  heading1?: string;
  heading2?: string;
  cta?: string;
  swipe?: string;
}

export interface CtaContent {
  heading1?: string;
  heading2?: string;
  sub?: string;
  ctaLabel?: string;
  /** Stored but not yet consumed — CtaSection renders a hardcoded CTA button without a link today. */
  ctaUrl?: string;
}

/**
 * Posts are auto-fetched from /api/blog/posts (top 3 published MDX posts).
 * These fields only override the section's headline presentation.
 */
export interface BlogContent {
  heading1?: string;
  heading2?: string;
  sub?: string;
  voirTous?: string;
}

/** Reserved for future CMS-ification — YoloSection is currently fully hardcoded. */
export interface YoloContent {
  title?: string;
  subtitle?: string;
  desc?: string;
}

export interface FooterContent {
  desc?: string;
  hours?: string;
}

/** Structured stats replacing the legacy flat `stat_0_value` / `stat_0_label` keys. */
export interface StatisticsContent {
  stats?: { value: string; label: string }[];
}

export interface ImageTextContent {
  heading?: string;
  text?: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface FullWidthCtaContent {
  heading?: string;
  sub?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  bgImage?: string;
}

/**
 * Maps each section type to the exact content shape it may hold.
 * Indexing with the `SectionType` union yields the union of all content
 * shapes for the heterogeneous `sections[]` array; the renderer narrows
 * per-case in a later step.
 */
export type SectionContentMap = {
  banner: BannerContent;
  hero: HeroContent;
  "how-it-works": HowItWorksContent;
  "disease-marquee": DiseaseMarqueeContent;
  biomarkers: BiomarkersContent;
  testimonials: TestimonialsContent;
  expertise: ExpertiseContent;
  "comparison-table": ComparisonTableContent;
  pricing: PricingContent;
  "cours-ateliers": CoursAteliersContent;
  cta: CtaContent;
  blog: BlogContent;
  yolo: YoloContent;
  footer: FooterContent;
  statistics: StatisticsContent;
  "image-text": ImageTextContent;
  "full-width-cta": FullWidthCtaContent;
};

/**
 * Discriminated union on `type`: switching on `section.type` narrows
 * `section.content` to that section's exact content contract, so the
 * renderer passes typed content to each component without casts.
 */
interface HomepageSectionBase {
  id: string;
  order: number;
  enabled: boolean;
}

export type HomepageSection = {
  [T in SectionType]: HomepageSectionBase & {
    type: T;
    content: SectionContentMap[T];
  };
}[SectionType];

export interface HomepageConfig {
  sections: HomepageSection[];
}

export interface HomepageState {
  draft: HomepageConfig;
  published: HomepageConfig;
  updatedAt: string;
  publishedAt: string | null;
}

export const SECTION_META: Record<SectionType, { label: string; description: string; theme: "dark" | "light"; hasSpacerBefore?: boolean; hasSectionBreak?: boolean }> = {
  banner: { label: "Banner", description: "Top promotional bar with bronze background", theme: "dark" },
  hero: { label: "Hero", theme: "dark", description: "Full-screen hero with video, headline, trust bar" },
  "how-it-works": { label: "How It Works", theme: "light", description: "4-step process (Assess, Align, Activate, Sustain)" },
  "disease-marquee": { label: "Practices & Specialties", theme: "dark", description: "9 individual care disciplines linking to /pratiques" },
  biomarkers: { label: "Biomarkers", theme: "light", description: "3-pillar biomarker visualization grid" },
  testimonials: { label: "Testimonials", theme: "light", description: "Stats + patient testimonials carousel" },
  expertise: { label: "Expertise", theme: "light", description: "Medical specialties linking to specialist profiles" },
  "comparison-table": { label: "Comparison Table", theme: "light", description: "Wenaya vs traditional healthcare" },
  pricing: { label: "Pricing", theme: "light", description: "Pricing cards with features" },
  "cours-ateliers": { label: "Courses & Workshops", theme: "dark", description: "Courses carousel on dark background" },
  cta: { label: "CTA Section", theme: "dark", description: "Final call-to-action with quote" },
  blog: { label: "Blog Posts", theme: "light", description: "Latest 3 blog posts preview" },
  yolo: { label: "YOLO Section", theme: "dark", description: "Interactive longevity exploration widget" },
  footer: { label: "Footer", theme: "dark", description: "Site footer with nav, socials, contact" },
  statistics: { label: "Statistics", theme: "light", description: "Custom trust metrics / stats bar" },
  "image-text": { label: "Image + Text", theme: "light", description: "Side-by-side image and content block" },
  "full-width-cta": { label: "Full-Width CTA", theme: "dark", description: "Full-width call-to-action banner" },
};

export const DEFAULT_SECTIONS: HomepageSection[] = [
  { id: "sct_banner", type: "banner", order: 0, enabled: true, content: {} },
  { id: "sct_hero", type: "hero", order: 1, enabled: true, content: {} },
  { id: "sct_how_it_works", type: "how-it-works", order: 2, enabled: true, content: {} },
  { id: "sct_disease_marquee", type: "disease-marquee", order: 3, enabled: true, content: {} },
  { id: "sct_biomarkers", type: "biomarkers", order: 4, enabled: true, content: {} },
  { id: "sct_testimonials", type: "testimonials", order: 5, enabled: true, content: {} },
  { id: "sct_expertise", type: "expertise", order: 6, enabled: true, content: {} },
  { id: "sct_comparison_table", type: "comparison-table", order: 7, enabled: true, content: {} },
  { id: "sct_pricing", type: "pricing", order: 8, enabled: true, content: {} },
  { id: "sct_cours_ateliers", type: "cours-ateliers", order: 9, enabled: true, content: {} },
  { id: "sct_cta", type: "cta", order: 10, enabled: true, content: {} },
  { id: "sct_blog", type: "blog", order: 11, enabled: true, content: {} },
  { id: "sct_yolo", type: "yolo", order: 12, enabled: true, content: {} },
  { id: "sct_footer", type: "footer", order: 13, enabled: true, content: {} },
];
