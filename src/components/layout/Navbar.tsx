"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const menu = [
  { name: "Home", href: "#hero" },
  { name: "Services", href: "#services" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Process", href: "#process" },
  { name: "Team", href: "#team" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { settings, loading } = useSiteSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("#hero");

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = menu.map((item) => item.href.replace("#", ""));

    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveHash(`#${id}`);
        },
        { threshold: 0.4 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const siteName = settings?.siteName || "Zentovia";
  const firstWord = siteName.split(" ")[0];
  const initial = siteName.charAt(0) || "Z";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 transition hover:opacity-90"
          >
            {!loading && settings?.logo ? (
              <img
                src={settings.logo}
                alt={siteName}
                className="h-12 w-12 rounded-2xl object-cover shadow-lg shadow-cyan-500/25"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-black text-white shadow-lg shadow-cyan-500/25">
                {initial}
              </div>
            )}

            <div>
              <h1 className="text-xl font-black tracking-tight text-white">
                {loading ? "Loading…" : firstWord}
              </h1>
              <p className="-mt-1 text-xs tracking-wide text-slate-400">
                SOFTWARE SOLUTIONS
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden items-center gap-8 lg:flex">
            {menu.map((item) => {
              const isActive = activeHash === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    relative text-sm font-medium transition duration-300
                    after:absolute after:-bottom-2 after:left-0 after:h-[2px]
                    after:transition-all after:duration-300
                    ${isActive
                      ? "text-cyan-400 after:w-full after:bg-cyan-400"
                      : "text-slate-300 hover:text-cyan-400 after:w-0 after:bg-cyan-400 hover:after:w-full"
                    }
                  `}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden rounded-xl border border-cyan-500/40 px-5 py-2.5 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500 hover:text-white md:inline-flex"
            >
              Admin
            </Link>

            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-105"
            >
              Get Quote
              <ArrowRight size={16} />
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
              aria-label={mobileOpen ? "Close Menu" : "Open Menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-2xl
          transition-all duration-300 ease-in-out lg:hidden
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        aria-hidden={!mobileOpen}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-8">
          {menu.map((item, i) => {
            const isActive = activeHash === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{ transitionDelay: mobileOpen ? `${i * 60}ms` : "0ms" }}
                className={`
                  text-3xl font-black tracking-tight transition-all duration-300
                  ${mobileOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
                  ${isActive ? "text-cyan-400" : "text-white hover:text-cyan-400"}
                `}
              >
                {item.name}
              </Link>
            );
          })}

          <Link
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-cyan-500/20"
          >
            Get Quote
            <ArrowRight size={18} />
          </Link>
        </nav>
      </div>
    </>
  );
}