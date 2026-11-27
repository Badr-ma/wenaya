import { httpRequest } from "@/lib/http-request";
import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api-base";

export const dynamic = "force-dynamic";

// These are the same locked referral options and IDs returned by Wenaya's
// production getSourceParrainage endpoint. Keep the form usable while the dev
// API's source endpoint is unavailable; when the API responds, its active list
// remains authoritative.
const LEGACY_SOURCES = [
  { id: "2", name: "Bouche a Oreille" },
  { id: "4", name: "Facebook" },
  { id: "3", name: "Instagram" },
  { id: "5", name: "LinkedIn" },
  { id: "1", name: "Medecin Traitant" },
  { id: "8", name: "Recherche Web" },
  { id: "6", name: "Tiktok" },
  { id: "7", name: "YouTube" },
];

export async function GET(): Promise<NextResponse> {
  try {
    const response = await httpRequest(`${getApiBaseUrl()}/api/v1/getSourceParrainage`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const payload: unknown = await response.json();
    if (!response.ok || !payload || typeof payload !== "object" || Array.isArray(payload)) {
      return NextResponse.json({ success: true, sources: LEGACY_SOURCES, dataSource: "fallback" });
    }
    const outer = payload as Record<string, unknown>;
    const data = outer.data;
    const rows = Array.isArray(data)
      ? data
      : data && typeof data === "object" && Array.isArray((data as Record<string, unknown>).data)
        ? (data as Record<string, unknown>).data as unknown[]
        : [];
    const sources = rows.flatMap((row) => {
      if (!row || typeof row !== "object" || Array.isArray(row)) return [];
      const source = row as Record<string, unknown>;
      if ((typeof source.id !== "string" && typeof source.id !== "number") || typeof source.name !== "string") return [];
      return [{ id: String(source.id), name: source.name.slice(0, 120) }];
    });
    return NextResponse.json({
      success: true,
      sources: sources.length ? sources : LEGACY_SOURCES,
      dataSource: sources.length ? "api" : "fallback",
    });
  } catch {
    return NextResponse.json({ success: true, sources: LEGACY_SOURCES, dataSource: "fallback" });
  }
}
