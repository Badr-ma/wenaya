"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

export default function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    // Preserve fragment ("#hash") destinations: the browser / Next.js already
    // scrolls to the targeted element, so resetting to top here would race and
    // win over it. Only force top for plain (hash-less) route changes.
    if (typeof window !== "undefined" && window.location.hash) return;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
}
