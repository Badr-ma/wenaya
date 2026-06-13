import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import StickyProgressScroll from "@/components/StickyProgressScroll";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Yolo AI | Agent IA de Longévité et de Bien-être | Wenaya",
  description:
    "Découvrez Yolo, l'agent IA de bien-être et de longévité développé par Wenaya. Accompagnement 24/7, prévention, santé mentale, routines personnalisées, Health Score et sécurité de niveau entreprise.",
  keywords: [
    "agent IA bien-être",
    "IA santé préventive",
    "wellbeing AI",
    "santé mentale entreprise",
    "longévité",
    "wellness platform",
    "employee wellbeing",
    "corporate wellness Morocco",
    "wellbeing assistant",
    "health score",
  ],
  openGraph: {
    title: "Yolo AI | Agent IA de Longévité et de Bien-être | Wenaya",
    description:
      "Découvrez Yolo, l'agent IA de bien-être et de longévité développé par Wenaya. Accompagnement 24/7, prévention, santé mentale, routines personnalisées.",
    type: "website",
  },
};

export default function YoloPage() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <StickyProgressScroll />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
