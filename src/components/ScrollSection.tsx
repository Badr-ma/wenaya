"use client";

import { createContext, useContext, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* ─── Context ─── */

const ScrollProgressCtx = createContext<MotionValue<number> | null>(null);

export function useSectionProgress() {
  return useContext(ScrollProgressCtx);
}

/* ─── Stagger variants ─── */

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 20, stiffness: 90 } },
};

export const fadeIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, damping: 22, stiffness: 100 } },
};

/* ─── Parallax child ─── */

export function ParallaxLayer({
  children,
  yOffset = [0, -60],
  className = "",
}: {
  children: React.ReactNode;
  yOffset?: [number, number];
  className?: string;
}) {
  const progress = useSectionProgress();
  const y = progress ? useTransform(progress, [0, 1], yOffset) : 0;

  return (
    <motion.div style={{ y, willChange: "transform" }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── ScrollSection ─── */

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  scaleRange?: [number, number, number];
  yRange?: [number, number, number];
  xRange?: [number, number, number];
  rotateRange?: [number, number, number];
  opacityRange?: [number, number, number];
}

export default function ScrollSection({
  children,
  className = "",
  scaleRange = [1, 1, 0.85],
  yRange = [0, 0, -100],
  xRange,
  rotateRange,
  opacityRange = [1, 1, 0],
}: ScrollSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], scaleRange);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], yRange);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], opacityRange);
  const x = xRange ? useTransform(scrollYProgress, [0, 0.5, 1], xRange) : 0;
  const rotate = rotateRange ? useTransform(scrollYProgress, [0, 0.5, 1], rotateRange) : 0;

  return (
    <motion.div
      ref={ref}
      style={{ scale, y, x, rotate, opacity, willChange: "transform" }}
      className={className}
    >
      <ScrollProgressCtx.Provider value={scrollYProgress}>
        {children}
      </ScrollProgressCtx.Provider>
    </motion.div>
  );
}
