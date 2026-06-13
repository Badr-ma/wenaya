"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const footerLinks = [
  {
    title: "Navigation",
    links: ["Qui sommes nous", "Spécialités", "Cours & Ateliers", "Pour les entreprises"],
  },
  {
    title: "Infos légales",
    links: [
      "Politique de confidentialité",
      "Conditions générales",
    ],
  },
  {
    title: "Contact",
    links: ["+212 6 66 12 40 35", "88 Rue De Jabal Azourki", "Casablanca 20930"],
  },
];

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
  {
    label: "YouTube",
    path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
];

export default function Footer(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
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
    const bg = bgTextRef.current;
    const body = bodyRef.current;
    if (!el || !bg || !body) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        body,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.to(bg, {
        y: 20,
        duration: 12,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      if (sweepRef.current) {
        gsap.to(sweepRef.current, {
          x: "100%",
          duration: 8,
          ease: "power2.inOut",
          repeat: -1,
          delay: 2,
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  const parallaxX = (mousePos.x - 0.5) * -20;
  const parallaxY = (mousePos.y - 0.5) * -10;

  return (
    <footer
      ref={sectionRef}
      className="bg-[#0B1220] relative overflow-hidden min-h-screen flex items-end"
    >
      <div className="absolute inset-0 pointer-events-none select-none">
        <div
          ref={glowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[#B88A5A]/[0.07] blur-[140px]"
        />
        <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-white/[0.04] blur-[120px]" />
        <div className="absolute bottom-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-[#B88A5A]/[0.05] blur-[100px]" />

        <svg className="absolute inset-0 w-full h-full opacity-[0.015]">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>

        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        <div
          ref={bgTextRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate(${parallaxX}px, ${parallaxY}px)`,
          }}
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
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
          <div ref={bodyRef} className="flex flex-col gap-10">
            <div
              className="w-full max-w-[840px] bg-[#F2EFE9]/95 backdrop-blur-xl rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col mx-auto border border-white/[0.06]"
              style={{
                boxShadow: "0 24px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)",
              }}
            >
              <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-14">
                <div>
                  <span className="text-3xl font-bold font-heading text-[#0B1220] tracking-tight">
                    Wenaya
                  </span>
                  <p className="text-[#2B2F36]/80 text-sm mt-4 max-w-sm leading-relaxed">
                    Centre de santé pluridisciplinaire à Casablanca — Kinésithérapie, ostéopathie, psychologie, neuropsychologie, nutrition, orthophonie, naturopathie, psychomotricité et thérapies complémentaires. Soins physiques et santé mentale pour toute la famille.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="w-10 h-10 rounded-full bg-[#0B1220]/5 hover:bg-[#B88A5A] flex items-center justify-center text-[#2B2F36]/60 hover:text-white transition-all duration-300 group"
                      aria-label={s.label}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d={s.path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 flex-1">
                {footerLinks.map((group) => (
                  <div key={group.title}>
                    <h4 className="text-[#0B1220]/50 font-heading font-semibold text-xs mb-6 uppercase tracking-[0.15em]">
                      {group.title}
                    </h4>
                    <ul className="space-y-3">
                      {group.links.map((link) => (
                        <li key={link}>
                          <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className="text-[#2B2F36]/70 hover:text-[#0B1220] transition-all duration-300 text-sm leading-relaxed"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#0B1220]/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[#2B2F36]/50 text-xs">
                  &copy; {new Date().getFullYear()} Wenaya. Tous droits réservés.
                </p>
                <p className="text-[#2B2F36]/40 text-xs">
                  Du lundi au samedi de 9h à 19h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
