/**
 * Products API Route — INTENTIONALLY DISABLED (shop is frozen / coming soon).
 *
 * This endpoint used to serve the hardcoded demo catalogue from
 * `@/lib/produits` (synthetic products, prices and reviews) as PUBLIC,
 * CACHEABLE JSON — i.e. it published fabricated merchandise to any crawler or
 * client that asked. The `/produits` page renders the "shop coming soon"
 * editorial landing and never called this route (its only caller,
 * `components/produits/ProductsGrid.tsx`, is itself unreferenced), so nothing in
 * the product depends on it.
 *
 * It now answers an explicit 404 in every environment. No product is invented
 * until a real catalogue backend exists; the demo dataset stays in
 * `@/lib/produits` only as unreachable reference data.
 *
 * RESTORE CONDITION: wire a real product API (or repoint `getProduits` at a
 * backend) before re-enabling a public JSON surface.
 */
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** No fabricated catalogue is ever served, in dev or production. */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      error: "not_found",
      message: "The Wenaya shop is not yet available. No product catalogue is published.",
    },
    { status: 404, headers: { "Cache-Control": "no-store" } }
  );
}
