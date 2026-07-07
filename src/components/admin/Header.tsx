"use client";

import { useState } from "react";
import {
  Bell,
  Search,
  CalendarDays,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// Mock notifications — replace with real data from your backend
const notifications = [
  { id: 1, message: "New contact form submission", time: "2m ago", unread: true },
  { id: 2, message: "Portfolio item published", time: "1h ago", unread: true },
  { id: 3, message: "Settings updated successfully", time: "3h ago", unread: false },
];

export default function Header() {
  const { settings } = useSiteSettings();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = notifications.filter((n) => n.unread).length;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

      {/* Left */}
      <div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-emerald-400">System Online</span>
        </div>

        <h1 className="mt-3 text-4xl font-black text-white">
          {settings?.siteName ? `${settings.siteName} CMS` : "Zentovia CMS"}
        </h1>

        <p className="mt-2 text-slate-400">
          Manage your website, portfolio, services and leads from one dashboard.
        </p>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-4">

        {/* Date */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
          <CalendarDays size={20} className="text-cyan-400" />
          <span className="text-sm text-slate-300">{today}</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search modules..."
            className="w-72 rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-5 text-white placeholder:text-slate-500 backdrop-blur-xl outline-none transition focus:border-cyan-400"
          />
          {/* Clear button */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition hover:border-cyan-400"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-white" />
            {unreadCount > 0 && (
              <span className="absolute right-2.5 top-2.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                {/* dot only — add count text if you want */}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-14 z-50 w-80 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <h4 className="font-semibold text-white">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-medium text-cyan-400">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="divide-y divide-white/5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-5 py-4 transition hover:bg-white/5 ${
                      n.unread ? "bg-cyan-500/5" : ""
                    }`}
                  >
                    {n.unread && (
                      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
                    )}
                    <div className={n.unread ? "" : "pl-5"}>
                      <p className="text-sm text-slate-200">{n.message}</p>
                      <p className="mt-1 text-xs text-slate-500">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 px-5 py-3">
                <button className="text-sm text-cyan-400 hover:text-cyan-300 transition">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setNotifOpen(false);
            }}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-xl transition hover:border-cyan-400"
          >
            {/* Avatar — initials fallback */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-black text-white">
              {settings?.siteName?.charAt(0) || "A"}
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-white">Administrator</h3>
              <p className="text-sm text-slate-400">
                {settings?.siteName || "Zentovia Tech"}
              </p>
            </div>

            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-200 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-16 z-50 w-52 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40">
              <div className="divide-y divide-white/5 p-2">
                <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
                  <Settings size={16} />
                  Settings
                </button>

                <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Click-outside overlay to close dropdowns */}
      {(notifOpen || profileOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setNotifOpen(false);
            setProfileOpen(false);
          }}
        />
      )}

    </header>
  );
}