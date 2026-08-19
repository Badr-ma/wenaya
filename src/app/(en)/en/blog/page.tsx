import type { Metadata } from "next";
import { getPublishedPosts, authors, categories } from "@/lib/blog";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";
import BlogHero from "@/components/blog/BlogHero";
import BlogListClient from "@/components/blog/BlogListClient";

export const metadata: Metadata = {
  title: "Health & Wellness Blog — Tips, Studies & Guides | Wenaya",
  description:
    "Articles, guides and health tips from the Wenaya Casablanca experts. Physiotherapy, nutrition, psychology, prevention and wellness — get inspired for a healthier life.",
  keywords: [
    "health blog Casablanca",
    "wellness tips Morocco",
    "physiotherapy articles",
    "preventive nutrition blog",
    "mental health advice",
    "longevity articles",
    "biomarkers explained",
  ],
  alternates: {
    canonical: `${SITE_URL}/en/blog`,
    languages: languageAlternates("/blog"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Health & Wellness Blog — Wenaya",
    description:
      "Articles, guides and health tips from the Wenaya Casablanca experts.",
    url: `${SITE_URL}/en/blog`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Health & Wellness Blog — Wenaya",
    description:
      "Articles, guides and health tips from the Wenaya Casablanca experts.",
  },
};

export default function EnglishBlogPage() {
  const posts = getPublishedPosts();
  const enriched = posts.map((p) => ({
    ...p,
    author: authors.find((a) => a.id === p.authorId),
    category: categories.find((c) => c.id === p.categoryId),
  }));

  const latest = enriched[0];

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-[#F2EFE9]">
      <main>
        <Breadcrumbs />
        <BlogHero latest={latest} />
        <BlogListClient posts={enriched} categories={categories} />
      </main>
      <div data-section-bg="dark"><Footer /></div>
    </div>
    </ErrorBoundary>
  );
}
