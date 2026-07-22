/**
 * Blog Post Page — server component that renders a single blog post.
 * Fetches post by slug, generates dynamic metadata (title, description, OG image),
 * renders structured data (BlogPosting schema), breadcrumbs, and the BlogPostClient.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getPublishedPosts, authors, categories } from "@/lib/blog";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import BlogPostClient from "./BlogPostClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPublishedPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const author = authors.find((a) => a.id === post.authorId);
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `https://www.wenaya.com/blog/${slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      images: [{ url: post.ogImage }],
      type: "article",
      locale: "fr_FR",
      publishedTime: post.publishedAt,
      authors: author ? [author.name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
      images: [post.ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const author = authors.find((a) => a.id === post.authorId);
  const category = categories.find((c) => c.id === post.categoryId);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wenaya.com";

  const related = getPublishedPosts()
    .filter((p) => p.slug !== post.slug && p.categoryId === post.categoryId)
    .slice(0, 3)
    .map((p) => ({
      ...p,
      author: authors.find((a) => a.id === p.authorId),
      category: categories.find((c) => c.id === p.categoryId),
    }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    image: post.ogImage,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: author ? {
      "@type": "Person",
      name: author.name,
      url: `${siteUrl}/blog?author=${author.id}`,
    } : undefined,
    publisher: {
      "@type": "Organization",
      name: "Wenaya",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/images/logo-full.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
    articleSection: category?.name,
    inLanguage: "fr-FR",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ErrorBoundary>
        <Breadcrumbs />
        <BlogPostClient post={{ ...post, author, category }} related={related} />
        <div data-section-bg="dark"><Footer /></div>
      </ErrorBoundary>
    </>
  );
}
