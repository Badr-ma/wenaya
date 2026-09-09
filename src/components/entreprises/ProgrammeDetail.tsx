/**
 * ProgrammeDetail — server component rendering a labelled corporate programme
 * (Leadership 360°, PCM, L'Art des Priorités, People Model Canvas) from the
 * shared `src/lib/corporate-programmes.ts` data source. Content is verbatim
 * from the live Wenaya pages; chrome (back links, section labels) is localised.
 *
 * Layout mirrors the corporate design language: sand/ivory bands, navy type,
 * bronze accent rules and buttons. No images exist on the live programme pages.
 */
import Link from "next/link";
import { h, type HrefLocale } from "@/lib/href";
import { getProgrammesListingHref } from "@/lib/corporate-programmes";
import type { Programme, ProgrammeBlock, ProgrammeBlockCard } from "@/lib/corporate-programmes";

export interface ProgrammeDetailLabels {
  back: string;
  backEnterprise: string;
  practicalLabel: string;
  practicalNote: string;
  othersLabel: string;
  othersCta: string;
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h2
      className="heading-serif text-[#0B1220] font-medium mt-2 mb-8 leading-[1.1]"
      style={{ fontSize: "clamp(1.35rem, 2.2vw, 2rem)" }}
    >
      {children}
    </h2>
  );
}

function BulletBlock({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3.5 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-4">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3.5">
          <svg
            className="w-[18px] h-[18px] shrink-0 mt-0.5 text-[#B88A5A]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-[#0B1220]/80 text-[15px] sm:text-base leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CardBlock({ cards }: { cards: ProgrammeBlockCard[] }) {
  return (
    <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
      {cards.map((card, i) => (
        <div key={card.title} className="border-t border-[#0B1220]/[0.08] pt-5">
          <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.14em] uppercase">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="heading-serif text-[#0B1220] text-lg sm:text-xl font-medium mt-2 leading-snug">
            {card.title.replace(/^\d+\.\s*/, "")}
          </h3>
          <p className="mt-2 text-[#0B1220]/70 text-[14px] sm:text-[15px] leading-relaxed">{card.desc}</p>
        </div>
      ))}
    </div>
  );
}

function ParagraphBlock({ paragraphs }: { paragraphs: NonNullable<ProgrammeBlock["paragraphs"]> }) {
  return (
    <div className="max-w-3xl space-y-5">
      {paragraphs.map((p) => (
        <p key={p} className="text-[#0B1220]/75 text-[15px] sm:text-base leading-relaxed">{p}</p>
      ))}
    </div>
  );
}

function Block({ block }: { block: ProgrammeBlock }) {
  if (block.type === "cards" && block.cards) {
    return (
      <div>
        <SectionHeading>{block.title}</SectionHeading>
        <CardBlock cards={block.cards} />
      </div>
    );
  }
  if (block.type === "paragraphs" && block.paragraphs) {
    return (
      <div>
        <SectionHeading>{block.title}</SectionHeading>
        <ParagraphBlock paragraphs={block.paragraphs} />
      </div>
    );
  }
  return (
    <div>
      <SectionHeading>{block.title}</SectionHeading>
      <BulletBlock items={block.items ?? []} />
    </div>
  );
}

export default function ProgrammeDetail({
  programme,
  locale,
  labels,
}: {
  programme: Programme;
  locale: HrefLocale;
  labels: ProgrammeDetailLabels;
}) {
  const exchangeCta = programme.ctas.find((c) => c.external) ?? programme.ctas[0];
  const quoteCta = programme.ctas.find((c) => !c.external);

  return (
    <div className="bg-[#FAF8F4]">
      <div className="bg-[#F2EFE9]">
        <div className="max-w-6xl mx-auto px-6 pt-20 sm:pt-24 pb-14 sm:pb-16 lg:pt-28 lg:pb-20">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#0B1220]/45 mb-10">
            <Link href={h(locale, "/corporate")} className="hover:text-[#B88A5A] transition-colors inline-flex items-center gap-2">
              {labels.backEnterprise}
            </Link>
            <span className="w-1 h-1 rounded-full bg-[#B88A5A]" aria-hidden />
            <Link href={getProgrammesListingHref(locale)} className="hover:text-[#B88A5A] transition-colors inline-flex items-center gap-2">
              {labels.back}
            </Link>
          </div>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              <span className="w-8 h-px bg-[#B88A5A]/50" />
              {programme.badge}
            </span>
            <h1
              className="heading-serif text-[#0B1220] font-medium leading-[1.06]"
              style={{ fontSize: "clamp(2.2rem, 4.4vw, 4rem)" }}
            >
              {programme.name}
            </h1>
            <p className="mt-5 font-serif text-[#B88A5A] text-xl sm:text-2xl leading-snug max-w-xl">
              {programme.pitch}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16 lg:py-20">
        <div className="max-w-3xl space-y-5">
          {programme.intro.map((p) => (
            <p key={p} className="text-[#0B1220]/75 text-[15px] sm:text-base lg:text-lg leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-14 lg:mt-20 grid gap-14 lg:divide-y lg:divide-[#0B1220]/[0.08]">
          {programme.blocks.map((block) => (
            <div key={block.title} className="lg:pt-14">
              <Block block={block} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0B1220]">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                <span className="w-8 h-px bg-[#B88A5A]/60" />
                {labels.practicalLabel}
              </span>
              <div className="grid gap-6 sm:grid-cols-2">
                {programme.practical.map((row) => (
                  <div key={row.label} className="border-t border-white/10 pt-4">
                    <div className="text-[#B88A5A] text-[10px] font-semibold tracking-[0.18em] uppercase">
                      {row.label}
                    </div>
                    <div className="mt-1.5 text-white text-[15px] sm:text-base leading-snug">
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-sm">
              <p className="text-white/55 text-sm italic leading-relaxed">{programme.note}</p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href={exchangeCta.href}
                  target={exchangeCta.external ? "_blank" : undefined}
                  rel={exchangeCta.external ? "noopener noreferrer" : undefined}
                  aria-label={exchangeCta.external ? `${exchangeCta.label} (nouvel onglet)` : exchangeCta.label}
                  className="inline-flex items-center justify-center h-13 px-8 rounded-full bg-gradient-to-r from-[#B88A5A] to-[#9A7242] text-white text-sm font-semibold tracking-wide hover:opacity-95 transition-opacity whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
                >
                  {exchangeCta.label}
                </Link>
                {quoteCta && (
                  <Link
                    href={h(locale, quoteCta.href)}
                    className="inline-flex items-center justify-center h-13 px-7 rounded-full border border-white/25 text-white text-sm font-semibold tracking-wide hover:border-[#B88A5A] hover:text-[#B88A5A] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
                  >
                    {quoteCta.label}
                  </Link>
                )}
              </div>
              <p className="mt-4 text-white/40 text-xs">{labels.practicalNote}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#F2EFE9]">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-[#0B1220]/45">{labels.othersLabel}</div>
          <Link
            href={getProgrammesListingHref(locale)}
            className="inline-flex items-center gap-2 text-[#0B1220] text-sm font-semibold hover:text-[#B88A5A] transition-colors decoration-[#B88A5A]/40 underline-offset-4 underline"
          >
            {labels.othersCta}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}