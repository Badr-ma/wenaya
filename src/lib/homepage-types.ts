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

export interface HomepageSection {
  id: string;
  type: SectionType;
  order: number;
  enabled: boolean;
  content: Record<string, unknown>;
}

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
  "disease-marquee": { label: "Specialties Marquee", theme: "light", description: "Scrolling topics row (fetches from admin:specialties)" },
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
