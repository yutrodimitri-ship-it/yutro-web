import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { castingSubmissions, talentProjects } from "@/db/schema";
import { verifySession } from "@/lib/auth";
import { sendCastingNotification } from "@/lib/talent/email";
import { logAuditEventServer } from "@/lib/talent/audit-log-server";

export const dynamic = "force-dynamic";

/**
 * POST /api/studio/talent/admin/submissions/[id]/resend
 *
 * Reenvia el email de notificacion del casting al equipo Yutro. Util cuando
 * Resend fallo en el submit original (registro `emailDeliveryStatus = 'failed'`).
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const [submission] = await db
    .select()
    .from(castingSubmissions)
    .where(eq(castingSubmissions.id, id))
    .limit(1);
  if (!submission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [project] = await db
    .select()
    .from(talentProjects)
    .where(eq(talentProjects.slug, submission.projectSlug))
    .limit(1);
  if (!project) {
    return NextResponse.json(
      { error: "Project missing" },
      { status: 404 }
    );
  }

  try {
    await sendCastingNotification({
      projectName: project.name,
      projectClient: project.client,
      projectSlug: project.slug,
      contactEmail: submission.userEmail,
      contactName: project.contactName,
      shortlist: submission.shortlist,
      exclusives: submission.exclusives,
      market: project.market,
      rightsDuration: project.rightsDurationEs,
      exclusivityMode: project.exclusivityMode,
      submissionId: submission.id,
      submittedAt: submission.submittedAt,
    });

    await db
      .update(castingSubmissions)
      .set({ emailDeliveryStatus: "sent" })
      .where(eq(castingSubmissions.id, id));

    await logAuditEventServer("admin_submission_email_resent", {
      userEmail: session.email,
      projectSlug: submission.projectSlug,
      payload: { submissionId: id },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin:resend-failed]", err);
    await db
      .update(castingSubmissions)
      .set({ emailDeliveryStatus: "failed" })
      .where(eq(castingSubmissions.id, id));
    return NextResponse.json(
      { error: "Email delivery failed" },
      { status: 502 }
    );
  }
}
