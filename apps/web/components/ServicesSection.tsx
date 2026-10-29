"use client";

import Reveal from "./Reveal";

const SERVICES_DATA = [
  {
    number: "01",
    title: "Custom Software",
    description: "End-to-end custom software engineered specifically around your company's operational workflows.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[#FF4A17]" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Web Development",
    description: "High-performance web applications and public websites built with Next.js, React, and modern CSS.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[#FF4A17]" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Mobile App Development",
    description: "High-framerate mobile apps built with Flutter for iOS & Android with offline-first synchronization.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[#FF4A17]" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Business Software",
    description: "POS, billing platforms, inventory management, and multi-location business management systems.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[#FF4A17]" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "AI & Automation",
    description: "Intelligent workflow automation, data extraction pipelines, and automated business processing engines.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[#FF4A17]" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 2a10 10 0 0110 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0112 2z" strokeLinecap="round" />
        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "06",
    title: "Cloud & DevOps",
    description: "Scalable cloud infrastructure, automated CI/CD pipelines, Docker containerization, and server monitoring.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[#FF4A17]" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "07",
    title: "UI/UX Engineering",
    description: "User-centered interface design, accessible component libraries, design systems, and rapid prototyping.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[#FF4A17]" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 19l7-7 3 3-7 7-3-3z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "08",
    title: "API & System Integration",
    description: "Third-party API integrations, payment gateway connections, webhook pipelines, and microservice bridges.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[#FF4A17]" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="px-5 py-24 md:py-32 scroll-mt-20">
      <div className="mx-auto max-w-[1180px]">
        {/* Section Header */}
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[.2em] text-[#FF4A17]">
            What We Build
          </p>
          <h2 className="text-4xl font-extrabold tracking-[-.04em] text-[#0B1220] md:text-6xl">
            Software Built Around Your Business
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#556078]">
            From business platforms to mobile apps and automation, we build digital systems around real business workflows.
          </p>
        </div>

        {/* 8-Card Grid (3 Columns on desktop) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES_DATA.map((service, index) => (
            <Reveal key={service.number} delay={index * 60}>
              <a
                href="#contact"
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-[#E1E7F0] bg-white p-8 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#FF4A17]/40 hover:shadow-[0_18px_40px_rgba(11,18,32,0.09)]"
              >
                <div className="pointer-events-none absolute inset-x-5 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-[#FF4A17]/80 to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />

                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFF1EC] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_10px_24px_rgba(255,74,23,0.18)]">
                      {service.icon}
                    </div>
                    <span className="font-mono text-xs font-bold text-[#8A96AA]">
                      {service.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-extrabold text-[#0B1220] transition-colors duration-300 group-hover:text-[#FF4A17]">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-[#556078]">
                    {service.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-xs font-bold text-[#FF4A17] transition-all duration-300 group-hover:translate-x-1">
                  <span>Enquire now</span>
                  <span className="text-base transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

