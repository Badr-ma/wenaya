interface SubtitleSplitProps {
  text: string;
  bronze: string;
  darkClass?: string;
  bronzeClass?: string;
}

export default function SubtitleSplit({
  text,
  bronze,
  darkClass = "text-[#2B2F36]",
  bronzeClass = "text-[#B88A5A]",
}: SubtitleSplitProps) {
  const idx = bronze && text.endsWith(bronze) ? text.length - bronze.length : -1;
  if (idx <= 0) return <span className={darkClass}>{text}</span>;
  return (
    <>
      <span className={darkClass}>{text.slice(0, idx)}</span>
      <span className={bronzeClass}>{text.slice(idx)}</span>
    </>
  );
}