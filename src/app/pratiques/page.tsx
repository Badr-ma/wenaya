/**
 * Pratiques Page — listing of all wellness practices (kinésithérapie, psychologie, etc.).
 * Renders the PratiquesGrid component with search, filters, and animated card grid.
 * Includes breadcrumbs, SEO metadata, and Footer.
 */
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import PratiquesGrid from "@/components/pratiques/PratiquesGrid";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Nos Pratiques — Kinésithérapie, Ostéopathie, Psychologie & Nutrition | Wenaya",
  description:
    "Découvrez toutes les pratiques Wenaya : kinésithérapie, ostéopathie, psychologie clinique, neuropsychologie, nutrition, orthophonie, naturopathie, psychomotricité et thérapies complémentaires à Casablanca.",
  alternates: {
    canonical: "https://www.wenaya.com/pratiques",
  },
  openGraph: {
    title: "Nos Pratiques — Wenaya",
    description:
      "Kinésithérapie, ostéopathie, psychologie, nutrition et plus — une approche intégrée pour votre santé à Casablanca.",
    url: "https://www.wenaya.com/pratiques",
    type: "website",
  },
};

export default function PratiquesPage() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Breadcrumbs />
        <PratiquesGrid />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
