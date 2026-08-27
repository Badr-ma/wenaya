"use client";

import { useRef, useEffect, Fragment } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

export default function DemoPrograms() {
  const { t, tRaw } = useLocale();
  const tiers = tRaw<Array<{ tag: string; title: string; for: string; includes: string; duration: string }>>("entreprises.levels.tiers");
  const packs = tRaw<Array<{ level: string; name: string; pitch: string; features: string[]; ideal: string }>>("entreprises.packs.items");
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
      gsap.from(".prg-eyebrow", { opacity: 0, y: 16, duration: 0.5, ease: "power3.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
      });
      gsap.from(".prg-heading", { opacity: 0, y: 24, duration: 0.6, ease: "power3.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
      });

      // Only the pinned experience. Disabled under prefers-reduced-motion.
      if (!prefersReduced.current && window.innerWidth >= 1024) {
        const scene = el.querySelector(".prg-pin-area");
        if (!scene) return;

        const nums = gsap.utils.toArray<HTMLElement>(".prg-num");
        const contents = gsap.utils.toArray<HTMLElement>(".prg-content");

        if (nums.length === 0) return;

        // Initial state: first program visible
        gsap.set(nums, { opacity: 0, y: 40 });
        gsap.set(nums[0], { opacity: 1, y: 0 });
        gsap.set(contents, { opacity: 0, y: 40 });
        gsap.set(contents[0], { opacity: 1, y: 0 });

        // Scroll distance proportional to viewport height and tier count
        const distance = window.innerHeight * (1.4 * tiers.length);

        const segDur = 1;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: () => `+=${distance}`,
            pin: ".prg-pin-area",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        for (let i = 1; i < nums.length; i++) {
          const t = (i - 0.5) * segDur;
          // Outgoing program fades and moves up, incoming emerges beneath — with overlap
          tl.to(nums[i - 1], { opacity: 0, y: -40, duration: segDur, ease: "power2.inOut" }, t)
            .to(nums[i], { opacity: 1, y: 0, duration: segDur, ease: "power2.inOut" }, t)
            .to(contents[i - 1], { opacity: 0, y: -30, duration: segDur, ease: "power2.inOut" }, t)
            .to(contents[i], { opacity: 1, y: 0, duration: segDur, ease: "power2.inOut" }, t);
        }
      }

      // Mobile: vertical 01→02→03 reveal sequence, no pin — each program animates on entry
      if (!prefersReduced.current && window.innerWidth < 1024) {
        gsap.utils.toArray<HTMLElement>(".m-prg-tier").forEach((tier) => {
          gsap.timeline({
            scrollTrigger: { trigger: tier, start: "top 82%", toggleActions: "play none none none" },
          })
            .from(tier.querySelector(".m-prg-num"), { y: 24, opacity: 0, duration: 0.6, ease: "power3.out", immediateRender: false })
            .from(tier.querySelector(".m-prg-tag"), { y: 12, opacity: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, "-=0.3")
            .from(tier.querySelector(".m-prg-title"), { y: 16, opacity: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, "-=0.25")
            .from(tier.querySelector(".m-prg-body"), { y: 14, opacity: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, "-=0.35");
        });
      }
    }, el);
    return () => ctx.revert();
  }, [ready, tiers.length]);

  return (
    <section
      ref={(el) => { sectionRef.current = el; elRef.current = el; }}
      className="relative bg-[#0B1220]"
      data-section-bg="dark"
    >
      {/* Header (scrolls away before pin) */}
      <div className="px-6 pt-24 sm:pt-32 pb-8">
        <div className="max-w-7xl mx-auto">
          <span className="prg-eyebrow inline-flex items-center gap-4 text-[#B88A5A] text-xs font-semibold tracking-[0.25em] uppercase">
            <span className="w-10 h-px bg-[#B88A5A]/50" />
            {t("entreprises.levels.title")}
          </span>
          <h2 className="prg-heading heading-serif text-white mt-6" style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)", lineHeight: 1.08 }}>
            {t("entreprises.levels.subtitle")}
          </h2>
          <p className="text-white/35 text-sm mt-4">{t("entreprises.levels.priceNote")}</p>
        </div>
      </div>

      {/* Desktop: THE pinned scroll story */}
      <div className="prg-pin-area hidden lg:block relative">
        <div className="h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="grid grid-cols-[auto_1fr] gap-16 items-center">
              {/* Left: huge program number — dominant bronze anchor */}
              <div className="relative w-[320px] h-[320px]">
                {tiers.map((tier, i) => {
                  const num = String(i + 1).padStart(2, "0");
                  return (
                    <Fragment key={i}>
                      <div className="prg-num-outline absolute inset-0 flex items-center justify-center" aria-hidden="true">
                        <span
                          className="font-heading font-bold"
                          style={{
                            fontSize: "clamp(6.5rem, 13vw, 12rem)",
                            lineHeight: 0.9,
                            color: "transparent",
                            WebkitTextStroke: "1.5px rgba(184,138,90,0.45)",
                          }}
                        >
                          {num}
                        </span>
                      </div>
                      <div className="prg-num absolute inset-0 flex items-center justify-center">
                        <span
                          className="text-transparent bg-clip-text font-heading font-bold"
                          style={{
                            fontSize: "clamp(6.5rem, 13vw, 12rem)",
                            lineHeight: 0.9,
                            backgroundImage: "linear-gradient(135deg, #D4A574 0%, #B88A5A 100%)",
                          }}
                        >
                          {num}
                        </span>
                      </div>
                    </Fragment>
                  );
                })}
              </div>

              {/* Right: active tier content */}
              <div className="relative h-[440px] prg-scene">
                {tiers.map((tier, i) => (
                  <div key={i} className={`prg-content absolute inset-0 flex flex-col justify-center${i > 0 ? " opacity-0" : ""}`}>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-white/80 w-fit" style={{ backgroundColor: "#B88A5A40" }}>
                        {tier.tag}
                      </span>
                      <div className="h-px flex-1 max-w-[160px] bg-white/[0.06]" />
                    </div>
                    <h3 className="text-white font-serif font-medium" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.08 }}>
                      {tier.title}
                    </h3>
                    <p className="text-white/40 text-base mt-3 max-w-lg">{tier.for}</p>

                    <div className="mt-8 grid grid-cols-2 gap-x-12 gap-y-4">
                      <div>
                        <p className="text-white/20 text-[10px] font-semibold uppercase tracking-[0.2em] mb-2">Inclus</p>
                        <p className="text-white/50 text-sm leading-relaxed">{tier.includes}</p>
                      </div>
                      <div>
                        <p className="text-white/20 text-[10px] font-semibold uppercase tracking-[0.2em] mb-2">Durée</p>
                        <p className="text-white/50 text-sm leading-relaxed">{tier.duration}</p>
                      </div>
                    </div>

                    <a
                      href="#contact"
                      className="mt-8 inline-flex items-center gap-2 text-[#B88A5A] text-sm font-semibold group w-fit"
                    >
                      <span className="border-b border-[#B88A5A]/40 pb-0.5 group-hover:border-[#B88A5A] transition-colors">{t("entreprises.levels.ctaQuote")}</span>
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: vertical list — animated reveal */}
      <div className="lg:hidden px-6 pb-8 space-y-16">
        {tiers.map((tier, i) => (
          <div key={i} className="m-prg-tier">
            <span className="m-prg-num text-transparent bg-clip-text font-heading font-bold block mb-3" style={{ fontSize: "clamp(3rem, 8vw, 5rem)", lineHeight: 0.85, backgroundImage: "linear-gradient(135deg, #D4A574 0%, #B88A5A 100%)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="m-prg-tag inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-white/80 mb-4" style={{ backgroundColor: "#B88A5A40" }}>
              {tier.tag}
            </span>
            <h3 className="m-prg-title text-white font-serif font-medium text-2xl leading-tight">
              {tier.title}
            </h3>
            <div className="m-prg-body">
              <p className="text-white/40 text-sm mt-3">{tier.for}</p>
              <div className="mt-5 space-y-3">
                <p className="text-white/20 text-[10px] font-semibold uppercase tracking-[0.2em]">Inclus</p>
                <p className="text-white/50 text-sm leading-relaxed">{tier.includes}</p>
                <p className="text-white/20 text-[10px] font-semibold uppercase tracking-[0.2em] mt-4">Durée</p>
                <p className="text-white/50 text-sm leading-relaxed">{tier.duration}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Thematic packs — editorial comparison, normal flow */}
      <div className="px-6 py-16 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <h3 className="prg-packs-heading heading-serif text-white mb-2" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", lineHeight: 1.1 }}>
            {t("entreprises.packs.title")}
          </h3>
          <p className="text-white/35 text-sm mb-12">{t("entreprises.packs.subtitle")}</p>
          <div className="space-y-8">
            {packs.map((pack, i) => (
              <div key={i} className="prg-pack flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 pb-8 border-b border-white/[0.04] last:border-0">
                <div className="shrink-0 sm:w-48">
                  <span className="text-[#B88A5A]/60 text-[10px] font-bold tracking-wider uppercase">{pack.level}</span>
                  <h4 className="text-white font-heading font-bold text-lg mt-1">{pack.name}</h4>
                </div>
                <div className="flex-1">
                  <p className="text-white/40 text-sm leading-relaxed">{pack.pitch}</p>
                  <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                    {pack.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-white/45 text-xs">
                        <span className="w-1 h-1 rounded-full bg-[#B88A5A]/40" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className="text-white/20 text-xs mt-3 italic">{pack.ideal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
