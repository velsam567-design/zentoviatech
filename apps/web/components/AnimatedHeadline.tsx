"use client";

type LineData = {
  text: string;
  isOrange?: boolean;
};

const lines: LineData[] = [
  { text: "We engineer" },
  { text: "digital products", isOrange: true },
  { text: "that move business." },
];

export default function AnimatedHeadline() {
  let globalCharIndex = 0;

  return (
    <h1
      aria-label="We engineer digital products that move business."
      className="text-[clamp(38px,5.5vw,72px)] font-black leading-[1.02] tracking-[-0.055em]"
    >
      {lines.map((line) => {
        const characters = Array.from(line.text);
        return (
          <span
            key={line.text}
            className={`block ${line.isOrange ? "text-[#FF4A17]" : "text-white"}`}
          >
            {characters.map((char, i) => {
              const charKey = `${line.text}-${i}`;
              const delay = globalCharIndex * 24;
              globalCharIndex++;

              return (
                <span
                  key={charKey}
                  style={{
                    animationDelay: `${delay}ms`,
                    animationFillMode: "forwards",
                    transformOrigin: "bottom center",
                  }}
                  className={`inline-block zt-char-animate ${
                    char === " " ? "w-[0.25em]" : ""
                  }`}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              );
            })}
          </span>
        );
      })}
    </h1>
  );
}
