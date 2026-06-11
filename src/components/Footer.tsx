"use client";

import { useRef, useEffect } from "react";
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
    links: ["0666-124035", "88 Rue De Jabal Azourki", "Casablanca 20930"],
  },
];

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bodyRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={sectionRef} className="bg-[#0B1220]">
      <div className="max-w-7xl mx-auto px-6 py-20 sm:py-24">
        <div ref={bodyRef} className="flex flex-col gap-10">
          <div
            className="w-full max-w-[800px] min-h-[400px] sm:min-h-[620px] bg-[#F2EFE9] rounded-2xl p-6 sm:p-10 lg:p-14 flex flex-col shadow-xl mx-auto"
            style={{ boxShadow: "12px 32px 80px rgba(11,18,32,0.12)" }}
          >
            <div className="flex items-start justify-between mb-12">
              <div>
                <span className="text-2xl font-bold font-heading text-[#0B1220] tracking-tight">
                  Wenaya
                </span>
                <p className="text-[#6B6B6B] text-sm mt-3 max-w-xs leading-relaxed">
                  Centre de santé pluridisciplinaire à Casablanca — Kinésithérapie, ostéopathie, psychologie, neuropsychologie, nutrition, orthophonie, naturopathie, psychomotricité et thérapies complémentaires. Soins physiques et santé mentale pour toute la famille.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <a href="#" rel="noopener noreferrer" target="_blank" className="text-[#6B6B6B]/50 hover:text-[#B88A5A] transition-colors duration-300" aria-label="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="#" rel="noopener noreferrer" target="_blank" className="text-[#6B6B6B]/50 hover:text-[#B88A5A] transition-colors duration-300" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" rel="noopener noreferrer" target="_blank" className="text-[#6B6B6B]/50 hover:text-[#B88A5A] transition-colors duration-300" aria-label="X">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" rel="noopener noreferrer" target="_blank" className="text-[#6B6B6B]/50 hover:text-[#B88A5A] transition-colors duration-300" aria-label="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 flex-1">
              {footerLinks.map((group) => (
                <div key={group.title}>
                  <h4 className="text-[#0B1220]/60 font-heading font-bold text-sm mb-5 uppercase tracking-wider">
                    {group.title}
                  </h4>
                  <ul className="space-y-3">
                    {group.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-[#6B6B6B] hover:text-[#B88A5A] transition-colors duration-300 text-sm"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-[#B88A5A]/10 mt-auto pt-6 flex items-center justify-between">
              <p className="text-[#6B6B6B]/50 text-xs">
                &copy; {new Date().getFullYear()} Wenaya. Tous droits réservés.
              </p>
              <p className="text-[#6B6B6B]/40 text-xs">
                Du lundi au samedi de 8h à 20h
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
