/**
 * Admin auth — multi-user with bcrypt-hashed passwords stored in Redis.
 * Tokens are HMAC-signed, short-lived (1h), and include the username.
 */
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { getRedis } from "./redis";
import type { NextRequest } from "next/server";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const BCRYPT_ROUNDS = 10;

export interface AdminUser {
  username: string;
  password: string; // bcrypt hash
  name: string;
  createdAt: string;
}

/* ── Password ── */

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export function verifyBcrypt(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/* ── Redis user storage ── */

function userKey(username: string) {
  return `admin:user:${username.toLowerCase()}`;
}

export async function getUser(username: string): Promise<AdminUser | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    const user = await redis.get<AdminUser>(userKey(username));
    return user ?? null;
  } catch {
    return null;
  }
}

export async function createUser(username: string, password: string, name: string): Promise<AdminUser> {
  const redis = getRedis();
  if (!redis) throw new Error("Redis not configured");
  const hash = await hashPassword(password);
  const user: AdminUser = {
    username: username.toLowerCase(),
    password: hash,
    name,
    createdAt: new Date().toISOString(),
  };
  await redis.set(userKey(username), user);
  return user;
}

/* ── Token signing / verification ── */

export function signToken(username: string): string {
  const secret = process.env.ADMIN_SECRET || "wenaya-admin-fallback";
  const payload = `${username.toLowerCase()}:${Date.now()}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifyToken(token: string): { valid: boolean; username?: string } {
  try {
    const secret = process.env.ADMIN_SECRET || "wenaya-admin-fallback";
    const decoded = Buffer.from(token, "base64url").toString();

    // Format: "username:timestamp:hexsignature" — sig is always last
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon === -1) return { valid: false };
    const payload = decoded.substring(0, lastColon);
    const sig = decoded.substring(lastColon + 1);
    if (!payload || !sig) return { valid: false };

    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    if (sig !== expected) return { valid: false };

    const parts = payload.split(":");
    const username = parts[0];
    const ts = parseInt(parts[1], 10);
    if (!username || isNaN(ts)) return { valid: false };
    if (Date.now() - ts > TOKEN_TTL_MS) return { valid: false };

    return { valid: true, username };
  } catch {
    return { valid: false };
  }
}

/* ── Cookie-based auth ── */

export function getTokenFromRequest(req: NextRequest): string | null {
  // Check Authorization header first
  const auth = req.headers.get("authorization")?.replace("Bearer ", "");
  if (auth) return auth;

  // Fall back to cookie
  const cookie = req.cookies.get("wenaya_admin_token")?.value;
  return cookie || null;
}

export function setAuthCookie(response: Response, token: string): void {
  response.headers.set(
    "Set-Cookie",
    `wenaya_admin_token=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600`
  );
}

export function clearAuthCookie(response: Response): void {
  response.headers.set(
    "Set-Cookie",
    "wenaya_admin_token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0"
  );
}
