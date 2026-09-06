/**
 * Programs Section — displays the corporate wellness program tiers.
 * Interactive card-based UI with expandable details for each program level.
 * Features: tabbed navigation between program types, image carousels,
 * and CTA links to contact form.
 */
"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { h, type HrefLocale } from "@/lib/href";

interface Program {
  badge: string; name: string; pitch: string; desc: string;
  format: string; animator: string; link: string;
}

const cardImages = [
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=2400&q=100",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=2400&q=100",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=2400&q=100",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=2400&q=100",
];

const EDGE_PX = 130;
const EDGE_PX_MOBILE = 24;
const SIDE_SCALE = 0.82;
const SIDE_OPACITY = 0.4;
const SPRING = { type: "spring" as const, stiffness: 500, damping: 35, mass: 0.5 };

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

function CardContent({
  program, image, isActive, locale, discoverLabel,
}: {
  program: Program; image: string; isActive: boolean; locale: HrefLocale; discoverLabel: string;
}) {
  if (!isActive) {
    return (
      <div
        className="w-full rounded-3xl overflow-hidden relative"
        style={{
          height: "clamp(280px, 52vw, 460px)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        <Image src={image} alt="" fill className="object-cover" sizes="600px" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-3xl overflow-hidden bg-white flex flex-col select-none"
      style={{
        height: "clamp(280px, 52vw, 460px)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)",
      }}
    >
      <div className="relative h-[35%] sm:h-[48%] min-h-[90px] sm:min-h-[160px] overflow-hidden shrink-0">
        <Image src={image} alt="" fill className="object-cover" sizes="600px" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 sm:top-5 sm:left-5">
          <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-[9px] sm:text-[10px] font-bold tracking-[0.1em] uppercase border border-white/10">
            {program.badge}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between p-2.5 sm:p-5 min-h-0">
        <div>
          <h3 className="heading-serif text-[#0B1220] text-base sm:text-2xl font-semibold leading-tight">
            {program.name}
          </h3>
          <p className="text-[#B88A5A] text-[9px] sm:text-xs font-medium mt-0.5 sm:mt-1">{program.pitch}</p>
          <p className="text-[#2B2F36]/50 text-[11px] sm:text-[13px] leading-snug sm:leading-relaxed mt-1.5 sm:mt-2 line-clamp-2">{program.desc}</p>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 sm:pt-3 mt-1.5 sm:mt-2 border-t border-[#0B1220]/[0.05] shrink-0">
          <div className="space-y-0 min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5 text-[#2B2F36]/40 text-[9px] sm:text-xs">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate">{program.format}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[#2B2F36]/30 text-[9px] sm:text-xs">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span className="truncate">{program.animator}</span>
            </div>
          </div>
          <Link
            href={h(locale, `/corporate/programmes#${program.link.split("/").pop()}`)}
            className="px-2.5 sm:px-5 h-7 sm:h-9 rounded-full bg-[#0B1220] text-white text-[9px] sm:text-xs font-semibold tracking-wide hover:bg-[#B88A5A] transition-colors duration-300 shrink-0 inline-flex items-center whitespace-nowrap"
          >
            {discoverLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProgrammesSection() {
  const { t, tRaw, locale } = useLocale();
  const programmes = tRaw<Program[]>("entreprises.programmes.list");

  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".pg-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const total = programmes.length;
  const prevIdx = (activeIdx - 1 + total) % total;
  const nextIdx = (activeIdx + 1) % total;

  const navigate = useCallback((dir: 1 | -1) => {
    if (isAnimating || total === 0) return;
    setIsAnimating(true);
    setDirection(dir);
    setActiveIdx(prev => (prev + dir + total) % total);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, total]);

  const edge = containerWidth < 640 ? EDGE_PX_MOBILE : EDGE_PX;

  function getPosition(idx: number): "active" | "prev" | "next" | null {
    if (idx === activeIdx) return "active";
    if (idx === prevIdx) return "prev";
    if (idx === nextIdx) return "next";
    return null;
  }

  function getAnimate(position: string, cw: number) {
    const gap = edge;
    const cardW = cw - 2 * gap;
    if (position === "active") return { x: gap, scale: 1, opacity: 1, rotate: 0 };
    if (position === "prev") return { x: gap - cardW + edge, scale: SIDE_SCALE, opacity: SIDE_OPACITY, rotate: -6 };
    return { x: cw - gap - edge, scale: SIDE_SCALE, opacity: SIDE_OPACITY, rotate: 6 };
  }

  if (!total) return null;

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9] pt-4 sm:pt-8 pb-12 sm:pb-16 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="pg-head max-w-2xl mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            <span className="w-8 h-px bg-[#B88A5A]/40" />
            {t("entreprises.programmes.title")}
          </span>
          <h2 className="heading-serif text-[#0B1220] mt-4 leading-[1.06]" style={{ fontSize: "clamp(1.75rem, 3.15vw, 3rem)" }}>
            {t("entreprises.programmes.subtitle")}
          </h2>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={() => navigate(-1)}
            aria-label={t("entreprises.programmes.prevLabel")}
            className="flex w-11 h-11 sm:w-10 sm:h-10 rounded-full border border-[#0B1220]/[0.15] items-center justify-center text-[#0B1220]/30 hover:border-[#B88A5A]/50 hover:text-[#B88A5A] transition-colors duration-200 shrink-0 z-10"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={containerRef}
            className="relative rounded-3xl w-full max-w-[600px] mx-auto"
            style={{ height: "clamp(280px, 52vw, 460px)" }}
          >
            <AnimatePresence initial={false} custom={{ direction, cw: containerWidth }}>
              {programmes.map((program, idx) => {
                const position = getPosition(idx);
                if (!position) return null;

                const isActive = position === "active";

                return (
                  <motion.div
                    key={idx}
                    className="absolute top-0 left-0 will-change-transform"
                    custom={{ direction, cw: containerWidth }}
                    initial={{ x: direction > 0 ? containerWidth + 50 : -containerWidth - 50, opacity: 0, rotate: direction > 0 ? 6 : -6 }}
                    animate={getAnimate(position, containerWidth)}
                    exit={{ x: direction > 0 ? -containerWidth - 50 : containerWidth + 50, opacity: 0, rotate: direction > 0 ? -6 : 6 }}
                    transition={SPRING}
                    style={{
                      width: containerWidth - 2 * edge,
                      zIndex: position === "active" ? 3 : position === "next" ? 2 : 1,
                    }}
                    drag={isActive ? "x" : false}
                    dragConstraints={{ left: -containerWidth * 0.35, right: containerWidth * 0.35 }}
                    dragElastic={0.25}
                    onDragEnd={(_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
                      if (!isActive) return;
                      if (info.offset.x < -40 || info.velocity.x < -400) navigate(1);
                      else if (info.offset.x > 40 || info.velocity.x > 400) navigate(-1);
                    }}
                  >
                    <CardContent
                      program={program}
                      image={cardImages[idx % cardImages.length]}
                      isActive={isActive}
                      locale={locale}
                      discoverLabel={t("entreprises.programmes.discoverLabel")}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <button
            onClick={() => navigate(1)}
            aria-label={t("entreprises.programmes.nextLabel")}
            className="flex w-11 h-11 sm:w-10 sm:h-10 rounded-full border border-[#0B1220]/[0.15] items-center justify-center text-[#0B1220]/30 hover:border-[#B88A5A]/50 hover:text-[#B88A5A] transition-colors duration-200 shrink-0 z-10"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 mt-10">
          <span className="text-[#0B1220]/25 text-sm font-medium tabular-nums">
            {activeIdx + 1} <span className="text-[#0B1220]/15">/ {total}</span>
          </span>
          <span className="text-[#0B1220]/15 text-[10px] font-semibold tracking-[0.15em] uppercase">
            {t("entreprises.programmes.swipeLabel")}
          </span>
        </div>
      </div>
    </section>
  );
}
