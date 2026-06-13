"use client";

import { type ReactNode } from "react";
import { ReactLenis } from "lenis/react";

export default function LenisProvider({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
