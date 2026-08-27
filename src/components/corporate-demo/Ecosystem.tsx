"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

const nodeColors = ["#1A6B52", "#B88A5A", "#2563EB", "#7C3AED"];

export default function DemoEcosystem() {
  const { tRaw } = useLocale();
  const pillars = tRaw<Array<{ title: string; desc: string }>>("entreprises.modularity.pillars");
  const expertiseTabs = tRaw<Array<{ title: string; services: string[] }>>("entreprises.expertises.tabs");
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
      gsap.from(".eco-eyebrow", { opacity: 0, y: 16, duration: 0.5, ease: "power3.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
      });
      gsap.from(".eco-center", { opacity: 0, scale: 0.85, duration: 0.8, ease: "back.out(1.5)", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 65%", toggleActions: "play none none none" },
      });
      gsap.from(".eco-arm", { opacity: 0, scaleX: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 60%", toggleActions: "play none none none" },
      });
      gsap.from(".eco-discipline", { opacity: 0, y: 20, duration: 0.5, stagger: 0.1, ease: "power3.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 55%", toggleActions: "play none none none" },
      });
      gsap.from(".eco-service", { opacity: 0, duration: 0.3, stagger: 0.04, immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 50%", toggleActions: "play none none none" },
      });

      // Mobile: sequential reveal of each discipline + its services with left border draw
      if (!prefersReduced.current && window.innerWidth < 1024) {
        gsap.utils.toArray<HTMLElement>(".m-eco-pillar").forEach((pillar) => {
          gsap.timeline({
            scrollTrigger: { trigger: pillar, start: "top 85%", toggleActions: "play none none none" },
          })
            .from(pillar.querySelector(".m-eco-title"), { y: 14, opacity: 0, duration: 0.45, ease: "power3.out", immediateRender: false })
            .from(pillar.querySelector(".m-eco-dot"), { scale: 0, opacity: 0, duration: 0.35, ease: "back.out(2)", immediateRender: false }, "-=0.15")
            .from(pillar.querySelector(".m-eco-border"), { scaleY: 0, transformOrigin: "top", duration: 0.5, ease: "power2.out", immediateRender: false }, "-=0.2")
            .from(pillar.querySelectorAll(".m-eco-service"), { y: 10, opacity: 0, duration: 0.35, stagger: 0.05, ease: "power3.out", immediateRender: false }, "-=0.35");
        });
      }
    }, el);
    return () => ctx.revert();
  }, [ready]);

  const positions = [
    { x: -240, y: -160 },
    { x: 240, y: -160 },
    { x: -240, y: 160 },
    { x: 240, y: 160 },
  ];

  return (
    <section
      ref={(el) => { sectionRef.current = el; elRef.current = el; }}
      className="relative bg-[#F2EFE9] py-24 sm:py-36 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="eco-eyebrow inline-flex items-center gap-4 text-[#B88A5A] text-xs font-semibold tracking-[0.25em] uppercase justify-center">
            <span className="w-10 h-px bg-[#B88A5A]/50" />
            {tRaw<string>("entreprises.modularity.ecosystemBadge")}
            <span className="w-10 h-px bg-[#B88A5A]/50" />
          </span>
          <h2
            className="heading-serif text-[#0B1220] mt-6"
            style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)", lineHeight: 1.08 }}
            dangerouslySetInnerHTML={{
              __html: tRaw<string>("entreprises.modularity.ecosystemHeading").replace(
                /<gradient>(.*?)<\/gradient>/,
                '<span class="text-transparent bg-clip-text" style="background-image: linear-gradient(135deg, #B88A5A 0%, #D4A574 100%)">$1</span>'
              ),
            }}
          />
          <p className="text-[#2B2F36]/50 text-base sm:text-lg leading-relaxed mt-6">
            {tRaw<string>("entreprises.modularity.ecosystemDesc")}
          </p>
        </div>

        {/* Desktop: typography cross with connecting lines */}
        <div className="hidden lg:flex items-center justify-center relative h-[420px]">
          {/* Center */}
          <div className="eco-center relative z-10 text-center">
            <p className="text-[#0B1220] font-heading font-bold text-xl tracking-tight">Wenaya</p>
            <p className="text-[#2B2F36]/30 text-[10px] mt-1 tracking-[0.15em] uppercase">{tRaw<string>("entreprises.modularity.ecosystemHubLabel")}</p>
          </div>

          {/* Arms + discipline labels */}
          {pillars.map((pillar, i) => {
            const pos = positions[i];
            const services = expertiseTabs[i]?.services || [];
            const isLeft = pos.x < 0;
            const isTop = pos.y < 0;
            return (
              <div key={i} className="absolute" style={{
                left: `calc(50% + ${pos.x}px)`,
                top: `calc(50% + ${pos.y}px)`,
                transform: "translate(-50%, -50%)",
              }}>
                {/* Connecting line */}
                <div
                  className="eco-arm absolute pointer-events-none"
                  style={{
                    width: `${Math.abs(pos.x) - 60}px`,
                    height: "1px",
                    background: `linear-gradient(${isLeft ? "to right" : "to left"}, ${nodeColors[i]}50, ${nodeColors[i]}15)`,
                    top: "50%",
                    [isLeft ? "right" : "left"]: "100%",
                    transformOrigin: isLeft ? "right center" : "left center",
                  }}
                />

                {/* Discipline name */}
                <div className="eco-discipline text-center">
                  <p className="font-heading font-semibold text-sm" style={{ color: nodeColors[i] }}>
                    {pillar.title}
                  </p>
                </div>

                {/* Services — small type below discipline */}
                <div className="mt-3 text-center max-w-[180px]">
                  {services.slice(0, 3).map((s, si) => (
                    <p key={si} className="eco-service text-[#2B2F36]/35 text-[11px] leading-relaxed">
                      {s}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: vertical list — animated */}
        <div className="lg:hidden space-y-10">
          {pillars.map((pillar, i) => {
            const services = expertiseTabs[i]?.services || [];
            return (
              <div key={i} className="m-eco-pillar">
                <div className="flex items-center gap-3 mb-3">
                  <div className="m-eco-dot w-2 h-2 rounded-full" style={{ backgroundColor: nodeColors[i] }} />
                  <h3 className="m-eco-title font-heading font-semibold text-sm" style={{ color: nodeColors[i] }}>
                    {pillar.title}
                  </h3>
                </div>
                <div className="m-eco-border pl-5 border-l border-[#0B1220]/[0.06]">
                  {services.map((s, si) => (
                    <p key={si} className="m-eco-service text-[#2B2F36]/45 text-xs leading-loose">
                      {s}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
