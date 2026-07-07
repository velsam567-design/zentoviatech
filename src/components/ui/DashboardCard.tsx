import { ReactNode } from "react";
import clsx from "clsx";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: string;
  className?: string;
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  color = "from-cyan-500 to-blue-600",
  className,
}: DashboardCardProps) {
  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-3xl",
        "border border-white/10",
        "bg-slate-900/70 backdrop-blur-xl",
        "p-6 transition-all duration-300",
        "hover:-translate-y-2",
        "hover:border-cyan-400",
        "hover:shadow-[0_20px_60px_rgba(6,182,212,.18)]",
        className
      )}
    >
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl transition group-hover:bg-cyan-500/20" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-black text-white">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={clsx(
            "flex h-16 w-16 items-center justify-center rounded-2xl",
            "bg-gradient-to-br text-white shadow-xl",
            color
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}