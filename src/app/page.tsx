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

import Banner from "@/components/Banner";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import DiseaseMarquee from "@/components/DiseaseMarquee";
import Biomarkers from "@/components/Biomarkers";
import TestimonialsSection from "@/components/TestimonialsSection";
import Testimonials from "@/components/Testimonials";
import ComparisonTable from "@/components/ComparisonTable";
import Pricing from "@/components/Pricing";
import CtaSection from "@/components/CtaSection";
import CoursAteliers from "@/components/CoursAteliers";
import Footer from "@/components/Footer";
import YoloSection from "@/components/YoloSection";
import SectionBreak from "@/components/SectionBreak";
import BlogSection from "@/components/blog/BlogSection";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { getPublishedPosts, authors, categories } from "@/lib/blog";

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
