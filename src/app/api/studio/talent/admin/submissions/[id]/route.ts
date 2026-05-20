import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { castingSubmissions } from "@/db/schema";
import { verifySession } from "@/lib/auth";
import {
  SUBMISSION_STATUSES,
} from "@/lib/talent/admin-schemas";
import { logAuditEventServer } from "@/lib/talent/audit-log-server";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  status: z.enum(SUBMISSION_STATUSES).optional(),
  adminNotes: z.string().max(2000).nullable().optional(),
});

async function requireAdminSession() {
  const session = await verifySession();
  if (!session) return { error: "Unauthorized" as const, status: 401 };
  if (session.role !== "admin") {
    return { error: "Forbidden" as const, status: 403 };
  }
  return { session };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminSession();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { id } = await params;
  const [row] = await db
    .select()
    .from(castingSubmissions)
    .where(eq(castingSubmissions.id, id))
    .limit(1);
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(row);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdminSession();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 }
    );
  }

  const [existing] = await db
    .select({
      projectSlug: castingSubmissions.projectSlug,
      previousStatus: castingSubmissions.status,
    })
    .from(castingSubmissions)
    .where(eq(castingSubmissions.id, id))
    .limit(1);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) {
    updates.status = parsed.data.status;
    updates.reviewedAt = new Date();
    updates.reviewedBy = guard.session.userId;
  }
  if (parsed.data.adminNotes !== undefined) {
    updates.adminNotes = parsed.data.adminNotes;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: true });
  }

  await db
    .update(castingSubmissions)
    .set(updates)
    .where(eq(castingSubmissions.id, id));

  if (parsed.data.status) {
    await logAuditEventServer("admin_submission_status_changed", {
      userEmail: guard.session.email,
      projectSlug: existing.projectSlug,
      payload: {
        submissionId: id,
        from: existing.previousStatus,
        to: parsed.data.status,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
