/**
 * Mobile Menu — fullscreen slide-in navigation for mobile devices.
 * Shows all nav links vertically with active state indicators.
 * Renders as a fullscreen overlay when toggled open.
 */
"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
  h: (path: string) => string;
  clinicHref: string;
  aboutHref: string;
  authState: "loading" | "authenticated" | "anonymous";
  t: (key: string) => string;
}

export default function MobileMenu({
  open,
  onClose,
  isActive,
  h,
  clinicHref,
  aboutHref,
  authState,
  t,
}: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const menu = menuRef.current;
    if (!open || !menu) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const links = () => Array.from(menu.querySelectorAll<HTMLAnchorElement>('a[href]'));
    links()[0]?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); }
      if (event.key !== 'Tab') return;
      const items = links();
      const first = items[0], last = items.at(-1);
      if (!first || !last) return;
      if (!menu.contains(document.activeElement) || (event.shiftKey && document.activeElement === first)) {
        event.preventDefault(); (event.shiftKey ? last : first).focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (previous?.isConnected && !menu.contains(previous)) previous.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <div
      id="mobile-navigation-menu"
      ref={menuRef}
      role="dialog"
      aria-modal={open ? true : undefined}
      aria-hidden={!open}
      inert={!open}
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
              { label: t("nav.clinique"), href: clinicHref },
              { label: t("nav.aPropos"), href: aboutHref },
              { label: t("nav.produits"), href: h("/produits") },
              { label: t("nav.solutions"), href: h("/corporate") },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={`flex items-center gap-3 py-3.5 text-[clamp(1.6rem,4vw,2.2rem)] font-heading font-bold transition-all duration-200 ${
                    isActive(href) ? "text-white" : "text-white/38 hover:text-white/75"
                  }`}
                >
                  {isActive(href) ? <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A] shrink-0" /> : null}
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pt-8 border-t border-white/[0.06] space-y-3">
          {authState !== "loading" && (
            authState === "authenticated" ? (
              <Link
                href={h("/compte")}
                onClick={onClose}
                className="flex items-center justify-center h-12 rounded-xl border border-white/[0.09] bg-white/[0.04] text-white/65 text-sm font-medium transition-all hover:bg-white/[0.07]"
              >
                {t("nav.monCompte")}
              </Link>
            ) : (
              <Link
                href={h("/login")}
                onClick={onClose}
                className="flex items-center justify-center h-12 rounded-xl border border-white/[0.09] bg-white/[0.04] text-white/65 text-sm font-medium transition-all hover:bg-white/[0.07]"
              >
                {t("nav.seConnecter")}
              </Link>
            )
          )}
          <p className="text-center text-white/18 text-[11.5px] tracking-wide">
            {t("nav.votreSanteNotreEngagement")}
          </p>
        </div>
      </div>
    </div>
  );
}
