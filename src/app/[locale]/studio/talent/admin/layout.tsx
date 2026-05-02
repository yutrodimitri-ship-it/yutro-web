import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";

/**
 * Guard del panel admin Talent.
 *
 * Requiere `role === "admin"`. Sin sesion → login. No-admin → /studio.
 * El layout padre /studio/layout.tsx ya monta sidebar + chrome.
 */
export default async function TalentAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await verifySession();

  if (!session) redirect(`/${locale}/studio/login`);
  if (session.role !== "admin") redirect(`/${locale}/studio`);

  return <div data-talent="admin">{children}</div>;
}
