/**
 * Articles Listing Page — server component that fetches all published posts
 * from the LIVE Wenaya API and renders the blog hero (featured post)
 * + filterable blog list grid. Includes BlogPosting structured data,
 * breadcrumbs, and pagination.
 */
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import { SITE_URL, OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";
import BlogHero from "@/components/blog/BlogHero";
import BlogListClient from "@/components/blog/BlogListClient";
import { getArticlesPage } from "@/lib/blog-articles-api";
import { toClientPost } from "@/lib/blog-mappers";

export const metadata: Metadata = {
  title: "Blog Santé & Bien-être — Conseils, Études et Guides | Wenaya",
  description:
    "Articles, guides et conseils santé par les experts de Wenaya Casablanca. Kinésithérapie, nutrition, psychologie, prévention et bien-être — inspirez-vous pour une vie plus saine.",
  keywords: [
    "blog santé Casablanca",
    "conseils bien-être Maroc",
    "articles kinésithérapie",
    "nutrition préventive blog",
    "santé mentale conseils",
    "longévité articles",
    "biomarqueurs explication",
  ],
  alternates: {
    canonical: `${SITE_URL}/articles`,
    languages: languageAlternates("/articles"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Blog Santé & Bien-être — Wenaya",
    description:
      "Articles, guides et conseils santé par les experts de Wenaya Casablanca.",
    url: `${SITE_URL}/articles`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Blog Santé & Bien-être — Wenaya",
    description:
      "Articles, guides et conseils santé par les experts de Wenaya Casablanca.",
  },
};

export default async function BlogPage() {
  const { articles } = await getArticlesPage(1);
  const posts = articles.map(toClientPost);
  const latest = posts[0];

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-[#F2EFE9]">
      <main>
        <Breadcrumbs />
        <BlogHero latest={latest} />
        <BlogListClient posts={posts} categories={[]} />
      </main>
      <div data-section-bg="dark"><Footer /></div>
    </div>
    </ErrorBoundary>
  );
}
