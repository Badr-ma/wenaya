/**
 * Group Sessions List — "Nos séances de groupe".
 * Lists the group sessions passed in by the server page (currently-active
 * backend feed via `getActiveGroupSessions` — the live feed is the only source;
 * an unreachable backend shows a retry state, never stale local sessions.
 * Rendered as compact, scannable cards. Every card links to its DEDICATED
 * detail route (`s.path`): editorial sessions to the static detail pages,
 * backend-only programs to their live detail pages (STEP 3) whose CTAs then
 * hand off to the contact flow.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/contexts/LanguageContext";
import type { GroupSession } from "@/lib/group-sessions";

export default function GroupSessionsList({
  sessions: initialSessions,
  initialLoadError = false,
}: {
  sessions: GroupSession[];
  initialLoadError?: boolean;
}): React.JSX.Element {
  const { t, locale } = useLocale();
  const [sessions, setSessions] = useState(initialSessions);
  const [status, setStatus] = useState<"ready" | "loading" | "error">(
    initialLoadError ? "loading" : "ready"
  );
  const requestIdRef = useRef(0);

  const reloadSessions = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setStatus("loading");
    try {
      const response = await fetch(`/api/seance-de-groupe?locale=${locale}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Group session feed unavailable");
      const payload: unknown = await response.json();
      if (!payload || typeof payload !== "object" || !Array.isArray((payload as { sessions?: unknown }).sessions)) {
        throw new Error("Unexpected group session response");
      }
      if (requestId === requestIdRef.current) {
        setSessions((payload as { sessions: GroupSession[] }).sessions);
        setStatus("ready");
      }
    } catch {
      if (requestId === requestIdRef.current) setStatus("error");
    }
  }, [locale]);

  useEffect(() => {
    const timer = initialLoadError ? window.setTimeout(() => void reloadSessions(), 0) : undefined;
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      requestIdRef.current += 1;
    };
  }, [initialLoadError, reloadSessions]);

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

        {status === "loading" && (
          <p role="status" className="py-8 text-center text-sm text-[#2B2F36]/55">
            {t("seanceDeGroupe.list.loading")}
          </p>
        )}
        {status === "error" && (
          <div className="py-8 text-center">
            <p role="alert" className="text-sm text-[#2B2F36]/65">
              {t("seanceDeGroupe.list.unavailable")}
            </p>
            <button
              type="button"
              onClick={() => void reloadSessions()}
              className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-[#B88A5A]/40 px-5 text-sm font-medium text-[#9A7242] transition-colors hover:bg-[#B88A5A]/10"
            >
              {t("seanceDeGroupe.list.retry")}
            </button>
          </div>
        )}
        {status === "ready" && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          {sessions.map((s) => (
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
              </div>
              <div className="flex-1 px-5 py-4">
                <h3 className="font-heading font-semibold text-white text-[15px] leading-snug">
                  {s.title}
                </h3>
                <p className="text-white/60 text-[12.5px] leading-relaxed mt-1.5 line-clamp-2">{s.description}</p>
              </div>
            </Link>
          ))}
        </div>}
      </div>
    </section>
  );
}
