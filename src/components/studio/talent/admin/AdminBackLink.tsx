import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AdminBackLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 transition-colors hover:text-white"
    >
      <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
      {label}
    </Link>
  );
}
