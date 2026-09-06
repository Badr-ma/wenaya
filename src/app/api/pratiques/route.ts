/**
 * Practices API Route — server-side proxy between the PratiquesGrid (browser)
 * and the real Wenaya backend listing. The browser never calls api.wenaya.com;
 * it only talks to this handler.
 *
 * Supports page / locale / category / search (same query shape as the SSR
 * `getPracticesPageAsync` call). Responds with the paginated contract
 * `{ items, total, page, pageSize, totalPages, hasMore, dataSource }` plus an
 * `X-Data-Source` header ("api" | "local-fallback") so QA can verify the data
 * path without inspecting the body.
 */
import { NextRequest, NextResponse } from "next/server";
import { getPracticesPageAsync, PRATIQUES_PAGE_SIZE } from "@/lib/pratiques";

export const runtime = "nodejs";

/** Kept dynamic — each request must reflect the current backend state, and the
 *  underlying fetch's data cache is already revalidated via `next.revalidate`. */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "fr";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("pageSize") || String(PRATIQUES_PAGE_SIZE), 10);
  const category = searchParams.get("category") || null;
  const search = searchParams.get("search") || "";

  try {
    const result = await getPracticesPageAsync({
      locale,
      page: Number.isFinite(page) ? Math.max(1, page) : 1,
      pageSize: Number.isFinite(limit) ? Math.min(50, Math.max(1, limit)) : PRATIQUES_PAGE_SIZE,
      category,
      search,
    });

    const res = NextResponse.json(result);
    res.headers.set("Cache-Control", "no-store");
    res.headers.set("X-Data-Source", result.dataSource);
    return res;
  } catch {
    return NextResponse.json({ error: "unable to load practices" }, { status: 500 });
  }
}