/**
 * Group Session Detail — renders the core content for /seance-de-groupe/[slug] and
 * /en/group-sessions/[slug]. Server component; all copy arrives pre-resolved from the
 * pages via the group-sessions adapter (no client i18n).
 *
 * Structure: back link, hero (image + type + title + description + CTA), factual info
 * cards (only when the data is supported), booking area and related sessions.
 */
import Image from "next/image";
import Link from "next/link";
import type { GroupSession, GroupSessionDetailLabels } from "@/lib/group-sessions";

interface GroupSessionDetailProps {
  session: GroupSession;
  related: GroupSession[];
  labels: GroupSessionDetailLabels;
  listingHref: string;
}

export default function GroupSessionDetail({
  session,
  related,
  labels,
  listingHref,
}: GroupSessionDetailProps): React.JSX.Element {
  return (
    <section className="bg-[#F2EFE9] min-h-screen pt-8 sm:pt-10 pb-20 sm:pb-28 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Back link */}
        <Link
          href={listingHref}
          className="inline-flex items-center text-xs text-[#2B2F36]/30 hover:text-[#2B2F36]/60 transition-colors mb-8 sm:mb-12"
        >
          <span className="mr-1.5">←</span>
          {labels.back}
        </Link>

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#0B1220]/[0.06]">
            <Image
              src={session.image}
              alt={session.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-5">
            <span
              className="inline-flex items-center gap-2 self-start text-[11px] font-semibold tracking-[0.18em] uppercase rounded-full px-3.5 py-1.5"
              style={{
                color: session.accent,
                background: `${session.accent}14`,
                border: `1px solid ${session.accent}30`,
              }}
            >
              <span className="w-1 h-1 rounded-full" style={{ background: session.accent }} />
              {session.typeLabel}
            </span>

            <h1 className="heading-serif text-[clamp(1.9rem,4vw,3.2rem)] text-[#0B1220] leading-[1.1] tracking-[-0.01em]">
              {session.title}
            </h1>

            <div className="border-l-2 border-[#377B89]/40 pl-5 py-1">
              <p className="text-[#2B2F36]/60 text-base sm:text-lg leading-relaxed">{session.description}</p>
            </div>

            <div className="pt-4">
              <Link
                href={session.bookingHref}
                className="inline-flex items-center gap-3 h-11 px-7 rounded-xl text-[13px] font-semibold text-white transition-all duration-300 hover:-translate-y-px active:translate-y-0"
                style={{
                  background: `linear-gradient(135deg, ${session.accent} 0%, #9A7242 100%)`,
                  boxShadow: `0 1px 0 rgba(255,255,255,0.16) inset, 0 6px 24px ${session.accent}40`,
                }}
              >
                {labels.bookCta}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Factual information cards */}
        <div className="mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard title={labels.whatTitle} accent={session.accent}>
            <p>{session.description}</p>
          </InfoCard>

          {session.audience && (
            <InfoCard title={labels.audienceTitle} accent={session.accent}>
              <p>{session.audience}</p>
            </InfoCard>
          )}

          {session.format && (
            <InfoCard title={labels.formatTitle} accent={session.accent}>
              <h3 className="text-[#0B1220] font-heading font-semibold text-[15px] mb-1">{session.format.title}</h3>
              <p>{session.format.desc}</p>
            </InfoCard>
          )}

          <InfoCard title={labels.locationTitle} accent={session.accent}>
            <h3 className="text-[#0B1220] font-heading font-semibold text-[15px] mb-1">{session.location.title}</h3>
            <p>{session.location.desc}</p>
          </InfoCard>
        </div>

        {/* Booking area */}
        <div className="mt-14 sm:mt-20 rounded-2xl border border-[#0B1220]/[0.06] bg-white/60 px-6 py-10 sm:py-14 text-center">
          <h2 className="heading-serif text-[clamp(1.5rem,3vw,2.2rem)] text-[#0B1220]">{session.title}</h2>
          {labels.bookingNote && <p className="text-[#2B2F36]/55 text-sm sm:text-[15px] max-w-xl mx-auto mt-3 leading-relaxed">{labels.bookingNote}</p>}
          <div className="mt-7">
            <Link
              href={session.bookingHref}
              className="inline-flex items-center gap-3 h-12 px-8 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-px active:translate-y-0"
              style={{
                background: `linear-gradient(135deg, ${session.accent} 0%, #9A7242 100%)`,
                boxShadow: `0 1px 0 rgba(255,255,255,0.16) inset, 0 6px 24px ${session.accent}40`,
              }}
            >
              {labels.bookCta}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Related sessions */}
        {related.length > 0 && (
          <div className="mt-14 sm:mt-20">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2.5 mb-2">
                <div className="w-1 h-1 rounded-full bg-[#B88A5A]" />
                <span className="text-[#B88A5A]/60 text-[10px] font-semibold tracking-[0.24em] uppercase">{session.typeLabel}</span>
              </span>
              <h2 className="heading-serif text-[clamp(1.5rem,3vw,2.2rem)] text-[#0B1220]">{labels.relatedTitle}</h2>
              {labels.relatedSub && <p className="text-[#2B2F36]/55 text-sm mt-2">{labels.relatedSub}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => (
                <Link
                  key={r.id}
                  href={r.path}
                  className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: "#0B1220", border: "1px solid rgba(11,18,32,0.08)" }}
                >
                  <div className="relative w-full aspect-[16/10] overflow-hidden">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition-all duration-700 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/80 via-[#0B1220]/10 to-transparent" />
                    <div
                      className="absolute left-3 top-3 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: `${r.accent}18`, border: `1px solid ${r.accent}30` }}
                    >
                      <span className="font-heading font-bold text-[10px] tabular-nums" style={{ color: r.accent }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 px-5 py-4">
                    <h3 className="font-heading font-semibold text-white text-[15px] leading-snug">{r.title}</h3>
                    <p className="text-white/60 text-[12.5px] leading-relaxed mt-1.5">{r.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function InfoCard({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#0B1220]/[0.06] bg-white/60 p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${accent}14`, border: `1px solid ${accent}25` }}>
          <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
        </div>
        <h2 className="font-heading font-semibold text-[15px] text-[#0B1220] tracking-wide">{title}</h2>
      </div>
      <div className="text-[#2B2F36]/60 text-sm leading-relaxed">{children}</div>
    </div>
  );
}