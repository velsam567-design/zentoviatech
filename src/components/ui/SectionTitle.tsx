import clsx from "clsx";

interface SectionTitleProps {
  subtitle: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionTitle({
  subtitle,
  title,
  description,
  align = "center",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={clsx(
        "mb-16",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {/* Subtitle */}

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
          tracking-[0.25em]
          text-cyan-400
        "
      >
        {subtitle}
      </span>

      {/* Title */}

      <h2 className="mt-6 text-4xl font-black leading-tight text-white lg:text-5xl">
        {title}
      </h2>

      {/* Description */}

      {description && (
        <p
          className={clsx(
            "mt-6 text-lg leading-8 text-slate-400",
            align === "center" && "mx-auto max-w-3xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}