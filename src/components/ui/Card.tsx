import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: "sm" | "md" | "lg";
}

export default function Card({
  children,
  className,
  hover = true,
  glow = true,
  padding = "lg",
}: CardProps) {
  const paddingClass = {
    sm: "p-5",
    md: "p-7",
    lg: "p-8",
  };

  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-3xl",
        "border border-white/10",
        "bg-white/5 backdrop-blur-xl",
        "transition-all duration-500",

        paddingClass[padding],

        hover &&
          "hover:-translate-y-2 hover:border-cyan-400 hover:shadow-[0_25px_70px_rgba(6,182,212,.18)]",

        className
      )}
    >
      {glow && (
        <>
          {/* Top Glow */}

          <div
            className="
            absolute
            -right-24
            -top-24
            h-56
            w-56
            rounded-full
            bg-cyan-500/10
            blur-3xl
            transition
            duration-500
            group-hover:bg-cyan-500/20
            "
          />

          {/* Bottom Glow */}

          <div
            className="
            absolute
            -bottom-24
            -left-24
            h-56
            w-56
            rounded-full
            bg-blue-500/10
            blur-3xl
            transition
            duration-500
            group-hover:bg-blue-500/20
            "
          />
        </>
      )}

      {/* Gradient Border */}

      <div
        className="
        absolute
        inset-0
        rounded-3xl
        opacity-0
        transition-opacity
        duration-500
        group-hover:opacity-100
        bg-gradient-to-br
        from-cyan-500/5
        via-transparent
        to-blue-500/5
        pointer-events-none
        "
      />

      {/* Content */}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}