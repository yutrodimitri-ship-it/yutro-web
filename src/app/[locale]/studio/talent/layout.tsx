import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { userHasTalentAccess } from "@/lib/talent/data-source";

/**
 * Guard del modulo Talent.
 *
 * Si el usuario no tiene acceso (no esta en TALENT_CLIENT_EMAILS) lo regresa
 * al hub /studio. La auth base ya la maneja el layout padre /studio/layout.tsx.
 *
 * En Fase 2 esta verificacion se hace contra DB:
 *   `SELECT 1 FROM projects WHERE contact_email = $1 AND status = 'active'`
 */
export default async function TalentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await verifySession();

  if (!session) redirect(`/${locale}/studio/login`);
  if (session.role !== "admin" && !(await userHasTalentAccess(session.email)))
    redirect(`/${locale}/studio`);

  return <>{children}</>;
}
