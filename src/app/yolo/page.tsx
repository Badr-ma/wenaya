import type { Metadata } from "next";
import StickyProgressScroll from "@/components/StickyProgressScroll";

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
  return <StickyProgressScroll />;
}
