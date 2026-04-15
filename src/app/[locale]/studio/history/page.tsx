import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { generations } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { Clock, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { GenerationList } from "@/components/studio/GenerationList";

const PAGE_SIZE = 12;

export default async function HistoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await verifySession();
  const { locale } = await params;
  if (!session) redirect(`/${locale}/studio/login`);

  const { page: pageStr } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageStr || "1", 10));
  const offset = (currentPage - 1) * PAGE_SIZE;

  const [[{ total }], pageGenerations] = await Promise.all([
    db.select({ total: count() }).from(generations).where(eq(generations.userId, session.userId)),
    db.select().from(generations).where(eq(generations.userId, session.userId))
      .orderBy(desc(generations.createdAt)).limit(PAGE_SIZE).offset(offset),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Historial</h1>
          <p className="text-sm text-white/40">{total} generaciones</p>
        </div>
        <Link
          href={`/${locale}/studio/generate`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Sparkles className="h-4 w-4" />
          Crear Avatar
        </Link>
      </div>

      {pageGenerations.length === 0 && currentPage === 1 ? (
        <div className="rounded-xl border border-dashed border-[#222] p-12 text-center">
          <Clock className="mx-auto h-8 w-8 text-white/40" />
          <p className="mt-3 text-sm text-white/40">No tienes generaciones aun.</p>
          <Link
            href={`/${locale}/studio/generate`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="h-4 w-4" />
            Crear tu primer avatar
          </Link>
        </div>
      ) : (
        <>
          <GenerationList
            generations={pageGenerations.map((g) => ({
              id: g.id,
              gender: g.gender,
              wardrobePreset: g.wardrobePreset,
              status: g.status,
              createdAt: g.createdAt?.toISOString() || "",
            }))}
            locale={locale}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              {currentPage > 1 && (
                <Link href={`/${locale}/studio/history?page=${currentPage - 1}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#222] px-3 py-2 text-sm text-white/50 hover:bg-white/[0.04]">
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Link>
              )}
              <span className="px-3 text-sm text-white/40">{currentPage} / {totalPages}</span>
              {currentPage < totalPages && (
                <Link href={`/${locale}/studio/history?page=${currentPage + 1}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#222] px-3 py-2 text-sm text-white/50 hover:bg-white/[0.04]">
                  Siguiente <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
