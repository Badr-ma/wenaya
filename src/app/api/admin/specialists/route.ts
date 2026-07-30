/**
 * Admin Specialists API — CRUD for specialist data.
 * GET falls back to hardcoded mock data when Redis is empty or unavailable.
 * PUT requires a valid admin token.
 */
import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { verifyToken, getTokenFromRequest } from "@/lib/admin-auth";
import { specialists as defaults, type Specialist } from "@/lib/specialistes";

const KEY = "admin:specialists";

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ data: defaults, source: "defaults" });
  }

  try {
    const stored = await redis.get<Specialist[]>(KEY);
    if (!stored || !Array.isArray(stored) || stored.length === 0) {
      return NextResponse.json({ data: defaults, source: "defaults" });
    }
    return NextResponse.json({ data: stored, source: "redis" });
  } catch {
    return NextResponse.json({ data: defaults, source: "defaults" });
  }
}

export async function PUT(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyToken(token).valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json(
      { error: "Redis not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env.local." },
      { status: 503 }
    );
  }

  try {
    const body: Specialist[] = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Body must be an array of specialists" }, { status: 400 });
    }

    await redis.set(KEY, body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token || !verifyToken(token).valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ success: true });
  }

  try {
    await redis.del(KEY);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
