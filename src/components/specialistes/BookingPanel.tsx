"use client";

import { useState } from "react";
import { useLocale } from "@/contexts/LanguageContext";

type BookingPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  specialistName: string;
  services: { id: string; title: string; duration: string; price: string }[];
  availability: { day: string; date: string; slots: { time: string; available: boolean }[] }[];
  hours: string;
};

export default function BookingPanel({ isOpen, onClose, specialistName, services, availability, hours }: BookingPanelProps) {
  const { t } = useLocale();
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const canConfirm = selectedSlot && selectedService;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-[#0B1220]/30 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`fixed inset-x-0 bottom-0 sm:top-0 sm:right-0 sm:left-auto h-[85vh] sm:h-full w-full sm:w-[420px] bg-[#F2EFE9] z-50 shadow-2xl transition-transform duration-400 ease-out rounded-t-2xl sm:rounded-none ${isOpen ? "translate-y-0" : "translate-y-full sm:translate-y-0 sm:translate-x-full"}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#0B1220]/[0.06]">
            <div>
              <p className="font-heading font-semibold text-sm text-[#0B1220]">{t("specialistes.booking.title")}</p>
              <p className="text-[11px] text-[#2B2F36]/35">{specialistName}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#0B1220]/[0.04] flex items-center justify-center hover:bg-[#0B1220]/[0.08] transition-colors">
              <svg className="w-3.5 h-3.5 text-[#2B2F36]/40" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4l8 8M12 4l-8 8" /></svg>
            </button>
          </div>

          {/* Steps indicator */}
          <div className="px-6 py-3 flex items-center gap-3">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${step >= s ? "bg-[#B88A5A] text-white" : "bg-[#0B1220]/[0.05] text-[#2B2F36]/25"}`}>
                  {s}
                </div>
                <span className={`text-[11px] ${step >= s ? "text-[#0B1220]" : "text-[#2B2F36]/25"}`}>
                  {s === 1 ? t("specialistes.booking.stepSlot") : t("specialistes.booking.stepInfo")}
                </span>
                {s < 2 && <div className="w-8 h-px bg-[#0B1220]/[0.08]" />}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {step === 1 ? (
              <>
                {/* Day picker */}
                <p className="text-[11px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-3">{t("specialistes.booking.pickDay")}</p>
                <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                  {availability.map((day, i) => (
                    <button key={i} onClick={() => { setSelectedDay(i); setSelectedSlot(null); }}
                      className={`flex flex-col items-center min-w-[52px] py-2 px-2.5 rounded-lg text-center transition-all ${selectedDay === i ? "bg-[#0B1220] text-white" : "bg-[#0B1220]/[0.03] text-[#2B2F36]/40"}`}>
                      <span className="text-[10px] uppercase">{day.day}</span>
                      <span className="text-base font-heading font-bold">{day.date}</span>
                    </button>
                  ))}
                </div>

                {/* Time slots */}
                <p className="text-[11px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-3">{t("specialistes.booking.pickTime")}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {availability[selectedDay]?.slots.map((slot) => (
                    <button key={slot.time} disabled={!slot.available} onClick={() => setSelectedSlot(slot.time)}
                      className={`px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${!slot.available ? "bg-[#0B1220]/[0.03] text-[#2B2F36]/15 line-through cursor-not-allowed" : selectedSlot === slot.time ? "bg-[#B88A5A] text-white" : "bg-[#0B1220]/[0.04] text-[#0B1220]/60 hover:bg-[#B88A5A]/10"}`}>
                      {slot.time}
                    </button>
                  ))}
                </div>

                {/* Service picker */}
                <p className="text-[11px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-3">{t("specialistes.booking.consultationType")}</p>
                <div className="space-y-1.5 mb-6">
                  {services.map((svc) => (
                    <button key={svc.id} onClick={() => setSelectedService(svc.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left transition-all ${selectedService === svc.id ? "bg-[#B88A5A]/10 border border-[#B88A5A]/30" : "bg-[#0B1220]/[0.03] hover:bg-[#0B1220]/[0.05]"}`}>
                      <div>
                        <span className="text-[13px] text-[#0B1220] font-medium">{svc.title}</span>
                        <span className="text-[11px] text-[#2B2F36]/30 ml-2">{svc.duration}</span>
                      </div>
                      <span className="text-[13px] font-semibold text-[#B88A5A]">{svc.price}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-[11px] font-mono text-[#B88A5A] uppercase tracking-[0.2em] mb-4">{t("specialistes.booking.yourInfo")}</p>
                <div className="space-y-3">
                  {[
                    { key: "name", label: t("specialistes.booking.nameLabel"), placeholder: t("specialistes.booking.namePlaceholder") },
                    { key: "email", label: t("specialistes.booking.emailLabel"), placeholder: t("specialistes.booking.emailPlaceholder"), type: "email" },
                    { key: "phone", label: t("specialistes.booking.phoneLabel"), placeholder: t("specialistes.booking.phonePlaceholder"), type: "tel" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-[11px] text-[#2B2F36]/35 mb-1">{field.label}</label>
                      <input
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        value={(formData as Record<string, string>)[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-[#0B1220]/[0.06] text-[13px] text-[#0B1220] placeholder:text-[#2B2F36]/20 focus:outline-none focus:border-[#B88A5A]/50 transition-colors"
                      />
                    </div>
                  ))}
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

                {/* Summary */}
                <div className="mt-6 bg-white rounded-lg p-4 border border-[#0B1220]/[0.04]">
                  <p className="text-[11px] text-[#2B2F36]/30 mb-2">{t("specialistes.booking.summary")}</p>
                  <p className="text-[13px] text-[#0B1220] font-medium">{specialistName}</p>
                  <p className="text-[12px] text-[#2B2F36]/40">{availability[selectedDay]?.day} {availability[selectedDay]?.date} · {selectedSlot}</p>
                  <p className="text-[12px] text-[#2B2F36]/40">{services.find((s) => s.id === selectedService)?.title}</p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#0B1220]/[0.06]">
            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                disabled={!canConfirm}
                className={`w-full py-3.5 rounded-full text-[13px] font-medium transition-all ${canConfirm ? "bg-[#0B1220] text-white hover:bg-[#B88A5A]" : "bg-[#0B1220]/[0.06] text-[#2B2F36]/20 cursor-not-allowed"}`}
              >
                {t("specialistes.booking.continue")}
              </button>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-5 py-3.5 rounded-full text-[13px] font-medium bg-[#0B1220]/[0.04] text-[#2B2F36]/50 hover:bg-[#0B1220]/[0.08] transition-colors">
                  {t("specialistes.booking.back")}
                </button>
                <button className="flex-1 py-3.5 rounded-full text-[13px] font-medium bg-[#B88A5A] text-white hover:bg-[#B88A5A]/90 transition-colors">
                  {t("specialistes.booking.confirm")}
                </button>
              </div>
            )}
            <p className="text-center text-[11px] text-[#2B2F36]/20 mt-2">{hours}</p>
          </div>
        </div>
      </div>
    </>
  );
}
