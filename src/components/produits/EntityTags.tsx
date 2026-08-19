/**
 * EntityTags — renders a titled list of tag links (goals, topics, etc.).
 * Presentation-only. Server Component compatible.
 *
 * The parent provides translated labels and final hrefs.
 * This component owns no data logic, no product imports, no translations.
 */

import Link from "next/link";

type EntityTag = {
  label: string;
  href: string;
};

type EntityTagsProps = {
  title: string;
  tags: EntityTag[];
  variant?: "goal" | "topic";
};

const variantStyles: Record<"goal" | "topic", { bg: string; text: string; hover: string }> = {
  goal: {
    bg: "bg-[#B88A5A]/10",
    text: "text-[#B88A5A]",
    hover: "hover:bg-[#B88A5A]/15",
  },
  topic: {
    bg: "bg-[#0B1220]/[0.05]",
    text: "text-[#0B1220]/60",
    hover: "hover:bg-[#0B1220]/[0.08]",
  },
};

export default function EntityTags({
  title,
  tags,
  variant = "goal",
}: EntityTagsProps): React.JSX.Element | null {
  if (tags.length === 0) return null;

  const style = variantStyles[variant];

  return (
    <div>
      <h2 className="font-heading font-semibold text-lg text-[#0B1220] mb-4">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.href}
            href={tag.href}
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-mono transition-colors ${style.bg} ${style.text} ${style.hover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-1`}
          >
            {tag.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export type { EntityTag, EntityTagsProps };
