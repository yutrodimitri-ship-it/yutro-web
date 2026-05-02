"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function DeleteTalentButton({
  code,
  redirectTo,
}: {
  code: string;
  redirectTo: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (
      !confirm(
        `¿Desactivar talento ${code}? El cliente dejará de verlo en el catálogo.`
      )
    ) {
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/studio/talent/admin/talents/${code}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push(redirectTo);
      router.refresh();
    } else {
      alert("No se pudo desactivar.");
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 border border-red-500/40 bg-red-500/5 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-50"
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      Desactivar talento
    </button>
  );
}
