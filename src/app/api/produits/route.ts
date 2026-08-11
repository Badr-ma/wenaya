/**
 * Products API Route — serves product data as JSON for the /produits page.
 * Supports search, filtering by goals/category/topics, and sorting.
 * Uses the shared getProduits query (same logic as SSR initial data).
 */
import { NextRequest, NextResponse } from "next/server";
import { getProduits } from "@/lib/produits";

export const runtime = "nodejs"; // Required for fs access in some environments

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "fr";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);
  const category = searchParams.get("category");
  const search = searchParams.get("search") || "";
  const goals = searchParams.get("goals")?.split(",").filter(Boolean) || [];
  const topics = searchParams.get("topics")?.split(",").filter(Boolean) || [];
  const sort = searchParams.get("sort") || "bestRated";

  const result = getProduits({
    locale,
    page,
    limit,
    category,
    search,
    goals,
    topics,
    sort,
  });

  const res = NextResponse.json(result);
  res.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=600");
  return res;
}
