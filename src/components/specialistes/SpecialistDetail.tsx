"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Specialist } from "@/lib/specialistes";
import type { Pratique } from "@/lib/pratiques";
import BookingPanel from "./BookingPanel";
import SpecialistPractices from "./SpecialistPractices";
import MapView from "./MapView";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";
import { normalizeLegacyPrice } from "@/lib/format";

gsap.registerPlugin(ScrollTrigger);

const DISPLAY_FONT = "var(--font-manrope), 'Manrope', ui-sans-serif, sans-serif";

// Wenaya primary CTA treatment (bronze gradient, subtle lift on hover,
// accessible focus ring, ≥44px tap target). Shared by the hero CTA and the
// mobile sticky bar.
const BOOKING_CTA_STYLE: React.CSSProperties = {
  background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
  boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 4px 16px rgba(184,138,90,0.22)",
};

const BOOKING_CTA_BASE =
  "inline-flex items-center justify-center gap-2 rounded-full text-[13px] font-medium text-white py-3 min-h-[44px] transition-all duration-300 hover:-translate-y-px hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]/70";

function BookArrow() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12L12 4M12 4H6M12 4v6" /></svg>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((d) => (
        <svg key={d} className="w-3.5 h-3.5" viewBox="0 0 10 10">
          <circle cx="5" cy="5" r="4" fill={rating >= d ? "#FEBB58" : "#D4C9B8"} />
        </svg>
      ))}
    </span>
  );
}

export default function SpecialistDetail({ specialist, practices = [] }: { specialist: Specialist; practices?: Pratique[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { t, tRaw, locale } = useLocale();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [showMobileBar, setShowMobileBar] = useState(false);

  // The booking CTA opens the existing in-page BookingPanel for every
  // professional profile (legacy and API-sourced alike). Profiles without
  // availability/services simply land on the panel's existing empty state.
  const bookingLabel = t("specialistes.detail.mobileBook");

  const { lat, lng } = specialist.location;
  const hasCoordinates = Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0;
  const tags = [...new Set(specialist.specialtyTags)];

  // Sections render only when the profile actually carries content — API
  // profiles can be incomplete (empty bio, no address) and must hide cleanly.
  const hasBio = Boolean(
    specialist.bioHtml ||
      (specialist.bioParagraphs && specialist.bioParagraphs.length > 0) ||
      specialist.bio ||
      specialist.approach
  );
  const hasLocation = Boolean(
    hasCoordinates ||
      specialist.location.address ||
      specialist.location.city ||
      specialist.location.parking ||
      specialist.location.access ||
      specialist.hours ||
      specialist.clinicPhotos.length > 0
  );

  useEffect(() => {
    const onScroll = () => setShowMobileBar(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".sp-reveal").forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const locationLabel = (
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B88A5A] mb-5" style={{ fontFamily: DISPLAY_FONT }}>
      {t("specialistes.detail.location")}
    </p>
  );

  return (
    <div ref={ref} className="bg-[#F2EFE9] min-h-screen pb-20 lg:pb-0">

      {/* ── PROFILE HERO ── */}
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <Link href={h(locale, "/professional")} className="inline-flex items-center text-[11px] font-mono text-[#2B2F36]/55 hover:text-[#2B2F36]/65 transition-colors mb-8">
            <span className="mr-2">←</span> {t("specialistes.detail.backLink")}
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

            {/* ── Large practitioner photo ── */}
            <div className="lg:col-span-5 sp-reveal">
              <div className="relative">
                <div aria-hidden="true" className="absolute -inset-3 sm:-inset-4 rounded-[34px] border border-[#B88A5A]/30" />
                <div aria-hidden="true" className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-14 h-14 sm:w-20 sm:h-20 rounded-xl border border-[#159AA9]/30 bg-[#159AA9]/[0.06] rotate-6" />
                <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden bg-[#E8E2D9]">
                  <Image
                    src={specialist.image}
                    alt={specialist.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 92vw, 42vw"
                    priority
                  />
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0B1220]/30 to-transparent" />
                </div>
              </div>
            </div>

            {/* ── Identity / info ── */}
            <div className="lg:col-span-7 lg:pt-6 sp-reveal">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1
                  className="font-bold text-[#0B1220] text-[clamp(2rem,4.2vw,3.25rem)] leading-[1.05] tracking-[-0.01em]"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  {specialist.name}
                </h1>
                <span className="inline-flex items-center gap-1.5 bg-white border border-[#0B1220]/[0.08] text-[#0B1220]/70 text-[11px] font-medium px-2.5 py-1 rounded-full">
                  <span className="w-4 h-4 rounded-full bg-[#B88A5A]/15 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-[#B88A5A]" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.5 5.3a.75.75 0 00-1.06-1.06L6.75 7.94 5.56 6.75a.75.75 0 00-1.06 1.06l1.75 1.75a.75.75 0 001.06 0l3.25-3.25z" /></svg>
                  </span>
                  {t("specialistes.detail.verified")}
                </span>
              </div>

              {specialist.role && (
                <p className="text-[#B88A5A] font-semibold text-base sm:text-lg tracking-[0.02em] mb-4" style={{ fontFamily: DISPLAY_FONT }}>
                  {specialist.role}
                </p>
              )}

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 bg-white border border-[#B88A5A]/25 rounded-full pl-3 pr-3.5 py-1.5 text-[13px] font-medium text-[#0B1220]/80">
                      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#159AA9]" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {specialist.rating > 0 && (
                <div className="flex items-center gap-2.5 mb-4">
                  <Stars rating={specialist.rating} />
                  <span className="text-sm text-[#0B1220] font-semibold">{specialist.rating}</span>
                  <span className="text-[12px] text-[#2B2F36]/60">{tRaw<(n: number) => string>("specialistes.detail.reviews")(specialist.reviewCount)}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#2B2F36]/55 mb-4">
                {specialist.yearsExperience > 0 && (
                  <>
                    <span>{tRaw<(n: number) => string>("specialistes.detail.yearsExp")(specialist.yearsExperience)}</span>
                    <span className="w-1 h-1 rounded-full bg-[#2B2F36]/15" />
                  </>
                )}
                {specialist.languages.length > 0 && (
                  <>
                    <span>{specialist.languages.join(", ")}</span>
                    <span className="w-1 h-1 rounded-full bg-[#2B2F36]/15" />
                  </>
                )}
                {specialist.orderNumber && (
                  <span>N° {specialist.orderNumber}</span>
                )}
              </div>

              {(specialist.location.address || specialist.location.city) && (
                <div className="inline-flex items-start gap-2.5 text-sm text-[#2B2F36]/70 mb-7">
                  <svg className="w-4 h-4 mt-0.5 text-[#B88A5A]/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
                  <span className="max-w-md leading-relaxed">
                    {specialist.location.address}
                    {specialist.location.address && specialist.location.city && ", "}
                    {specialist.location.city}
                  </span>
                </div>
              )}

              {/* Booking CTA — present on every profile; opens the existing
                  in-page BookingPanel booking flow. */}
              <div className="w-full lg:w-auto">
                <button
                  type="button"
                  onClick={() => setBookingOpen(true)}
                  aria-haspopup="dialog"
                  className={`${BOOKING_CTA_BASE} w-full lg:w-auto px-7`}
                  style={BOOKING_CTA_STYLE}
                >
                  {bookingLabel}
                  <BookArrow />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      {hasBio && (
        <section className="py-12 sm:py-16 border-t border-[#0B1220]/[0.06]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            <div className="sp-reveal max-w-[820px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B88A5A] mb-6" style={{ fontFamily: DISPLAY_FONT }}>
                {t("specialistes.detail.about")}
              </p>
              {specialist.bioHtml
                ? <div className="bio-content" dangerouslySetInnerHTML={{ __html: specialist.bioHtml }} />
                : specialist.bioParagraphs && specialist.bioParagraphs.length > 0
                  ? specialist.bioParagraphs.map((para, i) => (
                      <p key={i} className="text-[#2B2F36]/80 leading-[1.9] text-[clamp(0.95rem,1.2vw,1.05rem)] mb-6">{para}</p>
                    ))
                  : specialist.bio && (
                      <p className="text-[#2B2F36]/80 leading-[1.9] text-[clamp(0.95rem,1.2vw,1.05rem)] mb-6">{specialist.bio}</p>
                    )}
              {specialist.approach && (
                <p className="text-[#2B2F36]/55 leading-[1.9] italic mt-4 border-l-2 border-[#B88A5A]/30 pl-5">&ldquo;{specialist.approach}&rdquo;</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── APPOINTMENT INFORMATION ── */}
      {(specialist.appointmentInfoHtml || (specialist.appointmentInfo && specialist.appointmentInfo.length > 0)) && (
        <section className="py-12 sm:py-16 border-t border-[#0B1220]/[0.06]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            <div className="sp-reveal">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B88A5A] mb-5" style={{ fontFamily: DISPLAY_FONT }}>
                {t("specialistes.detail.appointmentInfo")}
              </p>
              <div className="bg-[#FAF8F4] border border-[#0B1220]/[0.06] rounded-[20px] px-6 py-7 sm:px-9 sm:py-8">
                <div className="max-w-[720px] bio-content">
                  {specialist.appointmentInfoHtml
                    ? <div dangerouslySetInnerHTML={{ __html: specialist.appointmentInfoHtml }} />
                    : <div className="space-y-4">
                        {specialist.appointmentInfo?.map((para, i) => (
                          <p key={i} className="text-[#2B2F36]/80 leading-[1.85] text-[15px] sm:text-base">{para}</p>
                        ))}
                      </div>}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SERVICES & PRICING (API-sourced only) ── */}
      {specialist.isApiSourced && specialist.services.length > 0 && (
        <section className="py-12 sm:py-16 border-t border-[#0B1220]/[0.06]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            <div className="sp-reveal">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B88A5A] mb-5" style={{ fontFamily: DISPLAY_FONT }}>
                {t("specialistes.detail.servicesTitle")}
              </p>
              <div className="bg-[#FAF8F4] border border-[#0B1220]/[0.06] rounded-[20px] px-6 py-7 sm:px-9 sm:py-8 max-w-[820px]">
                <ul className="divide-y divide-[#0B1220]/[0.06]">
                  {specialist.services.map((svc) => (
                    <li key={svc.id} className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0">
                      <div className="flex items-baseline gap-2.5 min-w-0">
                        <span className="text-[15px] text-[#0B1220] font-medium leading-snug">{svc.title}</span>
                        {svc.duration && (
                          <span className="text-[12px] text-[#2B2F36]/50 whitespace-nowrap">{svc.duration}</span>
                        )}
                        {svc.type === "ligne" && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#159AA9]/10 text-[#159AA9] font-semibold uppercase tracking-wide">
                            {t("specialistes.list.ligne")}
                          </span>
                        )}
                      </div>
                      {svc.price && (
                        <span className="text-[#B88A5A] font-semibold text-[15px] whitespace-nowrap">{normalizeLegacyPrice(svc.price)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PACKAGES (API-sourced only) ── */}
      {specialist.isApiSourced && specialist.packages && specialist.packages.length > 0 && (
        <section className="py-12 sm:py-16 border-t border-[#0B1220]/[0.06]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            <div className="sp-reveal">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B88A5A] mb-5" style={{ fontFamily: DISPLAY_FONT }}>
                {t("specialistes.detail.packsTitle")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[820px]">
                {specialist.packages.map((pack) => (
                  <div key={pack.id} className="bg-[#FAF8F4] border border-[#0B1220]/[0.06] rounded-[20px] px-6 py-6 flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-[15px] font-semibold text-[#0B1220] leading-snug" style={{ fontFamily: DISPLAY_FONT }}>
                        {pack.name}
                      </h3>
                      {pack.price && (
                        <span className="text-[#B88A5A] font-semibold text-[15px] whitespace-nowrap">{normalizeLegacyPrice(pack.price)}</span>
                      )}
                    </div>
                    {pack.description && (
                      <p className="text-[13px] leading-[1.6] text-[#2B2F36]/60">{pack.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── LOCATION ── */}
      {hasLocation && (
      <section className={`py-12 sm:py-16 border-t border-[#0B1220]/[0.06]${hasCoordinates ? "" : " pb-16 sm:pb-20"}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className={hasCoordinates ? "lg:col-span-5" : "lg:col-span-7"}>
              <div className="sp-reveal">
                {locationLabel}
                {specialist.location.address && (
                  <p className="text-[#0B1220] font-medium text-sm mb-1">{specialist.location.address}</p>
                )}
                {specialist.location.city && (
                  <p className="text-[12px] text-[#2B2F36]/65 mb-4">{specialist.location.city}</p>
                )}
                <div className="space-y-2 text-[13px] text-[#2B2F36]/60">
                  {specialist.location.parking && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#B88A5A]/50 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></svg>
                      {specialist.location.parking}
                    </div>
                  )}
                  {specialist.hours && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#B88A5A]/50 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" /><path d="M12 6v6l4 2" /></svg>
                      {specialist.hours}
                    </div>
                  )}
                  {specialist.location.access && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#B88A5A]/50 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
                      {specialist.location.access}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {hasCoordinates && (
              <div className="lg:col-span-7 sp-reveal">
                <div className="relative h-[320px] rounded-[20px] overflow-hidden">
                  <MapView
                    specialists={[{
                      slug: specialist.slug,
                      name: specialist.name,
                      role: specialist.role,
                      specialty: tags[0] ?? specialist.role ?? "",
                      image: specialist.image,
                      location: { lat, lng, city: specialist.location.city, address: specialist.location.address },
                    }]}
                    activeSpecialistSlug={specialist.slug}
                    onPinClick={() => {}}
                  />
                </div>
              </div>
            )}
          </div>
          {specialist.clinicPhotos.length > 0 && (
            <div className="sp-reveal mt-10 flex gap-3 overflow-x-auto pb-2">
              {specialist.clinicPhotos.map((photo, i) => (
                <div key={i} className="shrink-0 w-64 h-44 relative rounded-lg overflow-hidden bg-[#E8E2D9]">
                  <Image src={photo} alt={`Cabinet ${i + 1}`} fill className="object-cover" sizes="256px" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      )}

      {/* ── PRACTICES OFFERED (reverse relation) ── */}
      {practices.length > 0 && (
        <section className="py-12 sm:py-16 border-t border-[#0B1220]/[0.06]">
          <SpecialistPractices practices={practices} />
        </section>
      )}

      {/* ── MOBILE STICKY BAR ── */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#0B1220]/[0.06] px-6 py-3 transition-all duration-300 ${showMobileBar ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-heading font-semibold text-sm text-[#0B1220]">{specialist.name}</p>
            <div className="flex items-center gap-1.5">
              <Stars rating={specialist.rating} />
              <span className="text-[11px] text-[#2B2F36]/65">{tRaw<(n: number) => string>("specialistes.detail.reviews")(specialist.reviewCount)}</span>
            </div>
          </div>
          <button onClick={() => setBookingOpen(true)} className={`${BOOKING_CTA_BASE} shrink-0 px-5`} style={BOOKING_CTA_STYLE}>
            {bookingLabel}
          </button>
        </div>
      </div>

      {/* ── BOOKING PANEL ── */}
      <BookingPanel
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        specialist={specialist}
        initialDayIso={null}
        initialSlot={null}
        initialService={null}
      />
    </div>
  );
}