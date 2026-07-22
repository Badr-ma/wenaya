/**
 * Products API Route — serves product data as JSON for the /produits page.
 * Supports search, filtering by goals/category/topics, and sorting.
 * Reads from the French translations data and returns filtered results.
 */
import { NextRequest, NextResponse } from "next/server";
import fr from "@/i18n/fr";
import en from "@/i18n/en";

export const runtime = "nodejs"; // Required for fs access in some environments

type ProductItem = {
  slug: string;
  title: string;
  desc: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  goals: string[];
  topics: string[];
};

const locales: Record<string, { produits: { items: ProductItem[] } }> = { fr, en };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "fr";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
  const category = searchParams.get("category");
  const search = searchParams.get("search") || "";
  const goals = searchParams.get("goals")?.split(",").filter(Boolean) || [];
  const topics = searchParams.get("topics")?.split(",").filter(Boolean) || [];
  const sort = searchParams.get("sort") || "bestRated";

  const data = locales[locale] || fr;
  let items = [...data.produits.items] as ProductItem[];

  if (category) {
    items = items.filter((item) => item.category === category);
  }
  if (goals.length > 0) {
    items = items.filter((item) => item.goals.some((g) => goals.includes(g)));
  }
  if (topics.length > 0) {
    items = items.filter((item) => item.topics.some((t) => topics.includes(t)));
  }
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)
    );
  }

  switch (sort) {
    case "bestRated":
      items.sort((a, b) => b.rating - a.rating);
      break;
    case "mostPopular":
      items.sort((a, b) => b.reviews - a.reviews);
      break;
  }

  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  const res = NextResponse.json({
    items: paged,
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
  });
  res.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=600");
  return res;
}
