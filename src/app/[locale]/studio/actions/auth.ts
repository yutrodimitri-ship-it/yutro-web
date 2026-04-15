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
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const locale = formData.get("locale") as string || "es";

  if (!email || !password) {
    return { error: "Email y contraseña son requeridos" };
  }

  // Rate limiting: 5 attempts per 15 minutes per IP
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rateLimit = await checkRateLimit(`studio-login:${ip}`, 5, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return { error: "Demasiados intentos. Intenta de nuevo en unos minutos." };
  }

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

  if (!user || !user.isActive) {
    return { error: "Credenciales inválidas" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Credenciales inválidas" };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  redirect(`/${locale}/studio/dashboard`);
}

export async function logoutAction(formData?: FormData) {
  await deleteSession();
  const locale = formData?.get("locale") as string || "es";
  redirect(`/${locale}/studio/login`);
}
