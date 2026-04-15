import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, generations } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { Sparkles, ImageIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { GenerationList } from "@/components/studio/GenerationList";

export default async function StudioDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await verifySession();
  const { locale } = await params;
  if (!session) redirect(`/${locale}/studio/login`);

  const [[user], recentGenerations, [{ total }]] = await Promise.all([
    db.select({ name: users.name, credits: users.credits }).from(users).where(eq(users.id, session.userId)).limit(1),
    db.select().from(generations).where(eq(generations.userId, session.userId)).orderBy(desc(generations.createdAt)).limit(8),
    db.select({ total: count() }).from(generations).where(eq(generations.userId, session.userId)),
  ]);

  if (!user) redirect(`/${locale}/studio/login`);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-white/50">Dashboard</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Hola, {user.name}
          </h1>
        </div>
        <Link
          href={`/${locale}/studio/generate`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Sparkles className="h-4 w-4" />
          Crear Avatar
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-xl border border-[#222] bg-[#1a1a1a] px-6 py-5">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-5 w-5 text-white/50" />
            <p className="text-sm text-white/50">Avatares generados</p>
          </div>
          <p className="mt-2 text-3xl font-bold tracking-tight">{total}</p>
        </div>

        <div className="rounded-xl border border-[#222] bg-[#1a1a1a] px-6 py-5">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-white/50" />
            <p className="text-sm text-white/50">Créditos disponibles</p>
          </div>
          <p className="mt-2 text-3xl font-bold tracking-tight">{user.credits}</p>
        </div>
      </div>

      {/* Recent generations */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">
            Recientes
          </h2>
          {recentGenerations.length > 0 && (
            <Link
              href={`/${locale}/studio/history`}
              className="inline-flex items-center gap-1 text-sm text-white/40 transition-colors hover:text-white"
            >
              Ver todo
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {recentGenerations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#333] px-8 py-16 text-center">
            <p className="text-sm text-white/50">
              Aún no tienes avatares.{" "}
              <Link href={`/${locale}/studio/generate`} className="font-medium text-primary hover:underline">
                Crea el primero
              </Link>
            </p>
          </div>
        ) : (
          <GenerationList
            generations={recentGenerations.map((g) => ({
              id: g.id,
              gender: g.gender,
              wardrobePreset: g.wardrobePreset,
              status: g.status,
              createdAt: g.createdAt?.toISOString() || "",
            }))}
            locale={locale}
          />
        )}
      </div>
    </div>
  );
}
