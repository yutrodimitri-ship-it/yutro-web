"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Sparkles, Clock, Users, LogOut, Zap, Menu, X, ExternalLink } from "lucide-react";
import { logoutAction } from "@/app/[locale]/studio/actions/auth";

interface StudioSidebarProps {
  locale: string;
  role: string;
  userName?: string;
  credits?: number;
}

export function StudioSidebar({ locale, role, userName, credits }: StudioSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const base = `/${locale}/studio`;

  const links = [
    { href: `${base}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
    { href: `${base}/generate`, label: "Crear Avatar", icon: Sparkles },
    { href: `${base}/history`, label: "Historial", icon: Clock },
  ];

  if (role === "admin") {
    links.push({ href: `${base}/admin`, label: "Admin", icon: Users });
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-20 items-center gap-1.5 border-b border-[#1e1e1e] px-6">
        <Link href={`/${locale}/studio/dashboard`} className="text-[28px] font-extrabold tracking-tight text-white">
          YUTRO<span className="text-primary">.</span>
        </Link>
        <span className="text-[20px] font-medium text-white/30">studio</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-white/[0.08] text-white"
                  : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
              }`}
            >
              <link.icon className={`h-[18px] w-[18px] ${isActive ? "text-primary" : ""}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Credits */}
      {credits !== undefined && (
        <div className="mx-3 mb-3 rounded-lg bg-white/[0.04] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Zap className="h-4 w-4 text-primary" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/50">Créditos</p>
              <p className="text-sm font-bold text-white">{credits}</p>
            </div>
          </div>
        </div>
      )}

      {/* Back to site */}
      <div className="px-3 mb-1">
        <a
          href={`/${locale}`}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-white/30 transition-colors hover:bg-white/[0.04] hover:text-white/50"
        >
          <ExternalLink className="h-[16px] w-[16px]" />
          yutro.cl
        </a>
      </div>

      {/* User & Logout */}
      <div className="border-t border-[#1e1e1e] px-3 py-3">
        <div className="flex items-center justify-between rounded-lg px-3 py-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.08] text-xs font-semibold text-white/50">
              {userName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="text-[13px] text-white/40">{userName}</span>
          </div>
          <form action={logoutAction}>
            <input type="hidden" name="locale" value={locale} />
            <button type="submit" className="rounded-md p-1.5 text-white/20 transition-colors hover:text-white/50" title="Cerrar sesión" aria-label="Cerrar sesión">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a] text-white/60 md:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — mobile: slide-in overlay, desktop: fixed */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#1e1e1e] bg-[#1a1a1a] transition-transform duration-300 md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-6 rounded-md p-1 text-white/30 hover:text-white/60 md:hidden"
          aria-label="Cerrar menú"
        >
          <X className="h-5 w-5" />
        </button>

        {sidebarContent}
      </aside>
    </>
  );
}
