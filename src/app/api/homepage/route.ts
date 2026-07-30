import { NextResponse } from "next/server";
import { getHomepagePublished } from "@/lib/homepage";

export async function GET() {
  const config = await getHomepagePublished();
  return NextResponse.json({ data: config });
}
