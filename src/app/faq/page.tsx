import type { Metadata } from "next";
import FaqSection from "@/components/FaqSection";

export const metadata: Metadata = {
  title: "FAQ — Wenaya",
  description:
    "Tout savoir sur Wenaya Clinic : soins en kinésithérapie, ostéopathie, psychologie, nutrition, programmes bien-être en entreprise, rendez-vous, remboursement et téléconsultation.",
};

export default function FaqPage() {
  return <FaqSection />;
}
