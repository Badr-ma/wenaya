"use client";

import { useRef, useEffect } from "react";

export default function YoloMeshBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      time += 0.003;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cols = 5;
      const rows = 4;
      const cw = w / cols;
      const rh = h / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cw;
          const y = r * rh;
          const dx = Math.sin(time + r * 0.5 + c * 0.7) * 30;
          const dy = Math.cos(time + c * 0.4 + r * 0.6) * 25;

          const gradient = ctx.createRadialGradient(x + cw / 2 + dx, y + rh / 2 + dy, 0, x + cw / 2 + dx, y + rh / 2 + dy, cw * 0.6);
          gradient.addColorStop(0, `rgba(170, 65, 42, ${0.04 + Math.sin(time + r + c) * 0.02})`);
          gradient.addColorStop(0.5, `rgba(170, 65, 42, ${0.02 + Math.cos(time * 0.7 + r - c) * 0.01})`);
          gradient.addColorStop(1, "rgba(170, 65, 42, 0)");
          ctx.fillStyle = gradient;
          ctx.fillRect(x - 20, y - 20, cw + 40, rh + 40);
        }
      }

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
}
