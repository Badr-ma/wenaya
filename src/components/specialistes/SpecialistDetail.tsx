"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Specialist } from "@/lib/specialistes";
import BookingPanel from "./BookingPanel";
import MapView from "./MapView";
import { useLocale } from "@/contexts/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

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

export default function SpecialistDetail({ specialist }: { specialist: Specialist }) {
  const ref = useRef<HTMLDivElement>(null);
  const { t, tRaw } = useLocale();
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [reviewSort, setReviewSort] = useState<"recent" | "top">("recent");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [showMobileBar, setShowMobileBar] = useState(false);

  const sortedReviews = [...specialist.reviews].sort((a, b) =>
    reviewSort === "top" ? b.rating - a.rating : 0
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

  return (
    <div ref={ref} className="bg-[#F2EFE9] min-h-screen pb-20 lg:pb-0">

      {/* ── HEADER ── */}
      <section className="pt-28 sm:pt-36 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <Link href="/specialistes" className="inline-flex items-center text-[11px] font-mono text-[#2B2F36]/55 hover:text-[#2B2F36]/65 transition-colors mb-8">
            <span className="mr-2">←</span> {t("specialistes.detail.backLink")}
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 flex flex-col sm:flex-row gap-5 sm:gap-6 items-center sm:items-start text-center sm:text-left">
              <div className="shrink-0 flex justify-center sm:justify-start">
                <div className="relative w-28 h-28 sm:w-48 sm:h-48">
                  <div className="absolute inset-0 rounded-full border-2 border-[#B88A5A]/20" />
                  <div className="absolute inset-[-4px] sm:inset-[-6px] rounded-full border border-[#0B1220]/[0.06]" />
                  <div className="absolute inset-[-8px] sm:inset-[-12px] rounded-full border border-dashed border-[#B88A5A]/10" />
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-[#E8E2D9]">
                    <Image src={specialist.image} alt={specialist.name} fill className="object-cover" sizes="(max-width: 640px) 112px, 192px" priority />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#0B1220]">{specialist.name}</h1>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-medium px-2 py-0.5 rounded-full">
                    <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.5 5.3a.75.75 0 00-1.06-1.06L6.75 7.94 5.56 6.75a.75.75 0 00-1.06 1.06l1.75 1.75a.75.75 0 001.06 0l3.25-3.25z" /></svg>
                    {t("specialistes.detail.verified")}
                  </span>
                </div>
                <p className="text-[#B88A5A] font-medium text-sm mb-2">{specialist.role}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-[12px] text-[#2B2F36]/55 mb-3">
                  <span>{tRaw<(n: number) => string>("specialistes.detail.yearsExp")(specialist.yearsExperience)}</span>
                  <span className="w-1 h-1 rounded-full bg-[#2B2F36]/15" />
                  <span>{specialist.languages.join(", ")}</span>
                  <span className="w-1 h-1 rounded-full bg-[#2B2F36]/15" />
                  <span>N° {specialist.orderNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stars rating={specialist.rating} />
                  <span className="text-sm text-[#0B1220] font-semibold">{specialist.rating}</span>
                  <span className="text-[12px] text-[#2B2F36]/65">{tRaw<(n: number) => string>("specialistes.detail.reviews")(specialist.reviewCount)}</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex lg:col-span-4 lg:justify-end">
              <button onClick={() => setBookingOpen(true)} className="inline-flex items-center gap-2 bg-[#0B1220] text-white px-6 py-3 rounded-full text-[13px] font-medium transition-all duration-300 hover:bg-[#B88A5A]">
                {t("specialistes.detail.bookAppointment")}
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12L12 4M12 4H6M12 4v6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT + AVAILABILITY ── */}
      <section className="py-12 sm:py-16 border-t border-[#0B1220]/[0.06]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="sp-reveal mb-10">
                <p className="text-[11px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-4">{t("specialistes.detail.about")}</p>
                <p className="text-[#2B2F36]/75 leading-[1.9] text-[clamp(0.95rem,1.2vw,1.05rem)] mb-6">{specialist.bio}</p>
                <p className="text-[#2B2F36]/55 leading-[1.9] italic">&ldquo;{specialist.approach}&rdquo;</p>
              </div>
              <div className="sp-reveal mb-10">
                <p className="text-[11px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-3">{t("specialistes.detail.specialties")}</p>
                <div className="flex flex-wrap gap-2">
                  {specialist.specialtyTags.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-[#0B1220]/[0.04] text-[#2B2F36]/65 text-[12px] rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="sp-reveal">
                <p className="text-[11px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-3">{t("specialistes.detail.certifications")}</p>
                <ul className="space-y-2">
                  {specialist.certifications.map((cert, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] text-[#2B2F36]/60">
                      <span className="w-1 h-1 rounded-full bg-[#B88A5A]/40 mt-1.5 shrink-0" />{cert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="sp-reveal bg-white rounded-xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)] lg:sticky lg:top-28">
                <p className="text-[11px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-4">{t("specialistes.detail.availability")}</p>
                <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                  {specialist.availability.map((day, i) => (
                    <button key={i} onClick={() => { setSelectedDay(i); setSelectedSlot(null); }}
                      className={`flex flex-col items-center min-w-[52px] py-2.5 px-2.5 rounded-lg text-center transition-all ${selectedDay === i ? "bg-[#0B1220] text-white" : "bg-[#0B1220]/[0.03] text-[#2B2F36]/55 hover:bg-[#0B1220]/[0.06]"}`}>
                      <span className="text-[10px] font-medium uppercase">{day.day}</span>
                      <span className="text-lg font-heading font-bold">{day.date}</span>
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {specialist.availability[selectedDay]?.slots.map((slot) => (
                    <button key={slot.time} disabled={!slot.available} onClick={() => setSelectedSlot(slot.time)}
                      className={`px-3.5 py-2 rounded-lg text-[12px] font-medium transition-all ${!slot.available ? "bg-[#0B1220]/[0.03] text-[#2B2F36]/15 line-through cursor-not-allowed" : selectedSlot === slot.time ? "bg-[#B88A5A] text-white" : "bg-[#0B1220]/[0.04] text-[#0B1220]/60 hover:bg-[#B88A5A]/10 hover:text-[#B88A5A]"}`}>
                      {slot.time}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#2B2F36]/60 mb-2">{t("specialistes.detail.consultationType")}</p>
                <div className="space-y-1.5 mb-5">
                  {specialist.services.map((svc) => (
                    <button key={svc.id} onClick={() => setSelectedService(svc.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left transition-all ${selectedService === svc.id ? "bg-[#B88A5A]/10 border border-[#B88A5A]/30" : "bg-[#0B1220]/[0.03] hover:bg-[#0B1220]/[0.05]"}`}>
                      <div>
                        <span className="text-[13px] text-[#0B1220] font-medium">{svc.title}</span>
                        <span className="text-[11px] text-[#2B2F36]/60 ml-2">{svc.duration}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        {svc.type === "ligne" && <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0B1220]/[0.05] text-[#2B2F36]/65 uppercase">Online</span>}
                        <span className="text-[13px] font-semibold text-[#B88A5A]">{svc.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setBookingOpen(true)} disabled={!selectedSlot || !selectedService}
                  className={`w-full py-3.5 rounded-full text-[13px] font-medium transition-all ${selectedSlot && selectedService ? "bg-[#0B1220] text-white hover:bg-[#B88A5A]" : "bg-[#0B1220]/[0.06] text-[#2B2F36]/20 cursor-not-allowed"}`}>
                  {selectedSlot && selectedService ? tRaw<(time: string) => string>("specialistes.detail.bookTime")(selectedSlot) : t("specialistes.detail.chooseSlot")}
                </button>
                <p className="text-center text-[11px] text-[#2B2F36]/20 mt-3">{specialist.hours}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOCATION ── */}
      <section className="py-12 sm:py-16 border-t border-[#0B1220]/[0.06]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <div className="sp-reveal">
                <p className="text-[11px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-4">{t("specialistes.detail.location")}</p>
                <p className="text-[#0B1220] font-medium text-sm mb-1">{specialist.location.address}</p>
                <p className="text-[12px] text-[#2B2F36]/65 mb-4">{specialist.location.city}</p>
                <div className="space-y-2 text-[13px] text-[#2B2F36]/60">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#B88A5A]/50 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></svg>
                    {specialist.location.parking}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#B88A5A]/50 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" /><path d="M12 6v6l4 2" /></svg>
                    {specialist.hours}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#B88A5A]/50 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
                    {specialist.location.access}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="sp-reveal rounded-xl overflow-hidden h-[300px] sm:h-[350px]">
                <MapView specialists={[{ slug: specialist.slug, name: specialist.name, role: specialist.role, specialty: specialist.specialty, image: specialist.image, location: specialist.location }]} />
              </div>
            </div>
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

      {/* ── REVIEWS ── */}
      <section className="py-12 sm:py-16 border-t border-[#0B1220]/[0.06]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div className="sp-reveal">
              <p className="text-[11px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-3">{t("specialistes.detail.patientReviews")}</p>
              <div className="flex items-center gap-3">
                <Stars rating={specialist.rating} />
                <span className="font-heading font-bold text-xl text-[#0B1220]">{specialist.rating}</span>
                <span className="text-[13px] text-[#2B2F36]/65">{tRaw<(n: number) => string>("specialistes.detail.reviews")(specialist.reviewCount)}</span>
              </div>
            </div>
            <div className="sp-reveal flex gap-2">
              {(["recent", "top"] as const).map((s) => (
                <button key={s} onClick={() => setReviewSort(s)}
                  className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all ${reviewSort === s ? "bg-[#0B1220] text-white" : "bg-[#0B1220]/[0.04] text-[#2B2F36]/55 hover:bg-[#0B1220]/[0.08]"}`}>
                  {s === "recent" ? t("specialistes.detail.reviewsRecent") : t("specialistes.detail.reviewsTop")}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-0">
            {sortedReviews.map((review) => (
              <div key={review.id} className="sp-reveal border-t border-[#0B1220]/[0.06] py-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-semibold text-sm text-[#0B1220]">{review.name}</span>
                      {review.verified && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#0B1220]/[0.04] text-[#2B2F36]/60 font-medium">{t("specialistes.detail.viaWenaya")}</span>
                      )}
                    </div>
                    <Stars rating={review.rating} />
                  </div>
                  <span className="text-[11px] text-[#2B2F36]/55 shrink-0">{review.date}</span>
                </div>
                <p className="text-[13px] text-[#2B2F36]/65 leading-relaxed mt-2">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOBILE STICKY BAR ── */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#0B1220]/[0.06] px-6 py-3 transition-all duration-300 ${showMobileBar ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-heading font-semibold text-sm text-[#0B1220]">{specialist.name}</p>
            <div className="flex items-center gap-1.5">
              <Stars rating={specialist.rating} />
              <span className="text-[11px] text-[#2B2F36]/65">{tRaw<(n: number) => string>("specialistes.detail.reviews")(specialist.reviewCount)}</span>
            </div>
          </div>
          <button onClick={() => setBookingOpen(true)} className="bg-[#0B1220] text-white px-5 py-3 min-h-[44px] rounded-full text-[13px] font-medium transition-all hover:bg-[#B88A5A]">
            {t("specialistes.detail.mobileBook")}
          </button>
        </div>
      </div>

      {/* ── BOOKING PANEL ── */}
      <BookingPanel
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        specialistName={specialist.name}
        services={specialist.services}
        availability={specialist.availability}
        hours={specialist.hours}
      />
    </div>
  );
}
