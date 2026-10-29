"use client";

import { useEffect, useState } from "react";

/* ─── Exact verified contact links ─────────────────────────────────── */
const CONTACT_LINKS = {
  WHATSAPP: "https://wa.me/918778844987",
  PHONE: "tel:+918778844987",
  EMAIL: "mailto:zentoviatechno@gmail.com",
  PRODUCTS: "#products",
};

/* ─── 4 Fixed Floating Buttons Configuration ────────────────────── */
const FLOATING_BUTTONS = [
  {
    id: "products",
    label: "PRODUCTS",
    tooltip: "Explore Products",
    href: CONTACT_LINKS.PRODUCTS,
    external: false,
    gradient: "from-[#1D4ED8] to-[#2563EB]", // Strong Blue
    glow: "shadow-[0_10px_25px_rgba(37,99,235,0.45)] hover:shadow-[0_14px_32px_rgba(37,99,235,0.65)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </svg>
    ),
    delay: 0,
  },
  {
    id: "chat",
    label: "CHAT",
    tooltip: "Email / Chat",
    href: CONTACT_LINKS.EMAIL,
    external: false,
    gradient: "from-[#6D28D9] to-[#7C3AED]", // Vibrant Purple
    glow: "shadow-[0_10px_25px_rgba(124,58,237,0.45)] hover:shadow-[0_14px_32px_rgba(124,58,237,0.65)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    delay: 100,
  },
  {
    id: "call",
    label: "CALL",
    tooltip: "Call Us Now",
    href: CONTACT_LINKS.PHONE,
    external: false,
    gradient: "from-[#EA580C] to-[#FF4A17]", // Orange/Red Accent
    glow: "shadow-[0_10px_25px_rgba(255,74,23,0.45)] hover:shadow-[0_14px_32px_rgba(255,74,23,0.65)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    delay: 200,
  },
  {
    id: "whatsapp",
    label: "WHATSAPP",
    tooltip: "WhatsApp Us",
    href: CONTACT_LINKS.WHATSAPP,
    external: true,
    gradient: "from-[#059669] to-[#25D366]", // WhatsApp Green
    glow: "shadow-[0_10px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_14px_32px_rgba(37,211,102,0.65)]",
    isPulse: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.58 15.13L2 22l4.98-1.31A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.08-1.12l-.29-.17-3.03.79.81-2.95-.19-.3A8 8 0 1 1 12 20zm4.4-5.93c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.27.18-.51.06a6.47 6.47 0 0 1-1.9-1.17 7.12 7.12 0 0 1-1.31-1.63c-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42s-.54-1.3-.74-1.78c-.2-.46-.4-.4-.54-.4h-.47c-.16 0-.42.06-.64.3a2.7 2.7 0 0 0-.85 2c0 1.18.86 2.33.98 2.49.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
      </svg>
    ),
    delay: 300,
  },
];

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    // Trigger entrance stagger animation after initial mount
    const timer = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <aside
      aria-label="Quick actions bar"
      className="fixed right-3 sm:right-6 top-1/2 z-40 -translate-y-1/2 flex flex-col items-end gap-3"
    >
      {FLOATING_BUTTONS.map((btn) => (
        <div key={btn.id} className="relative flex items-center">
          {/* Tooltip Label (Left of button) */}
          {activeTooltip === btn.id && (
            <div
              role="tooltip"
              className="pointer-events-none absolute right-[calc(100%+12px)] whitespace-nowrap rounded-xl bg-[#070B14] px-3.5 py-2 text-xs font-bold text-white shadow-xl border border-white/10 animate-in fade-in-0 slide-in-from-right-1 duration-150"
            >
              {btn.tooltip}
              {/* Caret pointing right */}
              <span className="absolute right-[-6px] top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[#070B14]" />
            </div>
          )}

          {/* Solid Vibrant Rounded Square Button */}
          <a
            href={btn.href}
            target={btn.external ? "_blank" : undefined}
            rel={btn.external ? "noopener noreferrer" : undefined}
            aria-label={btn.label}
            onMouseEnter={() => setActiveTooltip(btn.id)}
            onMouseLeave={() => setActiveTooltip(null)}
            onFocus={() => setActiveTooltip(btn.id)}
            onBlur={() => setActiveTooltip(null)}
            style={{
              transitionDelay: loaded ? `${btn.delay}ms` : "0ms",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateX(0) scale(1)" : "translateX(32px) scale(0.85)",
            }}
            className={`group relative grid h-[50px] w-[50px] sm:h-[58px] sm:w-[58px] place-items-center rounded-2xl bg-gradient-to-br ${btn.gradient} ${btn.glow} transition-all duration-300 hover:scale-[1.08] hover:-translate-y-1 active:scale-95 ${
              btn.isPulse ? "animate-pulse" : ""
            }`}
          >
            {/* White Icon */}
            <div className="transition-transform duration-200 group-hover:scale-110">
              {btn.icon}
            </div>
          </a>
        </div>
      ))}

      {/* Back To Top Button */}
      {showTop && (
        <div className="relative mt-1 flex items-center">
          {activeTooltip === "top" && (
            <div
              role="tooltip"
              className="pointer-events-none absolute right-[calc(100%+12px)] whitespace-nowrap rounded-xl bg-[#070B14] px-3.5 py-2 text-xs font-bold text-white shadow-xl border border-white/10"
            >
              Back to top
              <span className="absolute right-[-6px] top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[#070B14]" />
            </div>
          )}
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            onMouseEnter={() => setActiveTooltip("top")}
            onMouseLeave={() => setActiveTooltip(null)}
            className="grid h-[44px] w-[44px] sm:h-[50px] sm:w-[50px] place-items-center rounded-2xl border border-white/20 bg-[#070B14] text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-[#FF4A17] hover:scale-105 hover:-translate-y-1"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </aside>
  );
}
