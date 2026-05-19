import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { castingSubmissions } from "@/db/schema";
import { verifySession } from "@/lib/auth";
import { logAuditEventServer } from "@/lib/talent/audit-log-server";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  talentCode: z.string().min(1).max(16),
});

/**
 * PATCH /api/studio/talent/admin/submissions/[id]/release-talent
 *
 * Libera un talento individual de un casting confirmado.
 * - Lo quita de `shortlist` y `exclusives` del submission.
 * - Si la shortlist queda vacía, marca el submission como `rejected`.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid talentCode" }, { status: 422 });
  }
  const { talentCode } = parsed.data;

  const [submission] = await db
    .select()
    .from(castingSubmissions)
    .where(eq(castingSubmissions.id, id))
    .limit(1);
  if (!submission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (submission.status !== "confirmed") {
    return NextResponse.json(
      { error: "Solo se pueden liberar talentos de castings confirmados" },
      { status: 409 }
    );
  }

  const newShortlist = submission.shortlist.filter((c) => c !== talentCode);
  const newExclusives = submission.exclusives.filter((c) => c !== talentCode);

  // Si la shortlist queda vacía, marcamos el casting como rechazado
  const willEmpty = newShortlist.length === 0;

  await db
    .update(castingSubmissions)
    .set({
      shortlist: newShortlist,
      exclusives: newExclusives,
      ...(willEmpty
        ? { status: "rejected", reviewedAt: new Date(), reviewedBy: session.userId }
        : {}),
    })
    .where(eq(castingSubmissions.id, id));

  await logAuditEventServer("admin_talent_released", {
    userEmail: session.email,
    projectSlug: submission.projectSlug,
    talentCode,
    payload: {
      submissionId: id,
      castingEmptied: willEmpty,
    },
  });

  return NextResponse.json({
    ok: true,
    shortlist: newShortlist,
    exclusives: newExclusives,
    castingEmptied: willEmpty,
  });
}
