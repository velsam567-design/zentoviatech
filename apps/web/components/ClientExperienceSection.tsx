"use client";

import Reveal from "./Reveal";

const EXPERIENCE_PILLARS = [
  {
    tag: "OPERATIONAL RELIABILITY",
    title: "Zero-Downtime Architecture",
    description: "Systems engineered to keep cash counters, delivery dispatches, and rental checkouts running smoothly even during network outages.",
    highlight: "99.9%+ Infrastructure Health",
  },
  {
    tag: "FULL-STACK OWNERSHIP",
    title: "One Dedicated Partner",
    description: "Frontend, mobile apps, backend APIs, database synchronization, and cloud hosting owned completely under one engineering roof.",
    highlight: "Single Point of Accountability",
  },
  {
    tag: "TRANSPARENT DELIVERIES",
    title: "Predictable Development Sprints",
    description: "Regular demo builds, documented code repositories, and clear delivery timelines with direct engineer accessibility.",
    highlight: "Sprint Checkpoints & Demos",
  },
];

export default function ClientExperienceSection() {
  return (
    <section className="bg-[#0B1220] px-5 py-24 text-white md:py-32">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[.2em] text-[#FF4A17]">
            Our Client Experience
          </p>
          <h2 className="text-4xl font-extrabold tracking-[-.04em] sm:text-5xl md:text-6xl">
            Built Around Real Business Needs
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            We build long-term technology partnerships focused on system performance, operational continuity, and business value.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {EXPERIENCE_PILLARS.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <div className="flex h-full flex-col justify-between rounded-[26px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF4A17]/40 hover:bg-white/[0.07]">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#FF4A17]">
                    {item.tag}
                  </span>
                  <h3 className="mt-5 text-2xl font-extrabold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/60">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 border-t border-white/10 pt-4 text-xs font-mono text-emerald-400 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

