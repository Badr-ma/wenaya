import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FAQ — Questions Fréquentes sur Wenaya & Yolo AI",
  description:
    "Tout savoir sur Wenaya : kinésithérapie, psychologie, nutrition, bien-être corporate, Yolo AI et nos programmes hôtellerie wellness à Casablanca, Maroc.",
  alternates: { canonical: "https://www.wenaya.com/faq" },
  openGraph: {
    title: "FAQ — Questions Fréquentes sur Wenaya & Yolo AI",
    description:
      "Answers to the most common questions about Wenaya's integrated health platform, Yolo AI, corporate wellness programs, and hospitality partnerships in Morocco.",
    url: "https://www.wenaya.com/faq",
    type: "website",
  },
};

export default function FaqPage() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <FaqSection />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
