import { NextRequest, NextResponse } from "next/server";
import { getArticlesPage, blogApiErrorLabel } from "@/lib/blog-articles-api";
import { toFeedPost } from "@/lib/blog-mappers";

/**
 * Blog feed — consumed client-side by the homepage blog section
 * (see HomepageRenderer). Both locales read the SAME live Wenaya backend
 * top-3 via the adapter; EN no longer has a local EN blog, it shows the same
 * articles with EN chrome. The `locale` query string is still appended by the
 * section wrapper but is intentionally ignored — there is no separate EN feed.
 */
export async function GET(request: NextRequest) {
  try {
    const { articles } = await getArticlesPage(1);
    const isListing = request.nextUrl.searchParams.get("view") === "listing";
    const enriched = (isListing ? articles : articles.slice(0, 3)).map(toFeedPost);
    const response = NextResponse.json({ data: enriched });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error(`[blog] feed fetch failed: ${blogApiErrorLabel(error)}`);
    return NextResponse.json(
      { error: "The blog feed is temporarily unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
