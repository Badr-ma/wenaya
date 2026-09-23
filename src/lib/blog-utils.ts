/**
 * Blog utility helpers — formatting, display constants, and the shared
 * presentation models consumed by blog components (client + server).
 *
 * `Post`/`Author`/`Category` were relocated here from `src/lib/blog.ts`
 * (deleted) so the presentation layer keeps a single type home with no
 * dependency on the removed local-MDX data layer. All blog UI reads these
 * models only; live article rows are mapped into them by `./blog-mappers`.
 */

/** Author model — represents a blog post author with avatar and bio */
export interface Author {
  id: string;
  name: string;
  avatar: string;
  role: string;
  bio: string;
}

/** Category model — groups blog posts into topics (longevity, biomarkers, etc.) */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

/** Post model — a single blog post in its presentation form */
export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  authorId: string;
  categoryId: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  status: "draft" | "published";
  publishedAt: string;
  readingTime: number;
}

/** Convenience type — a Post with optional author/category references resolved */
export type PostWithAuthor = Post & { author?: Author; category?: Category };

/** Formats a date string (e.g., French "15 juin 2026", English "June 15, 2026") */
export function formatDate(dateStr: string, locale: "fr" | "en" = "fr"): string {
  return new Date(dateStr).toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Tailwind color classes per blog category — controls badge colors on blog cards */
export const categoryColors: Record<string, string> = {
  longevity: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  biomarkers: "bg-blue-500/10 text-blue-600 border-blue-200",
  nutrition: "bg-amber-500/10 text-amber-600 border-amber-200",
  "ai-health": "bg-purple-500/10 text-purple-600 border-purple-200",
  prevention: "bg-rose-500/10 text-rose-600 border-rose-200",
};
