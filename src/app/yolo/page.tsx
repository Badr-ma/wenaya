import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import StickyProgressScroll from "@/components/StickyProgressScroll";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Yolo AI — Assistant Bien-être Disponible 24h/24 | Wenaya",
  description:
    "Yolo est l'assistant IA de bien-être de Wenaya, disponible 24h/24 et 7j/7. Conseils personnalisés en santé physique, mentale et nutrition — avec escalade directe vers les spécialistes Wenaya quand nécessaire.",
  keywords: [
    "Yolo AI bien-être",
    "assistant IA santé Maroc",
    "wellbeing AI 24/7",
    "IA santé préventive Casablanca",
    "assistant santé mentale IA",
    "suivi santé IA",
    "corporate wellness AI Maroc",
    "nutrition IA personnalisée",
    "prévention santé IA",
    "health AI Morocco",
  ],
  alternates: { canonical: "https://www.wenaya.com/yolo" },
  openGraph: {
    title: "Yolo AI — Assistant Bien-être Disponible 24h/24 | Wenaya",
    description:
      "Yolo is Wenaya's AI-powered wellbeing assistant. Personalized guidance on physical health, mental wellbeing, nutrition, and prevention — available 24/7, with direct escalation to licensed Wenaya specialists.",
    url: "https://www.wenaya.com/yolo",
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
