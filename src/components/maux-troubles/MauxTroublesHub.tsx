/**
 * Maux-Troubles hub — server component for the `/maux-troubles` +
 * `/en/health-needs` catalogue pages.
 *
 * Premium responsive card grid (1 / 2 / 3 columns). Each card is a whole-card
 * accessible `<Link>` to its OWN dynamic detail route
 * (`/maux-troubles/{slug}` / `/en/health-needs/{slug}`) — crawlable real hrefs,
 * secrets/practice/pros routes. No direct routing to practices from hub cards;
 * no accordion/expand state; no practice or pros rows here — that exploration
 * lives on the detail page (`TroubleDetail`).
 *
 * Chrome i18n lives in this component (`getTranslations(locale)`); the item
 * names/paragraphs are backend FR content served as-is on both locales.
 *
 * Card anatomy (Wenaya premium-card language, cf. QuickAccessSection):
 *   API image (or a navy placeholder) → bronze rule → title → 2-line
 *   description → pinned "Découvrir"/"Discover" CTA. Equal heights via the
 *   grid stretch + `flex flex-col` + `mt-auto`.
 */
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "@/i18n";
import { troubleDetailHref } from "@/lib/href";
import type { Trouble } from "@/lib/troubles";
import type { TroublesHubStatus } from "@/lib/troubles-hub";

interface Props {
  items: Trouble[];
  status: TroublesHubStatus;
  locale: "fr" | "en";
}

export default function MauxTroublesHub({ items, status, locale }: Props): React.JSX.Element {
  const { t } = getTranslations(locale);
  const cardSizes = "(max-width:639px) 92vw, (max-width:1023px) 48vw, 32vw";

  return (
    <section data-section-bg="light" className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        {/* ── Header ── */}
        <header className="max-w-3xl">
          <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
            {t("mauxTroubles.badge")}
          </span>
          <h1 className="heading-serif text-[#0B1220] leading-[1.05]" style={{ fontSize: "clamp(2rem, 3.8vw, 3.4rem)" }}>
            {t("mauxTroubles.heading1")}
            <br />
            {t("mauxTroubles.heading2")}
          </h1>
          <p className="mt-6 text-[#0B1220]/55 text-base lg:text-lg leading-relaxed max-w-[680px]">
            {t("mauxTroubles.sub")}
          </p>
          <p className="mt-3 text-[13px] text-[#0B1220]/40">{t("mauxTroubles.disclaimer")}</p>
        </header>

        {/* ── State: error / empty ── */}
        {status === "error" || status === "empty" ? (
          <div
            role={status === "error" ? "alert" : "status"}
            className="mt-12 rounded-xl border border-[#0B1220]/[0.08] bg-white/70 px-6 py-8 max-w-2xl"
          >
            <p className="text-[#0B1220]/70 text-base lg:text-lg leading-relaxed">
              {status === "error" ? t("mauxTroubles.error") : t("mauxTroubles.empty")}
            </p>
          </div>
        ) : (
          /* ── Catalogue: responsive card grid (1 / 2 / 3) ── */
          <ul className="mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-5 md:gap-6">
            {items.map((item) => (
              <li key={item.id} className="h-full">
                <Link
                  href={troubleDetailHref(locale, item.slug)}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(184,138,90,0.16)] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(184,138,90,0.35)] hover:shadow-[0_18px_40px_rgba(11,18,32,0.10)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B88A5A]/70"
                >
                  {/* ── Image (or placeholder) ── */}
                  <span className="relative block aspect-[16/10] overflow-hidden bg-[#0B1220]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes={cardSizes}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0B1220] to-[#26304d]"
                      >
                        <svg className="w-8 h-8 text-[#B88A5A]/70" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L22 12L12 22L2 12L12 2Z" />
                        </svg>
                      </span>
                    )}
                  </span>

                  {/* ── Body ── */}
                  <span className="flex flex-1 flex-col p-5 sm:p-6">
                    <span aria-hidden="true" className="block w-8 h-[2px] bg-[#B88A5A] mb-4" />
                    <h2
                      className="heading-serif text-[#0B1220] leading-snug transition-colors group-hover:text-[#B88A5A]"
                      style={{ fontSize: "clamp(1.2rem, 1.7vw, 1.5rem)" }}
                    >
                      {item.name}
                    </h2>
                    <span className="mt-2 text-[#0B1220]/55 text-[13.5px] leading-relaxed line-clamp-2">
                      {item.description}
                    </span>
                    <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#B88A5A] group-hover:text-[#9A7242] transition-colors">
                      {t("mauxTroubles.discoverLabel")}
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}