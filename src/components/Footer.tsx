"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

export default function Footer(): React.JSX.Element {
  const { t, tRaw } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const el = sectionRef.current;
    const body = bodyRef.current;
    const bg = bgTextRef.current;
    if (!el || !body || !bg) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        body,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        }
      );
      gsap.to(bg, {
        y: 20, duration: 12, ease: "sine.inOut", repeat: -1, yoyo: true,
      });
      if (sweepRef.current) {
        gsap.to(sweepRef.current, {
          x: "100%", duration: 8, ease: "power2.inOut", repeat: -1, delay: 2,
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  const parallaxX = (mousePos.x - 0.5) * -20;
  const parallaxY = (mousePos.y - 0.5) * -10;

  return (
    <footer ref={sectionRef} className="bg-[#0B1220] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none">
        <div ref={glowRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[#B88A5A]/[0.07] blur-[140px]" />
        <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-white/[0.04] blur-[120px]" />
        <div className="absolute bottom-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-[#B88A5A]/[0.05] blur-[100px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        <svg className="absolute inset-0 w-full h-full opacity-[0.015]">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>

        <div
          ref={bgTextRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `translate(${parallaxX}px, ${parallaxY}px)` }}
        >
          <span
            className="text-[clamp(8rem,25vw,40rem)] font-bold leading-none tracking-[-0.06em] whitespace-nowrap select-none text-transparent bg-clip-text bg-gradient-to-b from-white/[0.12] via-white/[0.09] to-[#B88A5A]/[0.07]"
            style={{ fontStretch: "expanded" }}
          >
            WENAYA
          </span>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden
        >
          <span
            className="text-[clamp(8rem,25vw,40rem)] font-bold leading-none tracking-[-0.06em] whitespace-nowrap text-white/[0.03] blur-[6px]"
            style={{ fontStretch: "expanded" }}
          >
            WENAYA
          </span>
        </div>

        <div
          ref={sweepRef}
          className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent skew-x-[-20deg] -translate-x-1/2"
          style={{ left: "-100%" }}
        />
      </div>

      <div className="w-full relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-10 sm:py-14">
          <div ref={bodyRef} className="flex flex-col gap-6">

            {/* ── Main card ── */}
            <div
              className="w-full max-w-5xl bg-[#F2EFE9]/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 lg:p-14 mx-auto border border-white/[0.06]"
              style={{
                boxShadow: "0 24px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)",
              }}
            >
              {/* ── Logo + Newsletter row ── */}
              <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-10">
                <div className="max-w-sm">
                  <Image
                    src="/images/logo-full.png"
                    alt="Wenaya"
                    width={1097}
                    height={222}
                    className="h-7 sm:h-8 w-auto"
                  />
                  <p className="text-[#2B2F36]/80 text-sm mt-4 leading-relaxed">
                    {t("footer.desc")}
                  </p>
                </div>
                <div className="w-full lg:w-auto lg:min-w-[340px]">
                  <h4 className="text-[#0B1220] font-semibold text-sm mb-1">
                    Abonnez-vous à notre newsletter
                  </h4>
                  <p className="text-[#2B2F36]/60 text-xs mb-3">
                    Recevez nos conseils santé et actualités
                  </p>
                  <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="email"
                      placeholder="Votre email"
                      className="flex-1 min-w-0 px-4 py-2.5 rounded-lg border border-[#0B1220]/[0.12] bg-white text-sm text-[#0B1220] placeholder-[#2B2F36]/40 outline-none focus:border-[#B88A5A] transition-colors"
                    />
                    <button
                      type="submit"
                      className="shrink-0 px-5 py-2.5 rounded-lg bg-[#0B1220] text-white text-sm font-medium hover:bg-[#1a2332] transition-colors"
                    >
                      OK
                    </button>
                  </form>
                </div>
              </div>

              {/* ── Link columns grid ── */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h4 className="text-[#0B1220]/50 font-heading font-semibold text-xs mb-6 uppercase tracking-[0.15em]">
                    {t("footer.navigation.title")}
                  </h4>
                  <ul className="space-y-3">
                    {(tRaw<string[]>("footer.navigation.links")).map((label: string, i: number) => (
                      <li key={label}>
                        <Link
                          href={["/about", "#", "#", "/solutions/entreprises"][i] || "#"}
                          className="text-[#2B2F36]/70 hover:text-[#0B1220] transition-all duration-300 text-sm leading-relaxed"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[#0B1220]/50 font-heading font-semibold text-xs mb-6 uppercase tracking-[0.15em]">
                    {t("footer.infosLegales.title")}
                  </h4>
                  <ul className="space-y-3">
                    {(tRaw<string[]>("footer.infosLegales.links")).map((label: string, i: number) => (
                      <li key={label}>
                        <Link
                          href={["/confidentialite", "/conditions"][i] || "#"}
                          className="text-[#2B2F36]/70 hover:text-[#0B1220] transition-all duration-300 text-sm leading-relaxed"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[#0B1220]/50 font-heading font-semibold text-xs mb-6 uppercase tracking-[0.15em]">
                    {t("footer.contact.title")}
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="tel:+212666124035"
                        className="text-[#2B2F36]/70 hover:text-[#0B1220] transition-all duration-300 text-sm leading-relaxed"
                      >
                        {t("footer.contact.phone")}
                      </a>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        className="text-[#2B2F36]/70 hover:text-[#0B1220] transition-all duration-300 text-sm leading-relaxed"
                      >
                        {t("footer.contact.contact")}
                      </Link>
                    </li>
                  </ul>
                  <p className="text-[#2B2F36]/40 text-sm mt-3">{t("footer.contact.address")}</p>
                </div>
              </div>

              {/* ── Social icons + Copyright ── */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-10 pt-6 border-t border-[#0B1220]/10">
                <div className="flex items-center gap-3">
                  {(tRaw<string[]>("footer.socials")).map((label: string, i: number) => (
                    <a
                      key={label}
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="w-10 h-10 rounded-full bg-[#0B1220]/5 hover:bg-[#B88A5A] flex items-center justify-center text-[#2B2F36]/60 hover:text-white transition-all duration-300"
                      aria-label={label}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d={[
                          "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                          "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
                          "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
                          "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
                        ][i] || ""}
                        />
                      </svg>
                    </a>
                  ))}
                </div>
                <p className="text-[#2B2F36]/50 text-xs">
                  {t("footer.copyright").replace("{year}", String(new Date().getFullYear()))}
                </p>
              </div>
            </div>

            {/* ── Hours row ── */}
            <p className="text-white/40 text-xs text-center">
              {t("footer.hours")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
