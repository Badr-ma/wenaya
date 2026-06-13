import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FAQ — Wenaya",
  description:
    "Tout savoir sur Wenaya Clinic : soins en kinésithérapie, ostéopathie, psychologie, nutrition, programmes bien-être en entreprise, rendez-vous, remboursement et téléconsultation.",
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
