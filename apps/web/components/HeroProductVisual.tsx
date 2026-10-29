"use client";

import { useEffect, useState, useRef } from "react";

type LogEntry = {
  id: string;
  tag: "[BUILD]" | "[DEPLOY]" | "[ORDER]" | "[BILLING]" | "[BOOKING]" | "[RENTAL]" | "[SYNC]";
  categoryColor: string; // Tailwind text color
  text: string;
  timestamp: string;
};

const LOG_POOL: Omit<LogEntry, "id" | "timestamp">[] = [
  {
    tag: "[BUILD]",
    categoryColor: "text-blue-400 font-bold",
    text: "ZentoviaTech — compiling production bundle...",
  },
  {
    tag: "[DEPLOY]",
    categoryColor: "text-blue-400 font-bold",
    text: "zentovia.cloud — deployment completed (v2.4.1)",
  },
  {
    tag: "[ORDER]",
    categoryColor: "text-emerald-400 font-bold",
    text: "ZENTOZ — rider assigned to order #ZT2048",
  },
  {
    tag: "[BILLING]",
    categoryColor: "text-amber-400 font-bold",
    text: "Malligai Billing — GST invoice #MB-9042 generated",
  },
  {
    tag: "[BOOKING]",
    categoryColor: "text-purple-400 font-bold",
    text: "KalyanaHub — hall booking confirmed (Royal Palace)",
  },
  {
    tag: "[RENTAL]",
    categoryColor: "text-[#FF4A17] font-bold",
    text: "Power Tools Rental — QR checkout completed (#TR-088)",
  },
  {
    tag: "[SYNC]",
    categoryColor: "text-green-400 font-bold",
    text: "Offline SQLite data synchronized successfully",
  },
  {
    tag: "[BUILD]",
    categoryColor: "text-blue-400 font-bold",
    text: "NestJS API cluster — health check 200 OK (32ms)",
  },
  {
    tag: "[ORDER]",
    categoryColor: "text-emerald-400 font-bold",
    text: "ZENTOZ — kitchen accepted order #ZT2049",
  },
  {
    tag: "[BILLING]",
    categoryColor: "text-amber-400 font-bold",
    text: "Malligai Billing — auto inventory delta reconciled",
  },
];

function formatTime(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const SYSTEM_STATUS = [
  { label: "SYSTEM", state: "online", value: 96, tone: "bg-emerald-400" },
  { label: "API", state: "online", value: 88, tone: "bg-[#FF4A17]" },
  { label: "DATABASE", state: "online", value: 92, tone: "bg-sky-400" },
  { label: "CLOUD", state: "online", value: 90, tone: "bg-violet-400" },
  { label: "SYNC", state: "online", value: 94, tone: "bg-amber-400" },
] as const;

export default function HeroProductVisual() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [completedLines, setCompletedLines] = useState<LogEntry[]>([]);
  const [currentTypingText, setCurrentTypingText] = useState<string>("");
  const [currentLogItem, setCurrentLogItem] = useState<Omit<LogEntry, "id" | "timestamp">>(LOG_POOL[0]);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });

  const poolIndexRef = useRef<number>(0);
  const charIndexRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visualRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateTime = () => setCurrentTime(formatTime());

    updateTime();
    const interval = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduceMotion(isReduced);

    if (isReduced) {
      const staticRows = LOG_POOL.slice(0, 6).map((item, idx) => ({
        ...item,
        id: `static-${idx}`,
        timestamp: formatTime(),
      }));
      setCompletedLines(staticRows);
      return;
    }

    const initialLines: LogEntry[] = [
      { ...LOG_POOL[0], id: "init-0", timestamp: formatTime() },
      { ...LOG_POOL[1], id: "init-1", timestamp: formatTime() },
      { ...LOG_POOL[2], id: "init-2", timestamp: formatTime() },
    ];
    setCompletedLines(initialLines);
    poolIndexRef.current = 3;
    setCurrentLogItem(LOG_POOL[3]);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const typeNextChar = () => {
      const targetText = currentLogItem.text;

      if (charIndexRef.current < targetText.length) {
        charIndexRef.current += 1;
        setCurrentTypingText(targetText.slice(0, charIndexRef.current));
        timerRef.current = setTimeout(typeNextChar, 28);
      } else {
        timerRef.current = setTimeout(() => {
          const finishedEntry: LogEntry = {
            ...currentLogItem,
            id: `line-${Date.now()}`,
            timestamp: formatTime(),
          };

          setCompletedLines((prev) => {
            const nextList = [...prev, finishedEntry];
            return nextList.length > 6 ? nextList.slice(nextList.length - 6) : nextList;
          });

          poolIndexRef.current = (poolIndexRef.current + 1) % LOG_POOL.length;
          const nextItem = LOG_POOL[poolIndexRef.current];
          setCurrentLogItem(nextItem);
          charIndexRef.current = 0;
          setCurrentTypingText("");
        }, 1500);
      }
    };

    timerRef.current = setTimeout(typeNextChar, 100);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentLogItem, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;

    const element = visualRef.current;
    if (!element) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
      setPointerOffset({ x, y });
    };

    const handlePointerLeave = () => setPointerOffset({ x: 0, y: 0 });

    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [reduceMotion]);

  return (
    <div
      ref={visualRef}
      className="relative mx-auto w-full max-w-[580px] select-none lg:max-w-none"
      style={
        reduceMotion
          ? undefined
          : {
              transform: `translate3d(${pointerOffset.x * 0.35}px, ${pointerOffset.y * 0.35}px, 0)`,
              transition: "transform 220ms ease-out",
            }
      }
    >
      <div
        className="pointer-events-none absolute -inset-4 rounded-[32px] bg-gradient-to-tr from-[#FF4A17]/20 via-blue-600/15 to-purple-600/10 blur-2xl"
        style={
          reduceMotion
            ? undefined
            : {
                transform: `translate3d(${pointerOffset.x * 0.18}px, ${pointerOffset.y * 0.18}px, 0)`,
              }
        }
      />

      <div
        style={{ animation: reduceMotion ? "none" : "zt-float 5s ease-in-out infinite" }}
        className="pointer-events-none absolute -right-3 -top-6 z-20 hidden items-center gap-2.5 rounded-2xl border border-white/20 bg-[#070B14]/90 px-3.5 py-2 shadow-[0_12px_28px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:flex"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#FF4A17] text-xs font-black text-white shadow-sm">
          ⚡
        </span>
        <div className="text-left leading-tight">
          <div className="text-xs font-bold text-white">Live System Operations</div>
          <div className="text-[10px] text-emerald-400 font-mono">99.99% Uptime Active</div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[24px] border border-white/15 bg-[#070B14] shadow-[0_25px_65px_rgba(0,0,0,0.75)] backdrop-blur-2xl ring-1 ring-white/10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-4 top-16 z-10 hidden h-24 sm:block">
          <span className="zt-data-packet absolute left-0 top-1/2 h-1.5 w-10 rounded-full bg-gradient-to-r from-transparent via-[#FF9E7A] to-[#FF4A17]" style={{ top: "22%", animationDelay: "0s" }} />
          <span className="zt-data-packet absolute left-14 top-1/2 h-1.5 w-10 rounded-full bg-gradient-to-r from-transparent via-[#FF9E7A] to-[#FF4A17]" style={{ top: "52%", animationDelay: "1.3s" }} />
          <span className="zt-data-packet absolute left-28 top-1/2 h-1.5 w-10 rounded-full bg-gradient-to-r from-transparent via-[#FF9E7A] to-[#FF4A17]" style={{ top: "34%", animationDelay: "2.6s" }} />
        </div>

        <div className="relative z-20 flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#FF5F56] shadow-[0_0_8px_rgba(255,95,86,0.6)]" />
            <span className="h-3 w-3 rounded-full bg-[#FFBD2E] shadow-[0_0_8px_rgba(255,189,46,0.6)]" />
            <span className="h-3 w-3 rounded-full bg-[#27C93F] shadow-[0_0_8px_rgba(39,201,63,0.6)]" />
            <span className="ml-2 font-mono text-[11px] font-medium text-white/50">
              console@zentoviatech.cloud:~
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              STREAMING
            </span>
          </div>
        </div>

        <div className="relative z-20 p-4 font-mono text-xs text-white/85 sm:p-5 sm:text-[13px] min-h-[300px] sm:min-h-[340px] flex flex-col justify-end">
          <div className="flex flex-col gap-2.5 overflow-hidden">
            {completedLines.map((line) => (
              <div
                key={line.id}
                className="flex flex-wrap items-baseline gap-2 transition-all duration-300"
              >
                <span className="text-white/40 text-[10px] sm:text-[11px]">
                  {line.timestamp}
                </span>
                <span className={line.categoryColor}>{line.tag}</span>
                <span className="text-white/90 leading-snug">{line.text}</span>
              </div>
            ))}

            {!reduceMotion && (
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-white/40 text-[10px] sm:text-[11px]">
                  {currentTime || "--:--:--"}
                </span>
                <span className={currentLogItem.categoryColor}>
                  {currentLogItem.tag}
                </span>
                <span className="text-white/90 leading-snug">
                  {currentTypingText}
                  <span className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 bg-[#FF4A17] animate-pulse" />
                </span>
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {SYSTEM_STATUS.map((status) => (
              <div
                key={status.label}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-2 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/60">{status.label}</span>
                  <span className={`h-2 w-2 rounded-full ${status.tone} ${reduceMotion ? "" : "animate-pulse"}`} />
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <span
                    className={`block h-full rounded-full ${status.tone}`}
                    style={{ width: `${status.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF4A17]" />
              ZentoviaTech Cluster Engine v2.4
            </span>
            <span className="font-mono">utf-8 • bash</span>
          </div>
        </div>
      </div>
    </div>
  );
}
