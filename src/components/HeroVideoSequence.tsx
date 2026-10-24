"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export interface HeroClip {
  src: string;
  poster: string;
}

interface HeroVideoSequenceProps {
  clips: readonly HeroClip[];
  className?: string;
  objectPosition?: string;
}

/* Long, soft dissolve. The incoming clip fades in ON TOP of the outgoing clip,
 * which holds full opacity underneath until the fade completes. A single-layer
 * fade (instead of two crossing opacities) means the composited luminance never
 * dips mid-transition — no black flash between clips. */
const FADE_MS = 1600;
/* Poster -> video hand-off (a video's own fade-in once it reports playing). */
const VIDEO_REVEAL_MS = 700;
/* Start buffering the next clip this early so the dissolve is always covered. */
const PRELOAD_LEAD_SECONDS = 8;
/* Begin the dissolve this long before the outgoing clip ends. */
const TRANSITION_LEAD_SECONDS = 2;

interface MutableNumber {
  current: number;
}
interface MutableBoolean {
  current: boolean;
}
interface MutableTimer {
  current: number | null;
}

/* First clip after `from` that has not failed (loops back to `from` when none). */
function findNextPlayable(
  from: number,
  failedSet: ReadonlySet<number>,
  count: number,
): number {
  for (let step = 1; step <= count; step += 1) {
    const candidate = (from + step) % count;
    if (!failedSet.has(candidate)) return candidate;
  }
  return from;
}

/**
 * Commit a clip change: keep the outgoing clip fully opaque underneath while
 * the incoming one fades in above it, then drop the outgoing layer once the
 * dissolve has finished. Module scope keeps the effect closures stable (the
 * React Compiler discourages manual memoisation hooks in this file).
 */
function commitTransition(
  from: number,
  to: number,
  setPrevious: (value: number | null) => void,
  setActive: (value: number) => void,
  activeRef: MutableNumber,
  advancingRef: MutableBoolean,
  timerRef: MutableTimer,
): void {
  if (to === from) return;
  setPrevious(from);
  activeRef.current = to;
  setActive(to);
  advancingRef.current = true;
  if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  timerRef.current = window.setTimeout(() => {
    setPrevious(null);
    advancingRef.current = false;
    timerRef.current = null;
  }, FADE_MS);
}

/**
 * Full-bleed hero background: a stack of muted videos that dissolve into each
 * other in sequence while looping. Every clip carries its own poster layer, so
 * the hero always shows a real frame when video cannot play (autoplay blocked,
 * reduced motion, decode error, offline).
 */
export default function HeroVideoSequence({
  clips,
  className = "",
  objectPosition = "center 30%",
}: HeroVideoSequenceProps): React.JSX.Element {
  const clipCount = clips.length;
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [failed, setFailed] = useState<ReadonlySet<number>>(() => new Set());
  const [started, setStarted] = useState<ReadonlySet<number>>(() => new Set());
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const activeRef = useRef(0);
  const failedRef = useRef<ReadonlySet<number>>(new Set());
  const startedRef = useRef(false);
  const reducedRef = useRef(false);
  const advancingRef = useRef(false);
  const transitionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    failedRef.current = failed;
  }, [failed]);

  /* Autoplay kick-off, reduced-motion + visibility handling. */
  useEffect(() => {
    if (!clipCount) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = media.matches;

    const failTo = (index: number) => {
      const nextFailed = new Set(failedRef.current);
      nextFailed.add(index);
      failedRef.current = nextFailed;
      setFailed(nextFailed);
      const nextIndex = findNextPlayable(index, nextFailed, clipCount);
      if (nextIndex !== index) {
        commitTransition(
          index,
          nextIndex,
          setPrevious,
          setActive,
          activeRef,
          advancingRef,
          transitionTimerRef,
        );
      } else {
        /* Every clip failed: rest on the first poster as the static base. */
        activeRef.current = 0;
        setActive(0);
      }
    };

    const playActive = () => {
      const index = activeRef.current;
      if (failedRef.current.has(index)) return;
      const video = videoRefs.current[index];
      if (!video) return;
      video.muted = true;
      const attempt = video.play();
      if (!attempt) return;
      void attempt.catch(() => failTo(index));
    };

    const stopAll = () => {
      videoRefs.current.forEach((video) => video?.pause());
    };

    const start = () => {
      if (startedRef.current || reducedRef.current) return;
      startedRef.current = true;
      playActive();
    };

    const onMotionChange = () => {
      reducedRef.current = media.matches;
      if (media.matches) stopAll();
      else if (startedRef.current) playActive();
    };

    const onVisibilityChange = () => {
      if (document.hidden) stopAll();
      else if (startedRef.current && !reducedRef.current) playActive();
    };

    media.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    let idleHandle: number | null = null;
    let idleIsTimeout = false;
    if (!media.matches) {
      if (typeof requestIdleCallback === "function") {
        idleHandle = requestIdleCallback(start, { timeout: 3000 });
      } else {
        idleIsTimeout = true;
        idleHandle = window.setTimeout(start, 200);
      }
    }

    return () => {
      media.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (idleHandle !== null) {
        if (idleIsTimeout) window.clearTimeout(idleHandle);
        else if (typeof cancelIdleCallback === "function") cancelIdleCallback(idleHandle);
      }
      stopAll();
      startedRef.current = false;
      advancingRef.current = false;
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    };
  }, [clipCount]);

  /* Whenever the active clip changes, play it and release the others. */
  useEffect(() => {
    if (!startedRef.current || reducedRef.current) return;
    if (failedRef.current.has(active)) return;

    const video = videoRefs.current[active];
    if (!video) return;
    /* A looping clip that already ended must restart from frame 0, not sit on
     * its last frame while the poster underneath is hidden. */
    if (video.ended) {
      try {
        video.currentTime = 0;
      } catch {
        /* Some browsers throw before metadata is ready — play() restarts it. */
      }
    }
    video.muted = true;
    const attempt = video.play();
    if (attempt) {
      void attempt.catch(() => {
        const nextFailed = new Set(failedRef.current);
        nextFailed.add(active);
        failedRef.current = nextFailed;
        setFailed(nextFailed);
        const nextIndex = findNextPlayable(active, nextFailed, clipCount);
        if (nextIndex !== active) {
          commitTransition(
            active,
            nextIndex,
            setPrevious,
            setActive,
            activeRef,
            advancingRef,
            transitionTimerRef,
          );
        } else {
          activeRef.current = 0;
          setActive(0);
        }
      });
    }

    const settle = window.setTimeout(() => {
      videoRefs.current.forEach((candidate, index) => {
        if (!candidate || index === activeRef.current) return;
        if (!candidate.paused) candidate.pause();
      });
    }, FADE_MS + 150);

    return () => window.clearTimeout(settle);
  }, [active, clipCount]);

  const advanceFrom = (index: number) => {
    if (advancingRef.current || index !== activeRef.current) return;
    const nextIndex = findNextPlayable(index, failedRef.current, clipCount);
    if (nextIndex === index) return;
    commitTransition(
      index,
      nextIndex,
      setPrevious,
      setActive,
      activeRef,
      advancingRef,
      transitionTimerRef,
    );
  };

  const markStarted = (index: number) => {
    setStarted((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const handleTimeUpdate = (index: number, video: HTMLVideoElement) => {
    if (index !== activeRef.current) return;
    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;

    const nextIndex = (index + 1) % clipCount;
    const remaining = duration - video.currentTime;

    if (remaining <= PRELOAD_LEAD_SECONDS) {
      const nextVideo = videoRefs.current[nextIndex];
      if (nextVideo && !failedRef.current.has(nextIndex) && nextVideo.preload !== "auto") {
        nextVideo.preload = "auto";
        nextVideo.load();
      }
    }

    if (remaining <= TRANSITION_LEAD_SECONDS) advanceFrom(index);
  };

  return (
    <div
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
      data-hero-video-sequence=""
      data-active={active}
      data-previous={previous ?? ""}
    >
      {clips.map((clip, index) => {
        const isActive = index === active;
        const isPrevious = previous === index;
        const isShown = isActive || isPrevious;
        const showVideo = started.has(index) && !failed.has(index);

        return (
          <div
            key={clip.src}
            className="absolute inset-0"
            data-hero-clip-shell={index}
            data-active={isActive}
            data-previous={isPrevious}
            style={{
              zIndex: isActive ? 2 : isPrevious ? 1 : 0,
              opacity: isShown ? 1 : 0,
              transitionProperty: "opacity",
              transitionDuration: `${FADE_MS}ms`,
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              willChange: isShown ? "opacity" : "auto",
            }}
          >
            <div className="hero-clip-media" data-shown={isShown ? "true" : "false"}>
              <Image
                src={clip.poster}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                style={{ objectPosition }}
                className="object-cover"
              />

              <video
                ref={(element) => {
                  videoRefs.current[index] = element;
                }}
                src={clip.src}
                muted
                playsInline
                preload="none"
                tabIndex={-1}
                disablePictureInPicture
                data-hero-clip={index}
                style={{
                  objectPosition,
                  opacity: showVideo ? 1 : 0,
                  transitionProperty: "opacity",
                  transitionDuration: `${VIDEO_REVEAL_MS}ms`,
                  transitionTimingFunction: "ease-out",
                }}
                className="absolute inset-0 h-full w-full object-cover"
                onPlaying={() => markStarted(index)}
                onTimeUpdate={(event) => handleTimeUpdate(index, event.currentTarget)}
                onEnded={() => advanceFrom(index)}
                onError={() => {
                  const nextFailed = new Set(failedRef.current);
                  nextFailed.add(index);
                  failedRef.current = nextFailed;
                  setFailed(nextFailed);
                  if (index === activeRef.current) {
                    const nextIndex = findNextPlayable(index, nextFailed, clipCount);
                    if (nextIndex !== index) {
                      commitTransition(
                        index,
                        nextIndex,
                        setPrevious,
                        setActive,
                        activeRef,
                        advancingRef,
                        transitionTimerRef,
                      );
                    } else {
                      activeRef.current = 0;
                      setActive(0);
                    }
                  }
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
