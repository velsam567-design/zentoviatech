"use client";

import { useEffect, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from "react-simple-maps";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const worldTopo = require("../public/maps/world-countries-110m.json") as unknown as string;

type MapMarker = {
  id: string;
  name: string;
  role: string;
  coordinates: [number, number];
  primary: boolean;
  tertiary?: boolean;
  offset: [number, number];
};

/* ─── Geographic Locations — real lon/lat ────────────────────────────── */
const MARKERS: MapMarker[] = [
  {
    id: "india",
    name: "India",
    role: "Engineering HQ",
    coordinates: [78.9629, 20.5937] as [number, number],
    primary: true,
    offset: [12, -20] as [number, number],
  },
  {
    id: "uk",
    name: "United Kingdom",
    role: "Technology Reach",
    coordinates: [-3.436, 55.3781] as [number, number],
    primary: false,
    offset: [-8, -20] as [number, number],
  },
  {
    id: "uae",
    name: "UAE",
    role: "Technology Reach",
    coordinates: [53.8478, 23.4241] as [number, number],
    primary: false,
    offset: [-8, -18] as [number, number],
  },
  {
    id: "singapore",
    name: "Singapore",
    role: "Technology Reach",
    coordinates: [103.8198, 1.3521] as [number, number],
    primary: false,
    offset: [12, 4] as [number, number],
  },
  {
    id: "srilanka",
    name: "Sri Lanka",
    role: "Technology Reach",
    coordinates: [80.7718, 7.8731] as [number, number],
    primary: false,
    offset: [14, 4] as [number, number],
  },
  {
    id: "canada",
    name: "Canada",
    role: "Technology Reach",
    coordinates: [-106.3468, 56.1304] as [number, number],
    primary: false,
    offset: [-12, -18] as [number, number],
  },
  {
    id: "germany",
    name: "Germany",
    role: "Technology Reach",
    coordinates: [10.4515, 51.1657],
    primary: false,
    tertiary: true,
    offset: [11, -8],
  },
  {
    id: "france",
    name: "France",
    role: "Technology Reach",
    coordinates: [2.2137, 46.2276],
    primary: false,
    tertiary: true,
    offset: [-15, 10],
  },
  {
    id: "netherlands",
    name: "Netherlands",
    role: "Technology Reach",
    coordinates: [5.2913, 52.1326],
    primary: false,
    tertiary: true,
    offset: [11, -10],
  },
  {
    id: "switzerland",
    name: "Switzerland",
    role: "Technology Reach",
    coordinates: [8.2275, 46.8182],
    primary: false,
    tertiary: true,
    offset: [11, 10],
  },
  {
    id: "japan",
    name: "Japan",
    role: "Technology Reach",
    coordinates: [138.2529, 36.2048],
    primary: false,
    tertiary: true,
    offset: [10, -8],
  },
  {
    id: "south-korea",
    name: "South Korea",
    role: "Technology Reach",
    coordinates: [127.7669, 35.9078],
    primary: false,
    tertiary: true,
    offset: [-14, 10],
  },
  {
    id: "malaysia",
    name: "Malaysia",
    role: "Technology Reach",
    coordinates: [101.9758, 4.2105],
    primary: false,
    tertiary: true,
    offset: [-14, 9],
  },
  {
    id: "indonesia",
    name: "Indonesia",
    role: "Technology Reach",
    coordinates: [113.9213, -0.7893],
    primary: false,
    tertiary: true,
    offset: [10, 11],
  },
  {
    id: "thailand",
    name: "Thailand",
    role: "Technology Reach",
    coordinates: [100.9925, 15.87],
    primary: false,
    tertiary: true,
    offset: [10, -10],
  },
  {
    id: "saudi-arabia",
    name: "Saudi Arabia",
    role: "Technology Reach",
    coordinates: [45.0792, 23.8859],
    primary: false,
    tertiary: true,
    offset: [-15, 10],
  },
  {
    id: "qatar",
    name: "Qatar",
    role: "Technology Reach",
    coordinates: [51.1839, 25.3548],
    primary: false,
    tertiary: true,
    offset: [10, -9],
  },
  {
    id: "united-states",
    name: "United States",
    role: "Technology Reach",
    coordinates: [-95.7129, 37.0902],
    primary: false,
    tertiary: true,
    offset: [10, -9],
  },
  {
    id: "mexico",
    name: "Mexico",
    role: "Technology Reach",
    coordinates: [-102.5528, 23.6345],
    primary: false,
    tertiary: true,
    offset: [-12, 10],
  },
  {
    id: "australia",
    name: "Australia",
    role: "Technology Reach",
    coordinates: [133.7751, -25.2744],
    primary: false,
    tertiary: true,
    offset: [10, -9],
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    role: "Technology Reach",
    coordinates: [174.886, -40.9006],
    primary: false,
    tertiary: true,
    offset: [-14, 10],
  },
  {
    id: "brazil",
    name: "Brazil",
    role: "Technology Reach",
    coordinates: [-51.9253, -14.235],
    primary: false,
    tertiary: true,
    offset: [10, -9],
  },
  {
    id: "argentina",
    name: "Argentina",
    role: "Technology Reach",
    coordinates: [-63.6167, -38.4161],
    primary: false,
    tertiary: true,
    offset: [-14, 10],
  },
  {
    id: "chile",
    name: "Chile",
    role: "Technology Reach",
    coordinates: [-71.543, -35.6751],
    primary: false,
    tertiary: true,
    offset: [-12, -8],
  },
  {
    id: "colombia",
    name: "Colombia",
    role: "Technology Reach",
    coordinates: [-74.2973, 4.5709],
    primary: false,
    tertiary: true,
    offset: [-14, -8],
  },
  {
    id: "south-africa",
    name: "South Africa",
    role: "Technology Reach",
    coordinates: [22.9375, -30.5595],
    primary: false,
    tertiary: true,
    offset: [10, 10],
  },
  {
    id: "nigeria",
    name: "Nigeria",
    role: "Technology Reach",
    coordinates: [8.6753, 9.082],
    primary: false,
    tertiary: true,
    offset: [-14, -8],
  },
  {
    id: "kenya",
    name: "Kenya",
    role: "Technology Reach",
    coordinates: [37.9062, -0.0236],
    primary: false,
    tertiary: true,
    offset: [10, 10],
  },
  {
    id: "egypt",
    name: "Egypt",
    role: "Technology Reach",
    coordinates: [30.8025, 26.8206],
    primary: false,
    tertiary: true,
    offset: [10, -8],
  },
  {
    id: "morocco",
    name: "Morocco",
    role: "Technology Reach",
    coordinates: [-7.0926, 31.7917],
    primary: false,
    tertiary: true,
    offset: [-14, 10],
  },
];

const MARKER_ACTIVITY_ORDER = [
  "india",
  "uae",
  "uk",
  "singapore",
  "srilanka",
  "canada",
];

const TERTIARY_ACTIVITY_ORDER = [
  "germany",
  "united-states",
  "japan",
  "australia",
  "france",
  "netherlands",
  "switzerland",
  "saudi-arabia",
  "qatar",
  "malaysia",
  "indonesia",
  "thailand",
  "south-korea",
  "mexico",
  "new-zealand",
  "brazil",
  "argentina",
  "chile",
  "colombia",
  "south-africa",
  "nigeria",
  "kenya",
  "egypt",
  "morocco",
];

/* ─── Connection Arcs (HQ → Global) — real lon/lat coordinates ──────── */
type NetworkRoute = {
  id: string;
  from: string;
  to: string;
  primary?: boolean;
  packet?: boolean;
};

const ARCS: NetworkRoute[] = [
  { id: "india-uk", from: "india", to: "uk", primary: true, packet: true },
  { id: "india-uae", from: "india", to: "uae", primary: true, packet: true },
  { id: "india-singapore", from: "india", to: "singapore", primary: true, packet: true },
  { id: "india-srilanka", from: "india", to: "srilanka", packet: true },
  { id: "india-canada", from: "india", to: "canada", packet: true },
  { id: "india-germany", from: "india", to: "germany", primary: true, packet: true },
  { id: "india-japan", from: "india", to: "japan", primary: true, packet: true },
  { id: "india-australia", from: "india", to: "australia", primary: true, packet: true },
  { id: "uk-canada", from: "uk", to: "canada" },
  { id: "uk-france", from: "uk", to: "france" },
  { id: "uk-netherlands", from: "uk", to: "netherlands" },
  { id: "germany-switzerland", from: "germany", to: "switzerland" },
  { id: "germany-france", from: "germany", to: "france" },
  { id: "uae-saudi-arabia", from: "uae", to: "saudi-arabia" },
  { id: "uae-qatar", from: "uae", to: "qatar" },
  { id: "singapore-malaysia", from: "singapore", to: "malaysia" },
  { id: "singapore-indonesia", from: "singapore", to: "indonesia" },
  { id: "singapore-thailand", from: "singapore", to: "thailand" },
  { id: "japan-south-korea", from: "japan", to: "south-korea" },
  { id: "united-states-canada", from: "united-states", to: "canada" },
  { id: "united-states-mexico", from: "united-states", to: "mexico" },
  { id: "australia-new-zealand", from: "australia", to: "new-zealand" },
  { id: "brazil-united-states", from: "brazil", to: "united-states", packet: true },
  { id: "brazil-uk", from: "brazil", to: "uk" },
  { id: "brazil-india", from: "brazil", to: "india" },
  { id: "argentina-brazil", from: "argentina", to: "brazil" },
  { id: "chile-brazil", from: "chile", to: "brazil" },
  { id: "colombia-united-states", from: "colombia", to: "united-states" },
  { id: "morocco-uk", from: "morocco", to: "uk" },
  { id: "egypt-uae", from: "egypt", to: "uae", packet: true },
  { id: "nigeria-uk", from: "nigeria", to: "uk" },
  { id: "kenya-uae", from: "kenya", to: "uae" },
  { id: "south-africa-india", from: "south-africa", to: "india", packet: true },
];

export default function WorldMapSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [clientReady, setClientReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
      if (event.matches) setActiveMarkerId(null);
    };

    setReduceMotion(motionQuery.matches);
    setClientReady(true);
    motionQuery.addEventListener("change", updateMotionPreference);
    return () => motionQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="global"
      className="overflow-hidden border-b border-[#E1E7F0] bg-white px-5 py-16 md:py-20"
    >
      <div className="mx-auto max-w-[1180px]">

        {/* ── Section Header ────────────────────────────────────────── */}
        <div
          className={`mb-8 max-w-2xl transition-all duration-700 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
        >
          <p className="font-mono text-xs font-bold uppercase tracking-[.22em] text-[#FF4A17]">
            GLOBAL REACH
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#0B1220] sm:text-4xl md:text-5xl">
            Our Technology Has{" "}
            <span className="text-[#FF4A17]">No Borders</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#556078] sm:text-base">
            From our engineering core in Tamil Nadu, India, ZentoviaTech
            designs and delivers resilient software products for clients and
            partners across the globe.
          </p>
        </div>

        {/* ── Map Card ─────────────────────────────────────────────── */}
        <div
          className={`relative overflow-hidden rounded-[28px] border border-[#E1E7F0] bg-[#F8FAFC] shadow-[0_16px_48px_rgba(11,18,32,0.06)] transition-all duration-700 delay-100 md:rounded-[36px] ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
          style={
            reduceMotion ? { opacity: 1, transform: "none" } : undefined
          }
        >
          {/* Technical grid background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(11,18,32,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(11,18,32,0.04) 1px,transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />

          {/* Subtle orange radial glow roughly over India */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute rounded-full ${visible && !reduceMotion ? "zt-map-ambient" : ""}`}
            style={{
              width: 340,
              height: 340,
              left: "57%",
              top: "28%",
              transform: "translate(-50%,-50%)",
              background:
                "radial-gradient(circle,rgba(255,74,23,0.12) 0%,transparent 70%)",
            }}
          />

          {/* Status bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[#E1E7F0]/70 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF4A17] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF4A17]" />
              </span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0B1220]">
                Global Technology Coverage
              </span>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              99.9% Uptime SLA
            </span>
          </div>

          {/* Map */}
          <div className="relative w-full select-none px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-4">
            {clientReady ? (
              <ComposableMap
              projection="geoEqualEarth"
              projectionConfig={{ scale: 155, center: [18, 10] }}
              width={800}
              height={400}
              style={{ width: "100%", height: "auto" }}
              aria-label="World map showing ZentoviaTech engineering headquarters in India and global technology reach"
            >
              {/* Graticule-style latitude/longitude grid */}
              <defs>
                <pattern
                  id="zt-grid"
                  width="80"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 80 0 L 0 0 0 40"
                    fill="none"
                    stroke="rgba(11,18,32,0.06)"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="800" height="400" fill="url(#zt-grid)" />

              {/* ── All Countries — real TopoJSON geometry ── */}
              <Geographies
                geography={worldTopo}
                aria-hidden="true"
              >
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const isIndia = geo.id === "356";
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isIndia ? "#FF4A17" : "#DCE3EC"}
                        stroke="#FFFFFF"
                        strokeWidth={0.6}
                        className={visible && !reduceMotion ? "zt-country-reveal" : undefined}
                        style={{
                          animationDelay: "300ms",
                          ...(isIndia
                            ? { filter: "drop-shadow(0 0 6px rgba(255,74,23,0.55))" }
                            : {}),
                        }}
                      />
                    );
                  })
                }
              </Geographies>

              {/* ── Connection Arcs HQ → Global ── */}
              {ARCS.map((arc, idx) => {
                const source = MARKERS.find((marker) => marker.id === arc.from);
                const destination = MARKERS.find((marker) => marker.id === arc.to);
                if (!source || !destination) return null;

                const routeIsActive =
                  activeMarkerId === arc.from || activeMarkerId === arc.to;

                return (
                  <Line
                    key={arc.id}
                    id={`zt-map-route-${arc.id}`}
                    from={source.coordinates}
                    to={destination.coordinates}
                    stroke="rgba(255,74,23,0.30)"
                    strokeWidth={0.9}
                    pathLength={100}
                    strokeLinecap="round"
                    className={`zt-map-route ${arc.primary ? "zt-route-primary" : "zt-route-secondary"} ${visible && !reduceMotion ? "zt-route-draw" : ""} ${routeIsActive ? "zt-route-active" : ""}`}
                    style={{ animationDelay: `${1520 + idx * 15}ms` }}
                  />
                );
              })}

              {!reduceMotion && visible && ARCS.map((arc, idx) => {
                if (!arc.packet) return null;

                const duration = 3.1 + (idx % 4) * 0.15;
                const startDelay = 1.97 + idx * 0.015;

                return (
                  <circle
                    key={`packet-${arc.id}`}
                    r={2.2}
                    fill="#FF9C78"
                    className={`zt-map-packet ${arc.primary ? "zt-map-packet-primary" : "zt-map-packet-secondary"}`}
                    aria-hidden="true"
                  >
                    <animateMotion
                      dur={`${duration}s`}
                      begin={`${startDelay}s`}
                      repeatCount="indefinite"
                    >
                      <mpath href={`#zt-map-route-${arc.id}`} />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;0.8;0.8;0"
                      keyTimes="0;0.12;0.82;1"
                      dur={`${duration}s`}
                      begin={`${startDelay}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                );
              })}

              {/* ── Markers (geographic coordinates via projection) ── */}
              {MARKERS.map((marker, idx) => {
                const isTertiary = marker.tertiary === true;
                const activityIndex = isTertiary
                  ? TERTIARY_ACTIVITY_ORDER.indexOf(marker.id)
                  : MARKER_ACTIVITY_ORDER.indexOf(marker.id);
                const activityDelay = isTertiary
                  ? -((TERTIARY_ACTIVITY_ORDER.length - activityIndex) % TERTIARY_ACTIVITY_ORDER.length) * 4
                  : -((MARKER_ACTIVITY_ORDER.length - activityIndex) % MARKER_ACTIVITY_ORDER.length) * 5;
                const revealDelay = isTertiary
                  ? 970 + activityIndex * 15
                  : 700 + idx * 45;

                return (
                  <Marker
                    key={marker.id}
                    coordinates={marker.coordinates}
                    role="img"
                    tabIndex={isTertiary ? 0 : undefined}
                    aria-label={isTertiary
                      ? `${marker.name} network location — visual technology reach indicator`
                      : `${marker.name} — ZentoviaTech ${marker.role}`}
                    className={`zt-marker-target ${isTertiary ? "zt-marker-tertiary" : ""} ${activeMarkerId === marker.id ? "zt-marker-hovered" : ""}`}
                    onPointerEnter={(event) => {
                      if (!reduceMotion && event.pointerType === "mouse") {
                        setActiveMarkerId(marker.id);
                      }
                    }}
                    onPointerLeave={(event) => {
                      if (event.pointerType === "mouse") setActiveMarkerId(null);
                    }}
                    onFocus={() => setActiveMarkerId(marker.id)}
                    onBlur={() => setActiveMarkerId(null)}
                  >
                  <g
                    className={visible && !reduceMotion ? "zt-marker-reveal" : undefined}
                    style={{ animationDelay: `${revealDelay}ms` }}
                  >
                    <circle
                      r={marker.primary ? 14 : isTertiary ? 7 : 9}
                      fill="none"
                      stroke="#FF4A17"
                      strokeWidth={marker.primary ? 1.5 : isTertiary ? 0.7 : 1}
                      opacity={marker.primary ? 0.4 : isTertiary ? 0.38 : 0.3}
                      className={!reduceMotion
                        ? `zt-map-pulse ${isTertiary ? "zt-map-pulse-tertiary" : ""}`
                        : undefined}
                      style={{
                        animationDelay: marker.primary
                          ? undefined
                          : isTertiary
                            ? `${idx * 240}ms`
                            : `${idx * 380}ms`,
                      }}
                    />

                    <circle
                      r={marker.primary ? 6 : isTertiary ? 2.8 : 4}
                      fill="white"
                      stroke="#FF4A17"
                      strokeWidth={marker.primary ? 2 : isTertiary ? 1 : 1.5}
                      className={`${marker.primary ? "zt-marker-strong" : isTertiary ? "zt-marker-tertiary-core" : "zt-marker-soft"} ${!reduceMotion ? "zt-marker-activity" : ""}`}
                      style={{
                        animationDelay: `${activityDelay}s`,
                        animationDuration: isTertiary
                          ? `${TERTIARY_ACTIVITY_ORDER.length * 4}s`
                          : undefined,
                      }}
                    />

                    <circle
                      r={marker.primary ? 3 : isTertiary ? 1.35 : 2}
                      fill="#FF4A17"
                      className={isTertiary ? "zt-marker-tertiary-dot" : undefined}
                    />

                    {!isTertiary && (
                      <text
                        x={marker.offset[0]}
                        y={marker.offset[1]}
                        fontSize={marker.primary ? 7 : 5.5}
                        fontWeight={marker.primary ? "800" : "600"}
                        fill={marker.primary ? "#FF4A17" : "#0B1220"}
                        fontFamily="system-ui,sans-serif"
                        className="hidden md:block"
                        aria-hidden="true"
                      >
                        {marker.name}
                      </text>
                    )}
                    {isTertiary && (
                      <text
                        x={marker.offset[0]}
                        y={marker.offset[1]}
                        fontSize={5}
                        fontWeight="600"
                        fill="#556078"
                        fontFamily="system-ui,sans-serif"
                        className="zt-marker-tertiary-label"
                        style={{
                          animationDelay: `${activityDelay}s`,
                          animationDuration: `${TERTIARY_ACTIVITY_ORDER.length * 4}s`,
                        }}
                        aria-hidden="true"
                      >
                        {marker.name}
                      </text>
                    )}
                    {marker.primary && (
                      <text
                        x={marker.offset[0]}
                        y={marker.offset[1] + 9}
                        fontSize={4.8}
                        fill="#556078"
                        fontFamily="system-ui,sans-serif"
                        className="hidden md:block"
                        aria-hidden="true"
                      >
                        {marker.role}
                      </text>
                    )}
                  </g>
                  </Marker>
                );
              })}
              </ComposableMap>
            ) : (
              <div aria-hidden="true" className="aspect-[2/1] w-full" />
            )}
          </div>

          {/* ── Infrastructure KPI Strip ────────────────────────────── */}
          <div className="grid grid-cols-2 gap-2 border-t border-[#E1E7F0] px-4 py-3 sm:grid-cols-4 sm:gap-3 sm:px-6 sm:py-4 md:px-8 md:py-5">
            {[
              {
                label: "Engineering Base",
                value: "Tamil Nadu, India",
                color: "text-[#0B1220]",
              },
              {
                label: "Infrastructure",
                value: "Cloud & Edge Resilient",
                color: "text-[#0B1220]",
              },
              {
                label: "Offline Capability",
                value: "Zero-Loss Local Sync",
                color: "text-[#0B1220]",
              },
              {
                label: "Uptime SLA",
                value: "99.9% Guaranteed",
                color: "text-emerald-600",
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-xl border border-[#E1E7F0] bg-white/80 p-2.5 sm:p-3"
              >
                <span className="block font-mono text-[9px] uppercase tracking-wider text-[#8A96AA] sm:text-[10px]">
                  {kpi.label}
                </span>
                <p
                  className={`mt-1 text-[11px] font-extrabold sm:text-xs ${kpi.color}`}
                >
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Location Tag Line ─────────────────────────────────────── */}
        <p
          className={`mt-5 text-center font-mono text-[11px] text-[#8A96AA] transition-all duration-700 delay-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          aria-label="ZentoviaTech Engineering Headquarters — Tamil Nadu, India"
        >
          📍 Tamil Nadu, India — ZentoviaTech Engineering HQ &nbsp;·&nbsp; Serving clients globally
        </p>
      </div>
    </section>
  );
}
