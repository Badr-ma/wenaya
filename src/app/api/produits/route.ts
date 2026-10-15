/**
 * Public products BFF — proxies the live Laravel catalogue to the /produits UI.
 *
 * The upstream endpoint is GET /api/v2/{companySlug}/public/products.
 * This route returns the legacy paginated shape expected by ProductsGrid.
 */
import { NextResponse, type NextRequest } from "next/server";
import {
  fetchPublicProducts,
  mapBackendProductToProductItem,
  type BackendPublicProduct,
} from "@/lib/products/api-adapter";

export const runtime = "nodejs";

function normalizeParam(value: string | null): string {
  return value ?? "";
}

function parseListParam(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function matchesSearch(product: BackendPublicProduct, query: string): boolean {
  if (!query) return true;
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  const haystack = [
    product.name,
    product.description ?? "",
    product.category ?? "",
    ...(product.goals ?? []),
    ...(product.topics ?? []),
    product.brand ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return tokens.every((token) => haystack.includes(token));
}

function matchesCategory(
  product: BackendPublicProduct,
  category: string,
): boolean {
  if (!category) return true;
  return (product.category ?? "").toLowerCase() === category.toLowerCase();
}

function matchesAny(
  product: BackendPublicProduct,
  field: "goals" | "topics",
  values: string[],
): boolean {
  if (values.length === 0) return true;
  const productValues = (product[field] ?? []).map((v) => v.toLowerCase());
  return values.some((v) => productValues.includes(v.toLowerCase()));
}

function sortProducts(
  products: BackendPublicProduct[],
  sort: string,
): BackendPublicProduct[] {
  const sorted = [...products];
  switch (sort) {
    case "mostPopular":
      sorted.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
      break;
    case "newest":
      sorted.sort((a, b) => {
        if (a.created_at && b.created_at) {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
        return (b.id ?? 0) - (a.id ?? 0);
      });
      break;
    case "bestRated":
    default:
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
  }
  return sorted;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;

    const search = normalizeParam(searchParams.get("search"));
    const category = normalizeParam(searchParams.get("category"));
    const goals = parseListParam(searchParams.get("goals"));
    const topics = parseListParam(searchParams.get("topics"));
    const sort = normalizeParam(searchParams.get("sort")) || "bestRated";
    const page = Math.max(
      1,
      parseInt(normalizeParam(searchParams.get("page")) || "1", 10),
    );
    const limit = Math.max(
      1,
      Math.min(
        100,
        parseInt(normalizeParam(searchParams.get("limit")) || "12", 10),
      ),
    );

    const backendProducts = await fetchPublicProducts();

    const filtered = backendProducts.filter((p) => {
      if (!matchesSearch(p, search)) return false;
      if (!matchesCategory(p, category)) return false;
      if (!matchesAny(p, "goals", goals)) return false;
      if (!matchesAny(p, "topics", topics)) return false;
      return true;
    });

    const sorted = sortProducts(filtered, sort);

    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;
    const paginated = sorted.slice(start, start + limit);

    const items = paginated.map((p) => mapBackendProductToProductItem(p));

    return NextResponse.json({
      items,
      total,
      page: safePage,
      totalPages,
      hasMore: safePage < totalPages,
    });
  } catch (error) {
    console.error("[api/produits] failed to load products", error);

    return NextResponse.json(
      {
        items: [],
        total: 0,
        page: 1,
        totalPages: 0,
        hasMore: false,
      },
      { status: 200 },
    );
  }
}
