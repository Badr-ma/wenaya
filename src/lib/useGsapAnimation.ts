"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GsapAnimation {
  selector?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  scrollTrigger?: gsap.plugins.ScrollTriggerInstanceVars;
}

export function useGsapAnimation<T extends HTMLElement>(
  animations: GsapAnimation[] = [],
  deps: React.DependencyList = []
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || animations.length === 0) return;

    const ctx = gsap.context(() => {
      animations.forEach(({ selector, from, to, scrollTrigger }) => {
        const target = selector ? el.querySelector(selector) : el;
        if (!target) return;

        if (from && to) {
          gsap.fromTo(target, from, { ...to, scrollTrigger });
        } else if (from) {
          gsap.fromTo(target, from, { scrollTrigger });
        } else if (to) {
          gsap.to(target, { ...to, scrollTrigger });
        }
      });
    }, el);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
