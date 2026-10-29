"use client";

import dynamic from "next/dynamic";
import { useMemo, useEffect, useCallback, useReducer, useRef } from "react";
import { usePathname } from "next/navigation";
import type { HomepageConfig, HomepageSection, BlogContent } from "@/lib/homepage-types";
import type { Specialist } from "@/lib/specialistes";
import { SECTION_META } from "@/lib/homepage-types";
import SectionBreak from "@/components/SectionBreak";
import {
  fetchBlogPosts,
  homepageBlogFeedReducer,
  initialHomepageBlogFeedState,
} from "@/lib/homepage-blog-feed";

const HeroSection = dynamic(() => import("@/components/HeroSection"), { ssr: true });
const HowItWorks = dynamic(() => import("@/components/HowItWorks"), { ssr: true });
const Biomarkers = dynamic(() => import("@/components/Biomarkers"), { ssr: true });
const QuickAccessSection = dynamic(() => import("@/components/QuickAccessSection"), { ssr: true });
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"), { ssr: true });
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

export default function HomepageRenderer({
  config,
  experts,
  quickAccessImages,
}: {
  config: HomepageConfig;
  experts?: Specialist[];
  quickAccessImages?: (string | null)[];
}) {
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
        <SectionComponent section={section} experts={experts} quickAccessImages={quickAccessImages} />
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

function SectionComponent({
  section,
  experts,
  quickAccessImages,
}: {
  section: HomepageSection;
  experts?: Specialist[];
  quickAccessImages?: (string | null)[];
}) {
  switch (section.type) {
    case "hero":
      return <HeroSection content={section.content} />;
    case "how-it-works":
      return <HowItWorks content={section.content} />;
    case "disease-marquee":
      // Integrated into the testimonials section (practices text-link rows).
      // Component, i18n, types and CMS schema keep their data intact — only the
      // standalone public render of this section is suppressed.
      return null;
    case "biomarkers":
      return <Biomarkers content={section.content} />;
    case "quick-links":
      return <QuickAccessSection content={section.content} images={quickAccessImages} />;
    case "testimonials":
      return <TestimonialsSection content={section.content} />;
    case "expertise":
      return <ExpertiseSection content={section.content} specialists={experts} />;
    case "pricing":
      // TEMPORARILY HIDDEN from the public homepage. Component, i18n, types,
      // CMS schema and editor support are all kept intact — only the public
      // render of this section is suppressed.
      return null;
    case "cours-ateliers":
      // Removed from public homepage structure. Component, i18n, types,
      // CMS schema and editor support are all kept intact — only the public
      // render of this section is suppressed.
      return null;
    case "footer":
      return <Footer content={section.content} />;
    case "blog":
      return <BlogSectionWrapper content={section.content} />;
    default:
      return null;
  }
}

function BlogSectionWrapper({ content }: { content: BlogContent }) {
  const pathname = usePathname();
  const locale = pathname?.startsWith("/en") ? "en" : "fr";
  const [feed, dispatch] = useReducer(homepageBlogFeedReducer, initialHomepageBlogFeedState);
  const requestIdRef = useRef(0);

  const loadPosts = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    dispatch({ type: "start", requestId });
    try {
      const posts = await fetchBlogPosts(locale);
      if (requestId === requestIdRef.current) {
        dispatch({ type: "success", requestId, posts });
      }
    } catch {
      if (requestId === requestIdRef.current) dispatch({ type: "failure", requestId });
    }
  }, [locale]);

  useEffect(() => {
    void loadPosts();
    return () => {
      // Invalidate a pending request when locale changes or the section unmounts.
      requestIdRef.current += 1;
    };
  }, [loadPosts]);

  if (feed.status === "loading") {
    return (
      <section className="bg-[#F2EFE9] py-10 sm:py-20 px-6" aria-busy="true">
        <p role="status" className="max-w-7xl mx-auto text-center text-sm text-[#2B2F36]/55">
          {locale === "en" ? "Loading articles…" : "Chargement des articles…"}
        </p>
      </section>
    );
  }

  if (feed.status === "error") {
    return (
      <section className="bg-[#F2EFE9] py-10 sm:py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p role="alert" className="text-sm text-[#2B2F36]/65">
            {locale === "en"
              ? "The latest articles are temporarily unavailable. Please try again."
              : "Les derniers articles sont momentanément indisponibles. Veuillez réessayer."}
          </p>
          <button
            type="button"
            onClick={() => void loadPosts()}
            className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-[#B88A5A]/40 px-5 text-sm font-medium text-[#9A7242] transition-colors hover:bg-[#B88A5A]/10"
          >
            {locale === "en" ? "Try again" : "Réessayer"}
          </button>
        </div>
      </section>
    );
  }

  return <BlogSection posts={feed.posts} content={content} />;
}

