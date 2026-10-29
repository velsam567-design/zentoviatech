"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import ConsultationModal from "./ConsultationModal";

/* ─── Mega-menu categories & items with SVG icons ─────────── */
const MEGA_MENU = {
  columns: [
    {
      heading: "ENGINEERING",
      links: [
        {
          label: "Custom Software",
          desc: "End-to-end product engineering",
          href: "#contact",
          icon: "💻",
        },
        {
          label: "Web Development",
          desc: "High-performance web apps & sites",
          href: "#contact",
          icon: "🌐",
        },
        {
          label: "Mobile App Development",
          desc: "Flutter & React Native platforms",
          href: "#contact",
          icon: "📱",
        },
        {
          label: "Business Software",
          desc: "POS, billing & enterprise systems",
          href: "#contact",
          icon: "⚡",
        },
        {
          label: "UI/UX Engineering",
          desc: "Design systems & interactive prototypes",
          href: "#contact",
          icon: "🎨",
        },
      ],
    },
    {
      heading: "AUTOMATION & GROWTH",
      links: [
        {
          label: "AI & Automation",
          desc: "Intelligent workflow automation",
          href: "#contact",
          icon: "🤖",
        },
        {
          label: "Workflow Automation",
          desc: "No-code + custom pipelines",
          href: "#contact",
          icon: "🔄",
        },
        {
          label: "Cloud & DevOps",
          desc: "Infra, CI/CD & deployment",
          href: "#contact",
          icon: "☁️",
        },
        {
          label: "API & System Integration",
          desc: "Third-party & payment gateways",
          href: "#contact",
          icon: "🔗",
        },
        {
          label: "Business Analytics",
          desc: "Dashboards & data pipelines",
          href: "#contact",
          icon: "📊",
        },
      ],
    },
  ],
  featured: {
    question: "Not sure what you need?",
    cta: "Talk to us →",
    href: "#contact",
  },
};

const NAV_LINKS = [
  { label: "Services", href: "#services", hasMega: true },
  { label: "Products", href: "#products", hasMega: false },
  { label: "Process", href: "#process", hasMega: false },
  { label: "Technology", href: "#technology", hasMega: false },
  { label: "About", href: "#about", hasMega: false },
  { label: "Contact", href: "#contact", hasMega: false },
];

/* ─── Component ──────────────────────────────────────────── */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [megaFocused, setMegaFocused] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const megaRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Defer close so moving mouse from trigger → panel doesn't flicker */
  const scheduleMegaClose = useCallback(() => {
    closeTimer.current = setTimeout(() => {
      if (!megaFocused) setMegaOpen(false);
    }, 120);
  }, [megaFocused]);

  const cancelMegaClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  /* Close mega on Escape or outside click */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        triggerRef.current?.focus();
      }
    };
    const clickOutside = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    document.addEventListener("mousedown", clickOutside);
    return () => {
      document.removeEventListener("keydown", handler);
      document.removeEventListener("mousedown", clickOutside);
    };
  }, []);

  return (
    <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-32px)] max-w-[1180px] -translate-x-1/2">
      {/* ── Main pill nav ─────────────────────────────────── */}
      <nav
        aria-label="Main Navigation"
        className="flex items-center justify-between rounded-[24px] border border-white/75 bg-white/90 px-5 py-3 shadow-[0_12px_32px_rgba(11,18,32,0.08)] backdrop-blur-xl transition-all duration-200"
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-[21px] font-extrabold tracking-[-0.04em] text-[#0B1220]"
          onClick={() => setMobileOpen(false)}
        >
          Zentovia<span className="text-[#FF4A17]">Tech</span>
        </Link>

        {/* ── Desktop links ─────────────────────────────── */}
        <div
          ref={megaRef}
          className="relative hidden items-center gap-7 text-sm font-semibold text-[#556078] md:flex"
        >
          {NAV_LINKS.map((link) =>
            link.hasMega ? (
              /* Services trigger */
              <button
                key={link.label}
                ref={triggerRef}
                type="button"
                aria-haspopup="true"
                aria-expanded={megaOpen}
                onMouseEnter={() => { cancelMegaClose(); setMegaOpen(true); }}
                onMouseLeave={scheduleMegaClose}
                onClick={() => setMegaOpen((v) => !v)}
                className="flex items-center gap-1 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:text-[#FF4A17]"
              >
                {link.label}
                <svg
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${megaOpen ? "rotate-180 text-[#FF4A17]" : ""}`}
                  viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="transition-all duration-200 ease-out hover:-translate-y-0.5 hover:text-[#FF4A17]"
              >
                {link.label}
              </a>
            )
          )}

          {/* ── Mega menu panel ────────────────────────── */}
          {megaOpen && (
            <div
              role="dialog"
              aria-label="Services menu"
              onMouseEnter={() => { cancelMegaClose(); setMegaFocused(true); }}
              onMouseLeave={() => { setMegaFocused(false); scheduleMegaClose(); }}
              className="absolute left-1/2 top-[calc(100%+18px)] z-50 w-[720px] -translate-x-1/2 overflow-hidden rounded-[26px] border border-[#E1E7F0] bg-white shadow-[0_24px_64px_rgba(11,18,32,0.14)] ring-1 ring-black/5 animate-in fade-in-0 slide-in-from-top-2 duration-150"
              style={{ transformOrigin: "top center" }}
            >
              {/* Arrow pointer */}
              <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 h-3.5 w-3.5 rotate-45 rounded-sm border-l border-t border-[#E1E7F0] bg-white" />

              <div className="grid grid-cols-2 gap-0 p-6">
                {MEGA_MENU.columns.map((col, ci) => (
                  <div key={col.heading} className={ci === 0 ? "border-r border-[#F0F2F7] pr-6" : "pl-6"}>
                    <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#FF4A17]">
                      {col.heading}
                    </p>
                    <ul className="flex flex-col gap-1">
                      {col.links.map((item) => (
                        <li key={item.label}>
                          <a
                            href={item.href}
                            onClick={() => setMegaOpen(false)}
                            className="group flex items-start gap-3 rounded-[12px] p-2.5 transition hover:bg-[#F2F5FA]"
                          >
                            <span className="text-lg leading-none transition-transform group-hover:scale-110">
                              {item.icon}
                            </span>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-[#0B1220] group-hover:text-[#FF4A17]">
                                {item.label}
                              </span>
                              <span className="text-xs text-[#8A96AA] leading-snug">{item.desc}</span>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Mega menu footer callout */}
              <a
                href={MEGA_MENU.featured.href}
                onClick={() => setMegaOpen(false)}
                className="group flex items-center justify-between gap-4 border-t border-[#F0F2F7] bg-[#F8F9FC] px-8 py-4 transition hover:bg-[#FFF1EC]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#556078]">
                    {MEGA_MENU.featured.question}
                  </span>
                  <span className="text-sm font-bold text-[#0B1220] group-hover:text-[#FF4A17]">
                    {MEGA_MENU.featured.cta}
                  </span>
                </div>
                <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-[#0B1220] text-white text-sm transition group-hover:bg-[#FF4A17] group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
              className="group inline-flex items-center gap-2 rounded-full bg-[#FF4A17] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_18px_rgba(255,74,23,0.25)] transition-all duration-250 ease-out hover:-translate-y-0.5 hover:bg-[#f53d0a] hover:shadow-[0_6px_24px_rgba(255,74,23,0.40)] active:scale-[0.97]"
          >
            Start a Project
            <span className="transition-transform duration-250 group-hover:translate-x-1" aria-hidden="true">→</span>
          </button>
        </div>


        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="grid h-10 w-10 place-items-center rounded-full bg-[#F2F5FA] text-[#0B1220] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#E1E7F0] md:hidden"
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="flex h-4 w-[18px] flex-col justify-between">
            <span className={`h-0.5 w-full rounded-full bg-current transition-all duration-300 ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`h-0.5 w-full rounded-full bg-current transition-all duration-200 ${mobileOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`h-0.5 w-full rounded-full bg-current transition-all duration-300 ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {/* ── Mobile drawer ─────────────────────────────────── */}
      {mobileOpen && (
        <div className="mt-2 flex flex-col gap-2 rounded-[24px] border border-white/80 bg-white/95 p-5 shadow-[0_16px_40px_rgba(11,18,32,0.12)] backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-1 py-1 text-base font-semibold text-[#0B1220]">
            {/* Services accordion */}
            <div>
              <button
                type="button"
                aria-expanded={mobileServicesOpen}
                onClick={() => setMobileServicesOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-[#F2F5FA] hover:text-[#FF4A17]"
              >
                <span>Services</span>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180 text-[#FF4A17]" : ""}`}
                  viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {mobileServicesOpen && (
                <div className="ml-3 mt-1 flex flex-col gap-0 rounded-[16px] border border-[#F0F2F7] bg-[#F8F9FC] p-2">
                  {MEGA_MENU.columns.map((col) => (
                    <div key={col.heading} className="mb-2">
                      <p className="mb-1 px-3 font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[#FF4A17]">
                        {col.heading}
                      </p>
                      {col.links.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#0B1220] transition hover:bg-white hover:text-[#FF4A17]"
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Other links */}
            {NAV_LINKS.filter((l) => !l.hasMega).map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2.5 transition hover:bg-[#F2F5FA] hover:text-[#FF4A17]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="border-t border-[#E1E7F0] pt-4">
            <button
              type="button"
              onClick={() => { setMobileOpen(false); setModalOpen(true); }}
              className="flex w-full items-center justify-center rounded-full bg-[#FF4A17] py-3 text-center text-sm font-bold text-white shadow-md transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#f53d0a]"
            >
              Start a Project
            </button>
          </div>
        </div>
      )}

      {/* Consultation Modal — z-[999] renders above fixed navbar */}
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </header>
  );
}
