/**
 * HomecareSectionHeading — tiny presentational primitive: eyebrow (bronze
 * small-caps) + a short bronze rule above a heading-serif section title.
 * Shared by every major Homecare section so the title decoration is identical.
 * Server-safe (static, no animation). Light (navy title) / dark (white title).
 */
interface HomecareSectionHeadingProps {
  eyebrow?: string;
  children: React.ReactNode;
  variant?: "light" | "dark";
  className?: string;
  style?: React.CSSProperties;
}

export default function HomecareSectionHeading({
  eyebrow,
  children,
  variant = "light",
  className = "",
  style,
}: HomecareSectionHeadingProps): React.JSX.Element {
  const titleColor = variant === "dark" ? "text-white" : "text-[#0B1220]";
  return (
    <div>
      {eyebrow ? (
        <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
          {eyebrow}
        </span>
      ) : null}
      <span
        aria-hidden="true"
        className="block h-[2px] w-9 sm:w-12 bg-[#B88A5A] mb-4"
      />
      <h2
        className={`heading-serif ${titleColor} leading-[1.08] ${className}`}
        style={style}
      >
        {children}
      </h2>
    </div>
  );
}
