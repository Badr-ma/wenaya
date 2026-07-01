import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ProductDetail from "@/components/produits/ProductDetail";
import Footer from "@/components/Footer";
import en from "@/i18n/en";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return (en.produits.items as { slug: string }[]).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = (en.produits.items as { slug: string; title: string; desc: string }[]).find((p) => p.slug === slug);
  if (!item) return {};
  return {
    title: `${item.title} — Wenaya`,
    description: item.desc,
    alternates: { canonical: `https://www.wenaya.com/produits/${slug}` },
    openGraph: {
      title: `${item.title} — Wenaya`,
      description: item.desc,
      url: `https://www.wenaya.com/produits/${slug}`,
    },
  };
}

export default async function ProduitPage({ params }: Props) {
  const { slug } = await params;
  const item = (en.produits.items as { slug: string }[]).find((p) => p.slug === slug);
  if (!item) notFound();

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <ProductDetail slug={slug} />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
