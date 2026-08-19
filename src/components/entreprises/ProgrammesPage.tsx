/**
 * Programmes Page — detailed showcase of Wenaya's corporate wellness programs.
 * Shared by the French (/solutions/entreprises/programmes) and English
 * (/en/solutions/entreprises/programmes) routes.
 * Client component with program cards, pricing tiers, feature comparisons,
 * and CTA sections. Extensive page with multiple program options.
 */
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useLocale } from "@/contexts/LanguageContext";

interface Program {
  badge: string; name: string; pitch: string; desc: string;
  format: string; animator: string; link: string;
}

interface ProgramExtras {
  benefits: string[];
  forWho: string;
  outcomes: string[];
  modules: { title: string; desc: string }[];
  chartData: { label: string; value: number }[];
}

/* ── 3D scroll animations ── */

function FadeSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotateX: 4, y: 60 }}
      animate={inView ? { opacity: 1, rotateX: 0, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FadeItem({ children, index = 0, className = "" }: { children: React.ReactNode; index?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotateX: 2 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function HeroDiamondPattern() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 8]);
  return (
    <motion.div ref={ref} className="absolute inset-0 w-full h-full" style={{ y, rotateX, transformPerspective: 800 }}>
      <svg className="w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="diamond" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="none" />
            <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diamond)" />
      </svg>
    </motion.div>
  );
}

function ParallaxDotsPattern({ color = "white" }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  return (
    <motion.div ref={ref} className="absolute inset-0 w-full h-full" style={{ y }}>
      <svg className="w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="parallax-dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="1.5" fill={color} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#parallax-dots)" />
      </svg>
    </motion.div>
  );
}

function getSlug(link: string) {
  return link.split("/").pop() ?? "";
}

const programImages: Record<string, string[]> = {
  pcm: [
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=90",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=90",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=90",
  ],
  "leadership-360": [
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=90",
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=90",
    "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=90",
  ],
  "art-des-priorites": [
    "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=90",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=90",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=90",
  ],
  "people-model-canvas": [
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=90",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=90",
    "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=90",
  ],
};

function DiamondPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="diamond" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="none" />
          <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diamond)" />
    </svg>
  );
}

function DotsPattern({ color = "white" }: { color?: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1.5" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}

function ImpactChart({ data }: { data: { label: string; value: number }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const maxVal = Math.max(...data.map(d => d.value));
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="space-y-4 mt-6"
    >
      {data.map((d, i) => {
        const pct = (d.value / maxVal) * 100;
        return (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#2B2F36]/60">{d.label}</span>
              <span className="text-[#0B1220] font-semibold">{d.value}%</span>
            </div>
            <div className="relative h-2 rounded-full bg-[#0B1220]/[0.06] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${pct}%` } : {}}
                transition={{ duration: 1, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#B88A5A] to-[#D4A574]"
              />
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

export default function ProgrammesPage() {
  const { locale, t, tRaw } = useLocale();
  const backEnterpriseHref = locale === "en" ? "/en/solutions/entreprises" : "/solutions/entreprises";
  const programmes = tRaw<Program[]>("entreprises.programmes.list");
  const programmeExtras = tRaw<Record<string, ProgramExtras>>("entreprises.programmes.details");
  const [activeIdx, setActiveIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const program = programmes[activeIdx];
  const slug = getSlug(program?.link ?? "");
  const info = programmeExtras[slug];
  const images = programImages[slug];

  if (!program) return null;

  return (
    <div className="lg:flex min-h-screen bg-[#F2EFE9]">
      {/* ── Mobile top bar ── */}
      <div className="lg:hidden sticky top-0 z-20 bg-[#0B1220]">
        <div className="flex items-center justify-between px-4 h-14">
          <Link
            href={backEnterpriseHref}
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-xs tracking-wide transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t("entreprises.programmes.back")}
          </Link>
          <span className="text-white/30 text-[10px] font-semibold tracking-[0.15em] uppercase">
            {t("entreprises.programmes.title")}
          </span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.1] text-white/50 hover:text-white/80 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/[0.06] bg-[#0B1220]">
            {programmes.map((p, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={idx}
                  onClick={() => { setActiveIdx(idx); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 transition-colors duration-200 ${
                    isActive ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <span className={`block text-[10px] font-bold tracking-[0.1em] uppercase ${
                    isActive ? "text-[#B88A5A]" : "text-white/30"
                  }`}>
                    {p.badge}
                  </span>
                  <span className={`block text-sm font-medium mt-0.5 ${
                    isActive ? "text-white" : "text-white/50"
                  }`}>
                    {p.name}
                  </span>
                </button>
              );
            })}
            <div className="px-4 py-3 border-t border-white/[0.06]">
              <Link
                href={backEnterpriseHref}
                className="block w-full text-center py-2 rounded-lg border border-white/[0.12] text-white/50 text-xs font-medium hover:bg-white/[0.04] transition-all"
              >
                {t("entreprises.programmes.backEnterprise")}
              </Link>
            </div>
          </div>
        )}

        <div className="flex overflow-x-auto gap-1 px-3 py-2 scrollbar-hide border-t border-white/[0.04]">
          {programmes.map((p, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wide whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-[#B88A5A] text-white"
                    : "bg-white/[0.06] text-white/40 hover:bg-white/[0.1]"
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex w-[260px] shrink-0 bg-[#0B1220] flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-white/[0.06]">
          <Link
            href={backEnterpriseHref}
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-xs tracking-wide transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t("entreprises.programmes.back")}
          </Link>
          <span className="block text-white/30 text-[10px] font-semibold tracking-[0.15em] uppercase mt-4">
            {t("entreprises.programmes.title")}
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {programmes.map((p, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`w-full text-left px-6 py-4 transition-all duration-200 border-l-2 ${
                  isActive
                    ? "border-[#B88A5A] bg-white/[0.04]"
                    : "border-transparent hover:bg-white/[0.02] hover:border-white/[0.08]"
                }`}
              >
                <span className={`block text-[10px] font-bold tracking-[0.1em] uppercase transition-colors duration-200 ${
                  isActive ? "text-[#B88A5A]" : "text-white/30"
                }`}>
                  {p.badge}
                </span>
                <span className={`block text-sm font-medium mt-1 transition-colors duration-200 ${
                  isActive ? "text-white" : "text-white/50"
                }`}>
                  {p.name}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/[0.06]">
          <Link
            href={backEnterpriseHref}
            className="block w-full text-center py-2.5 rounded-lg border border-white/[0.12] text-white/50 text-xs font-medium hover:bg-white/[0.04] hover:text-white/70 transition-all duration-200"
          >
            {t("entreprises.programmes.backEnterprise")}
          </Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1" style={{ perspective: "1200px" }}>
        {/* ── HERO ── */}
        <FadeSection className="relative bg-[#0B1220] overflow-hidden">
          <HeroDiamondPattern />
          <div className="relative px-6 sm:px-12 lg:px-16 xl:px-24 pt-10 lg:pt-36 pb-16 lg:pb-28">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-8">
                <span className="h-px w-8 bg-[#B88A5A]/50" />
                <span className="text-[#B88A5A] text-[10px] font-bold tracking-[0.15em] uppercase">
                  {program.badge}
                </span>
              </div>
              <h1 className="heading-serif text-white text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.04] tracking-tight">
                {program.name}
              </h1>
              <div className="relative mt-6 pl-6 border-l-2 border-[#B88A5A]/40">
                <p className="text-[#B88A5A] text-lg sm:text-xl font-medium">
                  {program.pitch}
                </p>
              </div>
              <div className="flex flex-wrap gap-x-10 gap-y-2 mt-10 pt-6 border-t border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#B88A5A]/10 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-white/50 text-sm">{program.format}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#B88A5A]/10 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <span className="text-white/50 text-sm">{program.animator}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B88A5A]/20 to-transparent" />
        </FadeSection>

        {/* ── DESCRIPTION — 50/50 SPLIT ── */}
        <FadeSection className="relative bg-white overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[420px]">
            <div className="px-6 sm:px-12 lg:px-16 xl:px-24 py-20 lg:py-28 flex flex-col justify-center">
              <span className="text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">{t("entreprises.programmes.overviewLabel")}</span>
              <div className="relative mt-6">
                <span className="absolute -top-3 -left-4 text-[#B88A5A]/10 text-7xl font-serif leading-none select-none">&ldquo;</span>
                <p className="text-[#2B2F36]/70 text-base sm:text-lg leading-[1.8] relative z-10">
                  {program.desc}
                </p>
              </div>
            </div>
            {info && (
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent z-10" />
                <Image
                  src={images[0]}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            )}
          </div>
        </FadeSection>

        {info && (
          <>
            {/* ── FULL-BLEED BANNER ── */}
            <section className="relative h-[50vh] min-h-[320px] overflow-hidden">
              <Image src={images[1]} alt="" fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/70 via-[#0B1220]/30 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="px-6 sm:px-12 lg:px-16 xl:px-24 max-w-2xl">
                  <span className="text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">{t("entreprises.programmes.overviewLabel")}</span>
                  <p className="text-white/80 text-lg sm:text-xl leading-relaxed mt-4 max-w-xl">
                    {program.pitch}
                  </p>
                </div>
              </div>
            </section>

            {/* ── BENEFITS ── */}
            <FadeSection className="relative bg-[#F2EFE9] px-6 sm:px-12 lg:px-16 xl:px-24 py-20 lg:py-28 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#B88A5A]/[0.02] blur-3xl pointer-events-none" />
              <div className="max-w-4xl mx-auto relative">
                <div className="flex items-center gap-4 mb-3">
                  <span className="w-6 h-px bg-[#B88A5A]/40" />
                  <span className="text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
                    {t("entreprises.programmes.benefitsLabel")}
                  </span>
                </div>
                <div className="divide-y divide-[#0B1220]/[0.06] mt-10">
                  {info.benefits.map((b, i) => {
                    const icons = [
                      <svg key="0" className="w-5 h-5 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                      <svg key="1" className="w-5 h-5 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" /></svg>,
                      <svg key="2" className="w-5 h-5 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>,
                      <svg key="3" className="w-5 h-5 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
                    ];
                    return (
                      <FadeItem key={i} index={i}>
                        <div className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                          <div className="w-10 h-10 rounded-full bg-[#B88A5A]/10 flex items-center justify-center shrink-0 mt-0.5">
                            {icons[i]}
                          </div>
                          <p className="text-[#2B2F36]/70 text-sm leading-relaxed pt-1.5">{b}</p>
                        </div>
                      </FadeItem>
                    );
                  })}
                </div>
              </div>
            </FadeSection>

            {/* ── TARGET ── */}
            <FadeSection className="relative bg-[#0B1220] overflow-hidden">
              <ParallaxDotsPattern />
              <div className="absolute inset-0 opacity-[0.08]">
                <Image src={images[2]} alt="" fill className="object-cover" sizes="100vw" />
              </div>
              <div className="relative px-6 sm:px-12 lg:px-16 xl:px-24 py-20 lg:py-28">
                <div className="max-w-3xl mx-auto text-center">
                  <svg className="w-10 h-10 text-[#B88A5A] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  <span className="block text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mt-6 mb-8">
                    {t("entreprises.programmes.targetLabel")}
                  </span>
                  <div className="relative">
                    <svg className="absolute -top-4 -left-2 text-[#B88A5A]/10 w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                    </svg>
                    <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto relative z-10">
                      {info.forWho}
                    </p>
                  </div>
                </div>
              </div>
            </FadeSection>

            {/* ── OUTCOMES ── */}
            <FadeSection className="relative bg-white px-6 sm:px-12 lg:px-16 xl:px-24 py-20 lg:py-28 overflow-hidden">
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-[0.02]">
                <DotsPattern color="#0B1220" />
              </div>
              <div className="max-w-4xl mx-auto relative">
                <div className="flex items-center gap-4 mb-3">
                  <span className="w-6 h-px bg-[#B88A5A]/40" />
                  <span className="text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
                    {t("entreprises.programmes.outcomesLabel")}
                  </span>
                </div>
                <h2 className="heading-serif text-[#0B1220] text-2xl sm:text-3xl font-semibold mt-2 mb-10">
                  {t("entreprises.programmes.outcomesTitle")}
                </h2>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                  {info.outcomes.map((o, i) => (
                    <FadeItem key={i} index={i}>
                      <div className="flex items-start gap-4 group">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-[#0B1220] flex items-center justify-center shrink-0 text-white text-sm font-bold group-hover:bg-[#B88A5A] transition-colors duration-300">
                            {i + 1}
                          </div>
                          {i < info.outcomes.length - 1 && i % 2 === 0 && (
                            <div className="hidden sm:block absolute top-10 left-1/2 w-px h-[calc(100%+1.5rem)] bg-[#0B1220]/[0.06]" />
                          )}
                        </div>
                        <p className="text-[#2B2F36]/70 text-sm leading-relaxed pt-2">{o}</p>
                      </div>
                    </FadeItem>
                  ))}
                </div>
              </div>
            </FadeSection>

            {/* ── IMPACT CHART ── */}
            <FadeSection className="relative bg-[#F2EFE9] px-6 sm:px-12 lg:px-16 xl:px-24 py-20 lg:py-28 overflow-hidden">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-3">
                  <span className="w-6 h-px bg-[#B88A5A]/40" />
                  <span className="text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
                    {t("entreprises.programmes.impactLabel")}
                  </span>
                </div>
                <h2 className="heading-serif text-[#0B1220] text-2xl sm:text-3xl font-semibold mt-2 mb-4">
                  {t("entreprises.programmes.impactTitle")}
                </h2>
                <ImpactChart data={info.chartData} />
              </div>
            </FadeSection>

            {/* ── MODULES ── */}
            <FadeSection className="relative bg-[#0B1220] overflow-hidden">
              <DiamondPattern />
              <div className="relative px-6 sm:px-12 lg:px-16 xl:px-24 py-20 lg:py-28">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="w-6 h-px bg-[#B88A5A]/40" />
                    <span className="text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
                      {t("entreprises.programmes.modulesLabel")}
                    </span>
                  </div>
                  <h2 className="heading-serif text-white text-2xl sm:text-3xl font-semibold mt-2 mb-12">
                    {t("entreprises.programmes.modulesTitle")}
                  </h2>
                  <div className="relative">
                    <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-[#B88A5A]/40 via-[#B88A5A]/10 to-transparent" />
                    <div className="space-y-0">
                      {info.modules.map((m, i) => (
                        <FadeItem key={i} index={i}>
                          <div className="relative flex gap-6 pb-10 last:pb-0">
                            <div className="relative z-10">
                              <div className="w-[38px] h-[38px] rounded-full bg-[#B88A5A] flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-[#B88A5A]/20">
                                {i + 1}
                              </div>
                            </div>
                            <div className="pt-1.5 flex-1">
                              <h3 className="text-white text-base font-medium">{m.title}</h3>
                              <p className="text-white/40 text-sm leading-relaxed mt-1.5 max-w-xl">{m.desc}</p>
                            </div>
                          </div>
                        </FadeItem>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeSection>
          </>
        )}

        {/* ── CTA ── */}
        <FadeSection className="relative bg-[#F2EFE9] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B88A5A]/30 to-transparent" />
          <div className="relative px-6 sm:px-12 lg:px-16 xl:px-24 py-20 lg:py-28">
            <div className="max-w-2xl mx-auto text-center">
              <span className="text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
                {t("entreprises.programmes.ctaLabel")}
              </span>
              <h2 className="heading-serif text-[#0B1220] text-[clamp(1.8rem,3.5vw,3rem)] font-semibold mt-4 leading-[1.08]">
                {t("entreprises.programmes.ctaTitle")}
              </h2>
              <p className="text-[#2B2F36]/50 text-sm sm:text-base mt-4 max-w-md mx-auto">
                {t("entreprises.programmes.ctaDesc")}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="https://calendar.app.google/YyAirdPSc2ugGbnh9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 h-12 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                    boxShadow: "0 4px 20px rgba(184,138,90,0.3)",
                  }}
                >
                  {t("entreprises.programmes.ctaPrimary")}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href={backEnterpriseHref}
                  className="inline-flex items-center gap-2 px-8 h-12 rounded-full border border-[#0B1220]/10 text-[#2B2F36]/50 text-sm font-medium hover:border-[#B88A5A]/30 hover:text-[#B88A5A] transition-all duration-200"
                >
                  {t("entreprises.programmes.ctaSecondary")}
                </Link>
              </div>
              <p className="text-[#2B2F36]/30 text-xs mt-4">{t("entreprises.programmes.ctaNote")}</p>
            </div>
          </div>
        </FadeSection>
      </main>
    </div>
  );
}
