import { Post, Author, Category } from "./blog";

export type PostWithAuthor = Post & { author?: Author; category?: Category };

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const categoryColors: Record<string, string> = {
  longevity: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  biomarkers: "bg-blue-500/10 text-blue-600 border-blue-200",
  nutrition: "bg-amber-500/10 text-amber-600 border-amber-200",
  "ai-health": "bg-purple-500/10 text-purple-600 border-purple-200",
  prevention: "bg-rose-500/10 text-rose-600 border-rose-200",
};
