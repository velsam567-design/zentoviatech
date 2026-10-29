"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const current = window.scrollY;
      setProgress(Math.min(100, Math.max(0, (current / totalHeight) * 100)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[3px] w-full bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-[#FF4A17] to-[#FF7A4D] transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
