import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import FaqSection from "@/components/faq/FaqSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FAQ — Questions Fréquentes sur Wenaya",
  description:
    "Tout savoir sur Wenaya : kinésithérapie, psychologie, nutrition et bien-être corporate à Casablanca, Maroc.",
  alternates: { canonical: "https://www.wenaya.com/faq" },
  openGraph: {
    title: "FAQ — Questions Fréquentes sur Wenaya",
    description:
      "Answers to the most common questions about Wenaya's integrated health platform and corporate wellness programs in Morocco.",
    url: "https://www.wenaya.com/faq",
    type: "website",
  },
};

export default function FaqPage() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <FaqSection />
        <div data-section-bg="dark"><Footer /></div>
      </div>
    </ErrorBoundary>
  );
}
