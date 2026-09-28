/**
 * Waiting-list adapter — persists an email subscription to the Shop or
 * Configurator coming-soon waiting list. Redis-backed via `getRedis()`.
 *
 * Storage model (kept separate per source so the Shop and Configurator lists
 * can be launched/exported independently):
 *   - Set `wenaya:waiting-list:{source}`                    → atomic per-source dedup
 *   - Hash `wenaya:waiting-list:entries` field `{source}:{email}` → ISO/JSON record
 * The hash record stores {email, source, locale, consented, createdAt} for later
 * export; the set makes re-subscribing idempotent (SADD returns 1 when added,
 * 0 when already present).
 */
import { getRedis } from "@/lib/redis";

export const WAITING_LIST_SOURCES = ["shop", "configurator"] as const;
export type WaitingListSource = (typeof WAITING_LIST_SOURCES)[number];

export const WAITLIST_BODY_MAX_CHARS = 2048;

export type WaitingListOutcome =
  | { kind: "added" }
  | { kind: "existing" }
  | { kind: "storage-unavailable" }
  | { kind: "storage-error" };

const EMAIL_MAX_LENGTH = 254;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidWaitingListEmail(email: string): boolean {
  return email.length > 0 && email.length <= EMAIL_MAX_LENGTH && EMAIL_RE.test(email);
}

export function isValidWaitingListSource(source: unknown): source is WaitingListSource {
  return typeof source === "string" && (WAITING_LIST_SOURCES as readonly string[]).includes(source);
}

export async function addToWaitingList(args: {
  email: string;
  source: WaitingListSource;
  locale: string;
  consented: boolean;
}): Promise<WaitingListOutcome> {
  const redis = getRedis();
  if (!redis) {
    return { kind: "storage-unavailable" };
  }

  const email = normalizeEmail(args.email);
  if (!isValidWaitingListEmail(email) || args.consented !== true) {
    return { kind: "storage-error" };
  }

  const sourceKey = `wenaya:waiting-list:${args.source}`;
  const entryKey = `${args.source}:${email}`;

  try {
    const added = await redis.sadd(sourceKey, email);
    await redis.hset("wenaya:waiting-list:entries", {
      [entryKey]: JSON.stringify({
        email,
        source: args.source,
        locale: args.locale,
        consented: true,
        createdAt: new Date().toISOString(),
      }),
    });
    return added > 0 ? { kind: "added" } : { kind: "existing" };
  } catch {
    return { kind: "storage-error" };
  }
}