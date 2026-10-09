"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}

export default function PracticeHeroImage({ src, alt, sizes, className }: Props) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority
      sizes={sizes}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
