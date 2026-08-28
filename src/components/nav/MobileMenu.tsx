/**
 * Mobile Menu — fullscreen slide-in navigation for mobile devices.
 * Shows all nav links vertically with active state indicators.
 * Renders as a fullscreen overlay when toggled open.
 */
"use client";

import Link from "next/link";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
  h: (path: string) => string;
  t: (key: string) => string;
}

export default function MobileMenu({
  open,
  onClose,
  isActive,
  h,
  t,
}: MobileMenuProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("nav.menuNav")}
      className={`fixed inset-0 bg-[#080E1C] z-40 transition-all duration-400 lg:hidden ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative flex flex-col h-full px-6 sm:px-10 pt-[88px] pb-10 overflow-y-auto">
        <nav className="flex-1" aria-label={t("nav.navMobile")}>
          <ul className="space-y-0.5">
            <li>
              <Link
                href={h("/")}
                onClick={onClose}
                className={`flex items-center gap-3 py-3.5 text-[clamp(1.6rem,4vw,2.2rem)] font-heading font-bold transition-all duration-200 ${
                  isActive(h("/")) ? "text-white" : "text-white/38 hover:text-white/75"
                }`}
              >
                {isActive(h("/")) && <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A] shrink-0" />}
                {t("nav.accueil")}
              </Link>
            </li>

            {[
              { label: t("nav.aPropos"), href: h("/about") },
              { label: t("nav.produits"), href: h("/produits") },
              { label: t("nav.solutions"), href: h("/solutions/entreprises") },
              { label: t("nav.specialistes"), href: h("/specialistes") },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={`flex items-center gap-3 py-3.5 text-[clamp(1.6rem,4vw,2.2rem)] font-heading font-bold transition-all duration-200 ${
                    isActive(href) ? "text-white" : "text-white/38 hover:text-white/75"
                  }`}
                >
                  {isActive(href) && <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A] shrink-0" />}
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pt-8 border-t border-white/[0.06] space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={h("/login")}
              onClick={onClose}
              className="flex items-center justify-center h-12 rounded-xl border border-white/[0.09] bg-white/[0.04] text-white/65 text-sm font-medium transition-all hover:bg-white/[0.07]"
            >
              {t("nav.seConnecter")}
            </Link>
            <Link
              href="#"
              onClick={(e) => { e.preventDefault(); onClose(); }}
              className="flex items-center justify-center h-12 rounded-xl text-[#0B1220] text-sm font-semibold transition-all duration-300"
              style={{
                background: "#B88A5A",
              }}
            >
              {t("nav.reserver")}
            </Link>
          </div>
          <p className="text-center text-white/18 text-[11.5px] tracking-wide">
            {t("nav.votreSanteNotreEngagement")}
          </p>
        </div>
      </div>
    </div>
  );
}
