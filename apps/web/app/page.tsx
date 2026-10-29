"use client";

import { useEffect, useRef, useState } from "react";
import InteractiveHero from "../components/InteractiveHero";
import HeroProductVisual from "../components/HeroProductVisual";
import Navbar from "../components/Navbar";
import ScrollProgress from "../components/ScrollProgress";
import AnimatedHeadline from "../components/AnimatedHeadline";
import AnimatedCounter from "../components/AnimatedCounter";
import ServicesSection from "../components/ServicesSection";
import ProductsSection from "../components/ProductsSection";
import AboutSection from "../components/AboutSection";
import TechnologySection from "../components/TechnologySection";
import IntegrationsSection from "../components/IntegrationsSection";
import WorldMapSection from "../components/WorldMapSection";
import TeamSection from "../components/TeamSection";
import ProcessJourney from "../components/ProcessJourney";
import ClientExperienceSection from "../components/ClientExperienceSection";
import ContactSection from "../components/ContactSection";
import FooterSection from "../components/FooterSection";
import FloatingActions from "../components/FloatingActions";
import ConsultationModal from "../components/ConsultationModal";

/**
 * ZentoviaTech Statistics Configuration
 * Modify target values here once final metrics are verified.
 */
const STATS_CONFIG = [
  { value: "04+", label: "Products Built" },
  { value: "07", label: "Technologies Used" },
  { value: "08", label: "Service Areas" },
  { value: "02", label: "Web & Mobile" },
];

const HERO_TRUST_POINTS = [
  { icon: "<> ", label: "Product Engineering" },
  { icon: "▦", label: "Business Software" },
  { icon: "↗", label: "Support & Growth" },
];

const POPUP_SESSION_KEY = "zentovia_requirement_popup_closed";
const POPUP_DELAY_MS = 60_000;

export default function Home() {
  const [popupOpen, setPopupOpen] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissed = window.sessionStorage.getItem(POPUP_SESSION_KEY) === "true";
    if (dismissed) return;

    const startTimer = () => {
      if (timerRef.current !== null) return;

      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        if (window.sessionStorage.getItem(POPUP_SESSION_KEY) === "true") return;
        setPopupOpen(true);
      }, POPUP_DELAY_MS);
    };

    startTimer();

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handlePopupClose = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(POPUP_SESSION_KEY, "true");
    }
    setPopupOpen(false);
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F2F5FA] text-[#0B1220]">
      {/* 1. Thin Top Scroll Progress Indicator */}
      <ScrollProgress />

      {/* 2. Floating Pill Navigation with Services Mega Menu & Mobile Drawer */}
      <Navbar />

      {/* 3. Cinematic Dark Hero Section */}
      <section className="relative min-h-[760px] overflow-hidden bg-[#0B1220] px-5 pb-10 pt-36 text-white md:pb-12 md:pt-44">
        {/* Ambient Radial Glows */}
        <div className="zt-hero-glow absolute -right-32 top-20 h-[520px] w-[520px] rounded-full bg-[#FF4A17]/20 blur-[120px]" />
        <div className="zt-float absolute -left-40 bottom-0 h-[360px] w-[360px] rounded-full bg-blue-500/15 blur-[100px]" />

        {/* Interactive Particle & Network Background */}
        <InteractiveHero />

        <div className="relative mx-auto max-w-[1180px]">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Left Column: Headline, Description & CTAs */}
            <div className="lg:col-span-7">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/85 backdrop-blur-sm sm:text-sm">
                <span className="zt-status-dot h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Building digital products that move business forward
              </div>

              {/* Animated Character-by-Character Headline */}
              <AnimatedHeadline />

              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg sm:leading-8">
                From concept to deployment, ZentoviaTech designs and builds custom software products, mobile applications, business platforms, and intelligent automation systems.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#1A1F2B] to-[#FF4A17] px-6 py-3.5 text-sm font-bold shadow-[0_12px_35px_rgba(255,74,23,.25)] transition hover:-translate-y-0.5"
                >
                  Build with us
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#FF4A17] transition group-hover:translate-x-1">
                    →
                  </span>
                </a>

                <a
                  href="#products"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
                >
                  Explore Products
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6 sm:gap-x-8">
                {HERO_TRUST_POINTS.map((point) => (
                  <div key={point.label} className="flex items-center gap-2.5 text-xs font-medium text-white/75 sm:text-sm">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#FF4A17]/15 text-xs font-bold text-[#FF6A42]" aria-hidden="true">
                      {point.icon}
                    </span>
                    {point.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Live Terminal Operations Console */}
            <div className="lg:col-span-5 lg:-mt-6">
              <HeroProductVisual />
            </div>
          </div>

          {/* Single Hero Statistics Strip */}
          <div className="mt-12 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:gap-4 lg:grid-cols-4">
            {STATS_CONFIG.map((stat) => (
              <AnimatedCounter
                key={stat.label}
                value={stat.value}
                label={stat.label}
                isCard={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Services Section ("Software Built Around Your Business") */}
      <ServicesSection />

      {/* 6. Products Section ("Built, not just imagined.") */}
      <ProductsSection />

      {/* 7. About ZentoviaTech ("Engineering-first. Tamil Nadu, India.") */}
      <AboutSection />

      {/* 8. Technology Stack ("Modern Technology Stack") */}
      <TechnologySection />

      {/* 9. Platforms & Integrations ("Technology That Works Together") */}
      <IntegrationsSection />

      {/* 10. Global Reach ("Building From India, Reaching Everywhere") */}
      <WorldMapSection />

      {/* 11. Inside ZentoviaTech ("People Behind ZentoviaTech / Engineering Culture") */}
      <TeamSection />

      {/* 12. Scroll-Driven Engineering Journey */}
      <ProcessJourney />

      {/* 13. Client Experience ("Built Around Real Business Needs") */}
      <ClientExperienceSection />

      {/* 13. Contact & Enquiry Section ("Let's build something.") */}
      <ContactSection />

      {/* 14. Large Dark Footer */}
      <FooterSection />

      {/* 15. Fixed Floating Action Stack (Products, Chat, Call, WhatsApp, Back to Top) */}
      <FloatingActions />

      <ConsultationModal open={popupOpen} onClose={handlePopupClose} />
    </main>
  );
}
