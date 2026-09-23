/**
 * Blog mappers — converts normalized live Wenaya API article rows
 * (`ArticleSummary`/`ArticleDetail` from `./blog-articles-api`) into the
 * shared presentation models (`Post`/`PostWithAuthor` from `./blog-utils`).
 *
 * Single home for the mapping that was previously duplicated inline in the
 * FR listing page, FR detail page and the `/api/blog/posts` route. Both
 * locales consume the same live rows (EN shows the same French articles with
 * EN chrome) so the two locales now share one mapper contract — identical
 * FR/EN listing + detail behavior.
 *
 * Image precedence: listing/summary views are thumbnail-first, the detail
 * body is image-first (matches the previous FR page behavior). Broken images
 * fall back to a single neutral local asset (`BLOG_IMAGE_FALLBACK`); the old
 * `/images/blog/placeholder.jpg` fallback never existed in `public/`.
 */
import type { Post, PostWithAuthor, Author } from "./blog-utils";
import type { ArticleSummary, ArticleDetail, ArticleCreator } from "./blog-articles-api";

/** Neutral local fallback for broken/missing article images. */
export const BLOG_IMAGE_FALLBACK = "/images/wellness-stretch.jpg";

/** Projects the adapted creator identity into the shared Author model. */
function toAuthor(creator: ArticleCreator | null): Author | undefined {
  if (!creator) return undefined;
  return {
    id: String(creator.id),
    name: [creator.firstName, creator.lastName].filter(Boolean).join(" "),
    avatar: creator.avatar ?? "",
    role: "",
    bio: "",
  };
}

/** Shared base mapping — every mapper builds on this. */
function toPostBase(
  article: ArticleSummary,
  opts: { content?: string; imageFirst?: boolean; withAuthor?: boolean } = {}
): PostWithAuthor {
  const image = opts.imageFirst
    ? article.image ?? article.thumbnail ?? BLOG_IMAGE_FALLBACK
    : article.thumbnail ?? article.image ?? BLOG_IMAGE_FALLBACK;
  const author = opts.withAuthor ? toAuthor(article.creator) : undefined;
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.description ?? "",
    content: opts.content ?? "",
    featuredImage: image,
    author,
    authorId: String(article.creator?.id ?? ""),
    categoryId: "",
    tags: [],
    metaTitle: article.title,
    metaDescription: article.description ?? "",
    ogImage: image,
    status: "published",
    publishedAt: article.createdAt ?? new Date().toISOString(),
    readingTime: 0,
  };
}

/** Listing-card shape (no author block), thumbnail-first — FR/EN /articles. */
export function toClientPost(article: ArticleSummary): Post {
  return toPostBase(article);
}

/** Homepage-feed shape (author attached), thumbnail-first — /api/blog/posts + homepage fallback. */
export function toFeedPost(article: ArticleSummary): PostWithAuthor {
  return toPostBase(article, { withAuthor: true });
}

/** Detail-body shape: sanitized `details` content, image-first, author attached. */
export function toDetailPost(article: ArticleDetail): PostWithAuthor {
  return toPostBase(article, { content: article.details ?? "", imageFirst: true, withAuthor: true });
}

/** Related-article shape (no body), thumbnail-first, author attached. */
export function toPostSummary(article: ArticleSummary): PostWithAuthor {
  return toPostBase(article, { withAuthor: true });
}