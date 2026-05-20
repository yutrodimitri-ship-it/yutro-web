import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, requireAdmin } from "@/lib/auth";
import { logAuditEventServer } from "@/lib/talent/audit-log-server";

/**
 * PATCH /api/studio/admin/users/[id]/password
 *
 * Admin-only password reset. Lets an admin set a new password for any
 * user without going through the email/magic-link flow. Useful when a
 * client forgets their credentials and asks the studio operator to
 * reset on their behalf.
 *
 * Returns:
 *   200 { ok: true }
 *   400 invalid payload (password under 8 chars)
 *   401 not signed in
 *   403 signed in but not admin
 *   404 user not found
 */
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  password: z.string().min(8, "Mínimo 8 caracteres").max(200),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;

    const body = await request.json().catch(() => null);
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      );
    }

    const [target] = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const passwordHash = await hashPassword(parsed.data.password);
    await db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, id));

    // Audit trail: log the password reset event (no payload of the new value)
    await logAuditEventServer("admin_password_reset", {
      userEmail: session.email,
      projectSlug: "_system",
      payload: { targetUserId: id, targetEmail: target.email },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    if (msg === "Unauthorized") return NextResponse.json({ error: msg }, { status: 401 });
    if (msg === "Forbidden") return NextResponse.json({ error: msg }, { status: 403 });
    console.error("PATCH /api/studio/admin/users/[id]/password error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
