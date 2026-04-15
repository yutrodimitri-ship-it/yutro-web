import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const session = await verifySession();
  const { locale } = await params;

  if (!session || session.role !== "admin") {
    redirect(`/${locale}/studio/dashboard`);
  }

  return <>{children}</>;
}
