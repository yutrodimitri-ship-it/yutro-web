import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminBackLink } from "./AdminBackLink";

interface AdminPageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  newHref?: string;
  newLabel?: string;
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  backHref,
  backLabel,
  newHref,
  newLabel,
}: AdminPageHeaderProps) {
  return (
    <header className="mb-10 space-y-4">
      {backHref && backLabel && <AdminBackLink href={backHref} label={backLabel} />}
      <div className="flex items-end justify-between gap-6">
        <div>
          <p
            className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em]"
            style={{
              fontFamily: "ui-monospace, monospace",
              color: "var(--accent)",
            }}
          >
            {eyebrow}
          </p>
          <h1
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
          >
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
              {description}
            </p>
          )}
        </div>
        {newHref && newLabel && (
          <Link
            href={newHref}
            className="inline-flex shrink-0 items-center gap-2 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-opacity hover:opacity-90"
            style={{
              background: "var(--accent)",
              color: "var(--accent-foreground)",
            }}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            {newLabel}
          </Link>
        )}
      </div>
    </header>
  );
}
