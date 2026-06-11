import type { Metadata } from "next";
import AboutHero from "@/components/AboutHero";
import WhyWeExist from "@/components/WhyWeExist";
import WenayaApproach from "@/components/WenayaApproach";
import ExpertiseSection from "@/components/ExpertiseSection";
import FutureVision from "@/components/FutureVision";

export const metadata: Metadata = {
  title: "About — Wenaya",
  description: "Wenaya brings together physical health, mental wellbeing, nutrition, rehabilitation, and preventive care into one integrated experience designed around people, not symptoms.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <AboutHero />
      <WhyWeExist />
      <WenayaApproach />
      <ExpertiseSection />
      <FutureVision />
    </div>
  );
}
