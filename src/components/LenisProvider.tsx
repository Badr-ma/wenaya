/**
 * Lenis Smooth Scroll Provider — wraps children in ReactLenis for buttery-smooth
 * scroll behavior. Configured with 1.2s duration and exponential easing.
 */
"use client";

import { type ReactNode } from "react";
import { ReactLenis } from "lenis/react";

export default function LenisProvider({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2, // Scroll animation duration in seconds
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out
        orientation: "vertical",
        smoothWheel: true, // Enable smooth wheel scrolling
      }}
    >
      {children}
    </ReactLenis>
  );
}
