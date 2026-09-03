/**
 * Related Practices — text-link list (no cards).
 * 1–3 columns of thin rows with practice title and an arrow, separated by hairlines.
 */
import Link from "next/link";
import type { Pratique } from "@/lib/pratiques";
import { h, type HrefLocale } from "@/lib/href";

interface RelatedPratiquesProps {
  related: Pratique[];
  overline: string;
  title: string;
  locale: HrefLocale;
}

export default function RelatedPratiques({
  related,
  overline,
  title,
  locale,
}: RelatedPratiquesProps): React.JSX.Element | null {
  if (!related || related.length === 0) return null;

  return (
    <section aria-labelledby="related-pratiques-heading">
      <div className="inline-flex items-center gap-2.5">
        <span className="w-1 h-1 rounded-full bg-[#B88A5A]" />
        <span className="text-[#B88A5A]/70 text-[10px] font-semibold tracking-[0.24em] uppercase">{overline}</span>
      </div>
      <h2
        id="related-pratiques-heading"
        className="heading-serif text-[clamp(1.7rem,3.5vw,2.6rem)] text-[#0B1220] mt-3 leading-tight"
      >
        {title}
      </h2>

      <ul className="mt-10 sm:mt-14 border-t border-[#0B1220]/[0.08] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-14">
        {related.map((p) => (
          <li key={p.slug} className="border-b border-[#0B1220]/[0.08]">
            <Link
              href={h(locale, `/pratiques/${p.slug}`)}
              className="group flex items-center justify-between gap-6 py-6 sm:py-7"
            >
              <span className="font-heading text-[17px] sm:text-xl text-[#0B1220] group-hover:text-[#159AA9] transition-colors leading-snug">
                {p.title}
              </span>
              <span
                aria-hidden="true"
                className="text-[#2B2F36]/25 group-hover:text-[#B88A5A] transition-colors shrink-0 text-lg"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}