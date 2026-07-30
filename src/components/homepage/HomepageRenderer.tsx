"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, useEffect } from "react";
import type { HomepageConfig, HomepageSection } from "@/lib/homepage-types";
import { SECTION_META } from "@/lib/homepage-types";
import SectionBreak from "@/components/SectionBreak";
import type { PostWithAuthor } from "@/lib/blog-utils";

const Banner = dynamic(() => import("@/components/Banner"), { ssr: true });
const HeroSection = dynamic(() => import("@/components/HeroSection"), { ssr: true });
const HowItWorks = dynamic(() => import("@/components/HowItWorks"), { ssr: true });
const DiseaseMarquee = dynamic(() => import("@/components/DiseaseMarquee"), { ssr: true });
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

  let lastTheme: string | null = null;

  return (
    <div className="flex flex-col min-h-screen">
      {sections.map((section, i) => {
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

        return (
          <span key={section.id}>
            {separator}
            <SectionWrapper section={section}>
              <SectionComponent section={section} />
            </SectionWrapper>
          </span>
        );
      })}
    </div>
  );
}

function SectionComponent({ section }: { section: HomepageSection }) {
  switch (section.type) {
    case "banner":
      return <Banner />;
    case "hero":
      return <HeroSection />;
    case "how-it-works":
      return <HowItWorks />;
    case "disease-marquee":
      return <DiseaseMarquee />;
    case "biomarkers":
      return <Biomarkers />;
    case "testimonials":
      return <TestimonialsSection />;
    case "expertise":
      return <ExpertiseSection />;
    case "comparison-table":
      return <ComparisonTable />;
    case "pricing":
      return <Pricing />;
    case "cours-ateliers":
      return <CoursAteliers />;
    case "cta":
      return <CtaSection />;
    case "yolo":
      return <YoloSection />;
    case "footer":
      return <Footer />;
    case "blog":
      return <BlogSectionWrapper />;
    default:
      return null;
  }
}

function BlogSectionWrapper() {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  useEffect(() => {
    fetch("/api/blog/posts")
      .then((r) => r.json())
      .then((d) => { if (d.data) setPosts(d.data); })
      .catch(() => {});
  }, []);
  if (posts.length === 0) return null;
  return <BlogSection posts={posts} />;
}

