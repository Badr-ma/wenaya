import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import CorporateDemoPage from "@/components/corporate-demo/CorporateDemoPage";

export const metadata: Metadata = {
  title: "Demo Corporate — Concept Page | Wenaya",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CorporateDemoENPage() {
  return (
    <ErrorBoundary>
      <CorporateDemoPage />
    </ErrorBoundary>
  );
}
