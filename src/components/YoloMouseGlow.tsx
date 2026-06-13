"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function MouseGlow(): React.JSX.Element {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handle = (e: MouseEvent) => setPos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return (
    <>
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#AA412A]/10 to-transparent blur-[120px] pointer-events-none"
        animate={{ left: `${20 + pos.x * 60}%`, top: `${20 + pos.y * 60}%` }}
        transition={{ type: "spring", damping: 30, stiffness: 50, mass: 0.5 }}
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-br from-white/[0.03] to-transparent blur-[100px] pointer-events-none"
        animate={{ left: `${80 - pos.x * 40}%`, top: `${80 - pos.y * 40}%` }}
        transition={{ type: "spring", damping: 25, stiffness: 40, mass: 0.8 }}
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </>
  );
}

export default MouseGlow;
