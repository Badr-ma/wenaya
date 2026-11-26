import type { Metadata } from "next";
import PatientProfileForm from "@/components/patient-profile/PatientProfileForm";

export const metadata: Metadata = {
  title: "Edit a patient profile — Wenaya",
  robots: { index: false, follow: false },
};

export default async function EnglishEditPatientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PatientProfileForm mode="edit" profileId={id} locale="en" />;
}
