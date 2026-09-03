/**
 * Group Sessions List — "Nos séances de groupe".
 * Lists the real group sessions (shared content with the homepage Cours &
 * Ateliers section: yoga, sophrologie, nutrition, breathwork, JJB, pilates).
 * Rendered as compact, scannable cards — each links to its group-session
 * detail page. Data is resolved centrally via the group-sessions adapter.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/contexts/LanguageContext";
import { getAllGroupSessions } from "@/lib/group-sessions";

export default function GroupSessionsList(): React.JSX.Element {
  const { t, locale } = useLocale();
  const sessions = getAllGroupSessions(locale);

  return (
    <section className="relative bg-[#F2EFE9] px-6 pb-4 sm:pb-6">
      <div className="relative z-[2] max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="heading-serif text-[clamp(1.7rem,3.2vw,2.6rem)] text-[#0B1220] leading-tight">
            {t("seanceDeGroupe.list.title")}
          </h2>
          <p className="text-[#2B2F36]/55 text-sm sm:text-[15px] mt-3 max-w-xl mx-auto leading-relaxed">
            {t("seanceDeGroupe.list.sub")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((s, i) => (
            <Link
              key={s.id}
              href={s.path}
              className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2EFE9]"
              style={{ background: "#0B1220", border: "1px solid rgba(11,18,32,0.08)" }}
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover transition-all duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/80 via-[#0B1220]/10 to-transparent" />
                <div
                  className="absolute left-3 top-3 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: `${s.accent}18`, border: `1px solid ${s.accent}30` }}
                >
                  <span className="font-heading font-bold text-[10px] tabular-nums" style={{ color: s.accent }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
              <div className="flex-1 px-5 py-4">
                <h3 className="font-heading font-semibold text-white text-[15px] leading-snug">
                  {s.title}
                </h3>
                <p className="text-white/60 text-[12.5px] leading-relaxed mt-1.5">{s.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}