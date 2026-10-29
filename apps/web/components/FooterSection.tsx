"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const VERIFIED_INFO = {
  PHONE: "8778844987",
  PHONE_LINK: "tel:+918778844987",
  WHATSAPP: "+918778844987",
  WHATSAPP_LINK: "https://wa.me/918778844987",
  EMAIL: "zentoviatechno@gmail.com",
  EMAIL_LINK: "mailto:zentoviatechno@gmail.com",
  LOCATION: "Tamil Nadu, India",
};

export default function FooterSection() {
  const [year, setYear] = useState<number>(0);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t-2 border-t-[#FF4A17] bg-[#0B1220] px-5 py-16 text-white">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Overview */}
          <div>
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-white">
              Zentovia<span className="text-[#FF4A17]">Tech</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              An engineering-first software company building digital products, offline-first business platforms, and automated cloud systems.
            </p>
            <div className="mt-6 text-xs text-white/40 font-mono">
              Tamil Nadu, India
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-[.18em] text-[#FF4A17]">
              Services
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/70">
              <li><a href="#services" className="hover:text-white transition">Custom Software</a></li>
              <li><a href="#services" className="hover:text-white transition">Web Development</a></li>
              <li><a href="#services" className="hover:text-white transition">Mobile App Development</a></li>
              <li><a href="#services" className="hover:text-white transition">Business Software & POS</a></li>
              <li><a href="#services" className="hover:text-white transition">AI & Automation</a></li>
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-[.18em] text-[#FF4A17]">
              Company
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/70">
              <li><a href="#about" className="hover:text-white transition">About ZentoviaTech</a></li>
              <li><a href="#products" className="hover:text-white transition">Products & Projects</a></li>
              <li><a href="#process" className="hover:text-white transition">Engineering Process</a></li>
              <li><a href="#technology" className="hover:text-white transition">Technology Stack</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact & Enquiry</a></li>
            </ul>
          </div>

          {/* Column 4: Verified Contact Info */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-[.18em] text-[#FF4A17]">
              Contact
            </h4>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-white/80">
              <li>
                <span className="text-white/40 text-xs block font-mono">Phone:</span>
                <a href={VERIFIED_INFO.PHONE_LINK} className="font-bold hover:text-[#FF4A17] transition">
                  {VERIFIED_INFO.PHONE}
                </a>
              </li>
              <li>
                <span className="text-white/40 text-xs block font-mono">WhatsApp:</span>
                <a href={VERIFIED_INFO.WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="font-bold hover:text-[#FF4A17] transition">
                  {VERIFIED_INFO.WHATSAPP}
                </a>
              </li>
              <li>
                <span className="text-white/40 text-xs block font-mono">Email:</span>
                <a href={VERIFIED_INFO.EMAIL_LINK} className="font-bold hover:text-[#FF4A17] transition">
                  {VERIFIED_INFO.EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights Notice */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-center text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            {year > 0 ? `© ${year} ZentoviaTech. All rights reserved.` : "© ZentoviaTech. All rights reserved."}
          </div>
          <div>
            Digital products • Business Software • Automation • AI
          </div>
        </div>
      </div>
    </footer>
  );
}
