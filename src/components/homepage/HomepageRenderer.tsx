"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, useEffect } from "react";
import type { HomepageConfig, HomepageSection, BlogContent } from "@/lib/homepage-types";
import { SECTION_META } from "@/lib/homepage-types";
import SectionBreak from "@/components/SectionBreak";
import type { PostWithAuthor } from "@/lib/blog-utils";

const Banner = dynamic(() => import("@/components/Banner"), { ssr: true });
const HeroSection = dynamic(() => import("@/components/HeroSection"), { ssr: true });
const HowItWorks = dynamic(() => import("@/components/HowItWorks"), { ssr: true });
const PracticesSection = dynamic(() => import("@/components/PracticesSection"), { ssr: true });
const Biomarkers = dynamic(() => import("@/components/Biomarkers"), { ssr: true });
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"), { ssr: true });
const ComparisonTable = dynamic(() => import("@/components/ComparisonTable"), { ssr: true });
const Pricing = dynamic(() => import("@/components/Pricing"), { ssr: true });
const CoursAteliers = dynamic(() => import("@/components/CoursAteliers"), { ssr: true });
const CtaSection = dynamic(() => import("@/components/CtaSection"), { ssr: true });
const YoloSection = dynamic(() => import("@/components/YoloSection"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });
const ExpertiseSection = dynamic(() => import("@/components/about/ExpertiseSection"), { ssr: true });
const BlogSection = dynamic(() => import("@/components/blog/BlogSection"), { ssr: true });

function Spacer() {
  return <div className="h-4 sm:h-6" />;
}

function SectionWrapper({ section, children }: { section: HomepageSection; children: React.ReactNode }) {
  const meta = SECTION_META[section.type];
  const theme = meta?.theme ?? "light";
  return <div data-section-bg={theme}>{children}</div>;
}

export default function HomepageRenderer({ config }: { config: HomepageConfig }) {
  const sections = useMemo(() => {
    return [...config.sections]
      .filter((s) => s.enabled)
      .sort((a, b) => a.order - b.order);
  }, [config]);

  const contentSections = useMemo(() => sections.filter((s) => s.type !== "footer"), [sections]);
  const footerSections = useMemo(() => sections.filter((s) => s.type === "footer"), [sections]);

  // Rendered order: content sections then footer sections (matches prior
  // behavior so theme break continuity runs across the two groups).
  const orderedSections = useMemo(
    () => [...contentSections, ...footerSections],
    [contentSections, footerSections]
  );

  // Precompute separators up front so no render-phase variable mutation is
  // needed. Same rules as before: theme-change break, hasSectionBreak, spacer.
  const separators = useMemo(() => {
    let lastTheme: string | null = null;
    return orderedSections.map((section, i) => {
      const meta = SECTION_META[section.type];
      const needsBreak = meta?.hasSectionBreak;
      const needsSpacer = meta?.hasSpacerBefore;
      const currentTheme = meta?.theme ?? "light";

      let separator = null;
      if (i > 0 && lastTheme && lastTheme !== currentTheme) {
        separator = <SectionBreak />;
      } else if (i > 0 && needsBreak) {
        separator = <SectionBreak />;
      } else if (needsSpacer) {
        separator = <Spacer />;
      }
      lastTheme = currentTheme;
      return separator;
    });
  }, [orderedSections]);

  const renderSection = (section: HomepageSection, separator: React.ReactNode) => (
    <span key={section.id}>
      {separator}
      <SectionWrapper section={section}>
        <SectionComponent section={section} />
      </SectionWrapper>
    </span>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <main>
        {contentSections.map((section, i) => renderSection(section, separators[i]))}
      </main>
      {footerSections.map((section, i) => renderSection(section, separators[contentSections.length + i]))}
    </div>
  );
}

function SectionComponent({ section }: { section: HomepageSection }) {
  switch (section.type) {
    case "banner":
      return <Banner content={section.content} />;
    case "hero":
      return <HeroSection content={section.content} />;
    case "how-it-works":
      return <HowItWorks content={section.content} />;
    case "disease-marquee":
      return <PracticesSection content={section.content} />;
    case "biomarkers":
      return <Biomarkers content={section.content} />;
    case "testimonials":
      return <TestimonialsSection content={section.content} />;
    case "expertise":
      return <ExpertiseSection content={section.content} />;
    case "comparison-table":
      return <ComparisonTable content={section.content} />;
    case "pricing":
      return <Pricing content={section.content} />;
    case "cours-ateliers":
      return <CoursAteliers content={section.content} />;
    case "cta":
      return <CtaSection content={section.content} />;
    case "yolo":
      return <YoloSection content={section.content} />;
    case "footer":
      return <Footer content={section.content} />;
    case "blog":
      return <BlogSectionWrapper content={section.content} />;
    default:
      return null;
  }
}

function BlogSectionWrapper({ content }: { content: BlogContent }) {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  useEffect(() => {
    fetch("/api/blog/posts")
      .then((r) => r.json())
      .then((d) => { if (d.data) setPosts(d.data); })
      .catch(() => {});
  }, []);
  if (posts.length === 0) return null;
  return <BlogSection posts={posts} content={content} />;
}

