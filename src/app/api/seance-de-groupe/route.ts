import { NextRequest, NextResponse } from "next/server";
import { getActiveGroupSessionsResult } from "@/lib/group-sessions-active";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") === "en" ? "en" : "fr";

  try {
    const result = await getActiveGroupSessionsResult(locale);
    if (result.loadError) {
      return NextResponse.json(
        { error: "Group sessions are temporarily unavailable" },
        { status: 503, headers: { "Cache-Control": "no-store" } }
      );
    }
    return NextResponse.json(
      { sessions: result.sessions },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { error: "Group sessions are temporarily unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
