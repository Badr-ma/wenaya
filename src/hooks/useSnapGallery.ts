/**
 * useSnapGallery — reusable horizontal snap-gallery rail engine.
 *
 * Encapsulates the scroll-snap carousel mechanics used across the Wenaya
 * image-led swipe galleries (homepage practices, clinic sessions, and the
 * clinic care-journey explorer). Extracted from the duplicated implementations
 * in `PracticesSection` / `SessionsExplorer` so new galleries share ONE source
 * of truth for:
 *
 *   - horizontal native scroll-snap rail (`scrollLeft`),
 *   - mouse drag with instant follow (no pointer capture, so link/button
 *     clicks are never retargeted; movement beyond a threshold cancels the
 *     following click instead),
 *   - touch swipe (native snap takes over on release),
 *   - arrow controls that glide the track with a slow premium ease
 *     (~850ms easeOutQuint) and disable at the ends,
 *   - active-slide index tracking from scroll position.
 *
 * The hook takes the live item COUNT (so the caller never passes stale array
 * references into callbacks) and returns:
 *
 *   - `activeIdx`           — 0-based index of the current snap-aligned slide,
 *   - `trackRef`            — attach to the scroll container (the `<div>`,
 *                             NOT an inner wrapper), the element whose slides
 *                             carry the `.hp-slide` class,
 *   - `trackHandlers`       — { onScroll, onPointerDown, onPointerMove,
 *                             onPointerUp, onClickCapture } for the container,
 *   - `goPrev` / `goNext`   — arrow action callbacks (no-op at the ends).
 *
 * Slide widths are set by Tailwind classes on the caller's slides, e.g.
 * `w-[85vw] md:w-[calc((100%_-_24px)/2)] lg:w-[calc((100%_-_48px)/3)]` for a
 * 1+peek / 2 / 3 responsive pattern; the hook only reads them to compute the
 * per-step scroll offset (slide width + column gap).
 */
"use client";

import { useCallback, useRef, useState } from "react";

/** Pointer movement above this cancels the following click (drag ≠ tap). */
const DRAG_THRESHOLD = 8;
/** Arrow glide duration — premium slow transition (~850ms). */
const GLIDE_DURATION = 850;
/** Ease-out quint ≈ cubic-bezier(0.22, 1, 0.36, 1): fast start, soft landing. */
const easeOutQuint = (x: number): number => 1 - Math.pow(1 - x, 5);

const reduceMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useSnapGallery(itemCount: number) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const scrollRafRef = useRef(0);
  const glideRafRef = useRef(0);
  const glideSnapRef = useRef(false);
  const dragRef = useRef<{
    id: number;
    lastX: number;
    startX: number;
    moved: boolean;
    winUp: (e: PointerEvent) => void;
    winBlur: () => void;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const stepSize = (): number => {
    const track = trackRef.current;
    if (!track) return 0;
    const first = track.querySelector(".hp-slide") as HTMLElement | null;
    if (!first) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap || "12") || 12;
    return first.offsetWidth + gap;
  };

  const clampIndex = useCallback(
    (i: number): number => Math.max(0, Math.min(itemCount - 1, i)),
    [itemCount]
  );

  const currentIndex = useCallback((): number => {
    const track = trackRef.current;
    if (!track || itemCount === 0) return 0;
    const step = stepSize();
    if (!step) return 0;
    return clampIndex(Math.round(track.scrollLeft / step));
  }, [itemCount, clampIndex]);

  const syncActive = useCallback((): void => {
    const idx = currentIndex();
    if (idx !== activeIdxRef.current) {
      activeIdxRef.current = idx;
      setActiveIdx(idx);
    }
  }, [currentIndex]);

  const cancelGlide = (): void => {
    if (glideRafRef.current) cancelAnimationFrame(glideRafRef.current);
    glideRafRef.current = 0;
    if (glideSnapRef.current) {
      glideSnapRef.current = false;
      const track = trackRef.current;
      if (track) track.style.scrollSnapType = "";
    }
  };

  const glideTo = (index: number, duration = GLIDE_DURATION): void => {
    const track = trackRef.current;
    if (!track) return;
    const step = stepSize();
    if (!step) return;
    cancelGlide();
    const from = track.scrollLeft;
    const to = clampIndex(index) * step;
    if (Math.abs(to - from) < 1) {
      syncActive();
      return;
    }
    glideSnapRef.current = true;
    track.style.scrollSnapType = "none";
    const start = performance.now();
    const tick = (now: number): void => {
      const p = Math.min(1, (now - start) / duration);
      track.scrollLeft = from + (to - from) * easeOutQuint(p);
      if (p < 1) {
        glideRafRef.current = requestAnimationFrame(tick);
      } else {
        glideRafRef.current = 0;
        glideSnapRef.current = false;
        track.style.scrollSnapType = "";
        syncActive();
      }
    };
    glideRafRef.current = requestAnimationFrame(tick);
  };

  const goPrev = (): void => {
    if (activeIdxRef.current > 0) {
      glideTo(activeIdxRef.current - 1, reduceMotion() ? 1 : GLIDE_DURATION);
    }
  };

  const goNext = (): void => {
    if (activeIdxRef.current < itemCount - 1) {
      glideTo(activeIdxRef.current + 1, reduceMotion() ? 1 : GLIDE_DURATION);
    }
  };

  /** End a mouse drag: detach window listeners, restore snap, re-snap to nearest. */
  const endMouseDrag = (id: number): void => {
    const drag = dragRef.current;
    if (!drag || drag.id !== id) return;
    dragRef.current = null;
    window.removeEventListener("pointerup", drag.winUp);
    window.removeEventListener("pointercancel", drag.winUp);
    window.removeEventListener("blur", drag.winBlur);
    const track = trackRef.current;
    if (!track) return;
    track.style.cursor = "";
    if (drag.moved) {
      track.style.scrollSnapType = "";
      glideTo(currentIndex(), reduceMotion() ? 1 : 400);
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    } else {
      track.style.scrollSnapType = "";
    }
  };

  const onTrackScroll = (): void => {
    if (scrollRafRef.current) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = 0;
      syncActive();
    });
  };

  const onTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    cancelGlide();
    const track = trackRef.current;
    if (!track) return;
    // Window-level listeners (NOT pointer capture, which would retarget the
    // following click away from links/buttons and kill navigation).
    const winUp = (ev: PointerEvent): void => endMouseDrag(ev.pointerId);
    const winBlur = (): void => {
      const d = dragRef.current;
      if (d) endMouseDrag(d.id);
    };
    window.addEventListener("pointerup", winUp);
    window.addEventListener("pointercancel", winUp);
    window.addEventListener("blur", winBlur);
    track.style.scrollSnapType = "none";
    track.style.cursor = "grabbing";
    dragRef.current = {
      id: e.pointerId,
      lastX: e.clientX,
      startX: e.clientX,
      moved: false,
      winUp,
      winBlur,
    };
  };

  const onTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    const drag = dragRef.current;
    if (!drag || drag.id !== e.pointerId) return;
    const track = trackRef.current;
    if (!track) return;
    const dx = e.clientX - drag.lastX;
    track.scrollLeft -= dx;
    drag.lastX = e.clientX;
    if (Math.abs(e.clientX - drag.startX) > DRAG_THRESHOLD) drag.moved = true;
  };

  const onTrackPointerUp = (e: React.PointerEvent<HTMLDivElement>): void => {
    endMouseDrag(e.pointerId);
  };

  const onTrackClickCapture = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (suppressClickRef.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClickRef.current = false;
    }
  };

  return {
    activeIdx,
    trackRef,
    trackHandlers: {
      onScroll: onTrackScroll,
      onPointerDown: onTrackPointerDown,
      onPointerMove: onTrackPointerMove,
      onPointerUp: onTrackPointerUp,
      onClickCapture: onTrackClickCapture,
    },
    goPrev,
    goNext,
  };
}
