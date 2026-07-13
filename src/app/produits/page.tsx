import type { Metadata } from "next";
import { Suspense } from "react";
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

function ProductsSkeleton() {
  return (
    <section className="bg-[#F2EFE9] pt-36 sm:pt-44 pb-20 sm:pb-28 px-6">
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="max-w-2xl mx-auto text-center mb-14 space-y-4">
          <div className="h-12 w-64 bg-[#0B1220]/5 rounded mx-auto" />
          <div className="h-4 w-80 bg-[#0B1220]/5 rounded mx-auto max-w-sm" />
        </div>
        <div className="flex gap-4 mb-10">
          <div className="h-8 w-20 bg-[#0B1220]/5 rounded-full" />
          <div className="h-8 w-24 bg-[#0B1220]/5 rounded-full" />
          <div className="h-8 w-20 bg-[#0B1220]/5 rounded-full" />
          <div className="h-8 w-28 bg-[#0B1220]/5 rounded-full" />
          <div className="h-8 w-32 bg-[#0B1220]/5 rounded-full ml-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 xl:gap-x-5 gap-y-14 sm:gap-y-16">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-[#E8E2D9] rounded-xl" />
              <div className="h-5 w-3/4 bg-[#0B1220]/5 rounded" />
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="w-2.5 h-2.5 rounded-full bg-[#0B1220]/5" />
                ))}
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-[#0B1220]/5 rounded" />
                <div className="h-3 w-2/3 bg-[#0B1220]/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProduitsPage() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductsGrid />
        </Suspense>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
