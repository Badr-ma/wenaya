"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Solutions", href: "#", hasDropdown: true },
  { label: "Yolo AI", href: "/yolo" },
  { label: "Experts", href: "/experts" },
  { label: "Ressources", href: "/ressources" },
  { label: "À Propos", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const solutions = [
  {
    title: "Particuliers",
    desc: "Accompagnement personnalisé en santé physique, bien-être mental, nutrition et prévention.",
    cta: "Découvrir",
    href: "#",
    icon: (
      <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
        <circle cx="24" cy="16" r="7" stroke="currentColor" strokeWidth="1.2" />
        <path d="M12 40c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Entreprises",
    desc: "Programmes de bien-être, santé mentale et performance pour les équipes.",
    cta: "Découvrir",
    href: "#",
    icon: (
      <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
        <rect x="10" y="18" width="28" height="24" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M18 18V12a2 2 0 012-2h8a2 2 0 012 2v6" stroke="currentColor" strokeWidth="1.2" />
        <path d="M22 28v4M26 28v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Hôtellerie",
    desc: "Expériences wellness et partenariats santé pour hôtels, resorts et résidences premium.",
    cta: "Découvrir",
    href: "#",
    icon: (
      <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
        <path d="M12 38V14l12-8 12 8v24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="18" y="24" width="12" height="14" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <path d="M22 30h4M22 34h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M8 38h32" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (mobileOpen) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const show = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setDropdownOpen(true); };
  const hide = () => { timeoutRef.current = setTimeout(() => setDropdownOpen(false), 120); };
  const closeMobile = () => { setMobileOpen(false); setMobileSolutionsOpen(false); };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 sm:px-6 pt-4">
      <div
        className={`w-full max-w-7xl flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 rounded-2xl transition-all duration-500 ${
          scrolled || dropdownOpen || mobileOpen
            ? "bg-[#0B1220]/85 backdrop-blur-[24px] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            : "bg-[#0B1220]/10 backdrop-blur-[16px] border border-white/[0.06]"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative">
            <svg viewBox="0 0 36 36" className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px]" fill="none">
              <circle cx="18" cy="18" r="15" stroke="#B88A5A" strokeWidth="0.8" opacity="0.25" />
              <circle cx="18" cy="18" r="10" stroke="#B88A5A" strokeWidth="1" opacity="0.45" />
              <circle cx="18" cy="18" r="4" fill="#B88A5A" />
              <circle cx="24" cy="12" r="1.5" fill="#B88A5A" opacity="0.2" className="transition-all duration-500 group-hover:opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </svg>
          </div>
          <span
            className="text-xl sm:text-[23px] font-bold font-heading tracking-[-0.03em]"
            style={{
              background: "linear-gradient(135deg, #B88A5A 0%, #159AA9 50%, #ffffff 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Wenaya
          </span>
        </Link>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <li key={link.label} className="relative">
                  <button
                    ref={triggerRef}
                    onMouseEnter={show}
                    onMouseLeave={hide}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`relative flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive(link.href)
                        ? "text-white bg-white/[0.06]"
                        : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {link.label}
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </li>
              ) : (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`relative px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive(link.href)
                        ? "text-white bg-white/[0.06]"
                        : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="#"
            className="relative hidden sm:inline-flex items-center justify-center h-9 px-5 bg-gradient-to-r from-[#B88A5A] to-[#A07848] text-white text-xs font-semibold rounded-full transition-all duration-300 hover:shadow-[0_4px_20px_rgba(184,138,90,0.35)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="relative z-10">Réserver</span>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden relative flex flex-col items-center justify-center w-9 h-9 rounded-xl hover:bg-white/[0.06] transition-colors"
            aria-label="Menu"
          >
            <span className={`block w-[18px] h-[1.5px] bg-white/70 rounded-full transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[3.25px]" : ""}`} />
            <span className={`block w-[18px] h-[1.5px] bg-white/70 rounded-full mt-[5px] transition-all duration-300 ${mobileOpen ? "opacity-0 scale-0" : ""}`} />
            <span className={`block w-[18px] h-[1.5px] bg-white/70 rounded-full mt-[5px] transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[3.25px]" : ""}`} />
          </button>
        </div>
      </div>

      {mounted && (
        <div
          ref={dropdownRef}
          onMouseEnter={show}
          onMouseLeave={hide}
          className={`hidden lg:block absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[780px] transition-all duration-200 ${
            dropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-[0.96] pointer-events-none"
          }`}
          style={{ transformOrigin: "top center" }}
        >
          <div className="relative bg-[#0B1220]/95 backdrop-blur-[40px] border border-white/[0.06] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-4 h-2 bg-[#0B1220] border-t border-l border-r border-white/[0.06] rounded-t-sm rotate-45" style={{ marginTop: "-5px" }} />
            <div className="p-5">
              <div className="grid grid-cols-3 gap-3">
                {solutions.map((s, i) => (
                  <Link
                    key={i}
                    href={s.href}
                    className="group relative rounded-xl p-5 transition-all duration-300 hover:bg-white/[0.03]"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center mb-4 text-[#B88A5A]/70 group-hover:text-[#B88A5A] group-hover:border-[#B88A5A]/20 group-hover:bg-[#B88A5A]/5 transition-all duration-300">
                      {s.icon}
                    </div>
                    <h3 className="text-white font-heading font-semibold text-sm mb-1.5">{s.title}</h3>
                    <p className="text-white/35 text-xs leading-relaxed mb-4">{s.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-[#B88A5A] text-xs font-medium group-hover:gap-3 transition-all duration-300">
                      {s.cta}
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
            <div className="px-5 py-3 flex items-center justify-between bg-white/[0.01]">
              <span className="text-white/25 text-xs">Solutions adaptées à chaque besoin</span>
              <Link href="#" className="text-white/50 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5">
                Voir toutes nos solutions
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div
        className={`fixed inset-0 top-0 left-0 right-0 bottom-0 bg-[#0B1220] z-40 transition-all duration-500 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full px-6 sm:px-10 pt-28 pb-10 overflow-y-auto">
          <nav className="flex-1">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  onClick={closeMobile}
                  className={`block text-[clamp(1.75rem,4vw,2.5rem)] font-heading font-bold py-2.5 transition-all duration-200 ${
                    isActive("/") ? "text-white" : "text-white/50 hover:text-white"
                  }`}
                >
                  Accueil
                </Link>
              </li>

              <li>
                <button
                  onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                  className="flex items-center justify-between w-full text-[clamp(1.75rem,4vw,2.5rem)] font-heading font-bold text-white/50 hover:text-white py-2.5 transition-colors"
                >
                  Solutions
                  <svg
                    className={`w-4 h-4 text-white/30 transition-transform duration-300 ${mobileSolutionsOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-400 ${
                    mobileSolutionsOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="space-y-2 pb-4 pt-3 pl-2">
                    {solutions.map((s, i) => (
                      <Link
                        key={i}
                        href={s.href}
                        onClick={closeMobile}
                        className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/[0.04]"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.04] flex items-center justify-center shrink-0 text-[#B88A5A]/70">
                          {s.icon}
                        </div>
                        <div className="min-w-0">
                          <span className="text-white font-heading font-semibold text-sm">{s.title}</span>
                          <p className="text-white/35 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              {[
                { label: "Yolo AI", href: "/yolo" },
                { label: "Experts", href: "/experts" },
                { label: "Ressources", href: "/ressources" },
                { label: "À Propos", href: "/about" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact", href: "/contact" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={closeMobile}
                    className={`block text-[clamp(1.75rem,4vw,2.5rem)] font-heading font-bold py-2.5 transition-all duration-200 ${
                      isActive(href) ? "text-white" : "text-white/50 hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="pt-6 border-t border-white/[0.06] space-y-3">
            <Link
              href="#"
              onClick={closeMobile}
              className="flex items-center justify-center h-[52px] px-8 bg-gradient-to-r from-[#B88A5A] to-[#A07848] text-white text-sm font-semibold rounded-full transition-all duration-300 w-full hover:shadow-[0_4px_20px_rgba(184,138,90,0.3)]"
            >
              Réserver
            </Link>
            <p className="text-center text-white/20 text-xs">Votre santé, notre engagement</p>
          </div>
        </div>
      </div>
    </header>
  );
}
