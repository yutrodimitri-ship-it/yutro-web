"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Users, LogOut, Menu, X, ExternalLink, Library, ClipboardList } from "lucide-react";
import { logoutAction } from "@/app/[locale]/studio/actions/auth";

interface StudioSidebarProps {
  locale: string;
  role: string;
  userName?: string;
  credits?: number;
  showTalentLink?: boolean;
}

interface SidebarLink {
  href: string;
  label: string;
  icon: typeof Users;
  variant?: "default" | "talent";
  exactPrefix?: string;
}

interface TalentProjectCtx {
  projectName: string;
  activeUserName: string;
  activeUserEmail: string;
  otherUsers: { email: string; name: string }[];
}

export function StudioSidebar({ locale, role, userName, showTalentLink }: StudioSidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [talentCtx, setTalentCtx] = useState<TalentProjectCtx | null>(null);

  const base = `/${locale}/studio`;

  // Detect if we're inside a talent project route (not admin)
  const projectSlug =
    typeof params.projectSlug === "string" &&
    !pathname.includes("/talent/admin")
      ? params.projectSlug
      : null;

  useEffect(() => {
    if (!projectSlug) {
      setTalentCtx(null);
      return;
    }
    fetch(`/api/studio/talent/${projectSlug}/context`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setTalentCtx(data ?? null))
      .catch(() => setTalentCtx(null));
  }, [projectSlug]);

  const isTalentLabel = locale === "en" ? "Talent Library" : "Catálogo Talent";

  const links: SidebarLink[] = [];

  if (showTalentLink) {
    links.push({
      href: `${base}/talent`,
      label: isTalentLabel,
      icon: Library,
      variant: "talent",
      exactPrefix: `${base}/talent/admin`,
    });
  }

  if (role === "admin") {
    links.push({ href: `${base}/admin`, label: "Admin", icon: Users });
    links.push({
      href: `${base}/talent/admin`,
      label: "Talent Admin",
      icon: ClipboardList,
      variant: "talent",
    });
  }

  const logoHref =
    role === "admin"
      ? `${base}/talent/admin`
      : showTalentLink
      ? `${base}/talent`
      : base;

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-20 items-center gap-1.5 border-b border-[#1e1e1e] px-6">
        <Link href={logoHref} className="text-[28px] font-extrabold tracking-tight text-white">
          YUTRO<span className="text-primary">.</span>
        </Link>
        <span className="text-[20px] font-medium text-white/30">studio</span>
      </div>

      {/* ── Talent project context block ───────────────────── */}
      {talentCtx && (
        <div className="border-b border-[#1e1e1e] px-5 py-5">
          {/* Project name */}
          <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.22em] text-white/25">
            Proyecto
          </p>
          <p className="mb-5 text-[13px] font-bold leading-tight tracking-tight text-white/90">
            {talentCtx.projectName}
          </p>

          {/* Active user */}
          <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.22em] text-white/25">
            Sesión activa
          </p>
          <div className="mb-1 flex items-center gap-2">
            <span
              className="block h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            <span className="text-[13px] font-semibold text-white/80">
              {talentCtx.activeUserName}
            </span>
          </div>
          <p className="mb-4 truncate pl-3.5 text-[10px] text-white/25">
            {talentCtx.activeUserEmail}
          </p>

          {/* Other users */}
          {talentCtx.otherUsers.length > 0 && (
            <>
              <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.22em] text-white/25">
                También con acceso
              </p>
              <div className="flex flex-col gap-1.5">
                {talentCtx.otherUsers.map((u) => (
                  <div key={u.email} className="flex items-center gap-2">
                    <span
                      className="block h-1.5 w-1.5 shrink-0 rounded-full border border-white/20"
                      style={{ background: "transparent" }}
                    />
                    <span className="text-[12px] text-white/35">{u.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {links.map((link) => {
          let isActive: boolean;
          if (link.exactPrefix) {
            isActive =
              pathname.startsWith(link.href) &&
              !pathname.startsWith(link.exactPrefix);
          } else {
            isActive = pathname.startsWith(link.href);
          }

          const isTalent = link.variant === "talent";
          const activeIconClass = isActive
            ? isTalent
              ? "text-[var(--accent)]"
              : "text-primary"
            : "";
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
              <link.icon className={`h-[18px] w-[18px] ${activeIconClass}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>

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
            <button
              type="submit"
              className="rounded-md p-1.5 text-white/20 transition-colors hover:text-white/50"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
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

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#1e1e1e] bg-[#1a1a1a] transition-transform duration-300 md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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
