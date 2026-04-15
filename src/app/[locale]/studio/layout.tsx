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

  let userName = "";
  let credits = 0;

  if (session) {
    const [user] = await db
      .select({ name: users.name, credits: users.credits })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);
    if (user) {
      userName = user.name;
      credits = user.credits;
    }
  }

  if (!session) {
    return <div className="h-screen bg-[#141414] text-white">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-[#141414] text-white">
      <StudioSidebar
        locale={locale}
        role={session.role}
        userName={userName}
        credits={credits}
      />
      <main className="flex-1 overflow-y-auto bg-[#141414]">
        <div className="mx-auto max-w-5xl px-4 py-6 pt-16 sm:px-8 sm:py-10 md:pt-10">
          {children}
        </div>
      </main>
    </div>
  );
}
