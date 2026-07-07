"use client";

import Link from "next/link";
import {
  ArrowUp,
  Mail,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { useSiteSettings } from "@/hooks/useSiteSettings"; // adjust path to wherever you save the hook

const quickLinks = [
  { name: "Home", href: "#hero" },
  { name: "Services", href: "#services" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Process", href: "#process" },
  { name: "Team", href: "#team" },
  { name: "Contact", href: "#contact" },
];

const services = [
  "Website Development",
  "Mobile App Development",
  "ERP Software",
  "AI Solutions",
  "Cloud Solutions",
  "UI / UX Design",
];

export default function Footer() {
  const { settings, loading } = useSiteSettings();
const socialLinks = [
  { url: settings.facebook, icon: FaFacebookF, label: "Facebook" },
  { url: settings.instagram, icon: FaInstagram, label: "Instagram" },
  { url: settings.linkedin, icon: FaLinkedinIn, label: "LinkedIn" },
  { url: settings.twitter, icon: FaXTwitter, label: "Twitter / X" },
  { url: settings.youtube, icon: FaYoutube, label: "YouTube" },
].filter((s) => s.url);
  
  


  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950">

      {/* Background Glow */}

      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[150px]" />

      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">

        <div className="grid gap-14 md:grid-cols-2 xl:grid-cols-4">

          {/* Company */}

          <div>

            <Link href="/" className="flex items-center gap-3">

              {!loading && settings.logo ? (
                <img
                  src={settings.logo}
                  alt={settings.siteName}
                  className="h-14 w-14 rounded-2xl object-cover shadow-lg shadow-cyan-500/20"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-black text-white shadow-lg shadow-cyan-500/20">
                  {settings.siteName.charAt(0) || "Z"}
                </div>
              )}

              <div>

                <h2 className="text-2xl font-black text-white">
                  {settings.siteName.split(" ")[0] || "Zentovia"}
                </h2>

                <p className="text-sm tracking-wide text-slate-400">
                  SOFTWARE SOLUTIONS
                </p>

              </div>

            </Link>

            <p className="mt-6 leading-8 text-slate-400">
              We design and develop world-class websites,
              ERP software, mobile applications, AI-powered
              business solutions and scalable cloud platforms.
            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="mb-6 text-xl font-bold text-white">
              Quick Links
            </h3>

            <div className="space-y-4">

              {quickLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-slate-400 transition hover:translate-x-1 hover:text-cyan-400"
                >
                  {item.name}
                </Link>
              ))}

            </div>

          </div>

          {/* Services */}

          <div>

            <h3 className="mb-6 text-xl font-bold text-white">
              Our Services
            </h3>

            <div className="space-y-4">

              {services.map((service) => (
                <p
                  key={service}
                  className="text-slate-400"
                >
                  {service}
                </p>
              ))}

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="mb-6 text-xl font-bold text-white">
              Contact Us
            </h3>

            <div className="space-y-5">

              <div className="flex gap-3">

                <MapPin
                  size={20}
                  className="mt-1 text-cyan-400"
                />

                <p className="text-slate-400">
                  vadalur,
                  Tamil Nadu,
                  India
                </p>

              </div>

              <div className="flex gap-3">

                <Phone
                  size={20}
                  className="text-cyan-400"
                />

                <p className="text-slate-400">
                  {settings.phone}
                </p>

              </div>

              <div className="flex gap-3">

                <Mail
                  size={20}
                  className="text-cyan-400"
                />

                <p className="text-slate-400">
                  {settings.email}
                </p>

              </div>

              <div className="flex gap-3">

                <Globe
                  size={20}
                  className="text-cyan-400"
                />

                <p className="text-slate-400">
                  {settings.website}
                </p>

              </div>

            </div>

            {/* Social */}

            {socialLinks.length > 0 && (
              <div className="mt-8 flex gap-4">

                {socialLinks.map(({ url, icon: Icon, label }) => (
                  <Link
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={label}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-500 hover:text-white"
                  >
                    <Icon size={18} />
                  </Link>
                ))}

              </div>
            )}

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">

          <p className="text-center text-sm text-slate-500">
            {settings.footerText ||
              `© ${new Date().getFullYear()} ${settings.siteName}. All Rights Reserved.`}
          </p>

          <Link
            href="#hero"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
          >
            Back to Top

            <ArrowUp size={18} />
          </Link>

        </div>

      </div>

    </footer>
  );
}