"use client";

import { useEffect, useRef, useState } from "react";

/* --- Journey step definitions ------------------------------------ */
const STEPS = [
  {
    number: "01",
    title: "Discovery",
    description: "We understand the business, users, workflows and product goals.",
    align: "bottom" as const,
    xPct: 7,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 lg:h-5 lg:w-5" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Strategy & Blueprint",
    description: "We define scope, architecture, technology direction and delivery plan.",
    align: "top" as const,
    xPct: 21,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 lg:h-5 lg:w-5" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "UI/UX Design",
    description: "We design user experience, interfaces and product flows before engineering.",
    align: "bottom" as const,
    xPct: 35,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 lg:h-5 lg:w-5" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 19l7-7 3 3-7 7-3-3z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Engineering",
    description: "We build using scalable frontend, backend, database and API architecture.",
    align: "top" as const,
    xPct: 50,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 lg:h-5 lg:w-5" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="8 6 2 12 8 18" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Testing & Review",
    description: "We test workflows, responsiveness, integrations and real-world usage scenarios.",
    align: "bottom" as const,
    xPct: 65,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 lg:h-5 lg:w-5" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="9 12 11 14 15 10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "06",
    title: "Launch",
    description: "We prepare deployment, production configuration and release the product.",
    align: "top" as const,
    xPct: 79,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 lg:h-5 lg:w-5" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 01-3.95 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "07",
    title: "Support & Growth",
    description: "We continue with improvements, maintenance, optimization and new capabilities.",
    align: "bottom" as const,
    xPct: 93,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 lg:h-5 lg:w-5" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M23 4v6h-6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const PATH_D =
  "M 50 175 C 120 55, 145 55, 215 55 C 285 55, 300 175, 360 175 C 420 175, 440 55, 505 55 C 570 55, 585 175, 650 175 C 715 175, 730 55, 795 55 C 860 55, 875 175, 950 175";

export default function ProcessJourney() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [pathLength, setPathLength] = useState(1200);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    if (mq.matches) {
      setProgress(1);
      setActiveStep(6);
      return;
    }
    if (pathRef.current) {
      try {
        const len = pathRef.current.getTotalLength();
        if (len > 0) setPathLength(len);
      } catch {
        /* fallback */
      }
    }
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // Mobile: smoothly track scroll through the vertical timeline
        const total = rect.height;
        const visible = vh - rect.top;
        const raw = Math.max(0, Math.min(1, (visible - 150) / (total - 100)));
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          setProgress(raw);
          setActiveStep(Math.min(6, Math.floor(raw * 7)));
        });
        return;
      }

      // Desktop: calibrated sticky scroll travel (380px)
      const scrollable = rect.height - vh;
      if (scrollable <= 0) return;
      const raw = Math.max(0, Math.min(1, -rect.top / scrollable));
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setProgress(raw);
        setActiveStep(Math.min(6, Math.floor(raw * 7)));
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  const pct = Math.round(progress * 100);

  return (
    <div
      ref={containerRef}
      id="process"
      className="relative bg-[#F8F9FC] border-y border-[#E1E7F0]"
      style={
        !reduceMotion
          ? { minHeight: "calc(100vh + 140px)" }
          : undefined
      }
    >
      {/* 
        Sticky canvas on desktop: centered vertically in viewport.
        Natural flowing section on mobile.
      */}
      <div className="relative z-10 flex flex-col justify-center px-5 pt-16 pb-16 md:sticky md:top-0 md:h-[100dvh] md:min-h-[640px] md:overflow-hidden md:pt-20 md:pb-20">

        {/* Section header */}
        <div className="mx-auto w-full max-w-[1140px]">
          <p className="font-mono text-xs font-bold uppercase tracking-[.22em] text-[#FF4A17]">
            HOW WE BUILD
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#0B1220] sm:text-4xl md:text-5xl">
            From Idea to Production
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#556078] sm:text-base md:mt-6">
            Every ZentoviaTech product moves through a structured engineering journey — from discovery to launch and continuous improvement.
          </p>
        </div>

        {/* Desktop & Tablet horizontal journey */}
        <div className="relative mx-auto mt-10 hidden w-full max-w-[1140px] md:block md:mt-12 lg:mt-14">
          <div className="relative h-[270px] w-full select-none lg:h-[300px]">
            <svg
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 1000 240"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="zt-journey-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF4A17" />
                  <stop offset="50%" stopColor="#0B1220" />
                  <stop offset="100%" stopColor="#FF4A17" />
                </linearGradient>
              </defs>

              {/* Muted base track */}
              <path
                d={PATH_D}
                fill="none"
                stroke="#DDE3EE"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Animated orange progress overlay */}
              <path
                ref={pathRef}
                d={PATH_D}
                fill="none"
                stroke="url(#zt-journey-grad)"
                strokeWidth="4.5"
                strokeLinecap="round"
                style={{
                  strokeDasharray: pathLength,
                  strokeDashoffset: pathLength * (1 - progress),
                  transition: reduceMotion ? "none" : "stroke-dashoffset 120ms linear",
                  filter: "drop-shadow(0 0 5px rgba(255,74,23,0.5))",
                }}
              />
            </svg>

            {/* Step nodes + cards */}
            {STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              const isPast = activeStep > idx;

              return (
                <div
                  key={step.number}
                  className="absolute -translate-x-1/2 -translate-y-1/2 select-none"
                  style={{
                    left: `${step.xPct}%`,
                    top: step.align === "top" ? "23%" : "73%",
                  }}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Marker */}
                    <div
                      className={`relative z-10 grid h-9 w-9 place-items-center rounded-xl border-2 transition-all duration-500 lg:h-10 lg:w-10 lg:rounded-2xl ${
                        isActive
                          ? "border-[#FF4A17] bg-[#0B1220] text-[#FF4A17]"
                          : isPast
                          ? "border-[#FF4A17]/50 bg-[#FFF1EC] text-[#FF4A17]"
                          : "border-[#DDE3EE] bg-white text-[#A0AABB]"
                      }`}
                      style={
                        isActive && !reduceMotion
                          ? {
                              boxShadow:
                                "0 0 0 7px rgba(255,74,23,0.15), 0 8px 24px rgba(255,74,23,0.28)",
                              transform: "scale(1.1)",
                            }
                          : undefined
                      }
                    >
                      {step.icon}
                      {isActive && !reduceMotion && (
                        <span className="absolute inset-0 rounded-xl border-2 border-[#FF4A17] animate-ping opacity-30 pointer-events-none lg:rounded-2xl" />
                      )}
                    </div>

                    {/* Card */}
                    <div
                      className={`absolute w-[135px] rounded-xl border p-2.5 text-center transition-all duration-500 lg:w-[155px] lg:rounded-2xl lg:p-3 ${
                        step.align === "top"
                          ? "top-[calc(100%+12px)] lg:top-[calc(100%+16px)]"
                          : "bottom-[calc(100%+12px)] lg:bottom-[calc(100%+16px)]"
                      } ${
                        isActive
                          ? "z-20 border-[#FF4A17] bg-[#0B1220] text-white shadow-[0_14px_36px_rgba(11,18,32,0.20)] scale-[1.03]"
                          : isPast
                          ? "border-[#E1E7F0] bg-white text-[#0B1220] shadow-sm"
                          : "border-transparent bg-white/60 text-[#8A96AA] opacity-50"
                      }`}
                    >
                      <span
                        className={`font-mono text-[8px] font-extrabold uppercase tracking-widest lg:text-[9px] ${
                          isActive ? "text-[#FF4A17]" : "text-[#A0AABB]"
                        }`}
                      >
                        STEP {step.number}
                      </span>
                      <h3 className="mt-0.5 text-[11px] font-extrabold leading-snug lg:text-xs">
                        {step.title}
                      </h3>
                      <p
                        className={`mt-1 text-[9px] leading-snug lg:text-[10px] ${
                          isActive ? "text-white/70" : "text-[#6B778A]"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="relative mx-auto mt-8 block w-full max-w-lg md:hidden">
          <div className="relative ml-4 border-l-2 border-[#DDE3EE] pl-7 flex flex-col gap-4">
            {STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              const isPast = activeStep > idx;
              return (
                <div key={step.number} className="relative">
                  <div
                    className={`absolute -left-[41px] top-3 grid h-7 w-7 place-items-center rounded-lg border-2 text-xs font-bold transition-all duration-400 ${
                      isActive
                        ? "border-[#FF4A17] bg-[#0B1220] text-[#FF4A17] shadow-[0_0_0_4px_rgba(255,74,23,0.15)]"
                        : isPast
                        ? "border-[#FF4A17]/50 bg-[#FFF1EC] text-[#FF4A17]"
                        : "border-[#DDE3EE] bg-white text-[#A0AABB]"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div
                    className={`rounded-xl border p-3.5 transition-all duration-400 ${
                      isActive
                        ? "border-[#FF4A17] bg-[#0B1220] text-white shadow-md"
                        : "border-[#E1E7F0] bg-white text-[#0B1220]"
                    }`}
                  >
                    <span className="font-mono text-[9px] font-extrabold uppercase tracking-widest text-[#FF4A17]">
                      STAGE {step.number}
                    </span>
                    <h3 className="mt-0.5 text-xs font-extrabold">{step.title}</h3>
                    <p
                      className={`mt-1 text-[11px] leading-relaxed ${
                        isActive ? "text-white/70" : "text-[#556078]"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress footer — directly 32-40px below the journey */}
        <div className="mx-auto mt-8 w-full max-w-[1140px] flex items-center justify-between border-t border-[#E1E7F0] pt-4 md:mt-10 md:pt-5">
          <div className="flex items-center gap-2 font-mono text-xs text-[#8A96AA]">
            {!reduceMotion && (
              <span className="animate-bounce text-[#FF4A17]" aria-hidden="true">↓</span>
            )}
            <span>Scroll to explore the journey</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-[#E1E7F0] sm:w-44">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF4A17] to-[#0B1220] transition-all duration-150"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-mono text-xs font-extrabold text-[#0B1220] min-w-[34px]">
              {pct}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
