"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, createSession, deleteSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  let stage = "entry";
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const locale = (formData.get("locale") as string) || "es";

    if (!email || !password) {
      return { error: "Email y contraseña son requeridos" };
    }

    stage = "rate-limit";
    const headerList = await headers();
    const ip =
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateLimit = await checkRateLimit(
      `studio-login:${ip}`,
      5,
      15 * 60 * 1000
    );
    if (!rateLimit.allowed) {
      return {
        error: "Demasiados intentos. Intenta de nuevo en unos minutos.",
      };
    }

    stage = "db-select";
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        passwordHash: users.passwordHash,
        name: users.name,
        role: users.role,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    stage = "verify-user";
    if (!user || !user.isActive) {
      return { error: "Credenciales inválidas" };
    }

    stage = "verify-password";
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return { error: "Credenciales inválidas" };
    }

    stage = "create-session";
    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    stage = "redirect";
    redirect(`/${locale}/studio`);
  } catch (err) {
    // Next.js `redirect` throws a special error; don't catch that.
    const isRedirectError =
      err instanceof Error && /NEXT_REDIRECT/.test(err.message);
    if (isRedirectError) throw err;

    // TEMP diagnostic 3rd round: surface the actual failure stage + error
    // so we can see in the UI exactly where loginAction is dying.
    const e = err as Error & { code?: string; detail?: string; cause?: unknown };
    const c = e.cause as
      | (Error & { code?: string; detail?: string })
      | undefined;
    return {
      error: `DEBUG3 stage=${stage} code=${e.code ?? "?"} | ${e.message.slice(
        0,
        140
      )} | cause:${c?.code ?? "?"}:${c?.message?.slice(0, 140) ?? "?"}`,
    };
  }
}

export async function logoutAction(formData?: FormData) {
  await deleteSession();
  const locale = formData?.get("locale") as string || "es";
  redirect(`/${locale}/studio/login`);
}
