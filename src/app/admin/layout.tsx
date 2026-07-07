"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  House,
 Briefcase,
  Image,
  Users,
  Phone,
  Mail,
  Settings,
  ExternalLink,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Hero",
    href: "/admin/hero",
    icon: House,
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: Briefcase,
  },
  {
    name: "Portfolio",
    href: "/admin/portfolio",
    icon: Image,
  },
  {
    name: "Team",
    href: "/admin/team",
    icon: Users,
  },
  {
    name: "Contact",
    href: "/admin/contact",
    icon: Phone,
  },
  {
    name: "Leads",
    href: "/admin/leads",
    icon: Mail,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* Sidebar */}

      <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-white/10 bg-slate-900">

        {/* Logo */}

        <div className="border-b border-white/10 p-8">

          <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-3xl font-black text-transparent">
            Zentovia
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Content Management System
          </p>

        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-2 p-5">

          {menu.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300

                ${
                  active
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={20} />

                <span>{item.name}</span>

              </Link>
            );
          })}

        </nav>

        {/* Status */}

        <div className="border-t border-white/10 p-6">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">

            <h3 className="font-semibold text-white">
              System Status
            </h3>

            <div className="mt-4 space-y-2 text-sm">

              <p className="text-emerald-400">
                ● Firebase Connected
              </p>

              <p className="text-emerald-400">
                ● Firestore Connected
              </p>

              <p className="text-yellow-400">
                ● Cloudinary Pending
              </p>

            </div>

          </div>

        </div>

      </aside>

      {/* Main */}

      <div className="flex flex-1 flex-col">

        {/* Header */}

        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-slate-900/90 px-10 py-5 backdrop-blur-xl">

          <div>

            <h2 className="text-3xl font-bold text-white">
              Admin Dashboard
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Welcome to Zentovia Tech CMS
            </p>

          </div>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-600"
          >
            View Website

            <ExternalLink size={18} />

          </Link>

        </header>

        {/* Content */}

        <main className="flex-1 p-10">
          {children}
        </main>

      </div>

    </div>
  );
}