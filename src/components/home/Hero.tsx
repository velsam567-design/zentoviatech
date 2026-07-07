"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config"; // adjust this import to your firebase config file
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const FIRESTORE_COLLECTION = "site_settings";
const FIRESTORE_DOC_ID = "hero";

interface HeroData {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  button1: string;
  button2: string;
  mainImage: string;
  image1: string; // Website UI
  image2: string; // Mobile App
  image3: string; // ERP Dashboard
  image4: string; // AI Dashboard
  image5: string; // Cloud Platform
  image6: string; // Analytics Dashboard
}

const DEFAULT_HERO: HeroData = {
  badge: "Trusted Software Development Partner",
  title: "Building Future-Ready Software",
  subtitle: "For Modern Businesses",
  description:
    "We build modern websites, ERP software, AI solutions, mobile applications and cloud platforms for startups and enterprises.",
  button1: "Start Your Project",
  button2: "View Portfolio",
  mainImage: "",
  image1: "",
  image2: "",
  image3: "",
  image4: "",
  image5: "",
  image6: "",
};

const trustedLogos = [
  { name: "Company One" },
  { name: "Company Two" },
  { name: "Company Three" },
  { name: "Company Four" },
];

// Config for the 6 floating satellite images around the main hero image.
// "field" maps to the HeroData key, "position" controls placement,
// and "parallax" controls how strongly it reacts to mouse movement
// (bigger numbers = moves more = feels "closer" to the camera).
const FLOATING_IMAGES: {
  field: keyof HeroData;
  label: string;
  icon: string;
  position: string;
  parallax: number;
  floatDuration: number;
  floatDelay: number;
}[] = [
  {
    field: "image4",
    label: "AI Dashboard",
    icon: "🤖",
    position: "-top-10 left-1/2 -translate-x-1/2",
    parallax: 22,
    floatDuration: 5,
    floatDelay: 0,
  },
  {
    field: "image2",
    label: "Mobile App",
    icon: "📱",
    position: "top-[8%] -left-10",
    parallax: 16,
    floatDuration: 6.5,
    floatDelay: 0.3,
  },
  {
    field: "image3",
    label: "ERP Dashboard",
    icon: "📊",
    position: "top-[8%] -right-10",
    parallax: 16,
    floatDuration: 7,
    floatDelay: 0.6,
  },
  {
    field: "image1",
    label: "Website UI",
    icon: "💻",
    position: "bottom-[6%] -left-14",
    parallax: 12,
    floatDuration: 6,
    floatDelay: 0.9,
  },
  {
    field: "image5",
    label: "Cloud Platform",
    icon: "☁️",
    position: "bottom-[6%] -right-14",
    parallax: 12,
    floatDuration: 6.8,
    floatDelay: 1.2,
  },
  {
    field: "image6",
    label: "Analytics Dashboard",
    icon: "📈",
    position: "-bottom-12 left-1/2 -translate-x-1/2",
    parallax: 20,
    floatDuration: 5.8,
    floatDelay: 1.5,
  },
];

function FloatingImage({
  src,
  label,
  icon,
  position,
  parallax,
  floatDuration,
  floatDelay,
  mouseX,
  mouseY,
}: {
  src: string;
  label: string;
  icon: string;
  position: string;
  parallax: number;
  floatDuration: number;
  floatDelay: number;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
}) {
  const px = useSpring(
    useTransform(mouseX, [-150, 150], [-parallax, parallax]),
    { stiffness: 150, damping: 16 }
  );
  const py = useSpring(
    useTransform(mouseY, [-150, 150], [-parallax * 0.7, parallax * 0.7]),
    { stiffness: 150, damping: 16 }
  );

  return (
    <motion.div
      className={`absolute z-10 hidden lg:block ${position}`}
      style={{ x: px, y: py }}
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{
          duration: floatDuration,
          delay: floatDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.08 }}
        className="relative h-[90px] w-[130px] overflow-hidden rounded-xl border border-cyan-400/25 bg-slate-900/90 shadow-[0_0_35px_rgba(6,182,212,.22)] backdrop-blur-sm"
      >
        {src ? (
          <Image src={src} alt={label} fill unoptimized className="object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-2 text-center">
            <span className="text-xl leading-none">{icon}</span>
            <span className="text-[10px] font-medium leading-tight text-slate-400">
              {label}
            </span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const [hero, setHero] = useState<HeroData>(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);

  // --- 3D mouse tilt + parallax setup (shared across main + floating images) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [12, -12]), {
    stiffness: 180,
    damping: 18,
  });

  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-12, 12]), {
    stiffness: 180,
    damping: 18,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }
  // --- end tilt / parallax setup ---

  useEffect(() => {
    // onSnapshot keeps the hero section live: whenever the admin saves
    // changes in the CMS, this listener fires again automatically.
    const ref = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setHero(DEFAULT_HERO);
          setLoading(false);
          return;
        }

        const d = snap.data() as Partial<HeroData>;
        setHero({
          badge: d.badge ?? DEFAULT_HERO.badge,
          title: d.title ?? DEFAULT_HERO.title,
          subtitle: d.subtitle ?? DEFAULT_HERO.subtitle,
          description: d.description ?? DEFAULT_HERO.description,
          button1: d.button1 ?? DEFAULT_HERO.button1,
          button2: d.button2 ?? DEFAULT_HERO.button2,
          mainImage: d.mainImage ?? "",
          image1: d.image1 ?? "",
          image2: d.image2 ?? "",
          image3: d.image3 ?? "",
          image4: d.image4 ?? "",
          image5: d.image5 ?? "",
          image6: d.image6 ?? "",
        });
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load hero section:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <section className="bg-slate-950 px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 rounded-full bg-slate-800" />
            <div className="h-14 w-3/4 rounded bg-slate-800" />
            <div className="h-10 w-1/2 rounded bg-slate-800" />
            <div className="h-20 w-full rounded bg-slate-800" />
          </div>
          <div className="h-[400px] w-full animate-pulse rounded-3xl bg-slate-800" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-24 md:py-32">
      {/* Gradient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: text content */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm font-medium text-cyan-400"
            >
              {hero.badge}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-8 text-5xl font-black leading-tight text-white md:text-6xl"
            >
              {hero.title}
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl"
            >
              {hero.subtitle}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 max-w-xl text-lg text-slate-400"
            >
              {hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/contact"
                className="rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-600"
              >
                {hero.button1}
              </Link>

              <Link
                href="/portfolio"
                className="rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-md transition hover:border-cyan-400 hover:bg-white/10"
              >
                {hero.button2}
              </Link>
            </motion.div>

            {/* Trusted by logos */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-14"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Trusted by teams at
              </p>
              <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-slate-500">
                {trustedLogos.map((logo) => (
                  <span key={logo.name} className="text-sm font-medium">
                    {logo.name}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: hero visual cluster (main image + 6 floating images) */}
          <div className="relative flex items-center justify-center py-10 lg:py-16">
            {/* Main hero image with 3D tilt */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformPerspective: 1200,
              }}
              whileHover={{ scale: 1.03 }}
              className="relative z-20 w-full max-w-[380px] lg:max-w-[420px]"
            >
              {hero.mainImage ? (
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative h-[320px] w-full overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-900 shadow-[0_0_70px_rgba(6,182,212,.25)] lg:h-[380px]"
                >
                  <Image
                    src={hero.mainImage}
                    alt={hero.title}
                    fill
                    priority
                    unoptimized
                    className="object-cover"
                  />
                </motion.div>
              ) : (
                <div className="flex h-[320px] w-full items-center justify-center rounded-3xl border border-white/10 bg-slate-900 lg:h-[380px]">
                  <p className="text-slate-600">No hero image set</p>
                </div>
              )}

              {/* Floating glass card */}
              <div className="absolute -bottom-6 -left-6 z-30 rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-4 backdrop-blur-xl shadow-xl">
                <p className="text-2xl font-bold text-white">100+</p>
                <p className="text-sm text-slate-400">Projects Delivered</p>
              </div>
            </motion.div>

            {/* 6 floating satellite images, positioned around the main image */}
            {FLOATING_IMAGES.map((img) => (
              <FloatingImage
                key={img.field}
                src={hero[img.field]}
                label={img.label}
                icon={img.icon}
                position={img.position}
                parallax={img.parallax}
                floatDuration={img.floatDuration}
                floatDelay={img.floatDelay}
                mouseX={mouseX}
                mouseY={mouseY}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}