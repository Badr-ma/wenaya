import type { Metadata } from "next";
import PatientProfileForm from "@/components/patient-profile/PatientProfileForm";

export const metadata: Metadata = {
  title: "Create a patient profile — Wenaya",
  robots: { index: false, follow: false },
};

export default function EnglishPersonalInfoPage() {
  return <PatientProfileForm mode="create" locale="en" />;
}
