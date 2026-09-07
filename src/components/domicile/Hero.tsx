/**
 * Homecare Hero — cinematic, full-bleed hero for /soins-a-domicile.
 *
 * Same cinematic family as the Clinic hero (reuses `.ch-*` CSS + GSAP), but
 * with its own identity: a calm, reassuring, care-led presentation for
 * at-home services. Navy overlay, one-image backdrop, a single WhatsApp CTA.
 *
 * All copy is the exact live `wenaya.com/soins-a-domicile` content — rebuilt
 * presentation only. Content is always visible in the HTML (SSR/no-JS safe);
 * GSAP entrance fires only when the section approaches the viewport and is
 * skipped entirely under prefers-reduced-motion.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";import { gsap } from "gsap";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

const WHATSAPP_HREF =
  "https://wa.me/212666124035?text=Bonjour,%20je%20souhaite%20obtenir%20des%20informations%20sur%20les%20services%20de%20soins%20%C3%A0%20domicile%20%C3%A0%20Casablanca.";

export default function HomecareHero(): React.JSX.Element {
  const { elRef: sectionRef, ready } = useIntersectionDeferred();
  const reduceMotion = (): boolean =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!ready) return;
    const el = sectionRef.current;
    if (!el) return;
    if (reduceMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dc-bg-wrap",
        { scale: 1.07 },
        { scale: 1.0, duration: 8.5, ease: "power1.out" }
      );
      gsap.fromTo(
        ".dc-bg-wrap",
        { yPercent: -2 },
        {
          yPercent: 3,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        }
      );
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".dc-eyebrow", { opacity: 1, y: 0, duration: 0.5 })
        .to(
          ".dc-line",
          { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.1 },
          "-=0.25"
        )
        .to(".dc-sub", { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
        .to(".dc-cta", { opacity: 1, y: 0, duration: 0.55 }, "-=0.35");
    }, el);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      data-section-bg="dark"
      aria-label="Soins à domicile"
      className="relative flex items-end overflow-hidden bg-[#0B1220] min-h-[82svh] sm:min-h-[86svh] lg:min-h-[90vh]"
    >
      {/* ── Background — full-bleed visual with layered navy overlay ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="dc-bg-wrap absolute inset-x-0 -top-[6%] -bottom-[6%] will-change-transform">
          <Image
            src="/domicile/Infirmerie.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(11,18,32,0.82) 0%, rgba(11,18,32,0.5) 44%, rgba(11,18,32,0.22) 74%, rgba(11,18,32,0.06) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 sm:h-48"
          style={{
            background:
              "linear-gradient(to top, rgba(11,18,32,0.96) 0%, rgba(11,18,32,0.6) 38%, rgba(11,18,32,0) 100%)",
          }}
        />
      </div>

      {/* ── Content — lower area, no card ── */}
      <div className="relative z-10 w-full px-6 sm:px-10 pt-32 pb-14 sm:pb-16 lg:pt-36 lg:pb-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            <div className="dc-eyebrow dc-fade flex items-center gap-3 mb-6 lg:mb-7">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B88A5A] shrink-0" />
              <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase">
                Soins à domicile
              </span>
            </div>

            <h1
              className="heading-serif text-white leading-[1.04] tracking-[-0.01em]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4.4rem)" }}
            >
              <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <span className="dc-line block will-change-transform">
                  Garde malade &amp; infirmier à domicile
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <span
                  className="dc-line block will-change-transform"
                  style={{
                    background: "linear-gradient(135deg, #C99B68 0%, #B88A5A 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  à Casablanca – 24h/24
                </span>
              </span>
            </h1>

            <p className="dc-sub dc-fade mt-6 sm:mt-7 max-w-[560px] text-white/80 text-base sm:text-lg leading-relaxed">
              Prise en charge coordonnée, humaine et sécurisée pour vos proches au
              domicile à Casablanca.
            </p>

            <div className="dc-cta dc-fade mt-8 sm:mt-9">
              <Link
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 h-13 px-8 text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px"
                style={{
                  background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 24px rgba(184,138,90,0.3)",
                }}
              >
                Contactez-nous sur WhatsApp
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
