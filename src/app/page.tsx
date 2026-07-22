import type { Metadata } from "next";

/** Homepage SEO metadata — title, description, canonical, Open Graph */
export const metadata: Metadata = {
  title: "Wenaya — Santé Intégrée & Bien-être | Casablanca, Maroc",
  description:
    "Wenaya est la première plateforme de santé intégrée au Maroc. Kinésithérapie, psychologie clinique, nutrition et bien-être corporate — depuis Casablanca. Notée 4,7/5 sur Google Maps.",
  alternates: {
    canonical: "https://www.wenaya.com",
  },
  openGraph: {
    title: "Wenaya — Santé Intégrée & Bien-être | Casablanca, Maroc",
    description:
      "Morocco's first integrated health and wellbeing platform. Physiotherapy, clinical psychology, nutrition, and corporate wellness — from Casablanca.",
    url: "https://www.wenaya.com",
  },
};

import dynamic from "next/dynamic";
import Banner from "@/components/Banner";
import HeroSection from "@/components/HeroSection";
import SectionBreak from "@/components/SectionBreak";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { getPublishedPosts, authors, categories } from "@/lib/blog";

/** Lazy-loaded sections — imported dynamically for code splitting and faster initial load */
const HowItWorks = dynamic(() => import("@/components/HowItWorks"), { ssr: true });
const DiseaseMarquee = dynamic(() => import("@/components/DiseaseMarquee"), { ssr: true });
const Biomarkers = dynamic(() => import("@/components/Biomarkers"), { ssr: true });
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"), { ssr: true });
const ComparisonTable = dynamic(() => import("@/components/ComparisonTable"), { ssr: true });
const Pricing = dynamic(() => import("@/components/Pricing"), { ssr: true });
const CoursAteliers = dynamic(() => import("@/components/CoursAteliers"), { ssr: true });
const CtaSection = dynamic(() => import("@/components/CtaSection"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });
const YoloSection = dynamic(() => import("@/components/YoloSection"), { ssr: true });
const BlogSection = dynamic(() => import("@/components/blog/BlogSection"), { ssr: true });
const ExpertiseSection = dynamic(() => import("@/components/about/ExpertiseSection"), { ssr: true });

/** Tiny vertical spacer between sections */
function Spacer(): React.JSX.Element {
  return <div className="h-4 sm:h-6" />;
}

/** Homepage — assembles all landing page sections in order with data-section-bg for nav theme detection */
export default function Home() {
  /** Fetch the 3 most recent published blog posts for the homepage blog preview */
  const posts = getPublishedPosts();
  const enriched = posts.slice(0, 3).map((p) => ({
    ...p,
    author: authors.find((a) => a.id === p.authorId),
    category: categories.find((c) => c.id === p.categoryId),
  }));

  return (
    <ErrorBoundary>
      {/* ── Page sections (data-section-bg tells the nav to switch dark/light theme) ── */}
      <div className="flex flex-col min-h-screen">
        <div data-section-bg="dark"><Banner /></div> {/* Top promotional banner */}
        <div data-section-bg="dark"><HeroSection /></div> {/* Hero with video background, headline, trust bar */}
        <SectionBreak /> {/* Decorative divider */}
        <div data-section-bg="light"><HowItWorks /></div> {/* How it works — 3-step process */}
        <Spacer />
        <div data-section-bg="light"><DiseaseMarquee /></div> {/* Scrolling disease/wellness topics marquee */}
        <Spacer />
        <div data-section-bg="light"><Biomarkers /></div> {/* Biomarker visualization section */}
        <Spacer />
        <div data-section-bg="light"><TestimonialsSection /></div> {/* Stats + patient testimonials */}
        <SectionBreak />
        <div data-section-bg="light"><ExpertiseSection /></div> {/* Medical specialties — links to specialist profiles */}
        <Spacer />
        <div data-section-bg="light"><ComparisonTable /></div> {/* Wenaya vs competitors comparison */}
        <Spacer />
        <div data-section-bg="light"><Pricing /></div> {/* Pricing cards */}
        <Spacer />
        <div data-section-bg="dark"><CoursAteliers /></div> {/* Courses & workshops section */}
        <div data-section-bg="dark"><CtaSection /></div> {/* Final CTA with quote */}
        <Spacer />
        <div data-section-bg="light"><BlogSection posts={enriched} /></div> {/* Latest blog posts preview */}
        <Spacer />
        <div data-section-bg="dark"><YoloSection /></div> {/* Interactive visual/exploration section */}
        <div data-section-bg="dark"><Footer /></div> {/* Site footer */}
      </div>
    </ErrorBoundary>
  );
}
