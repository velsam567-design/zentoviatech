import Link from "next/link";
import { ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function Button({
  href,
  children,
  className,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/30",
        className
      )}
    >
      {children}
    </Link>
  );
}