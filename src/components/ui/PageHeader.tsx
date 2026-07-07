import { ReactNode } from "react";
import clsx from "clsx";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  action?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  badge,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-3xl",
        "border border-white/10",
        "bg-slate-900/70 backdrop-blur-xl",
        "p-8 lg:p-10",
        "mb-10",
        className
      )}
    >
      {/* Background Glow */}

      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}

        <div>

          {badge && (
            <span
              className="
              inline-flex
              items-center
              rounded-full
              border
              border-cyan-500/20
              bg-cyan-500/10
              px-4
              py-2
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-cyan-400
              "
            >
              {badge}
            </span>
          )}

          <h1 className="mt-5 text-4xl font-black text-white lg:text-5xl">
            {title}
          </h1>

          {description && (
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
              {description}
            </p>
          )}

        </div>

        {/* Right */}

        {action && (
          <div className="flex shrink-0 items-center">
            {action}
          </div>
        )}

      </div>
    </div>
  );
}