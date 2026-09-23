/**
 * Blog Post Page — server component that renders a single blog post
 * from the LIVE Wenaya API. Fetches post by slug, generates dynamic
 * metadata (title, description, OG image), renders structured data
 * (BlogPosting schema), breadcrumbs, and the BlogPostClientEditorial.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import BlogPostClientEditorial from "@/components/blog/BlogPostClientEditorial";
import { getBlogPractitioner } from "@/lib/blog-practitioner";
import { SITE_URL, OG_DEFAULTS } from "@/lib/site-config";
import { languageAlternates } from "@/lib/hreflang";
import { getArticleBySlug, fetchAllArticles } from "@/lib/blog-articles-api";
import { toDetailPost, toPostSummary, BLOG_IMAGE_FALLBACK } from "@/lib/blog-mappers";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const articles = await fetchAllArticles();
    return articles.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const author = article.creator
    ? { name: [article.creator.firstName, article.creator.lastName].filter(Boolean).join(" ") }
    : null;

  return {
    title: article.title,
    description: article.description ?? undefined,
    alternates: { canonical: `${SITE_URL}/articles/${slug}`, languages: languageAlternates(`/articles/${slug}`) },
    openGraph: {
      ...OG_DEFAULTS,
      title: article.title,
      description: article.description ?? undefined,
      url: `${SITE_URL}/articles/${slug}`,
      images: [{ url: article.image ?? article.thumbnail ?? BLOG_IMAGE_FALLBACK }],
      type: "article",
      locale: "fr_MA",
      publishedTime: article.createdAt ?? undefined,
      authors: author ? [author.name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description ?? undefined,
      images: [article.image ?? article.thumbnail ?? BLOG_IMAGE_FALLBACK],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  let allArticles: Awaited<ReturnType<typeof fetchAllArticles>> = [];
  try {
    allArticles = await fetchAllArticles();
  } catch {
    allArticles = [];
  }
  const related = allArticles
    .filter((a) => a.slug !== slug)
    .slice(0, 3)
    .map(toPostSummary);

  const clientPost = toDetailPost(article);
  const practitioner = getBlogPractitioner(article.creator);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description ?? undefined,
    image: article.image ?? article.thumbnail ?? BLOG_IMAGE_FALLBACK,
    datePublished: article.createdAt ?? undefined,
    dateModified: article.updatedAt ?? article.createdAt ?? undefined,
    author: article.creator
      ? {
          "@type": "Person",
          name: [article.creator.firstName, article.creator.lastName].filter(Boolean).join(" "),
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Wenaya",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo-full.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/articles/${article.slug}`,
    },
    keywords: [],
    inLanguage: "fr-MA",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ErrorBoundary>
        <main>
          <Breadcrumbs labels={{ [slug]: article.title }} />
          <BlogPostClientEditorial post={clientPost} related={related} practitioner={practitioner} />
        </main>
        <div data-section-bg="dark"><Footer /></div>
      </ErrorBoundary>
    </>
  );
}
