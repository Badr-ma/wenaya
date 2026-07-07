import type { Metadata } from "next";

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

const HowItWorks = dynamic(() => import("@/components/HowItWorks"), { ssr: true });
const DiseaseMarquee = dynamic(() => import("@/components/DiseaseMarquee"), { ssr: true });
const Biomarkers = dynamic(() => import("@/components/Biomarkers"), { ssr: true });
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"), { ssr: true });
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: true });
const ComparisonTable = dynamic(() => import("@/components/ComparisonTable"), { ssr: true });
const Pricing = dynamic(() => import("@/components/Pricing"), { ssr: true });
const CoursAteliers = dynamic(() => import("@/components/CoursAteliers"), { ssr: true });
const CtaSection = dynamic(() => import("@/components/CtaSection"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });
const YoloSection = dynamic(() => import("@/components/YoloSection"), { ssr: true });
const BlogSection = dynamic(() => import("@/components/blog/BlogSection"), { ssr: true });

function Spacer(): React.JSX.Element {
  return <div className="h-4 sm:h-6" />;
}

export default function Home() {
  const posts = getPublishedPosts();
  const enriched = posts.slice(0, 3).map((p) => ({
    ...p,
    author: authors.find((a) => a.id === p.authorId),
    category: categories.find((c) => c.id === p.categoryId),
  }));

  return (
    <ErrorBoundary>
    <div className="flex flex-col min-h-screen">
      <div data-section-bg="dark"><Banner /></div>
      <div data-section-bg="dark"><HeroSection /></div>
      <SectionBreak />
      <div data-section-bg="light"><HowItWorks /></div>
      <Spacer />
      <div data-section-bg="light"><DiseaseMarquee /></div>
      <Spacer />
      <div data-section-bg="light"><Biomarkers /></div>
      <Spacer />
      <div data-section-bg="light"><TestimonialsSection /></div>
      <Spacer />
      <div data-section-bg="light"><Testimonials /></div>
      <SectionBreak />
      <div data-section-bg="light"><ComparisonTable /></div>
      <Spacer />
      <div data-section-bg="light"><Pricing /></div>
      <Spacer />
      <div data-section-bg="dark"><CoursAteliers /></div>
      <div data-section-bg="dark"><CtaSection /></div>
      <Spacer />
      <div data-section-bg="light"><BlogSection posts={enriched} /></div>
      <Spacer />
      <div data-section-bg="dark"><YoloSection /></div>
      <div data-section-bg="dark"><Footer /></div>
    </div>
    </ErrorBoundary>
  );
}
