"use client";

import { useState } from "react";

type TechItem = {
  name: string;
  category: string;
  logo: React.ReactNode;
};

/* ─── Authentic Vector SVG Logos for Technologies ─────────── */
const TECH_LOGOS: Record<string, React.ReactNode> = {
  Flutter: (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0">
      <path d="M14.28 2.34L4.76 11.86L7.9 15L20.56 2.34H14.28Z" fill="#54C5F8" />
      <path d="M14.24 11.58L9.08 16.74L12.22 19.88L15.38 16.72L20.54 11.58H14.24Z" fill="#29B6F6" />
      <path d="M12.22 19.88L14.26 21.92H20.54L15.38 16.72L12.22 19.88Z" fill="#01579B" />
      <path d="M9.08 16.74L12.22 19.88L15.38 16.72L12.22 13.56L9.08 16.74Z" fill="#0288D1" />
    </svg>
  ),
  "Next.js": (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0">
      <circle cx="12" cy="12" r="10" fill="#000000" />
      <path d="M14.9 16.5L9.2 9.1V16.5H7.5V7.5H9.2L14.9 14.9V7.5H16.6V16.5H14.9Z" fill="#FFFFFF" />
      <path d="M13.5 12L15.5 14.6V7.5H16.6V16L13.5 12Z" fill="url(#next-grad)" />
      <defs>
        <linearGradient id="next-grad" x1="12" y1="7.5" x2="16.6" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  ),
  React: (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0">
      <circle cx="12" cy="12" r="2.2" fill="#61DAFB" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.4" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#61DAFB" strokeWidth="1.4" transform="rotate(120 12 12)" />
    </svg>
  ),
  "Node.js": (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0">
      <path d="M12 2L3.5 7V17L12 22L20.5 17V7L12 2Z" fill="#339933" />
      <path d="M12 4.2L18.6 8V16L12 19.8L5.4 16V8L12 4.2Z" fill="#339933" />
      <path d="M12 7.5C9.5 7.5 8 8.8 8 10.5C8 13.5 13 12 13 14C13 14.8 12.2 15.2 11 15.2C9.5 15.2 8.5 14.5 8.2 13.5H6.5C6.8 15.8 8.6 16.8 11 16.8C13.5 16.8 15 15.4 15 13.8C15 10.8 10 12 10 10.2C10 9.5 10.8 9 11.8 9C13 9 14 9.6 14.2 10.5H16C15.7 8.5 14 7.5 12 7.5Z" fill="#FFFFFF" />
    </svg>
  ),
  NestJS: (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-5h2v5zm0-7h-2V7.5h2V9.5z" fill="#E0234E" />
      <path d="M18.8 7.2L12.5 3.5c-.3-.2-.7-.2-1 0L5.2 7.2c-.3.2-.5.5-.5.8v7.5c0 .4.2.7.5.8l6.3 3.7c.3.2.7.2 1 0l6.3-3.7c.3-.2.5-.5.5-.8V8c0-.3-.2-.6-.5-.8z" fill="#EA2845" />
      <path d="M12 6.5l4.5 2.6v5.2L12 16.9l-4.5-2.6V9.1L12 6.5z" fill="#FFFFFF" />
    </svg>
  ),
  PostgreSQL: (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.8 16.2c-2.3 0-3.8-1.4-3.8-3.3 0-2.3 2.1-3.2 4.2-3.2.6 0 1.2.1 1.7.2v-.4c0-1.1-.7-1.7-1.9-1.7-1 0-1.9.3-2.5.7l-.6-1.3c.9-.6 2.1-.9 3.5-.9 2.3 0 3.6 1.2 3.6 3.3v4.9h-1.6v-1.1c-.6.8-1.5 1.2-2.6 1.2zm.4-1.5c1.1 0 2-.6 2.4-1.4v-1.2c-.4-.1-.9-.2-1.4-.2-1.3 0-2.5.5-2.5 1.7 0 .8.6 1.1 1.5 1.1z" fill="#336791" />
    </svg>
  ),
  Firebase: (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0">
      <path d="M3.89 15.67L6.44 2.58C6.5-.02 9.87-.71 10.74 1.7L12.91 8.24" fill="#FFCA28" />
      <path d="M13.84 4.88L15.61 8.24L20.11 15.67L14.77 2.18C14.28.93 12.5.95 12.04 2.21" fill="#FFA000" />
      <path d="M3.89 15.67L12 20.33L20.11 15.67L16.29 8.24L12 12.53L7.71 8.24" fill="#F57C00" />
      <path d="M12 20.33L3.89 15.67L10.74 1.7C9.87-.71 6.5-.02 6.44 2.58L3.89 15.67Z" fill="#FFCA28" />
    </svg>
  ),
  Python: (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0">
      <path d="M11.88 2c-5.1 0-4.8 2.22-4.8 2.22l.01 2.3H12v.69H5.16S2 6.8 2 11.95c0 5.16 2.76 4.97 2.76 4.97h1.65v-2.34s-.09-2.76 2.72-2.76h4.67s2.63.05 2.63-2.58V4.6S16.98 2 11.88 2zm-2.6 1.48a.9.9 0 110 1.8.9.9 0 010-1.8z" fill="#3776AB" />
      <path d="M12.12 22c5.1 0 4.8-2.22 4.8-2.22l-.01-2.3H12v-.69h6.84s3.16.41 3.16-4.74c0-5.16-2.76-4.97-2.76-4.97h-1.65v2.34s.09 2.76-2.72 2.76h-4.67s-2.63-.05-2.63 2.58v4.63S7.02 22 12.12 22zm2.6-1.48a.9.9 0 110-1.8.9.9 0 010 1.8z" fill="#FFD43B" />
    </svg>
  ),
  TypeScript: (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0">
      <rect width="24" height="24" rx="4" fill="#3178C6" />
      <path d="M11.4 17.5h-1.8v-7.3H7.2V8.7h6.6v1.5h-2.4v7.3zm2.5-.2c.7.4 1.6.7 2.6.7 1.6 0 2.4-.7 2.4-1.7 0-1.1-.8-1.6-2.3-2.1-1.8-.7-2.7-1.4-2.7-2.9 0-1.7 1.4-2.8 3.5-2.8 1.1 0 1.9.2 2.5.5l-.5 1.4c-.5-.3-1.2-.5-2-.5-1.2 0-1.9.6-1.9 1.4 0 .9.7 1.4 2.2 1.9 1.9.7 2.8 1.5 2.8 3 0 1.8-1.4 3-3.8 3-1.2 0-2.3-.3-3-.7l.4-1.5z" fill="#FFFFFF" />
    </svg>
  ),
  JavaScript: (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0">
      <rect width="24" height="24" rx="4" fill="#F7DF1E" />
      <path d="M12.8 17.6c.6.4 1.4.7 2.3.7 1.3 0 2.1-.6 2.1-1.5 0-1-.7-1.4-2.1-1.9-1.6-.6-2.4-1.3-2.4-2.6 0-1.5 1.2-2.5 3.1-2.5 1 0 1.7.2 2.2.5l-.5 1.3c-.4-.2-1-.4-1.7-.4-1.1 0-1.6.5-1.6 1.2 0 .8.6 1.2 1.9 1.7 1.7.6 2.5 1.3 2.5 2.7 0 1.6-1.3 2.7-3.4 2.7-1.1 0-2.1-.3-2.7-.7l.3-1.2zm-5.7.1c.4.3.9.5 1.5.5.9 0 1.4-.4 1.4-1.5v-6.9h1.7v7c0 1.9-1.1 2.8-2.9 2.8-.9 0-1.7-.2-2.1-.5l.4-1.4z" fill="#000000" />
    </svg>
  ),
  Git: (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0">
      <path d="M21.7 10.8L13.2 2.3C12.8 1.9 12.2 1.9 11.8 2.3L9.6 4.5L12.3 7.2C13 6.9 13.8 7.1 14.3 7.6C14.8 8.2 14.9 9 14.6 9.7L17.2 12.3C17.9 12 18.7 12.1 19.2 12.6C19.8 13.2 19.8 14.2 19.2 14.8C18.6 15.4 17.6 15.4 17 14.8C16.5 14.3 16.4 13.5 16.7 12.8L14.3 10.2V16.8C14.5 17 14.6 17.3 14.6 17.6C14.6 18.5 13.9 19.2 13 19.2C12.1 19.2 11.4 18.5 11.4 17.6C11.4 17.1 11.6 16.7 12 16.4V9.7C11.6 9.4 11.4 9 11.4 8.5C11.4 8.1 11.6 7.7 11.9 7.4L9.2 4.7L2.3 11.6C1.9 12 1.9 12.6 2.3 13L10.8 21.5C11.2 21.9 11.8 21.9 12.2 21.5L21.7 12C22.1 11.7 22.1 11.1 21.7 10.8Z" fill="#F05032" />
    </svg>
  ),
  GitHub: (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill="#181717" />
    </svg>
  ),
  Docker: (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0">
      <path d="M13.98 11.08h2.12v2.12h-2.12v-2.12zm-3.18 0h2.12v2.12h-2.12v-2.12zm-3.18 0h2.12v2.12H7.62v-2.12zm-3.18 0h2.12v2.12H4.44v-2.12zm6.36-3.18h2.12v2.12h-2.12V7.9zm-3.18 0h2.12v2.12H7.62V7.9zm-3.18 0h2.12v2.12H4.44V7.9zm6.36-3.18h2.12v2.12h-2.12V4.72z" fill="#2496ED" />
      <path d="M23.77 12.28c-.46-.35-1.52-.46-2.3-.32-.23-.5-.62-.91-1.12-1.19l-.38-.21-.24.36c-.46.68-.62 1.5-.47 2.3-.29.13-.72.28-1.25.32h-.14c-.81 0-1.84-.28-2.61-.92l-.35-.29-.26.37c-.69.98-1.82 1.57-3.01 1.57H.56l-.16.89C.07 17.06 1.45 20 6.8 20c5.77 0 9.77-3.23 11.45-8.12.87.16 2.21.13 3.32-.57l.38-.24-.42-.31c-.65-.47-1.42-.62-2.16-.48.4-.55.97-.96 1.63-1.12l.46-.11-.29-.37z" fill="#2496ED" />
    </svg>
  ),
};

/* ─── Row 1 Data ────────────────────────────────────────── */
const ROW_1: TechItem[] = [
  { name: "Flutter", category: "CROSS-PLATFORM MOBILE", logo: TECH_LOGOS["Flutter"] },
  { name: "Next.js", category: "FULL-STACK WEB", logo: TECH_LOGOS["Next.js"] },
  { name: "React", category: "UI LIBRARY", logo: TECH_LOGOS["React"] },
  { name: "Node.js", category: "JAVASCRIPT RUNTIME", logo: TECH_LOGOS["Node.js"] },
  { name: "NestJS", category: "ENTERPRISE BACKEND", logo: TECH_LOGOS["NestJS"] },
  { name: "PostgreSQL", category: "RELATIONAL DATABASE", logo: TECH_LOGOS["PostgreSQL"] },
  { name: "Firebase", category: "CLOUD & AUTH SERVICES", logo: TECH_LOGOS["Firebase"] },
  { name: "Python", category: "AUTOMATION & DATA", logo: TECH_LOGOS["Python"] },
];

/* ─── Row 2 Data ────────────────────────────────────────── */
const ROW_2: TechItem[] = [
  { name: "TypeScript", category: "TYPED JAVASCRIPT", logo: TECH_LOGOS["TypeScript"] },
  { name: "JavaScript", category: "CORE WEB LANGUAGE", logo: TECH_LOGOS["JavaScript"] },
  { name: "Git", category: "VERSION CONTROL", logo: TECH_LOGOS["Git"] },
  { name: "GitHub", category: "CODE COLLABORATION", logo: TECH_LOGOS["GitHub"] },
  { name: "Docker", category: "CONTAINERIZATION", logo: TECH_LOGOS["Docker"] },
  { name: "Flutter", category: "CROSS-PLATFORM MOBILE", logo: TECH_LOGOS["Flutter"] },
  { name: "React", category: "UI LIBRARY", logo: TECH_LOGOS["React"] },
  { name: "Next.js", category: "FULL-STACK WEB", logo: TECH_LOGOS["Next.js"] },
];

function TechCard({ item }: { item: TechItem }) {
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const handlePointerMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setGlow({ x, y });
  };

  return (
    <div
      onMouseMove={handlePointerMove}
      onMouseLeave={() => setGlow({ x: 50, y: 50 })}
      className="group relative flex items-center gap-3.5 overflow-hidden rounded-[20px] border border-[#E1E7F0] bg-white px-5 py-3.5 shadow-[0_4px_16px_rgba(11,18,32,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#FF4A17]/40 hover:shadow-[0_10px_25px_rgba(11,18,32,0.08)] select-none"
      style={{
        background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255,74,23,0.08), transparent 42%)`,
        transform: "translate3d(0, 0, 0)",
      }}
    >
      <div className="transition-transform duration-300 ease-out group-hover:scale-[1.08]">
        {item.logo}
      </div>
      <div className="flex flex-col text-left">
        <span className="text-sm font-extrabold text-[#0B1220] transition-colors group-hover:text-[#FF4A17]">
          {item.name}
        </span>
        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#8A96AA]">
          {item.category}
        </span>
      </div>
    </div>
  );
}

export default function TechnologySection() {
  /* Duplicating array for infinite seamless looping track */
  const track1 = [...ROW_1, ...ROW_1];
  const track2 = [...ROW_2, ...ROW_2];

  return (
    <section id="technology" className="border-y border-[#E1E7F0] bg-[#F8F9FC] py-24 md:py-32 scroll-mt-20">
      <div className="mx-auto max-w-[1180px] px-5">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[.2em] text-[#FF4A17]">
              TECHNOLOGY STACK
            </p>
            <h2 className="text-4xl font-extrabold tracking-[-.04em] text-[#0B1220] md:text-5xl">
              Modern Technology Stack
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-[#556078]">
            We build with modern technologies selected for maintainability, performance, and scalable product development.
          </p>
        </div>
      </div>

      {/* Infinite Dual-Row Moving Marquee Container */}
      <div className="relative w-full overflow-hidden zt-marquee-mask">
        {/* Row 1: Left -> Right (38s) */}
        <div
          className="zt-marquee-track flex gap-4 py-2"
          style={{ "--marquee-duration": "38s" } as React.CSSProperties}
        >
          {track1.map((item, index) => (
            <TechCard key={`row1-${item.name}-${index}`} item={item} />
          ))}
        </div>

        {/* Row 2: Right -> Left (44s) */}
        <div
          className="zt-marquee-track-reverse flex gap-4 py-2 mt-2"
          style={{ "--marquee-duration": "44s" } as React.CSSProperties}
        >
          {track2.map((item, index) => (
            <TechCard key={`row2-${item.name}-${index}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

