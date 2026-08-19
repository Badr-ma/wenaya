/**
 * Blog utility helpers — formatting and display constants.
 * Used by blog components for consistent styling and date presentation.
 */
import { Post, Author, Category } from "./blog";

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
