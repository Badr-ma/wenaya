/**
 * Section Break — decorative horizontal divider between homepage sections.
 * Animated line that expands on scroll with GSAP. Adds visual rhythm to the page.
 */
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function SectionBreak(): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const lineL = useRef<HTMLDivElement>(null);
  const lineR = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        defaults: { ease: "power3.out" },
      })
        .fromTo(lineL.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5, transformOrigin: "right" })
        .fromTo(lineR.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5, transformOrigin: "left" }, "-=0.4")
        .fromTo(dot.current, { opacity: 0, scale: 0, rotate: -90 }, { opacity: 1, scale: 1, rotate: 45, duration: 0.4, ease: "back.out(2.5)" }, "-=0.3");
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="flex items-center justify-center h-8 sm:h-10 w-full select-none">
      <div ref={lineL} className="w-12 sm:w-20 h-px bg-gradient-to-l from-[#B88A5A]/25 to-transparent" />
      <div ref={dot} className="mx-2.5 w-2 h-2 bg-[#B88A5A]/40" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
      <div ref={lineR} className="w-12 sm:w-20 h-px bg-gradient-to-r from-[#B88A5A]/25 to-transparent" />
    </div>
  );
}
