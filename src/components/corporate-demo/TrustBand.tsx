"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

function animateCounter(el: HTMLElement, target: string) {
  const prefix = target.startsWith("+") ? "+" : target.startsWith("\u2212") ? "\u2212" : "";
  const numStr = target.replace(/[^0-9]/g, "");
  const num = parseInt(numStr, 10);
  if (!num) return;
  const suffix = target.replace(/[0-9+\u2212]/g, "");
  gsap.fromTo(el, { textContent: "0" }, {
    textContent: String(num), duration: 2, ease: "power2.out", snap: { textContent: 1 },
    onUpdate() { el.textContent = prefix + Math.round(Number(el.textContent)) + suffix; },
  });
}

export default function DemoTrustBand() {
  const { tRaw } = useLocale();
  const stats = tRaw<Array<{ number: string; label: string }>>("entreprises.approach.stats");
  const sectionRef = useRef<HTMLElement>(null);
  const { elRef, ready } = useIntersectionDeferred("100px 0px");
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!ready) return;
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".tb-stat", { opacity: 0, y: 24, duration: 0.6, stagger: 0.12, ease: "power3.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      if (!prefersReduced.current) {
        gsap.utils.toArray<HTMLElement>(".tb-num").forEach((num) => {
          const target = num.getAttribute("data-target") || num.textContent || "";
          ScrollTrigger.create({
            trigger: num, start: "top 92%",
            onEnter: () => animateCounter(num, target),
            once: true,
          });
        });
      }
    }, el);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={(el) => { sectionRef.current = el; elRef.current = el; }}
      className="relative py-8 sm:py-10 px-6 overflow-hidden"
      style={{ background: "linear-gradient(165deg, #D4A56A 0%, #C99B5E 25%, #B88A5A 50%, #A07848 80%, #8E6A3E 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.03) 55%, transparent 70%)" }} />
      <div className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {stats.map((s, i) => (
            <div key={i} className="tb-stat text-center">
              <p
                className="tb-num text-white font-heading font-bold"
                data-target={s.number}
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                {s.number}
              </p>
              <p className="text-white/55 text-xs sm:text-sm mt-2 tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
