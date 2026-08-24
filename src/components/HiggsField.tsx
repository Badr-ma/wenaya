/**
 * HiggsField — interactive particle field visualization used as a background effect.
 * Renders animated particles that respond to mouse movement on a canvas element.
 * Used inside the PratiquesGrid for visual flair.
 */
"use client";

import { useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  phase: number;
  frequency: number;
  connections: number;
}

export default function HiggsField({ className = "", parentRef, palette: customPalette }: { className?: string; parentRef?: React.RefObject<HTMLElement | null>; palette?: [number, number, number][] }): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, rawX: 0, rawY: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const getSize = () => {
      if (parentRef?.current) {
        const rect = parentRef.current.getBoundingClientRect();
        return { w: rect.width, h: rect.height };
      }
      return { w: window.innerWidth, h: window.innerHeight };
    };
    let { w, h } = getSize();
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const palette = customPalette ?? [
      [184, 138, 90],
      [21, 154, 169],
      [170, 65, 42],
    ];

    const particles: Particle[] = [];
    const count = Math.min(80, Math.floor((w * h) / 18000));

    for (let i = 0; i < count; i++) {
      const mass = 0.2 + Math.random() * 1.8;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        mass,
        radius: 1 + mass * 1.2,
        phase: Math.random() * Math.PI * 2,
        frequency: 0.2 + Math.random() * 0.8,
        connections: 0,
      });
    }

    const onMouse = (e: Event) => {
      const me = e as MouseEvent;
      mouseRef.current.active = true;
      mouseRef.current.rawX = me.clientX;
      mouseRef.current.rawY = me.clientY;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };

    const eventTarget = parentRef?.current || window;
    eventTarget.addEventListener("mousemove", onMouse);
    eventTarget.addEventListener("mouseleave", onLeave);

    let animId: number;
    let isVisible = true;
    let isRunning = false;

    const startLoop = () => {
      if (isRunning) return;
      isRunning = true;
      draw();
    };
    const stopLoop = () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) startLoop();
      else stopLoop();
    });
    observer.observe(canvas);

    const draw = () => {
      if (!isVisible) { isRunning = false; return; }
      ctx.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;
      if (mouse.active) {
        if (parentRef?.current) {
          const rect = parentRef.current.getBoundingClientRect();
          mouse.x = mouse.rawX - rect.left;
          mouse.y = mouse.rawY - rect.top;
        } else {
          mouse.x = mouse.rawX;
          mouse.y = mouse.rawY;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const drag = 0.98 + (p.mass - 0.2) * 0.015;
        p.vx *= drag;
        p.vy *= drag;

        p.vx += Math.sin(p.phase + performance.now() * 0.0003 * p.frequency) * 0.008;
        p.vy += Math.cos(p.phase + performance.now() * 0.0004 * p.frequency) * 0.008;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 250) {
            const force = (1 - dist / 250) * 0.6 * (1 - p.mass * 0.3);
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
          }
        }

        if (Math.random() < 0.002) {
          p.vx += (Math.random() - 0.5) * 0.4;
          p.vy += (Math.random() - 0.5) * 0.4;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -50) p.x = w + 50;
        if (p.x > w + 50) p.x = -50;
        if (p.y < -50) p.y = h + 50;
        if (p.y > h + 50) p.y = -50;

        const colorIdx = Math.floor(p.mass * palette.length) % palette.length;
        const [r, g, b] = palette[colorIdx];
        const alpha = 0.15 + p.mass * 0.2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();

        if (p.mass > 1.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.15})`;
          ctx.fill();
        }

        p.connections = 0;
      }

      // Connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.08 * Math.min(a.mass, b.mass);
            if (alpha > 0.005) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              const [cr, cg, cb] = palette[0];
              ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`;
              ctx.lineWidth = 0.4;
              ctx.stroke();
              a.connections++;
              b.connections++;
            }
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    startLoop();

    const resize = () => {
      const size = getSize();
      w = size.w;
      h = size.h;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", resize);

    return () => {
      stopLoop();
      observer.disconnect();
      eventTarget.removeEventListener("mousemove", onMouse);
      eventTarget.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
    };
    // customPalette is intentionally read only at mount — adding it would reinitialize particles on every palette change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentRef]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-[1] ${className}`}
    />
  );
}
