import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import AboutHero from "@/components/AboutHero";
import WhyWeExist from "@/components/WhyWeExist";
import WenayaApproach from "@/components/WenayaApproach";
import ExpertiseSection from "@/components/ExpertiseSection";
import FutureVision from "@/components/FutureVision";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About — Wenaya",
  description: "Wenaya brings together physical health, mental wellbeing, nutrition, rehabilitation, and preventive care into one integrated experience designed around people, not symptoms.",
};

export default function AboutPage() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col">
        <AboutHero />
        <WhyWeExist />
        <WenayaApproach />
        <ExpertiseSection />
        <FutureVision />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
