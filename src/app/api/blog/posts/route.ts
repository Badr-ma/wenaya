import { NextResponse } from "next/server";
import { getArticlesPage } from "@/lib/blog-articles-api";
import { toFeedPost } from "@/lib/blog-mappers";

/**
 * Blog feed — consumed client-side by the homepage blog section
 * (see HomepageRenderer). Both locales read the SAME live Wenaya backend
 * top-3 via the adapter; EN no longer has a local EN blog, it shows the same
 * articles with EN chrome. The `locale` query string is still appended by the
 * section wrapper but is intentionally ignored — there is no separate EN feed.
 */
export async function GET() {
  const { articles } = await getArticlesPage(1);
  const enriched = articles.slice(0, 3).map(toFeedPost);
  return NextResponse.json({ data: enriched });
}