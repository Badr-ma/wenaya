import type { Metadata } from "next";
import PatientProfileForm from "@/components/patient-profile/PatientProfileForm";

export const metadata: Metadata = {
  title: "Créer un profil patient — Wenaya",
  robots: { index: false, follow: false },
};

export default function PersonalInfoPage() {
  return <PatientProfileForm mode="create" />;
}
