import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { getProjectsForUser } from "@/lib/talent/data-source";

/**
 * Entry point del modulo Talent.
 *
 * Fase 1 mock: el usuario tiene un solo proyecto activo (Samsung). Redirige
 * directo al catalogo de ese proyecto. La auth + access guard ya viven en
 * /studio/layout y /studio/talent/layout.
 *
 * Fase 2: si el usuario tiene varios proyectos, mostrara un selector aqui.
 */
export default async function TalentRootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await verifySession();
  // El layout padre ya habria redirigido — guard defensivo
  if (!session) redirect(`/${locale}/studio/login`);

  const projects = await getProjectsForUser(session.email);
  if (projects.length === 0) redirect(`/${locale}/studio`);

  // Fase 1: solo hay 1 proyecto en mock — redirigir directo
  redirect(`/${locale}/studio/talent/${projects[0].slug}`);
}
