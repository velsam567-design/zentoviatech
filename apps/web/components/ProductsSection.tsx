"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const PRODUCTS_DATA = [
  {
    name: "ZENTOZ",
    tagline: "Multi-Vendor Food Delivery Platform",
    description: "Customer ordering apps, vendor operation portals, and automated driver dispatch in one unified ecosystem.",
    features: ["Flutter Mobile Apps", "Real-Time Driver Dispatch", "Vendor Management", "Order Live Sync"],
  },
  {
    name: "Malligai Billing",
    tagline: "Retail & Billing Management Platform",
    description: "Offline-first billing, inventory tracking, GST invoice generation, customer loyalty, and business analytics.",
    features: ["Offline-First SQLite", "Barcode Scanner Support", "GST Invoice PDF", "Stock Reconciliation"],
  },
  {
    name: "KalyanaHub",
    tagline: "Wedding Hall & Venue Booking Platform",
    description: "Digital venue discovery, hall packages, vendor bookings, availability calendars, and customer management.",
    features: ["Venue Catalog", "Booking Calendar", "Vendor Packages", "Customer Portal"],
  },
  {
    name: "Power Tools Rental",
    tagline: "Equipment & Tool Rental System",
    description: "QR-first tool checkout, rental inventory management, return schedules, damage tracking, and offline sync.",
    features: ["QR Scan Checkout", "Rental Agreements", "Damage Audits", "Offline Counter Mode"],
  },
];

const PRODUCT_RUNTIME = {
  ZENTOZ: [82, 68, 93],
  "Malligai Billing": [76, 91, 84],
  KalyanaHub: [64, 87, 77],
  "Power Tools Rental": [88, 73, 96],
};

const PRODUCT_RUNTIME_CARDS = {
  ZENTOZ: [
    ["ORDERS", "SYNCED"],
    ["ACTIVE", "LIVE"],
    ["DELIVERY", "READY"],
  ],
  "Malligai Billing": [
    ["BILLS", "SYNCED"],
    ["SALES", "READY"],
    ["STOCK", "TRACKED"],
  ],
  KalyanaHub: [
    ["BOOKINGS", "SYNCED"],
    ["VENUES", "READY"],
    ["VENDORS", "TRACKED"],
  ],
  "Power Tools Rental": [
    ["ACTIVE", "LIVE"],
    ["RETURNS", "TRACKED"],
    ["TOOLS", "READY"],
  ],
};

function ProductCard({ product, index }: { product: (typeof PRODUCTS_DATA)[number]; index: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [isHover, setIsHover] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  const handlePointerMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    const x = (px - 0.5) * 2;
    const y = (0.5 - py) * 2;

    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    frameRef.current = requestAnimationFrame(() => {
      setTilt({ x, y });
      setGlow({ x: px * 100, y: py * 100 });
    });
  };

  const handlePointerLeave = () => {
    setIsHover(false);
    setTilt({ x: 0, y: 0 });
    setGlow({ x: 50, y: 50 });
  };

  const runtimeBars = PRODUCT_RUNTIME[product.name as keyof typeof PRODUCT_RUNTIME] ?? [72, 84, 68];
  const runtimeCards = PRODUCT_RUNTIME_CARDS[product.name as keyof typeof PRODUCT_RUNTIME_CARDS];

  return (
    <div className="group relative h-full">
      <a
        href="#contact"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={handlePointerLeave}
        onMouseMove={handlePointerMove}
        className="zt-product-card relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm transition-all duration-300 hover:border-[#FF4A17]/50 hover:bg-white/[0.07] hover:shadow-[0_20px_50px_rgba(255,74,23,0.15)]"
        style={{
          background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255,74,23,0.16), rgba(255,255,255,0.04) 28%, rgba(255,255,255,0.04) 100%)`,
          transform: `perspective(1200px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translate3d(0, ${isHover ? -2 : 0}px, 0)`,
          transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms ease, box-shadow 300ms ease, filter 300ms ease",
          filter: isHover ? "saturate(1.05)" : "saturate(1)",
          willChange: "transform",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHover ? 1 : 0,
            background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255,74,23,0.22), transparent 36%)`,
          }}
          aria-hidden="true"
        />

        <div className="pointer-events-none absolute inset-x-3 top-0 h-px overflow-hidden" aria-hidden="true">
          <div
            className="zt-product-scan absolute inset-0 bg-gradient-to-r from-transparent via-[#FF4A17]/80 to-transparent"
            style={{ animation: isHover ? "zt-product-scan 700ms cubic-bezier(0.22, 1, 0.36, 1)" : "none" }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-[.18em] text-[#FF4A17]">
              {product.tagline}
            </span>
            <span className="font-mono text-xs text-white/30">
              0{index + 1}
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-[#0E1728] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/60">
              <span>Runtime</span>
              <span className="zt-product-live inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                LIVE
              </span>
            </div>
            <div className="mt-4 space-y-2.5">
              {runtimeBars.map((bar, idx) => (
                <div key={`${product.name}-bar-${idx}`} className="flex items-center gap-2">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <span
                      className="zt-product-bar block h-full rounded-full bg-gradient-to-r from-[#FF9C78] via-[#FF4A17] to-[#FFB39B]"
                      style={{ width: `${bar}%`, animationDelay: `${idx * 0.55}s` }}
                    />
                  </div>
                  <span className="min-w-9 text-right text-[8px] font-medium text-white/45">{bar}%</span>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-2 pt-3">
                <div className="relative flex h-12 flex-col justify-center overflow-hidden rounded-xl border border-white/5 bg-[#FF4A17]/12 px-2">
                  <span className="absolute inset-x-2 bottom-1 h-7 rounded-lg bg-[#FF4A17]/22" />
                  <span className="relative text-[7px] font-semibold leading-tight tracking-[0.08em] text-white/55">{runtimeCards[0][0]}</span>
                  <span className="relative mt-0.5 text-[9px] font-semibold leading-tight text-white/90">{runtimeCards[0][1]}</span>
                </div>
                {runtimeCards.slice(1).map(([label, status]) => (
                  <div key={label} className="flex h-12 flex-col justify-center rounded-xl border border-white/5 bg-white/5 px-2">
                    <span className="text-[7px] font-semibold leading-tight tracking-[0.08em] text-white/40">{label}</span>
                    <span className="mt-0.5 text-[9px] font-semibold leading-tight text-white/70">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h3 className="mt-6 text-3xl font-extrabold tracking-tight text-white transition-all duration-300 group-hover:-translate-y-1 group-hover:text-[#FF4A17]">
            {product.name}
          </h3>

          <p className="mt-4 text-base leading-relaxed text-white/60">
            {product.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.features.map((feat) => (
              <span
                key={feat}
                className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-medium text-white/80"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-10 flex items-center gap-2 text-xs font-bold text-[#FF4A17] transition-transform duration-300 group-hover:translate-x-1">
          <span>Discuss project</span>
          <span className="text-base">↗</span>
        </div>
      </a>
    </div>
  );
}

export default function ProductsSection() {
  return (
    <section id="products" className="bg-[#0B1220] px-5 py-24 text-white md:py-32 scroll-mt-[100px]">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[.2em] text-[#FF4A17]">
              Products & Projects
            </p>
            <h2 className="text-4xl font-extrabold tracking-[-.04em] sm:text-5xl md:text-6xl">
              Built, not just imagined.
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-white/60">
            A growing portfolio of digital products designed around real users, real workflows, and real business requirements.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {PRODUCTS_DATA.map((product, index) => (
            <Reveal key={product.name} delay={index * 80}>
              <ProductCard product={product} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

