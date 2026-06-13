"use client";

import { useRef, useEffect } from "react";

export default function AmbientLight({ className = "" }: { className?: string }): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const orbs = [
      { x: w * 0.25, y: h * 0.35, r: 350, rgb: "184,138,90", dx: 0.08, dy: 0.05, a: 0.08 },
      { x: w * 0.75, y: h * 0.55, r: 280, rgb: "21,154,169", dx: -0.06, dy: 0.1, a: 0.05 },
      { x: w * 0.55, y: h * 0.25, r: 220, rgb: "255,255,255", dx: 0.04, dy: -0.04, a: 0.03 },
    ];

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const o of orbs) {
        o.x += o.dx;
        o.y += o.dy;

        if (o.x < -o.r || o.x > w + o.r) o.dx *= -1;
        if (o.y < -o.r || o.y > h + o.r) o.dy *= -1;

        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, `rgba(${o.rgb},${o.a})`);
        g.addColorStop(0.5, `rgba(${o.rgb},${o.a * 0.4})`);
        g.addColorStop(1, `rgba(${o.rgb},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(o.x - o.r, o.y - o.r, o.r * 2, o.r * 2);
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-[1] ${className}`}
    />
  );
}
