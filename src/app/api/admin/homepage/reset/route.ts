import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getTokenFromRequest } from "@/lib/admin-auth";
import { resetHomepageDraft } from "@/lib/homepage";

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyToken(token).valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await resetHomepageDraft();
    return NextResponse.json({ data, success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
