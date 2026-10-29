"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  value: string;
  label: string;
  description?: string;
  className?: string;
  isCard?: boolean;
};

export default function AnimatedCounter({
  value,
  label,
  description,
  className = "",
  isCard = false,
}: AnimatedCounterProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [displayValue, setDisplayValue] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasAnimated) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setDisplayValue(value);
      setHasAnimated(true);
      return;
    }

    // Parse value: e.g. "155+" -> prefix "", target 155, suffix "+"
    // e.g. "4.9" -> prefix "", target 4.9, suffix ""
    // e.g. "99.9%" -> prefix "", target 99.9, suffix "%"
    const match = value.match(/^([^0-9.]*)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      setHasAnimated(true);
      return;
    }

    const prefix = match[1] || "";
    const targetNum = parseFloat(match[2]);
    const suffix = match[3] || "";
    const isDecimal = match[2].includes(".");
    const decimalPlaces = isDecimal ? (match[2].split(".")[1]?.length || 1) : 0;
    const padWithZero = match[2].startsWith("0") && match[2].length === 2;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setHasAnimated(true);
        observer.disconnect();

        const duration = 1600; // 1.6s
        const startTime = performance.now();

        const updateCount = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Cubic ease-out
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const current = targetNum * easeProgress;

          let formattedNum = isDecimal
            ? current.toFixed(decimalPlaces)
            : Math.floor(current).toString();

          if (padWithZero && parseInt(formattedNum, 10) < 10) {
            formattedNum = `0${formattedNum}`;
          }

          setDisplayValue(`${prefix}${formattedNum}${suffix}`);

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            setDisplayValue(value);
          }
        };

        requestAnimationFrame(updateCount);
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  if (isCard) {
    return (
      <div
        ref={containerRef}
        className={`group relative flex h-full flex-col justify-between rounded-[22px] border-t-2 border-t-[#FF4A17] border border-white/10 bg-white/95 p-6 text-[#0B1220] shadow-[0_8px_24px_rgba(11,18,32,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-t-[#FF4A17] hover:shadow-[0_12px_32px_rgba(11,18,32,0.12)] ${className}`}
      >
        <div>
          <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#0B1220]">
            {displayValue}
          </div>
          <div className="mt-2 text-sm font-bold text-[#0B1220]">{label}</div>
          {description && (
            <div className="mt-1 text-xs text-[#556078] leading-relaxed">
              {description}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      <div className="text-2xl font-black tracking-tight sm:text-3xl text-white">
        {displayValue}
      </div>
      <div className="mt-1 text-xs text-white/50">{label}</div>
    </div>
  );
}
