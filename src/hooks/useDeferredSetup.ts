"use client";

import { useRef, useEffect, useState } from "react";

/**
 * useIntersectionDeferred — returns a ref setter and a boolean.
 * The boolean becomes true when the element is near the viewport (or immediately if already visible).
 * Gate GSAP/ScrollTrigger initialization on the `ready` boolean.
 *
 * Content remains visible at all times (no opacity:0 set by JS).
 * GSAP fromTo animations that set initial opacity:0 are only applied after `ready` is true.
 */
export function useIntersectionDeferred(rootMargin = "200px 0px") {
  const elRef = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el || ready) return;

    // If already visible (e.g. at top of viewport or on small pages), fire immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 200 && rect.bottom > -200) {
      setReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  // ready is intentionally excluded — we only want the initial check + observer
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { elRef, ready };
}
