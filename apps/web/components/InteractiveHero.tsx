"use client";

import { useEffect, useRef } from "react";

export default function InteractiveHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement as HTMLElement | null;

    if (!canvas || !hero) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let animationFrame = 0;

    const pointer = {
      x: -9999,
      y: -9999,
    };

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
    };

    let particles: Particle[] = [];

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(70, Math.max(24, Math.floor(width / 12)));

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      }));
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();

      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      context.lineWidth = 1;
      context.strokeStyle = "rgba(255,255,255,0.035)";

      for (let x = 0; x < width; x += 48) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }

      for (let y = 0; y < height; y += 48) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      particles.forEach((particle, index) => {
        if (!reduceMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0 || particle.x > width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > height) particle.vy *= -1;

          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared < 14000) {
            particle.x += dx * 0.02;
            particle.y += dy * 0.02;
          }
        }

        context.fillStyle = "rgba(255,122,77,0.8)";
        context.beginPath();
        context.arc(particle.x, particle.y, 1.8, 0, Math.PI * 2);
        context.fill();

        for (let next = index + 1; next < particles.length; next += 1) {
          const other = particles[next];
          const distance = Math.hypot(
            particle.x - other.x,
            particle.y - other.y,
          );

          if (distance < 110) {
            context.strokeStyle = `rgba(255,74,23,${0.25 * (1 - distance / 110)})`;
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }
      });

      if (!reduceMotion) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    resize();

    hero.addEventListener("pointermove", handlePointerMove);
    hero.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", resize);

    draw();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", resize);
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
