import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ProductsGrid from "@/components/produits/ProductsGrid";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Nos Produits — Compléments, Appareils & Programmes Bien-être | Wenaya",
  description:
    "Découvrez notre sélection de produits santé et bien-être : compléments nutritionnels, appareils de thérapie, wearables, soins de la peau et programmes personnalisés par nos spécialistes.",
  alternates: { canonical: "https://www.wenaya.com/produits" },
  openGraph: {
    title: "Nos Produits — Wenaya",
    description:
      "Produits de santé, bien-être et longévité sélectionnés par nos spécialistes pour une santé optimale.",
    url: "https://www.wenaya.com/produits",
    type: "website",
  },
};

export default function ProduitsPage() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <ProductsGrid />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
