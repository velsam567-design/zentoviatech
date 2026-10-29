"use client";

type IntegrationItem = {
  name: string;
  type: string;
  description: string;
  logo: React.ReactNode;
  accentBorder: string;
};

/* ─── Authentic Vector SVG Logos for Integrations ─────────── */
const INTEGRATION_LOGOS: Record<string, React.ReactNode> = {
  Razorpay: (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0">
      <path d="M22 2L11 22L7 13L22 2Z" fill="#0C2340" />
      <path d="M11 22L15 13L7 13L11 22Z" fill="#0284C7" />
    </svg>
  ),
  Cloudinary: (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#3448C5" />
    </svg>
  ),
  "Google Maps": (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335" />
      <circle cx="12" cy="9" r="2.5" fill="#FFFFFF" />
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
  "GitHub Actions": (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill="#2088FF" />
    </svg>
  ),
  PostgreSQL: (
    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 shrink-0">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.8 16.2c-2.3 0-3.8-1.4-3.8-3.3 0-2.3 2.1-3.2 4.2-3.2.6 0 1.2.1 1.7.2v-.4c0-1.1-.7-1.7-1.9-1.7-1 0-1.9.3-2.5.7l-.6-1.3c.9-.6 2.1-.9 3.5-.9 2.3 0 3.6 1.2 3.6 3.3v4.9h-1.6v-1.1c-.6.8-1.5 1.2-2.6 1.2zm.4-1.5c1.1 0 2-.6 2.4-1.4v-1.2c-.4-.1-.9-.2-1.4-.2-1.3 0-2.5.5-2.5 1.7 0 .8.6 1.1 1.5 1.1z" fill="#336791" />
    </svg>
  ),
};

const INTEGRATION_ITEMS: IntegrationItem[] = [
  {
    name: "Razorpay",
    type: "PAYMENT GATEWAY",
    description: "UPI, card & automated refund workflows",
    logo: INTEGRATION_LOGOS["Razorpay"],
    accentBorder: "hover:border-sky-500/50 hover:shadow-[0_10px_25px_rgba(2,132,199,0.15)]",
  },
  {
    name: "Cloudinary",
    type: "MEDIA OPTIMIZATION",
    description: "Dynamic image resizing & CDN delivery",
    logo: INTEGRATION_LOGOS["Cloudinary"],
    accentBorder: "hover:border-indigo-500/50 hover:shadow-[0_10px_25px_rgba(52,72,197,0.15)]",
  },
  {
    name: "Google Maps API",
    type: "LOCATION & GEOCODING",
    description: "Distance matrix & rider tracking",
    logo: INTEGRATION_LOGOS["Google Maps"],
    accentBorder: "hover:border-red-500/50 hover:shadow-[0_10px_25px_rgba(234,67,53,0.15)]",
  },
  {
    name: "Firebase",
    type: "REAL-TIME CLOUD SERVICES",
    description: "Push notifications & OTP auth",
    logo: INTEGRATION_LOGOS["Firebase"],
    accentBorder: "hover:border-amber-500/50 hover:shadow-[0_10px_25px_rgba(245,124,0,0.15)]",
  },
  {
    name: "GitHub Actions",
    type: "AUTOMATED CI/CD",
    description: "Automated test runs & deployment",
    logo: INTEGRATION_LOGOS["GitHub Actions"],
    accentBorder: "hover:border-blue-500/50 hover:shadow-[0_10px_25px_rgba(32,136,255,0.15)]",
  },
  {
    name: "PostgreSQL Engine",
    type: "RELATIONAL DATABASE CORE",
    description: "ACID storage & delta sync engine",
    logo: INTEGRATION_LOGOS["PostgreSQL"],
    accentBorder: "hover:border-[#336791]/50 hover:shadow-[0_10px_25px_rgba(51,103,145,0.15)]",
  },
];

function IntegrationCard({ item }: { item: IntegrationItem }) {
  return (
    <div className={`group flex items-center gap-3.5 rounded-[22px] border border-[#E1E7F0] bg-white px-5 py-4 shadow-[0_4px_16px_rgba(11,18,32,0.04)] transition-all duration-300 hover:-translate-y-1 select-none ${item.accentBorder}`}>
      <div className="transition-transform duration-300 group-hover:scale-[1.08]">
        {item.logo}
      </div>
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-[#0B1220]">
            {item.name}
          </span>
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#8A96AA] bg-[#F2F5FA] px-2 py-0.5 rounded-md border border-[#E1E7F0]">
            {item.type}
          </span>
        </div>
        <span className="mt-0.5 text-xs text-[#556078] leading-tight">
          {item.description}
        </span>
      </div>
    </div>
  );
}

export default function IntegrationsSection() {
  const row1 = [...INTEGRATION_ITEMS, ...INTEGRATION_ITEMS];
  const row2 = [...INTEGRATION_ITEMS].reverse();
  const row2Track = [...row2, ...row2];

  return (
    <section id="integrations" className="bg-white py-24 md:py-32 border-b border-[#E1E7F0] scroll-mt-20">
      <div className="mx-auto max-w-[1180px] px-5">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[.2em] text-[#FF4A17]">
            PLATFORMS & INTEGRATIONS
          </p>
          <h2 className="text-4xl font-extrabold tracking-[-.04em] text-[#0B1220] md:text-5xl">
            Technology That Works Together
          </h2>
          <p className="mt-4 text-lg text-[#556078]">
            Seamlessly integrated APIs, infrastructure services, and cloud providers chosen for reliability and fast execution.
          </p>
        </div>
      </div>

      {/* Infinite Dual-Row Moving Marquee Container */}
      <div className="relative w-full overflow-hidden zt-marquee-mask">
        {/* Row 1: Left -> Right (36s) */}
        <div
          className="zt-marquee-track flex gap-4 py-2"
          style={{ "--marquee-duration": "36s" } as React.CSSProperties}
        >
          {row1.map((item, index) => (
            <IntegrationCard key={`int1-${item.name}-${index}`} item={item} />
          ))}
        </div>

        {/* Row 2: Right -> Left (42s) */}
        <div
          className="zt-marquee-track-reverse flex gap-4 py-2 mt-2"
          style={{ "--marquee-duration": "42s" } as React.CSSProperties}
        >
          {row2Track.map((item, index) => (
            <IntegrationCard key={`int2-${item.name}-${index}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

