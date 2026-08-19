import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getPublishedPosts, authors, categories } from "@/lib/blog";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import BlogPostClient from "@/components/blog/BlogPostClient";
import { SITE_URL, OG_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";

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
  const category = categories.find((c) => c.id === post.categoryId);
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    category: category?.name,
    alternates: { canonical: `${SITE_URL}/en/blog/${slug}`, languages: languageAlternates(`/blog/${slug}`) },
    openGraph: {
      ...OG_DEFAULTS,
      locale: "en_MA",
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${SITE_URL}/en/blog/${slug}`,
      images: [{ url: post.ogImage }],
      type: "article",
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

export default async function EnglishBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const author = authors.find((a) => a.id === post.authorId);
  const category = categories.find((c) => c.id === post.categoryId);
  const siteUrl = SITE_URL;

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
      "@id": `${siteUrl}/en/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
    articleSection: category?.name,
    inLanguage: "en-MA",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ErrorBoundary>
        <main>
          <Breadcrumbs labels={{ [slug]: post.title }} />
          <BlogPostClient post={{ ...post, author, category }} related={related} />
        </main>
        <div data-section-bg="dark"><Footer /></div>
      </ErrorBoundary>
    </>
  );
}
