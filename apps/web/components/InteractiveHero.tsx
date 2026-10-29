"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  green: boolean;
};

export default function InteractiveHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement as HTMLElement | null;
    if (!canvas || !hero) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionQuery.matches;
    let visible = true;
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastFrame = 0;
    let particles: Particle[] = [];
    const pointer = { x: -10000, y: -10000 };

    const stop = () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const start = () => {
      if (!frame && !reduceMotion && visible) {
        frame = window.requestAnimationFrame(draw);
      }
    };

    const render = (time: number) => {
      context.clearRect(0, 0, width, height);

      context.strokeStyle = "rgba(255,255,255,0.04)";
      context.lineWidth = 1;
      context.beginPath();
      for (let x = 0; x < width; x += 52) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 52) {
        context.moveTo(0, y);
        context.lineTo(width, y);
      }
      context.stroke();

      particles.forEach((p, index) => {
        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
          if (p.x > width) { p.x = width; p.vx = -Math.abs(p.vx); }
          if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
          if (p.y > height) { p.y = height; p.vy = -Math.abs(p.vy); }

          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0 && dist < 115) {
            const force = ((115 - dist) / 115) * 0.012;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
          p.vx = Math.max(-0.42, Math.min(0.42, p.vx));
          p.vy = Math.max(-0.42, Math.min(0.42, p.vy));
        }

        const shimmer = reduceMotion ? 0.65 : 0.72 + Math.sin(time * 0.0015 + p.phase) * 0.22;
        const color = p.green ? "74,222,128" : "255,122,77";

        // cheap glow: soft halo + core
        context.fillStyle = `rgba(${color},${0.14 * shimmer})`;
        context.beginPath();
        context.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = `rgba(${color},${0.95 * shimmer})`;
        context.beginPath();
        context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        context.fill();

        for (let n = index + 1; n < particles.length; n += 1) {
          const o = particles[n];
          const d = Math.hypot(p.x - o.x, p.y - o.y);
          if (d >= 112) continue;

          const opacity = (1 - d / 112) * 0.2;
          context.strokeStyle =
            p.green || o.green
              ? `rgba(74,222,128,${opacity})`
              : `rgba(255,122,77,${opacity})`;
          context.lineWidth = 0.8;
          context.beginPath();
          context.moveTo(p.x, p.y);
          context.lineTo(o.x, o.y);
          context.stroke();
        }
      });
    };

    function draw(time = 0) {
      frame = 0;
      if (time - lastFrame >= 28 || lastFrame === 0) {
        lastFrame = time;
        render(time);
      }
      start();
    }

    const resize = () => {
      stop();
      const rect = hero.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(64, Math.max(20, Math.floor(width / (width < 640 ? 17 : 14))));
      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.34,
        radius: 1 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        green: i % 4 === 0,
      }));

      lastFrame = 0;
      render(0);
      start();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const rect = hero.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };

    const onLeave = () => {
      pointer.x = -10000;
      pointer.y = -10000;
    };

    const onMotionChange = (e: MediaQueryListEvent) => {
      reduceMotion = e.matches;
      stop();
      render(0);
      start();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hero);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    visibilityObserver.observe(hero);

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
