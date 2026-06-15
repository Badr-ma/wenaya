import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wenaya — Santé Intégrée & Bien-être | Casablanca, Maroc",
  description:
    "Wenaya est la première plateforme de santé intégrée au Maroc. Kinésithérapie, psychologie clinique, nutrition, bien-être corporate et Yolo AI — depuis Casablanca. Notée 4,7/5 sur Google Maps.",
  alternates: {
    canonical: "https://www.wenaya.com",
  },
  openGraph: {
    title: "Wenaya — Santé Intégrée & Bien-être | Casablanca, Maroc",
    description:
      "Morocco's first integrated health and wellbeing platform. Physiotherapy, clinical psychology, nutrition, corporate wellness, and Yolo AI — from Casablanca.",
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
      <Banner />
      <HeroSection />
      <SectionBreak />
      <HowItWorks />
      <Spacer />
      <DiseaseMarquee />
      <Spacer />
      <Biomarkers />
      <Spacer />
      <TestimonialsSection />
      <Spacer />
      <Testimonials />
      <SectionBreak />
      <ComparisonTable />
      <Spacer />
      <Pricing />
      <Spacer />
      <CtaSection />
      <Spacer />
      <BlogSection posts={enriched} />
      <Spacer />
      <YoloSection />
      <Footer />
    </div>
    </ErrorBoundary>
  );
}
