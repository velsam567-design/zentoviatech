"use client";

import Reveal from "./Reveal";

const CULTURE_PILLARS = [
  {
    icon: "⚙️",
    title: "Practical System Architecture",
    description: "We design software around actual operational realities — network disruptions, cash register throughput, and offline reliability.",
  },
  {
    icon: "🎯",
    title: "Full Vertical Ownership",
    description: "One unified engineering team managing mobile apps, web applications, backend microservices, and database sync engines.",
  },
  {
    icon: "🔬",
    title: "Continuous Quality & Testing",
    description: "Every build undergoes static analysis, automated TypeScript checks, and strict deployment verification before release.",
  },
  {
    icon: "🚀",
    title: "Sprint-Based Delivery",
    description: "Predictable delivery milestones with direct engineering communication, demo builds, and transparent progress checkpoints.",
  },
];

export default function TeamSection() {
  return (
    <section className="px-5 py-24 md:py-32 border-b border-[#E1E7F0]">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[.2em] text-[#FF4A17]">
              People Behind ZentoviaTech
            </p>
            <h2 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] text-[#0B1220] md:text-5xl">
              Inside ZentoviaTech
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#556078]">
              Our engineering culture is rooted in software craftsmanship, operational accountability, and direct communication.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[#556078]">
              We work as your dedicated technical partner, keeping code clean, infrastructure scalable, and systems online when business velocity matters most.
            </p>
          </Reveal>

          <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
            {CULTURE_PILLARS.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 80}>
                <div className="flex h-full flex-col justify-between rounded-[22px] border border-[#E1E7F0] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF4A17]/40 hover:shadow-md">
                  <div>
                    <span className="text-3xl">{pillar.icon}</span>
                    <h3 className="mt-4 text-base font-extrabold text-[#0B1220]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#556078]">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

