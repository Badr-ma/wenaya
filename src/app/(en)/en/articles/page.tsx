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
    canonical: `${SITE_URL}/en/articles`,
    languages: languageAlternates("/articles"),
  },
  openGraph: {
    ...OG_DEFAULTS,
    locale: "en_MA",
    title: "Health & Wellness Blog — Wenaya",
    description:
      "Articles, guides and health tips from the Wenaya Casablanca experts.",
    url: `${SITE_URL}/en/articles`,
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: "Health & Wellness Blog — Wenaya",
    description:
      "Articles, guides and health tips from the Wenaya Casablanca experts.",
  },
};

export default async function EnglishBlogPage() {
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
