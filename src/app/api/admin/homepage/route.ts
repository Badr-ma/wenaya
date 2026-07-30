import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getTokenFromRequest } from "@/lib/admin-auth";
import { getHomepageDraft, saveHomepageDraft } from "@/lib/homepage";

export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyToken(token).valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const draft = await getHomepageDraft();
  return NextResponse.json({ data: draft, source: "redis" });
}

export async function PUT(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyToken(token).valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body || !Array.isArray(body.sections)) {
      return NextResponse.json({ error: "Invalid payload: sections array required" }, { status: 400 });
    }
    await saveHomepageDraft(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
