/**
 * Pure retry state machine for blog author avatars.
 *
 * Contract (user requirement): when an author-avatar image fails to load,
 * retry the SAME URL up to 3 total attempts (initial load + 2 retries),
 * spaced ~500–1000 ms apart, before falling back to an initials badge.
 * The retry counter resets whenever the avatar URL changes. Missing /
 * empty / whitespace-only / `dummy-man.png` sources never attempt a load
 * at all — they render initials immediately.
 *
 * Everything in this module is pure (no React, no timers, no DOM) so the
 * full lifecycle — including the URL-change reset — is unit-testable in
 * Node. The component (`BlogAuthorAvatar.tsx`) owns the scheduling: it
 * applies these transitions after the configured delay, and bumps a
 * `loadKey` applied as `key` on the `<Image>` so React remounts a fresh
 * `<img>` element which re-requests the exact same URL (no cache-busting,
 * no query-string mutation, no API re-fetch, no page reload).
 *
 * Only `import type` here (none needed currently) — keep this file free of
 * runtime imports so `.mjs` tests can load it directly via the `@/` hook.
 */

/** Total attempts: 1 initial load + 2 retries. */
export const AVATAR_MAX_ATTEMPTS = 3;

/** Delay between retries (ms). Within the required 500–1000 ms window. */
export const AVATAR_RETRY_DELAY_MS = 700;

/** Whether `src` may be handed to the image loader at all. */
export function isRenderableAvatarSrc(src: string | null | undefined): boolean {
  if (typeof src !== "string") return false;
  const trimmed = src.trim();
  if (trimmed.length === 0) return false;
  // Backend sentinel for "no real avatar" — never a renderable asset.
  if (trimmed.toLowerCase().includes("dummy-man.png")) return false;
  return true;
}

/** Initial-letter badge text: first character of the name, `"W"` fallback. */
export function initialsFor(name: string | null | undefined): string {
  if (typeof name !== "string") return "W";
  const ch = name.trim().charAt(0).toUpperCase();
  return ch.length > 0 ? ch : "W";
}

export interface AvatarRetryState {
  /** The avatar URL this state belongs to — carried so the component can detect prop changes without touching refs during render. */
  src: string | null | undefined;
  /** Completed failed load attempts for the CURRENT url. */
  failures: number;
  /**
   * Monotonic remount key applied to the `<Image>`. Bumping it forces a
   * fresh `<img>` (same `src`) so the browser re-requests the URL —
   * required because a failed `<img>` load does not retry by itself.
   */
  loadKey: number;
  /** All attempts exhausted — render the initials badge. */
  initialsOnly: boolean;
}

export function avatarRetryInit(src: string | null | undefined): AvatarRetryState {
  return { src, failures: 0, loadKey: 0, initialsOnly: false };
}

/**
 * Reset when the `src` prop changes: the new author/url is a fresh
 * lifecycle. The pending-retry timer is cleared separately by the
 * component (effect cleanup keyed on `src`); this only resets state.
 * `loadKey` still increments so the new url's first attempt also gets a
 * fresh `<img>` element (defends against a same-key remount edge).
 */
export function avatarRetryOnUrlChange(
  prev: AvatarRetryState,
  src: string | null | undefined
): AvatarRetryState {
  return { src, failures: 0, loadKey: prev.loadKey + 1, initialsOnly: false };
}

/**
 * Transition after one `onError`. `failures + 1 < maxAttempts` → schedule
 * a retry (bump `loadKey`, caller delays the state commit); otherwise the
 * lifecycle is exhausted → `initialsOnly`.
 */
export function avatarRetryOnFailure(
  prev: AvatarRetryState,
  maxAttempts: number = AVATAR_MAX_ATTEMPTS
): AvatarRetryState {
  const failures = prev.failures + 1;
  if (failures < maxAttempts) {
    return { src: prev.src, failures, loadKey: prev.loadKey + 1, initialsOnly: false };
  }
  return { src: prev.src, failures, loadKey: prev.loadKey, initialsOnly: true };
}
