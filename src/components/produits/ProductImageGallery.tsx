"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types/product";

interface Props {
  images: ProductImage[];
  alt: string;
}

export default function ProductImageGallery({ images, alt }: Props): React.JSX.Element {
  const validImages = images.filter((img) => img.src);
  const [selected, setSelected] = useState(0);

  if (validImages.length === 0) {
    return (
      <div className="w-full lg:w-[45%] shrink-0">
        <div className="relative aspect-square overflow-hidden bg-[#E8E2D9] rounded-xl">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-[#0B1220]/[0.06]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  const selectedImage = validImages[selected];

  return (
    <div className="w-full lg:w-[45%] shrink-0">
      <div className="relative aspect-square overflow-hidden bg-[#E8E2D9] rounded-xl">
        <Image
          src={selectedImage.src}
          alt={selectedImage.alt || alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 45vw"
          priority
        />
      </div>

      {validImages.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
          {validImages.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelected(index)}
              className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] ${
                selected === index
                  ? "border-[#B88A5A]"
                  : "border-transparent hover:border-[#B88A5A]/50"
              }`}
              aria-label={`Image ${index + 1} sur ${validImages.length}`}
            >
              <Image
                src={img.src}
                alt={img.alt || alt}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
