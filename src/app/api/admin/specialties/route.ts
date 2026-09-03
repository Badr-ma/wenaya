/**
 * Admin Specialties API — CRUD for the legacy homepage specialties/marquee data.
 * GET falls back to i18n defaults when Redis is empty or unavailable.
 * PUT requires a valid admin token.
 * Note: the homepage Practices & Specialties section is now data-driven from the
 * shared practices adapter (i18n); this endpoint powers the legacy admin tab only.
 */
import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { verifyToken, getTokenFromRequest } from "@/lib/admin-auth";
import fr from "@/i18n/fr";

const KEY = "admin:specialties";

type SpecialtiesData = {
  badge: string;
  heading1: string;
  heading2: string;
  sub: string;
  specialites: string[];
  services: string[];
  therapies: string[];
  pillShape: "pill" | "square" | "rounded";
};

function getDefaults(): SpecialtiesData {
  const m = fr.diseaseMarquee;
  return {
    badge: m.badge,
    heading1: m.heading1,
    heading2: m.heading2,
    sub: m.sub,
    specialites: [...m.specialites],
    services: [...m.services],
    therapies: [...m.therapies],
    pillShape: "pill",
  };
}

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ data: getDefaults(), source: "defaults" });
  }

  try {
    const stored = await redis.get<SpecialtiesData>(KEY);
    if (!stored) {
      return NextResponse.json({ data: getDefaults(), source: "defaults" });
    }
    return NextResponse.json({ data: stored, source: "redis" });
  } catch {
    return NextResponse.json({ data: getDefaults(), source: "defaults" });
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
    const body: SpecialtiesData = await req.json();

    if (!body.badge || !body.heading1 || !body.heading2 || !body.sub) {
      return NextResponse.json({ error: "Missing required text fields" }, { status: 400 });
    }
    if (!Array.isArray(body.specialites) || !Array.isArray(body.services) || !Array.isArray(body.therapies)) {
      return NextResponse.json({ error: "specialites, services, therapies must be arrays" }, { status: 400 });
    }
    if (body.specialites.length === 0 || body.services.length === 0 || body.therapies.length === 0) {
      return NextResponse.json({ error: "Each row must have at least one item" }, { status: 400 });
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
