/**
 * Corporate Footer — simplified footer specifically for the /corporate pages.
 * Dark background with logo, nav links, social icons, and legal links.
 * Separate from the main site Footer for a consistent B2B experience.
 */
"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";

const socialLinks = [
  {
    label: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    label: "X",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
];

export default function EntreprisesFooter(): React.JSX.Element {
  const { t, tRaw, locale } = useLocale();
  const hh = (path: string) => h(locale, path);

  const footerSolutions = tRaw<{title: string; links: string[]}>("entreprises.footer.solutions");
  const footerResources = tRaw<{title: string; links: string[]}>("entreprises.footer.resources");
  const footerContactRaw = tRaw<{title: string; phone: string; address: string; city: string; email: string}>("entreprises.footer.contact");
  const footerAPropos = tRaw<{title: string; links: string[]}>("entreprises.footer.aPropos");

  const footerLinks = [
    footerSolutions,
    footerResources,
    {
      title: footerContactRaw.title,
      links: [footerContactRaw.phone, footerContactRaw.address, footerContactRaw.city, footerContactRaw.email],
    },
    footerAPropos,
  ];

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
      {/* Teal glow — different from Cta's bronze glow */}
      <div
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(21,154,169,0.06) 0%, transparent 65%)" }}
      />
      {/* Bronze accent glow */}
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle at center, rgba(184,138,90,0.04) 0%, transparent 60%)" }}
      />
      {/* Logo background watermark */}
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
            {/* Dark gradient bg like Pour vos dirigeants */}
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
                    {t("entreprises.footer.desc")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {socialLinks.map((s) => {
                    const urls: Record<string, string> = {
                      LinkedIn: "https://linkedin.com/company/wenaya",
                      Instagram: "https://instagram.com/wenaya",
                      X: "https://x.com/wenaya",
                    };
                    return (
                      <a
                        key={s.label}
                        href={urls[s.label] || "#"}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="w-10 h-10 rounded-full bg-white/[0.05] hover:bg-[#B88A5A] flex items-center justify-center text-white/40 hover:text-white transition-all duration-300 group border border-white/[0.06]"
                        aria-label={s.label}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d={s.path} />
                        </svg>
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                {footerLinks.map((group) => {
                  const isContact = group.links.length === 4 && group.links[1] === footerContactRaw.address;
                  const groupUrls = isContact
                    ? null
: group.title === footerSolutions.title
                        ? [hh("/corporate"), "#", "#", "#"]
                      : group.title === footerResources.title
                        ? [hh("/faq"), "#", "#"]
                        : group.title === footerAPropos.title
                          ? [hh("/about"), hh("/pratiques"), "#", "#"]
                          : null;
                  return (
                    <div key={group.title}>
                      <h4 className="text-white/30 font-heading font-semibold text-xs mb-6 uppercase tracking-[0.15em]">
                        {group.title}
                      </h4>
                      <ul className="space-y-3">
                        {group.links.map((link, i) => {
                          let href: string | null;
                          let external = false;
                          if (isContact) {
                            if (i === 0) { href = `tel:${footerContactRaw.phone.replace(/\s/g, "")}`; external = true; }
                            else if (i === 3) { href = `mailto:${footerContactRaw.email}`; external = true; }
                            else href = null;
                          } else {
                            href = groupUrls?.[i] ?? "#";
                          }
                          if (href === null) {
                            return <li key={link} className="text-white/45 text-sm leading-relaxed">{link}</li>;
                          }
                          const cls = "text-white/45 hover:text-white transition-all duration-300 text-sm leading-relaxed";
                          if (external) {
                            return <li key={link}><a href={href} className={cls}>{link}</a></li>;
                          }
                          return <li key={link}><Link href={href} className={cls}>{link}</Link></li>;
                        })}
                      </ul>
                    </div>
                  );
                })}

              </div>

              <div className="border-t border-white/[0.08] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-white/25 text-xs">
                  {t("entreprises.footer.copyright").replace("{year}", String(new Date().getFullYear()))}
                </p>
                <p className="text-white/20 text-xs">
                  {t("entreprises.footer.hours")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

