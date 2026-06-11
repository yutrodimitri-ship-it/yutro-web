import { verifySession } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { StudioSidebar } from "@/components/studio/StudioSidebar";

export default async function StudioLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await verifySession();

  if (!session) {
    return <div className="h-screen bg-[#141414] text-white">{children}</div>;
  }

  const [user] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);
  const userName = user?.name ?? "";

  return (
    <div className="flex h-screen bg-[#141414] text-white">
      <StudioSidebar
        locale={locale}
        role={session.role}
        userName={userName}
      />
      <main className="flex-1 overflow-y-auto bg-[#141414]">
        <div className="px-6 py-6 pt-16 sm:px-10 sm:py-10 md:pt-10">
          {children}
        </div>
      </main>
    </div>
  );
}
