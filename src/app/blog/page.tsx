/**
 * Blog Listing Page — server component that fetches all published posts
 * and renders the blog hero (featured post) + filterable blog list grid.
 * Includes BlogPosting structured data, breadcrumbs, and pagination.
 */
import type { Metadata } from "next";
import { getPublishedPosts, authors, categories } from "@/lib/blog";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import BlogHero from "./BlogHero";
import BlogListClient from "./BlogListClient";

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
    canonical: "https://www.wenaya.com/blog",
  },
  openGraph: {
    title: "Blog Santé & Bien-être — Wenaya",
    description:
      "Articles, guides et conseils santé par les experts de Wenaya Casablanca.",
    url: "https://www.wenaya.com/blog",
    type: "website",
  },
};

export default function BlogPage() {
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
      <Breadcrumbs />
      <BlogHero latest={latest} />
      <BlogListClient posts={enriched} categories={categories} />
      <div data-section-bg="dark"><Footer /></div>
    </div>
    </ErrorBoundary>
  );
}
