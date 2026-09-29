"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";
import { normalizeLegacyPrice } from "@/lib/format";
import type { Specialist, SpecialistService } from "@/lib/specialistes";
import {
  buildMonthAvailability,
  buildMonthGrid,
  leadingBlanks,
  MONTHS_FR,
  formatDateCaption,
  formatDateCompact,
  weekdayShortLabels,
} from "@/lib/availability";
import { fetchClientUnavailableDates, fetchClientDay } from "@/lib/professional-availability-client";
import { submitWaitingListRequest } from "@/lib/professional-booking-client";
import type { ProfessionalAvailabilityReason, ProfessionalTimeSlot } from "@/lib/professional-availability";

type BookingConfirmationData = {
  specialistName: string;
  day?: string;
  date?: string;
  month?: string;
  iso?: string;
  time: string | null;
  service?: SpecialistService;
  hours: string;
  formData: { name: string; email: string; phone: string; message: string };
};

type BookingPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  specialist: Specialist;
  initialDayIso: string | null;
  initialSlot: string | null;
  initialService: string | null;
  onBookingConfirmed?: (data: BookingConfirmationData) => void;
};

function ApiDayState({
  day,
}: {
  day: { reason: ProfessionalAvailabilityReason; nextDay: string | null };
}) {
  const { t, locale } = useLocale();
  const bk = "specialistes.booking.";
  if (day.reason === "unavailable" && day.nextDay) {
    return (
      <>
        <p className="text-[12px] text-[#2B2F36]/45">{t(`${bk}closedDay`)}</p>
        <p className="text-[12px] text-[#2B2F36]/45 mt-1.5">
          {t(`${bk}nextDayHint`)}{" "}
          <span className="font-semibold text-[#B88A5A]">{formatDateCaption(day.nextDay, locale)}</span>
        </p>
      </>
    );
  }
  const key =
    day.reason === "no-work-hours"
      ? "noWorkHours"
      : day.reason === "ghost-mode"
        ? "ghostMode"
        : day.reason === "home-care-restricted"
          ? "homeCareRestricted"
          : day.reason === "unavailable"
            ? "closedDay"
            : "requestFailure";
  return <p className="text-[12px] text-[#2B2F36]/45">{t(`${bk}${key}`)}</p>;
}

export default function BookingPanel({
  isOpen,
  onClose,
  specialist,
  initialDayIso,
  initialSlot,
  initialService,
  onBookingConfirmed,
}: BookingPanelProps) {
  const { t, tRaw, locale } = useLocale();
  const legalLinks = tRaw<string[]>("footer.infosLegales.links");

  const [step, setStep] = useState(1);
  const [selectedDateIso, setSelectedDateIso] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const submittingRef = useRef(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const apiConfig = specialist.availabilityApi ?? null;
  const [apiDates, setApiDates] = useState<{ iso: string; closed: string[] }>({ iso: "", closed: [] });
  const [apiDayLoading, setApiDayLoading] = useState<string | null>(null);
  const [apiSlots, setApiSlots] = useState<Record<string, ProfessionalTimeSlot[]>>({});
  const [apiDays, setApiDays] = useState<Record<string, { reason: ProfessionalAvailabilityReason; nextDay: string | null }>>({});
  const dayRequestIsoRef = useRef<string | null>(null);

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const isCurrentMonth = viewMonth.year === today.getFullYear() && viewMonth.month === today.getMonth();
  const canGoNext = viewMonth.year * 12 + viewMonth.month < today.getFullYear() * 12 + today.getMonth() + 6;

  // Live fully-unavailable dates for API-sourced professionals, anchored on
  // the visible month. Legacy specialists keep the local weekly-schedule
  // calendar (buildMonthAvailability) untouched.
  useEffect(() => {
    if (!apiConfig) return;
    let cancelled = false;
    const anchor = `${viewMonth.year}-${String(viewMonth.month + 1).padStart(2, "0")}-01`;
    fetchClientUnavailableDates(apiConfig.userName, anchor).then((r) => {
      if (cancelled) return;
      setApiDates({ iso: anchor, closed: r.ok ? r.dates : [] });
    });
    return () => { cancelled = true; };
  }, [apiConfig, viewMonth]);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Close on Escape; lock body scroll while the panel is open; reset the
  // content scroll position whenever the step changes (fresh view per step).
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [step]);

  const monthDays = useMemo(
    () =>
      apiConfig
        ? buildMonthGrid(viewMonth.year, viewMonth.month, apiDates.closed, todayKey)
        : buildMonthAvailability(specialist, viewMonth.year, viewMonth.month),
    [specialist, apiConfig, viewMonth, apiDates.closed, todayKey]
  );
  const selectedDay = monthDays.find((d) => d.iso === selectedDateIso) ?? null;
  const canConfirm = Boolean(selectedSlot && selectedService);
  const weekdayLabels = useMemo(() => weekdayShortLabels(locale), [locale]);

  const apiSelectedDay = apiConfig && selectedDay ? apiDays[selectedDay.iso] : undefined;
  const apiSelectedSlots = apiConfig && selectedDay ? apiSlots[selectedDay.iso] : undefined;
  const slotsToRender = !apiConfig
    ? (selectedDay?.slots ?? []).map((s) => ({ key: s.time, label: s.time, disabled: !s.available }))
    : (apiSelectedSlots ?? []).map((s) => ({ key: `${s.start}-${s.end}`, label: s.start, disabled: s.isReserved }));

  const handleDaySelect = (iso: string) => {
    setSelectedDateIso(iso);
    setSelectedSlot(null);
    if (!apiConfig) return;
    if (apiSlots[iso] || apiDays[iso] || apiDayLoading === iso) return;
    dayRequestIsoRef.current = iso;
    setApiDayLoading(iso);
    fetchClientDay(apiConfig.professionalId, iso).then((r) => {
      if (dayRequestIsoRef.current !== iso) return;
      dayRequestIsoRef.current = null;
      setApiDayLoading(null);
      if (!r.ok) {
        setApiDays((p) => ({ ...p, [iso]: { reason: "api-error", nextDay: null } }));
        return;
      }
      if (r.available) {
        setApiSlots((p) => ({ ...p, [iso]: r.slots }));
        return;
      }
      setApiDays((p) => ({ ...p, [iso]: { reason: r.reason, nextDay: r.nextDay } }));
    });
  };

  // Seed the panel from the initial (URL/query) values whenever it opens or
  // those values change while open. This uses React's documented "adjust state
  // during render" pattern (track the previous seed, re-seed when it changes)
  // instead of an effect, so no synchronous setState runs from an effect body.
  const seedKey = `${initialDayIso ?? ""}|${initialSlot ?? ""}|${initialService ?? ""}`;
  const [prevSeedKey, setPrevSeedKey] = useState(seedKey);
  if (prevSeedKey !== seedKey) {
    setPrevSeedKey(seedKey);
    if (isOpen) {
      if (initialDayIso && initialSlot && initialService) {
        setSelectedDateIso(initialDayIso);
        setSelectedSlot(initialSlot);
        setSelectedService(initialService);
        setStep(2);
      } else {
        setSelectedDateIso(initialDayIso);
        setSelectedSlot(null);
        setSelectedService(null);
        setStep(1);
      }
      if (initialDayIso) {
        const [y, m] = initialDayIso.split("-").map(Number);
        setViewMonth({ year: y, month: m - 1 });
      }
    }
  }

  const changeMonth = (delta: number) => {
    dayRequestIsoRef.current = null;
    setApiDayLoading(null);
    setSelectedDateIso(null);
    setSelectedSlot(null);
    setViewMonth((prev) => {
      const t2 = prev.year * 12 + prev.month + delta;
      return { year: Math.floor(t2 / 12), month: ((t2 % 12) + 12) % 12 };
    });
  };

  const validateBooking = (data: { name: string; email: string; phone: string }): { name?: string; email?: string; phone?: string } => {
    const name = data.name.trim();
    const email = data.email.trim();
    const phone = data.phone.trim();
    const errors: { name?: string; email?: string; phone?: string } = {};
    if (!name) errors.name = t("specialistes.booking.errorNameRequired");
    if (!email) errors.email = t("specialistes.booking.errorEmailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = t("specialistes.booking.errorEmailInvalid");
    if (!phone) errors.phone = t("specialistes.booking.errorPhoneRequired");
    else {
      const digits = phone.replace(/\D/g, "").length;
      if (digits < 8 || digits > 15) errors.phone = t("specialistes.booking.errorPhoneInvalid");
    }
    return errors;
  };

  const handleFieldChange = (key: "name" | "email" | "phone", value: string) => {
    const next = { ...formData, [key]: value };
    setFormData(next);
    if (submitAttempted) setErrors(validateBooking(next));
  };

  const handleConfirm = async () => {
    if (submittingRef.current) return;
    const errs = validateBooking(formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSubmitAttempted(true);
      const firstInvalid = (["name", "email", "phone"] as const).find((k) => errs[k]);
      if (firstInvalid) document.getElementById(`bk-${firstInvalid}`)?.focus();
      return;
    }

    const bookingData: BookingConfirmationData = {
      specialistName: specialist.name,
      day: selectedDay?.day,
      date: selectedDay?.date,
      month: selectedDay?.month,
      iso: selectedDay?.iso,
      time: selectedSlot,
      service: specialist.services.find((s) => s.id === selectedService),
      hours: specialist.hours,
      formData: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
      },
    };

    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError(false);
    try {
      // Legacy/local profiles have no backend user id: keep the demo
      // (local-only) confirmation exactly as before.
      if (!apiConfig) {
        onBookingConfirmed?.(bookingData);
        setErrors({});
        setSubmitAttempted(false);
        setStep(3);
        return;
      }

      // API-sourced professional: real submission to the waiting list
      // (POST api/v1/waiting-lists via the same-origin BFF — same backend
      // contract as the legacy wenaya-front booking flow).
      const service = bookingData.service;
      const notesParts: string[] = [];
      if (formData.message.trim()) notesParts.push(formData.message.trim());
      if (service) notesParts.push(`${t("specialistes.booking.serviceNotePrefix")} : ${service.title}`);

      const result = await submitWaitingListRequest({
        customer_name: formData.name.trim(),
        customer_email: formData.email.trim(),
        customer_phone: formData.phone.trim(),
        user_id: apiConfig.professionalId,
        booking_date: selectedDay?.iso ?? "",
        booking_time: selectedSlot ?? "",
        notes: notesParts.join("\n"),
      });

      if (!result.ok) {
        setSubmitError(true);
        return;
      }

      onBookingConfirmed?.(bookingData);
      setErrors({});
      setSubmitAttempted(false);
      setStep(3);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const blanks = leadingBlanks(viewMonth.year, viewMonth.month);
  const selectedServiceTitle = specialist.services.find((s) => s.id === selectedService)?.title;

  return (
    <>
      {/* Backdrop + centered booking card */}
      <div
        className={`fixed inset-0 z-50 flex flex-col justify-end sm:flex sm:items-center sm:justify-center bg-[#0B1220]/30 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className={`w-full sm:w-[1000px] sm:max-w-[calc(100vw-2rem)] h-[85dvh] sm:h-auto sm:max-h-[calc(100dvh-2rem)] bg-white sm:border border-[#0B1220]/[0.08] rounded-t-2xl sm:rounded-2xl shadow-[0_2px_16px_rgba(11,18,32,0.06)] flex flex-col overflow-hidden transition-transform duration-400 ease-out ${isOpen ? "translate-y-0" : "translate-y-full"}`}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 sm:px-8 border-b border-[#0B1220]/[0.06]">
            <div>
              <p className="font-heading font-semibold text-sm text-[#0B1220]">{t("specialistes.booking.title")}</p>
              <p className="text-[11px] text-[#2B2F36]/35">{specialist.name}</p>
            </div>
            <button onClick={onClose} aria-label={t("specialistes.booking.close")} className="w-8 h-8 rounded-full bg-[#0B1220]/[0.04] flex items-center justify-center hover:bg-[#0B1220]/[0.08] transition-colors">
              <svg className="w-3.5 h-3.5 text-[#2B2F36]/40" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4l8 8M12 4l-8 8" /></svg>
            </button>
          </div>

          {/* Steps indicator */}
          <div className="px-6 pt-3 pb-2 sm:px-8 flex items-center gap-2 sm:gap-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${step >= s ? "bg-[#B88A5A] text-white" : "bg-[#0B1220]/[0.05] text-[#2B2F36]/25"}`}>
                  {s}
                </div>
                <span className={`whitespace-nowrap text-[10px] sm:text-[11px] ${step >= s ? "text-[#0B1220]" : "text-[#2B2F36]/25"}`}>
                  {s === 1 ? t("specialistes.booking.stepSlot") : s === 2 ? t("specialistes.booking.stepInfo") : t("specialistes.booking.stepConfirm")}
                </span>
                {s < 3 && <div className="hidden sm:block w-6 h-px bg-[#0B1220]/[0.08]" />}
              </div>
            ))}
          </div>

          {/* Content */}
          <div ref={contentRef} className="flex-1 overflow-y-auto overscroll-contain min-h-0 px-6 py-4 sm:px-8 sm:py-6">
            {step === 1 && (
              <>
                {/* Three-column booking card */}
                <div className="grid grid-cols-1 sm:grid-cols-[25fr_40fr_30fr] gap-6 sm:gap-10 items-start">
                  {/* LEFT — specialist */}
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[#E8E2D9] mb-3">
                      <Image src={specialist.image} alt={specialist.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <p className="font-heading font-bold text-[15px] text-[#0B1220] mb-2">{specialist.name}</p>
                    {selectedDay && (
                      <p className="flex items-center gap-1.5 text-[12px] text-[#2B2F36]/60 mb-4">
                        <svg className="w-3.5 h-3.5 text-[#B88A5A]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
                        {formatDateCaption(selectedDay.iso, locale)}
                      </p>
                    )}
                    <p className="text-[11px] text-[#2B2F36]/50 leading-relaxed">{t("specialistes.booking.cardNote")}</p>
                  </div>

                  {/* CENTER — calendar */}
                  <div>
                    {/* Month navigation: centered month, arrows to the right */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-8" aria-hidden="true" />
                      <span className="flex-1 text-center font-heading font-bold text-[15px] text-[#0B1220]">
                        {MONTHS_FR[viewMonth.month].toLowerCase()} {viewMonth.year}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => changeMonth(-1)}
                          disabled={isCurrentMonth}
                          aria-label={t("specialistes.booking.prevMonth")}
                          className={`w-8 h-8 flex items-center justify-center rounded-md border border-[#0B1220]/[0.08] transition-colors ${isCurrentMonth ? "text-[#2B2F36]/15 cursor-not-allowed" : "text-[#2B2F36]/50 hover:bg-[#0B1220]/[0.04] hover:text-[#0B1220]"}`}
                        >
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 4L6 8l4 4" /></svg>
                        </button>
                        <button
                          onClick={() => changeMonth(1)}
                          disabled={!canGoNext}
                          aria-label={t("specialistes.booking.nextMonth")}
                          className={`w-8 h-8 flex items-center justify-center rounded-md border border-[#0B1220]/[0.08] transition-colors ${!canGoNext ? "text-[#2B2F36]/15 cursor-not-allowed" : "text-[#2B2F36]/50 hover:bg-[#0B1220]/[0.04] hover:text-[#0B1220]"}`}
                        >
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 4l4 4-4 4" /></svg>
                        </button>
                      </div>
                    </div>

                    {/* Weekday labels */}
                    <div className="grid grid-cols-7 gap-[3px] mb-1.5">
                      {weekdayLabels.map((w, i) => (
                        <span key={i} className="text-center text-[10px] font-medium text-[#2B2F36]/40">{w}</span>
                      ))}
                    </div>

                    {/* Calendar grid — compact */}
                    <div className="grid grid-cols-7 gap-[3px]">
                      {Array.from({ length: blanks }).map((_, i) => (
                        <span key={`b-${i}`} />
                      ))}
                      {monthDays.map((d) => {
                        const isToday = d.iso === todayKey;
                        const isSelected = d.iso === selectedDateIso;
                        return (
                          <button
                            key={d.iso}
                            disabled={d.closed}
                            onClick={() => handleDaySelect(d.iso)}
                            className={`relative flex items-center justify-center aspect-square rounded-md text-[12px] font-medium transition-all ${d.closed ? "text-[#2B2F36]/15 cursor-not-allowed" : isSelected ? "bg-[#0B1220] text-white" : "bg-[#B88A5A]/10 text-[#0B1220]/80 hover:bg-[#B88A5A]/20 hover:text-[#0B1220]"}`}
                          >
                            <span>{Number(d.date)}</span>
                            {!d.closed && !isSelected && !apiConfig && (
                              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#B88A5A]" />
                            )}
                            {isToday && !isSelected && <span className="absolute inset-0 rounded-md ring-1 ring-[#B88A5A]/50 pointer-events-none" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* RIGHT — availability */}
                  <div className="flex flex-col">
                    {selectedDay && (
                      <>
                        <p className="font-heading font-bold text-xl text-[#0B1220]">{formatDateCaption(selectedDay.iso, locale)}</p>
                        <p className="text-[11px] text-[#2B2F36]/40 mb-5">{formatDateCompact(selectedDay.iso, locale)}</p>
                      </>
                    )}
                    <p className="text-[11px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-3">{t("specialistes.booking.availableSlots")}</p>
                    {selectedDay && slotsToRender.length > 0 ? (
                      <div className="w-full rounded-lg border border-[#0B1220]/[0.10] divide-y divide-[#0B1220]/[0.06] overflow-hidden">
                        {slotsToRender.map((slot) => (
                          <button key={slot.key} disabled={slot.disabled} onClick={() => setSelectedSlot(slot.label)}
                            className={`w-full px-3.5 py-2.5 text-[13px] font-medium text-center transition-colors ${slot.disabled ? "bg-[#0B1220]/[0.03] text-[#2B2F36]/25 line-through cursor-not-allowed" : selectedSlot === slot.label ? "bg-[#B88A5A] text-white" : "bg-white text-[#0B1220]/70 hover:bg-[#B88A5A]/10 hover:text-[#0B1220]"}`}>
                            {slot.label}
                          </button>
                        ))}
                      </div>
                    ) : selectedDay && apiConfig ? (
                      apiDayLoading === selectedDay.iso ? (
                        <p className="text-[12px] text-[#2B2F36]/45">{t("specialistes.booking.loadingSlots")}</p>
                      ) : apiSelectedDay ? (
                        <ApiDayState day={apiSelectedDay} />
                      ) : apiSelectedSlots ? (
                        <p className="text-[12px] text-[#2B2F36]/45">{t("specialistes.booking.noSlotsDay")}</p>
                      ) : (
                        <div className="w-full h-[180px] sm:h-[210px] rounded-lg border border-dashed border-[#0B1220]/[0.10] flex items-center justify-center px-4">
                          <p className="text-center text-[12px] text-[#2B2F36]/45">{t("specialistes.booking.selectDate")}</p>
                        </div>
                      )
                    ) : selectedDay ? (
                      <p className="text-[12px] text-[#2B2F36]/45">{t("specialistes.booking.noSlotsDay")}</p>
                    ) : (
                      <div className="w-full h-[180px] sm:h-[210px] rounded-lg border border-dashed border-[#0B1220]/[0.10] flex items-center justify-center px-4">
                        <p className="text-center text-[12px] text-[#2B2F36]/45">{t("specialistes.booking.selectDate")}</p>
                      </div>
                    )}

                    {/* Service picker */}
                    <p className="text-[11px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mt-6 mb-3">{t("specialistes.booking.consultationType")}</p>
                    <div className="space-y-1.5 w-full">
                      {specialist.services.map((svc) => (
                        <button key={svc.id} onClick={() => setSelectedService(svc.id)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left transition-all ${selectedService === svc.id ? "bg-[#B88A5A]/10 border border-[#B88A5A]/30" : "bg-[#0B1220]/[0.03] hover:bg-[#0B1220]/[0.05]"}`}>
                          <div>
                            <span className="text-[13px] text-[#0B1220] font-medium">{svc.title}</span>
                            <span className="text-[11px] text-[#2B2F36]/60 ml-2">{svc.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {svc.type === "ligne" && <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0B1220]/[0.05] text-[#2B2F36]/65 uppercase">Online</span>}
                            <span className="text-[13px] font-semibold text-[#B88A5A]">{normalizeLegacyPrice(svc.price)}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {canConfirm && selectedDay && (
                      <p className="w-full text-[11px] text-[#2B2F36]/55 text-center mt-4 truncate">
                        {formatDateCaption(selectedDay.iso, locale)} · {selectedSlot} · {selectedServiceTitle}
                      </p>
                    )}
                    <button
                      onClick={() => setStep(2)}
                      disabled={!canConfirm}
                      className={`w-full mt-3 py-3.5 rounded-full text-[13px] font-medium transition-all ${canConfirm ? "bg-[#0B1220] text-white hover:bg-[#B88A5A]" : "bg-[#0B1220]/[0.06] text-[#2B2F36]/20 cursor-not-allowed"}`}
                    >
                      {t("specialistes.booking.continue")}
                    </button>
                  </div>
                </div>

                {/* Bottom area — pending note + terms */}
                <div className="mt-8 sm:mt-10 border-t border-[#0B1220]/[0.06] pt-5 pb-1 text-center">
                  <p className="flex items-center justify-center gap-2 text-[12px] text-[#2B2F36]/60 mb-3">
                    <svg className="w-4 h-4 shrink-0 text-[#B88A5A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M12 12v4" /></svg>
                    {t("specialistes.booking.pendingNote")}
                  </p>
                  <p className="text-[11px] text-[#2B2F36]/40 mb-2">{t("specialistes.booking.termsNote")}</p>
                  <div className="flex items-center justify-center gap-3">
                    <Link href={h(locale, "/privacy-policy")} className="text-[11px] text-[#B88A5A] underline underline-offset-2">{legalLinks[0]}</Link>
                    <span className="text-[#2B2F36]/20">·</span>
                    <Link href={h(locale, "/terms-and-conditions")} className="text-[11px] text-[#B88A5A] underline underline-offset-2">{legalLinks[1]}</Link>
                  </div>
                  <p className="text-center text-[11px] text-[#2B2F36]/20 mt-3">{specialist.hours}</p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-[11px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-4">{t("specialistes.booking.yourInfo")}</p>
                <div className="space-y-3">
                  {[
                    { key: "name", label: t("specialistes.booking.nameLabel"), placeholder: t("specialistes.booking.namePlaceholder") },
                    { key: "email", label: t("specialistes.booking.emailLabel"), placeholder: t("specialistes.booking.emailPlaceholder"), type: "email" },
                    { key: "phone", label: t("specialistes.booking.phoneLabel"), placeholder: t("specialistes.booking.phonePlaceholder"), type: "tel" },
                  ].map((field) => {
                    const key = field.key as "name" | "email" | "phone";
                    const err = errors[key];
                    const inputId = `bk-${key}`;
                    return (
                      <div key={key}>
                        <label htmlFor={inputId} className="block text-[11px] text-[#2B2F36]/35 mb-1">{field.label}</label>
                        <input
                          id={inputId}
                          type={field.type || "text"}
                          placeholder={field.placeholder}
                          value={formData[key]}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
                          required
                          aria-required="true"
                          autoComplete={key === "name" ? "name" : key === "email" ? "email" : "tel"}
                          aria-invalid={err ? true : undefined}
                          aria-describedby={err ? `${inputId}-error` : undefined}
                          className={`w-full px-3.5 py-2.5 bg-white rounded-lg border text-[13px] text-[#0B1220] placeholder:text-[#2B2F36]/20 focus:outline-none transition-colors ${err ? "border-red-400/70 focus:border-red-400" : "border-[#0B1220]/[0.06] focus:border-[#B88A5A]/50"}`}
                        />
                        {err && (
                          <p id={`${inputId}-error`} role="alert" className="text-[11px] text-red-500/80 mt-1">{err}</p>
                        )}
                      </div>
                    );
                  })}
                  <div>
                    <label className="block text-[11px] text-[#2B2F36]/35 mb-1">{t("specialistes.booking.messageLabel")}</label>
                    <textarea
                      rows={3}
                      placeholder={t("specialistes.booking.messagePlaceholder")}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-[#0B1220]/[0.06] text-[13px] text-[#0B1220] placeholder:text-[#2B2F36]/20 focus:outline-none focus:border-[#B88A5A]/50 transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Submission error (API professionals only) */}
                {submitError && !submitting && (
                  <div role="alert" className="flex items-center justify-between gap-3 rounded-lg border border-red-400/40 bg-red-50/70 px-3.5 py-2.5">
                    <p className="text-[12px] text-red-600/90">{t("specialistes.booking.submitError")}</p>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={submitting}
                      className="shrink-0 text-[12px] font-semibold text-[#B88A5A] underline underline-offset-2 disabled:opacity-40"
                    >
                      {t("specialistes.booking.retry")}
                    </button>
                  </div>
                )}

                {/* Summary */}
                <div className="mt-6 bg-white rounded-lg p-4 border border-[#0B1220]/[0.04]">
                  <p className="text-[11px] text-[#2B2F36]/30 mb-2">{t("specialistes.booking.summary")}</p>
                  <p className="text-[13px] text-[#0B1220] font-medium">{specialist.name}</p>
                  <p className="text-[12px] text-[#2B2F36]/40">{selectedDay ? `${formatDateCaption(selectedDay.iso, locale)} · ${selectedSlot}` : selectedSlot}</p>
                  <p className="text-[12px] text-[#2B2F36]/40">{selectedServiceTitle}</p>
                </div>

                {/* Confirmation note + terms */}
                <div className="mt-5">
                  <p className="text-[11px] text-[#2B2F36]/50 leading-relaxed mb-3">{t("specialistes.booking.confirmNote")}</p>
                  <p className="text-[11px] text-[#2B2F36]/35 leading-relaxed mb-2">{t("specialistes.booking.termsNote")}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link href={h(locale, "/privacy-policy")} className="text-[11px] text-[#B88A5A] underline underline-offset-2">{legalLinks[0]}</Link>
                    <span className="text-[#2B2F36]/20">·</span>
                    <Link href={h(locale, "/terms-and-conditions")} className="text-[11px] text-[#B88A5A] underline underline-offset-2">{legalLinks[1]}</Link>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="text-center py-6">
                <div className="mx-auto w-14 h-14 rounded-full bg-[#B88A5A]/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#B88A5A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </div>
                <p className="font-heading font-bold text-lg text-[#0B1220] mb-2">{t("specialistes.booking.pendingTitle")}</p>
                <p className="text-[13px] text-[#2B2F36]/60 mb-5">{t("specialistes.booking.pendingDesc")}</p>
                <div className="bg-white rounded-xl border border-[#0B1220]/[0.06] p-4 text-left mb-5">
                  <p className="text-[13px] text-[#0B1220] font-medium">{specialist.name}</p>
                  <p className="text-[12px] text-[#2B2F36]/55">{selectedDay ? `${formatDateCaption(selectedDay.iso, locale)} · ${selectedSlot}` : selectedSlot}</p>
                  <p className="text-[12px] text-[#2B2F36]/55">{selectedServiceTitle}</p>
                </div>
                <p className="text-[11px] text-[#2B2F36]/40 italic">
                  {t(apiConfig ? "specialistes.booking.pendingSuccess" : "specialistes.booking.pendingLocalOnly")}
                </p>
              </div>
            )}
          </div>

          {/* Footer — only on steps 2/3 (step 1 has its own bottom area) */}
          {step !== 1 && (
            <div className="px-6 sm:px-8 py-4 border-t border-[#0B1220]/[0.06]">
              {step === 2 && (
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-5 py-3.5 rounded-full text-[13px] font-medium bg-[#0B1220]/[0.04] text-[#2B2F36]/50 hover:bg-[#0B1220]/[0.08] transition-colors">
                    {t("specialistes.booking.back")}
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={submitting || (submitAttempted && Object.keys(validateBooking(formData)).length > 0)}
                    className={`flex-1 py-3.5 rounded-full text-[13px] font-medium transition-colors ${submitting || (submitAttempted && Object.keys(validateBooking(formData)).length > 0) ? "bg-[#B88A5A]/40 text-white/70 cursor-not-allowed" : "bg-[#B88A5A] text-white hover:bg-[#B88A5A]/90"}`}
                  >
                    {submitting ? t("specialistes.booking.submitting") : t("specialistes.booking.confirm")}
                  </button>
                </div>
              )}
              {step === 3 && (
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="px-5 py-3.5 rounded-full text-[13px] font-medium bg-[#0B1220]/[0.04] text-[#2B2F36]/50 hover:bg-[#0B1220]/[0.08] transition-colors">
                    {t("specialistes.booking.back")}
                  </button>
                  <button onClick={onClose} className="flex-1 py-3.5 rounded-full text-[13px] font-medium bg-[#0B1220] text-white hover:bg-[#B88A5A] transition-colors">
                    {t("specialistes.booking.close")}
                  </button>
                </div>
              )}
              <p className="text-center text-[11px] text-[#2B2F36]/20 mt-2">{specialist.hours}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
