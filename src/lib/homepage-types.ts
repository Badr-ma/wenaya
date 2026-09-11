export type SectionType =
  | "banner"
  | "hero"
  | "how-it-works"
  | "disease-marquee"
  | "biomarkers"
  | "quick-links"
  | "testimonials"
  | "expertise"
  | "pricing"
  | "cours-ateliers"
  | "blog"
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

/**
 * Banner overrides, keyed per locale so a CMS value can never leak across
 * languages. Every field is optional; i18n (`banner.text`) remains the
 * per-locale fallback. A legacy flat `bannerText` key stored by older Redis
 * configs is intentionally not read here (it was a single string applied to
 * every locale — the source of the FR leak) and just round-trips harmlessly.
 */
export interface BannerContent {
  /** French override — falls back to fr:i18n `banner.text`. */
  bannerTextFr?: string;
  /** English override — falls back to en:i18n `banner.text`. */
  bannerTextEn?: string;
}

export interface HeroContent {
  eyebrow?: string;
  heading1?: string;
  heading2?: string;
  sub?: string;
  ctaLabel?: string;
  /** Secondary CTA label — reserved; the Hero renders it as an outline button
   *  linking to the booking-request flow (`/contact-us?type=booking`). */
  ctaSecondary?: string;
  /** Stored but the Hero component does not consume it today — the primary CTA
   *  scrolls to the future Configurator section (`#configurator`). */
  ctaUrl?: string;
  /** Stored but not yet consumed — the Hero plays a local /videos/forest.mp4. */
  videoUrl?: string;
}

export interface HowItWorksContent {
  badge?: string;
  heading1?: string;
  heading2?: string;
  sub?: string;
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
  bottom?: string;
  cta?: string;
}

export interface TestimonialsContent {
  eyebrow?: string;
  heading1?: string;
  heading2?: string;
  sub?: string;
}

/** Quick-access navigation cards. Heading/sub overridable; card content lives in i18n. */
export interface QuickLinksContent {
  heading?: string;
  sub?: string;
}

export interface ExpertiseContent {
  badge?: string;
  heading1?: string;
  heading2?: string;
  p1?: string;
  cta?: string;
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
  "quick-links": QuickLinksContent;
  testimonials: TestimonialsContent;
  expertise: ExpertiseContent;
  pricing: PricingContent;
  "cours-ateliers": CoursAteliersContent;
  blog: BlogContent;
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
  "how-it-works": { label: "How It Works", theme: "light", description: "3-step method (Comprendre, Agir, Progresser)" },
  "disease-marquee": { label: "Practices & Specialties", theme: "light", description: "5 editorial practice disciplines linking to /pratiques" },
  biomarkers: { label: "Biomarkers", theme: "light", description: "3-pillar biomarker visualization grid" },
  "quick-links": { label: "Quick Access", theme: "light", description: "4 quick-access navigation cards (needs, pathologies, care, professionals)" },
  testimonials: { label: "Testimonials", theme: "light", description: "Stats + patient testimonials carousel" },
  expertise: { label: "Expertise", theme: "light", description: "Medical specialties linking to specialist profiles" },
  pricing: { label: "Pricing", theme: "light", description: "Pricing cards with features" },
  "cours-ateliers": { label: "Courses & Workshops", theme: "dark", description: "Courses carousel on dark background" },
  blog: { label: "Blog Posts", theme: "light", description: "Latest 3 blog posts preview" },
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
  { id: "sct_quick_access", type: "quick-links", order: 5, enabled: true, content: {} },
  { id: "sct_testimonials", type: "testimonials", order: 6, enabled: true, content: {} },
  { id: "sct_expertise", type: "expertise", order: 7, enabled: true, content: {} },
  { id: "sct_pricing", type: "pricing", order: 8, enabled: true, content: {} },
  { id: "sct_cours_ateliers", type: "cours-ateliers", order: 9, enabled: true, content: {} },
  { id: "sct_blog", type: "blog", order: 11, enabled: true, content: {} },
  { id: "sct_footer", type: "footer", order: 13, enabled: true, content: {} },
];
