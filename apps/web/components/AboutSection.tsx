"use client";

import Reveal from "./Reveal";

/* ─── Verified ZentoviaTech data ───────────────────────────────────
   Update CONFIG values with verified data before publishing.
   Using clearly named constants so gaps are immediately obvious.
──────────────────────────────────────────────────────────────────── */
const CONFIG = {
  FOUNDED_YEAR: "2022",
  LOCATION: "Tamil Nadu, India",
  TAGLINE: "An engineering-first software company",
};

const CAPABILITIES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3m8 0h3a2 2 0 002-2v-3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12h6M12 9v6" strokeLinecap="round" />
      </svg>
    ),
    title: "Full-Stack Product Engineering",
    body: "From Flutter mobile apps to NestJS APIs and PostgreSQL databases, we own the full vertical of your digital product.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Offline-First Architecture",
    body: "Business-critical systems engineered to operate without internet, syncing seamlessly when connectivity is restored.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M3 3l9 18 2.5-7.5L22 11 3 3z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Rapid Iteration & Delivery",
    body: "We ship in focused sprints, keeping businesses in the loop at every checkpoint — no black-box development.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <rect x="2" y="9" width="20" height="13" rx="2" />
        <path d="M7 9V7a5 5 0 0110 0v2" strokeLinecap="round" />
      </svg>
    ),
    title: "Long-Term Maintainability",
    body: "Battle-tested frameworks chosen for lifespan, not trend. Code you can build on three years from now.",
  },
];

const PRODUCTS = [
  { name: "ZENTOZ", tag: "Multi-Vendor Food Delivery" },
  { name: "Malligai Billing", tag: "Retail & POS Platform" },
  { name: "KalyanaHub", tag: "Wedding Hall Platform" },
  { name: "Power Tools Rental", tag: "Rental Management" },
];

export default function AboutSection() {
  return (
    <section id="about" className="px-5 py-24 md:py-32 scroll-mt-20">
      <div className="mx-auto max-w-[1180px]">
        {/* Top row: heading + paragraph */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[.2em] text-[#FF4A17]">
              Who We Are
            </p>
            <h2 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] md:text-5xl">
              Engineering-first. <br />
              <span className="text-[#FF4A17]">Tamil Nadu, India.</span>
            </h2>
            <p className="mt-5 text-sm font-mono text-[#8A96AA]">Est. {CONFIG.FOUNDED_YEAR} · {CONFIG.LOCATION}</p>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-7">
            <p className="text-lg leading-8 text-[#556078]">
              ZentoviaTech is {CONFIG.TAGLINE} building digital products
              that solve real operational problems for businesses across India.
            </p>
            <p className="mt-5 text-lg leading-8 text-[#556078]">
              We don't sell generic software. We study how your business actually operates —
              at the cash counter, on the field, inside the warehouse — and build systems
              purpose-made for that reality. Everything we ship is designed to run reliably,
              scale sensibly, and remain maintainable long after launch.
            </p>
            <p className="mt-5 text-lg leading-8 text-[#556078]">
              Our approach is simple: one engineering partner, full accountability,
              from spec to production deployment.
            </p>
          </Reveal>
        </div>

        {/* Capabilities grid */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((cap, i) => (
            <Reveal key={cap.title} delay={i * 80}>
              <div className="flex h-full flex-col gap-4 rounded-[20px] border border-[#E1E7F0] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF4A17]/30 hover:shadow-md">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFF1EC] text-[#FF4A17]">
                  {cap.icon}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0B1220]">{cap.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#556078]">{cap.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Products built bar */}
        <Reveal delay={200}>
          <div className="mt-14 overflow-hidden rounded-[24px] border border-[#E1E7F0] bg-white p-8 shadow-sm">
            <p className="mb-6 font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#FF4A17]">
              Products we've built
            </p>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {PRODUCTS.map((p) => (
                <div
                  key={p.name}
                  className="flex flex-col gap-1 rounded-[14px] bg-[#F8F9FC] px-5 py-4 transition hover:bg-[#FFF1EC]"
                >
                  <span className="text-base font-extrabold text-[#0B1220]">{p.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[.14em] text-[#8A96AA]">
                    {p.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

