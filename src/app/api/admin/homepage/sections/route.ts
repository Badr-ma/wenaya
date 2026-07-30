import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getTokenFromRequest } from "@/lib/admin-auth";
import { addSection } from "@/lib/homepage";
import type { SectionType } from "@/lib/homepage-types";

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyToken(token).valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { type } = await req.json();
    if (!type) {
      return NextResponse.json({ error: "Section type required" }, { status: 400 });
    }
    const draft = await addSection(type as SectionType);
    return NextResponse.json({ data: draft, success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
