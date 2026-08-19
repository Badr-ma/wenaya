/**
 * EmptyState — displayed when product filtering returns no results.
 * Server Component compatible. No "use client".
 *
 * Accepts a locale-aware message and an optional clear-filters link.
 * The parent provides translated text — this component does not own translations.
 */

import Link from "next/link";

type EmptyStateProps = {
  message: string;
  clearLabel?: string;
  clearHref?: string;
};

export default function EmptyState({
  message,
  clearLabel,
  clearHref,
}: EmptyStateProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      {/* ── Icon ── */}
      <svg
        className="w-10 h-10 text-[#0B1220]/[0.07] mb-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>

      {/* ── Message ── */}
      <p className="text-sm text-[#2B2F36]/40 text-center max-w-sm leading-relaxed">
        {message}
      </p>

      {/* ── Clear action ── */}
      {clearHref && clearLabel && (
        <Link
          href={clearHref}
          className="mt-4 text-xs text-[#B88A5A] hover:text-[#B88A5A]/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2 rounded"
        >
          {clearLabel}
        </Link>
      )}
    </div>
  );
}
