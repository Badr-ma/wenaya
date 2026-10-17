"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types/product";

interface Props {
  images: ProductImage[];
  alt: string;
  locale?: "fr" | "en";
}

const LABELS = {
  fr: {
    prev: "Image précédente",
    next: "Image suivante",
    goTo: (i: number, n: number) => `Afficher l'image ${i} sur ${n}`,
  },
  en: {
    prev: "Previous image",
    next: "Next image",
    goTo: (i: number, n: number) => `Show image ${i} of ${n}`,
  },
} as const;

function ChevronLeft(): React.JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 5l-7 7 7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight(): React.JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProductImageGallery({
  images,
  alt,
  locale = "fr",
}: Props): React.JSX.Element {
  const validImages = images.filter((img) => img.src);
  const total = validImages.length;
  const labels = LABELS[locale];

  const [selected, setSelected] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (index: number) => setSelected(Math.max(0, Math.min(total - 1, index))),
    [total],
  );

  const prev = useCallback(() => goTo(selected - 1), [goTo, selected]);
  const next = useCallback(() => goTo(selected + 1), [goTo, selected]);

  if (total === 0) {
    return (
      <div className="w-full lg:w-[45%] shrink-0">
        <div className="relative aspect-square overflow-hidden bg-[#E8E2D9] rounded-xl">
          <div className="absolute inset-0 grid place-items-center">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 16l4-5 3 3.5L14 11l6 5M4 5h16v14H4z"
                stroke="#0B1220"
                strokeOpacity="0.25"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (total < 2) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    const startX = e.clientX;
    const width = viewportRef.current?.offsetWidth ?? 0;
    const threshold = Math.max(40, width * 0.15);
    const base = selected;
    let moved = false;

    setDragging(true);

    const onMove = (ev: PointerEvent) => {
      let dx = ev.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      if ((base === 0 && dx > 0) || (base === total - 1 && dx < 0)) dx *= 0.35;
      setDragX(dx);
    };

    const onUp = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      const dx = ev.clientX - startX;
      setDragX(0);
      setDragging(false);
      if (!moved) return;
      if (dx <= -threshold) goTo(base + 1);
      else if (dx >= threshold) goTo(base - 1);
    };

    const onCancel = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      setDragX(0);
      setDragging(false);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (total < 2) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  return (
    <div className="w-full lg:w-[45%] shrink-0">
      <div
        ref={viewportRef}
        role="group"
        aria-roledescription="carousel"
        aria-label={alt}
        tabIndex={total > 1 ? 0 : -1}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        onDragStart={(e) => e.preventDefault()}
        className="group relative aspect-square overflow-hidden rounded-2xl border border-[#0B1220]/[0.06] bg-white shadow-[0_24px_60px_-28px_rgba(11,18,32,0.4)] outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A]/70"
        style={{
          touchAction: "pan-y",
          cursor: total > 1 ? (dragging ? "grabbing" : "grab") : "default",
        }}
      >
        <div
          className="flex h-full w-full select-none"
          style={{
            transform: `translate3d(calc(${-selected * 100}% + ${dragX}px), 0, 0)`,
            transition: dragging ? "none" : "transform 550ms cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "transform",
          }}
        >
          {validImages.map((img, i) => (
            <div key={i} className="relative h-full w-full shrink-0">
              <Image
                src={img.src}
                alt={img.alt || alt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority={i === 0}
                draggable={false}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
          ))}
        </div>

        {total > 1 && (
          <>
            <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-[#0B1220]/70 px-2.5 py-1 text-[11px] font-medium tabular-nums text-white backdrop-blur-sm">
              {selected + 1} / {total}
            </div>

            <button
              type="button"
              onClick={prev}
              disabled={selected === 0}
              aria-label={labels.prev}
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[#0B1220]/[0.08] bg-white/85 text-[#0B1220] backdrop-blur-sm transition hover:bg-[#B88A5A] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/85 disabled:hover:text-[#0B1220]"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={next}
              disabled={selected === total - 1}
              aria-label={labels.next}
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[#0B1220]/[0.08] bg-white/85 text-[#0B1220] backdrop-blur-sm transition hover:bg-[#B88A5A] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/85 disabled:hover:text-[#0B1220]"
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <>
          <div className="mt-4 flex items-center justify-center gap-2">
            {validImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={labels.goTo(i + 1, total)}
                aria-current={i === selected}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === selected ? "w-5 bg-[#B88A5A]" : "w-1.5 bg-[#0B1220]/20 hover:bg-[#0B1220]/40"
                }`}
              />
            ))}
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {validImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={labels.goTo(i + 1, total)}
                aria-current={i === selected}
                className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border transition ${
                  i === selected
                    ? "border-[#B88A5A] ring-1 ring-[#B88A5A]/40"
                    : "border-[#0B1220]/[0.06] opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt || alt}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
