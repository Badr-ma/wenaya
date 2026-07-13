import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Programmes Bien-être Labellisés pour Entreprises | Wenaya Corporate",
  description:
    "Découvrez nos 4 programmes certifiés pour entreprises : PCM (Process Communication Model), Leadership 360°, L'Art des Priorités et People Model Canvas. Des méthodes éprouvées pour améliorer la communication, le leadership, la gestion du stress et la stratégie RH de vos équipes.",
  keywords: [
    "programme bien-être entreprise",
    "PCM Maroc",
    "Process Communication Model entreprise",
    "leadership 360 programme",
    "gestion des priorités formation",
    "People Model Canvas RH",
    "formation communication entreprise Casablanca",
    "programme santé mentale entreprise Maroc",
    "bien-être collaborateurs Maroc",
    "formation leadership Casablanca",
  ],
  openGraph: {
    title: "Programmes Labellisés Bien-être en Entreprise | Wenaya",
    description:
      "4 programmes certifiés pour transformer la santé, la communication et la performance de vos équipes. PCM, Leadership 360°, Art des Priorités, People Model Canvas.",
    url: "https://www.wenaya.com/solutions/entreprises/programmes",
  },
};

export default function ProgrammesLayout({ children }: { children: ReactNode }) {
  return children;
}
