"use client";

type TechItem = {
  name: string;
  category: string;
};

const row1: TechItem[] = [
  { name: "Flutter", category: "Mobile Apps" },
  { name: "Next.js", category: "Web Engineering" },
  { name: "React 19", category: "Frontend Core" },
  { name: "NestJS", category: "API Backend" },
  { name: "TypeScript", category: "Type Safety" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Node.js", category: "Runtime" },
];

const row2: TechItem[] = [
  { name: "SQLite", category: "Offline Storage" },
  { name: "Firebase", category: "Cloud & Auth" },
  { name: "Python", category: "AI & Automation" },
  { name: "Docker", category: "Containers" },
  { name: "Redis", category: "Caching Layer" },
  { name: "Tailwind CSS", category: "Modern UI" },
  { name: "WebSockets", category: "Real-Time Sync" },
];

export default function TechMarquee() {
  return (
    <div className="relative mt-12 overflow-hidden py-4">
      {/* Side gradient fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

      {/* Row 1 - Left to Right */}
      <div className="zt-marquee-track flex gap-4 py-2">
        {[...row1, ...row1, ...row1, ...row1].map((tech, idx) => (
          <div
            key={`${tech.name}-${idx}`}
            className="flex shrink-0 items-center gap-2.5 rounded-full border border-[#E1E7F0] bg-[#F2F5FA] px-5 py-2.5 transition duration-200 hover:border-[#FF4A17] hover:bg-white"
          >
            <span className="h-2 w-2 rounded-full bg-[#FF4A17]" />
            <span className="text-sm font-bold text-[#0B1220]">{tech.name}</span>
            <span className="text-xs text-[#556078]">• {tech.category}</span>
          </div>
        ))}
      </div>

      {/* Row 2 - Right to Left */}
      <div className="zt-marquee-track-reverse mt-3 flex gap-4 py-2">
        {[...row2, ...row2, ...row2, ...row2].map((tech, idx) => (
          <div
            key={`${tech.name}-${idx}`}
            className="flex shrink-0 items-center gap-2.5 rounded-full border border-[#E1E7F0] bg-white px-5 py-2.5 shadow-sm transition duration-200 hover:border-[#FF4A17] hover:bg-[#F2F5FA]"
          >
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-sm font-bold text-[#0B1220]">{tech.name}</span>
            <span className="text-xs text-[#556078]">• {tech.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
