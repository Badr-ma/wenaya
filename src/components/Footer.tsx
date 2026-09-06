/**
 * Site Footer — full-width dark footer with logo, description, nav columns (solutions,
 * services, company, legal), social icons, newsletter input, and copyright.
 * Features: GSAP fade-in animation, newsletter form, and social media links.
 */
"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { h, groupSessionsHref } from "@/lib/href";
import type { FooterContent } from "@/lib/homepage-types";

const socialPaths: Record<string, string> = {
  LinkedIn: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  Instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  Facebook: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  TikTok: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.62 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
};

const socialUrls: Record<string, string> = {
  LinkedIn: "https://www.linkedin.com/company/wenaya",
  Instagram: "https://www.instagram.com/wenaya_maroc/",
  Facebook: "https://www.facebook.com/WenayaMaroc/",
  TikTok: "https://www.tiktok.com/@wenaya_maroc",
};

const navUrls = ["/about", "/professional", "/seance-de-groupe", "/corporate", "/faq"];
const legalUrls = ["/confidentialite", "/conditions"];

interface FooterProps {
  content?: FooterContent;
}

export default function Footer({ content }: FooterProps): React.JSX.Element {
  const { t, tRaw, locale } = useLocale();
  const hh = (path: string) => h(locale, path);

  const navLinks = tRaw<string[]>("footer.navigation.links");
  const legalLinks = tRaw<string[]>("footer.infosLegales.links");
  const contactRaw = tRaw<{ title: string; phone: string; contact: string; address: string }>("footer.contact");
  const socials = tRaw<string[]>("footer.socials");

  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    const body = bodyRef.current;
    if (!el || !body) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        body,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={sectionRef} className="bg-[#0B1220] relative overflow-hidden py-16 sm:py-24">
      <div
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(21,154,169,0.06) 0%, transparent 65%)" }}
      />
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle at center, rgba(184,138,90,0.04) 0%, transparent 60%)" }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <div className="relative w-[clamp(300px,90vw,2200px)] aspect-[1097/222] opacity-[0.06]">
          <Image src="/images/logo-full.png" alt="" fill className="object-contain brightness-0 invert" sizes="90vw" />
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
        <div className="relative w-[clamp(300px,90vw,2200px)] aspect-[1097/222] opacity-[0.015] blur-[6px]">
          <Image src="/images/logo-full.png" alt="" fill className="object-contain brightness-0 invert" sizes="90vw" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div ref={bodyRef} className="flex justify-center">
          <div
            className="w-full max-w-[840px] rounded-3xl p-6 sm:p-12 lg:p-16 border border-white/[0.06] relative overflow-hidden"
            style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#159AA9]/8 via-[#0B1220] to-[#B88A5A]/4" />
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#B88A5A]/6 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B88A5A]/20 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-14">
                <div>
                  <Image
                    src="/images/logo-full.png"
                    alt="Wenaya"
                    width={1097}
                    height={222}
                    className="h-7 sm:h-8 w-auto brightness-0 invert"
                  />
                  <p className="text-white/45 text-sm mt-4 max-w-sm leading-relaxed">
                    {content?.desc ?? t("footer.desc")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {socials.map((label: string) => (
                    <a
                      key={label}
                      href={socialUrls[label] || "#"}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="w-11 h-11 rounded-full bg-white/[0.05] hover:bg-[#B88A5A] flex items-center justify-center text-white/40 hover:text-white transition-all duration-300 group border border-white/[0.06]"
                      aria-label={label}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d={socialPaths[label] || ""} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                <div>
                  <h4 className="text-white/30 font-heading font-semibold text-xs mb-6 uppercase tracking-[0.15em]">
                    {t("footer.navigation.title")}
                  </h4>
                  <ul className="space-y-3">
                    {navLinks.map((label: string, i: number) => (
                      <li key={label}>
                        <Link href={navUrls[i] === "/seance-de-groupe" ? groupSessionsHref(locale) : hh(navUrls[i] || "#")} className="text-white/45 hover:text-white transition-all duration-300 text-sm leading-relaxed">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-white/30 font-heading font-semibold text-xs mb-6 uppercase tracking-[0.15em]">
                    {t("footer.infosLegales.title")}
                  </h4>
                  <ul className="space-y-3">
                    {legalLinks.map((label: string, i: number) => (
                      <li key={label}>
                        <Link href={hh(legalUrls[i] || "#")} className="text-white/45 hover:text-white transition-all duration-300 text-sm leading-relaxed">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-white/30 font-heading font-semibold text-xs mb-6 uppercase tracking-[0.15em]">
                    {contactRaw.title}
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <a href={`tel:${contactRaw.phone.replace(/\s/g, "")}`} className="text-white/45 hover:text-white transition-all duration-300 text-sm leading-relaxed">
                        {contactRaw.phone}
                      </a>
                    </li>
                    <li>
                      <Link href={hh("/contact")} className="text-white/45 hover:text-white transition-all duration-300 text-sm leading-relaxed">
                        {contactRaw.contact}
                      </Link>
                    </li>
                    <li className="text-white/45 text-sm leading-relaxed">
                      {contactRaw.address}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-white/[0.08] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-white/25 text-xs">
                  {t("footer.copyright").replace("{year}", String(new Date().getFullYear()))}
                </p>
                <p className="text-white/20 text-xs">
                  {content?.hours ?? t("footer.hours")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
