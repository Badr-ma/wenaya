/**
 * Care journey section renderer — applies the editorial TREATMENTS (A/B/C/D/E)
 * to the shared article content. The text itself is never changed: each
 * treatment only changes the visual container around the exact same
 * `JourneyContent` blocks, so full content preservation is guaranteed by
 * construction.
 *
 *   A — text left + visual right (a secondary contextual image)
 *   B — wide editorial prose: oversized H2 + bronze rule
 *   C — navy editorial break (inset dark panel, one per long page)
 *   D — structured/list content with strong typography + generous spacing
 *   E — closing "Conclusion" band
 *
 * Every block carries an `id="section-{index}"` anchor so the sticky journey
 * nav can jump to it.
 */
import Image from "next/image";
import type { CareJourney, JourneySection } from "@/lib/care-journeys";
import { JourneyContent } from "./CareJourneyContent";
import type { JourneyPresentation } from "@/lib/care-journey-presentation";

function isConclusion(heading: string): boolean {
  const h = heading.trim();
  return h === "Conclusion" || h.toLowerCase().startsWith("conclusion");
}

/** Branded H2: bronze rule above a large serif heading. No visible numbering. */
function SectionHeading({
  children,
  dark = false,
  centered = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "flex flex-col items-center text-center" : ""}>
      <span
        aria-hidden="true"
        className="mb-5 block h-[2px] w-9 sm:w-12 bg-[#B88A5A]"
      />
      <h2
        className={[
          "heading-serif leading-[1.06] tracking-[-0.015em]",
          dark ? "text-white" : "text-[#0B1220]",
        ].join(" ")}
        style={{ fontSize: "clamp(1.8rem, 3.4vw, 3rem)" }}
      >
        {children}
      </h2>
    </div>
  );
}

interface Props {
  journey: CareJourney;
  section: JourneySection;
  index: number;
  presentation: JourneyPresentation;
}

export default function CareJourneySection({
  journey,
  section,
  index,
  presentation,
}: Props) {
  const heading = section.heading;
  const anchorId = `section-${index}`;

  if (!heading) {
    return (
      <div id={anchorId} className="scroll-mt-28">
        <div className="max-w-[760px]">
          <JourneyContent blocks={section.blocks} />
        </div>
      </div>
    );
  }

  // ── TYPE C: navy editorial break (inset dark panel) ────────────────
  if (presentation.breakIndex === index) {
    return (
      <div
        id={anchorId}
        data-section-bg="dark"
        className="scroll-mt-28 rounded-[24px] bg-[#0B1220] p-8 sm:p-12"
      >
        <SectionHeading dark>{heading}</SectionHeading>
        <div className="mt-8">
          <JourneyContent blocks={section.blocks} variant="dark" />
        </div>
      </div>
    );
  }

  const lastIndex = journey.sections.length - 1;

  // ── TYPE E: closing "Conclusion" band ──────────────────────────────
  if (index === lastIndex && isConclusion(heading)) {
    return (
      <div
        id={anchorId}
        className="scroll-mt-28 rounded-[24px] bg-[#FAF8F4] p-8 sm:p-12"
      >
        <div className="mx-auto max-w-[820px]">
          <SectionHeading centered>{heading}</SectionHeading>
          <div className="mt-8">
            <JourneyContent blocks={section.blocks} />
          </div>
        </div>
      </div>
    );
  }

  const placementImage = presentation.imagePlacements?.[index];

  // ── TYPE A: text left + visual right ───────────────────────────────
  if (placementImage) {
    return (
      <div id={anchorId} className="scroll-mt-28">
        <div className="grid gap-10 md:grid-cols-2 lg:gap-14 items-start">
          <div>
            <SectionHeading>{heading}</SectionHeading>
            <div className="mt-8">
              <JourneyContent blocks={section.blocks} />
            </div>
          </div>
          <div className="md:sticky md:top-24">
            <div className="relative overflow-hidden rounded-t-[24px] rounded-b-md bg-[#0B1220]">
              <Image
                src={placementImage}
                alt=""
                width={900}
                height={1100}
                sizes="(max-width: 1023px) 100vw, 40vw"
                className="h-auto w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasList = section.blocks.some((b) => b.type === "list");

  // ── TYPE D (list) / TYPE B (prose): strong typography, wide ────────
  return (
    <div id={anchorId} className="scroll-mt-28">
      <div className={hasList ? "max-w-[900px]" : "max-w-[820px]"}>
        <SectionHeading>{heading}</SectionHeading>
        <div className="mt-8">
          <JourneyContent blocks={section.blocks} />
        </div>
      </div>
    </div>
  );
}
