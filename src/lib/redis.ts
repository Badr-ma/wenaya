/**
 * Redis client — Upstash Redis via @upstash/redis.
 * Gracefully returns null when credentials are not configured,
 * so the app works without Redis (falls back to hardcoded data).
 */
import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;
let _checked = false;

export function getRedis(): Redis | null {
  if (_checked) return _redis;
  _checked = true;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  _redis = new Redis({ url, token });
  return _redis;
}
