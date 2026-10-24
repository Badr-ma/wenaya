"use client";

/**
 * Shared blog author-avatar with a bounded retry state machine.
 *
 * Behaviour (see `@/lib/avatar-retry` for the pure transitions):
 * - Renders the author photo via `next/image` `unoptimized`.
 * - On `onError`: up to 3 total attempts (initial + 2 retries, 700 ms
 *   apart) re-requesting the EXACT same URL (a `key` bump remounts a
 *   fresh `<img>`; the URL is never mutated and the blog API / page are
 *   never re-fetched). After the third failure → initials badge.
 * - Missing / empty / whitespace / `dummy-man.png` sources skip the load
 *   entirely and render initials immediately.
 * - When the `src` prop changes (author switch / new data), the retry
 *   state resets and a pending retry timer is cancelled.
 * - Image and initials badge share the same `size` / call-site classes so
 *   the swap never shifts layout. `alt` is the author name; the initials
 *   span is `aria-hidden` (every call site renders the name next to it).
 *
 * Retry timing / exhaustion are client-only — SSR always emits the plain
 * `<Image>` (identical markup to the pre-retry implementation), so there
 * is no hydration mismatch.
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  AVATAR_RETRY_DELAY_MS,
  avatarRetryInit,
  avatarRetryOnFailure,
  avatarRetryOnUrlChange,
  initialsFor,
  isRenderableAvatarSrc,
} from "@/lib/avatar-retry";
export interface BlogAuthorAvatarProps {
  /** Already-normalized avatar URL (mapper strips sentinels). `null`/`""` → initials. */
  src: string | null | undefined;
  /** Author display name — used for `alt` and the initials badge. */
  name: string | null | undefined;
  /** Square edge length in px (drives `width`/`height`; call site supplies the visual classes). */
  size: number;
  /** Classes for the `<Image>` (size + rounded-full + object-cover + rings…). */
  imgClassName?: string;
  /** Classes for the initials badge (same size/rounding as the image + colors). */
  initialsClassName?: string;
}

export function BlogAuthorAvatar({
  src,
  name,
  size,
  imgClassName = "",
  initialsClassName = "",
}: BlogAuthorAvatarProps) {
  // The src URL lives inside the retry state, so a prop change is a pure
  // state comparison (render-phase setState — the React-blessed
  // adjust-on-prop-change pattern; no refs touched during render).
  const [retry, setRetry] = useState(() => avatarRetryInit(src));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (retry.src !== src) {
    setRetry(avatarRetryOnUrlChange(retry, src));
  }

  // Cancel any pending retry when src changes or the component unmounts.
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [src]);

  const authorName = typeof name === "string" ? name.trim() : "";
  const badge = initialsFor(name);
  const showInitials = retry.initialsOnly || !isRenderableAvatarSrc(src);

  if (showInitials) {
    return (
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center ${initialsClassName}`}
        style={{ width: size, height: size }}
      >
        {badge}
      </span>
    );
  }

  const handleError = () => {
    const next = avatarRetryOnFailure(retry);
    if (next.initialsOnly) {
      setRetry(next);
      return;
    }
    // Delay the loadKey bump (state commit) so retries are spaced; the
    // timer is cancelled by the effect cleanup on src change / unmount.
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setRetry(next);
    }, AVATAR_RETRY_DELAY_MS);
  };

  return (
    <Image
      key={retry.loadKey}
      src={src as string}
      alt={authorName}
      width={size}
      height={size}
      unoptimized
      onError={handleError}
      className={`shrink-0 ${imgClassName}`}
      style={{ width: size, height: size }}
    />
  );
}

export default BlogAuthorAvatar;
