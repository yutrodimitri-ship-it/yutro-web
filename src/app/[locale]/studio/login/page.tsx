"use client";

import { useActionState } from "react";
import { loginAction } from "../actions/auth";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function StudioLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);
  const params = useParams();
  const locale = (params.locale as string) || "es";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#141414] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="text-[28px] font-extrabold tracking-tight text-white">
            YUTRO<span className="text-primary">.</span>
          </h1>
          <p className="mt-1 text-[20px] text-white/30">studio</p>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="locale" value={locale} />

          {state?.error && (
            <div className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-xs font-medium text-white/50">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-[#222] bg-[#1a1a1a] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-white/30"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-xs font-medium text-white/50">Contraseña</label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-[#222] bg-[#1a1a1a] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-white/30"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm text-white/30 transition-colors hover:text-white/50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a yutro.cl
          </a>
        </div>
      </div>
    </div>
  );
}
