import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";

export default async function StudioHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await verifySession();
  if (!session) redirect(`/${locale}/studio/login`);

  if (session.role === "admin") redirect(`/${locale}/studio/talent/admin`);

  redirect(`/${locale}/studio/talent`);
}
