/**
 * ActiveFilters — displays active product filters as removable pills/chips.
 * Client-compatible (receives callbacks from parent).
 *
 * The parent provides prepared filter objects with display labels.
 * This component owns no data logic, no translations, no product imports.
 */

type ActiveFilter = {
  type: "category" | "goal" | "topic" | "search" | "sort";
  value: string;
  label: string;
};

type ActiveFiltersProps = {
  filters: ActiveFilter[];
  onRemove: (filter: ActiveFilter) => void;
  onClearAll?: () => void;
  clearLabel?: string;
};

export default function ActiveFilters({
  filters,
  onRemove,
  onClearAll,
  clearLabel,
}: ActiveFiltersProps): React.JSX.Element | null {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <span
          key={`${filter.type}-${filter.value}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#0B1220]/[0.04] px-3 py-1.5 text-xs font-mono text-[#0B1220]/70 transition-colors hover:text-[#B88A5A]"
        >
          {filter.label}
          <button
            type="button"
            onClick={() => onRemove(filter)}
            className="rounded-full p-0.5 text-[#0B1220]/30 hover:text-[#B88A5A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-1"
            aria-label={`Remove filter: ${filter.label}`}
          >
            <svg
              className="w-3 h-3"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M3 3l6 6M9 3l-6 6" />
            </svg>
          </button>
        </span>
      ))}

      {onClearAll && clearLabel && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-mono text-[#B88A5A] hover:text-[#B88A5A]/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-1 rounded ml-1"
        >
          {clearLabel}
        </button>
      )}
    </div>
  );
}

export type { ActiveFilter, ActiveFiltersProps };
