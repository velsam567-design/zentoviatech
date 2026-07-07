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
  LogOut,
  ChevronRight,
} from "lucide-react";

import { useSiteSettings } from "@/hooks/useSiteSettings";

const menus = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Hero",      icon: House,           href: "/admin/hero" },
  { name: "Services",  icon: Briefcase,       href: "/admin/services" },
  { name: "Portfolio", icon: Image,           href: "/admin/portfolio" },
  { name: "Team",      icon: Users,           href: "/admin/team" },
  { name: "Contact",   icon: Phone,           href: "/admin/contact" },
  { name: "Leads",     icon: Mail,            href: "/admin/leads" },
  { name: "Settings",  icon: Settings,        href: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { settings, loading } = useSiteSettings();

  const siteName  = settings?.siteName  || "Zentovia";
  const firstWord = siteName.split(" ")[0];
  const initial   = siteName.charAt(0).toUpperCase() || "Z";
  const email     = settings?.email    || "admin@zentoviatech.com";

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-white/10 bg-slate-950">

      {/* ── Logo ── */}
      <div className="border-b border-white/10 p-8">
        <div className="flex items-center gap-4">

          {/* Logo image — falls back to gradient initial */}
          {!loading && settings?.logo ? (
            <img
              src={settings.logo}
              alt={siteName}
              className="h-14 w-14 rounded-2xl object-cover shadow-xl shadow-cyan-500/20"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-black text-white shadow-xl shadow-cyan-500/20">
              {initial}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-black text-white">
              {loading ? "Loading…" : firstWord}
            </h1>
            <p className="text-sm text-slate-400">CMS Dashboard</p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-sm text-emerald-400">System Online</span>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-5">
        {menus.map((menu) => {
          const Icon = menu.icon;

          // Exact match for /admin, prefix match for sub-routes
          const active =
            menu.href === "/admin"
              ? pathname === "/admin"
              : pathname === menu.href || pathname.startsWith(menu.href + "/");

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`
                group flex items-center justify-between
                rounded-2xl px-5 py-4
                transition-all duration-300
                ${active
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <div className="flex items-center gap-4">
                <Icon size={21} />
                <span className="font-medium">{menu.name}</span>
              </div>

              <ChevronRight
                size={18}
                className={`transition-all duration-200 ${
                  active
                    ? "translate-x-1 opacity-100"
                    : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"
                }`}
              />
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="border-t border-white/10 p-5">

        {/* Profile card */}
        <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">

            {/* Avatar — gradient initial */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-bold text-white">
              {initial}
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-white">Administrator</h3>
              {/* Truncate long emails */}
              <p className="truncate text-sm text-slate-400" title={email}>
                {email}
              </p>
            </div>

          </div>
        </div>

        {/* Logout */}
        <button
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 py-3 font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>
    </aside>
  );
}