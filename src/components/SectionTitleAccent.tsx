export default function SectionTitleAccent({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}): React.JSX.Element {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center gap-1.5 sm:gap-2 ${className}`}
    >
      <span
        className={
          compact
            ? "h-[2px] w-5 rounded-full bg-[#B88A5A] sm:w-9 lg:w-10"
            : "h-[2px] w-6 rounded-full bg-[#B88A5A] sm:w-10 lg:w-11"
        }
      />
      <span
        className={
          compact
            ? "h-[6px] w-[6px] rotate-45 bg-[#159AA9]"
            : "h-[7px] w-[7px] rotate-45 bg-[#159AA9]"
        }
      />
      <span
        className={
          compact
            ? "h-[2px] w-2.5 -translate-y-[3px] rounded-full bg-[#B88A5A]/90 sm:w-3 lg:w-4"
            : "h-[2px] w-3 -translate-y-[3px] rounded-full bg-[#B88A5A]/90 sm:w-4 lg:w-5"
        }
      />
    </span>
  );
}