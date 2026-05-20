import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, talentProjectAccess, talentProjects } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { z } from "zod";
import { logAuditEventServer } from "@/lib/talent/audit-log-server";
import { diffAccessChanges } from "@/lib/talent/access-diff";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  projectSlugs: z.array(z.string().min(1)).min(1, "Se requiere al menos un proyecto"),
});

/**
 * PATCH /api/studio/admin/users/[id]/access
 * Reemplaza el set completo de proyectos donde el user tiene acceso activo.
 * - Proyectos nuevos: insert o "unrevoke" si ya existía row con revokedAt set.
 * - Proyectos quitados: soft-delete (revokedAt = now).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;

    const body = await request.json();
    const data = patchSchema.parse(body);

    const [user] = await db.select({ email: users.email }).from(users).where(eq(users.id, id)).limit(1);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const email = user.email.toLowerCase();

    // Validar que todos los proyectos existen
    const existingProjects = await db
      .select({ slug: talentProjects.slug })
      .from(talentProjects)
      .where(inArray(talentProjects.slug, data.projectSlugs));
    if (existingProjects.length !== data.projectSlugs.length) {
      return NextResponse.json({ error: "Uno o más proyectos no existen" }, { status: 422 });
    }

    // Estado actual: todas las rows del user (incl. revocadas)
    const existing = await db
      .select()
      .from(talentProjectAccess)
      .where(eq(talentProjectAccess.userEmail, email));

    const { toCreate, toReactivate, toRevoke } = diffAccessChanges(
      existing,
      data.projectSlugs
    );

    await db.transaction(async (tx) => {
      if (toCreate.length) {
        await tx.insert(talentProjectAccess).values(
          toCreate.map((slug) => ({
            projectSlug: slug,
            userEmail: email,
            grantedBy: session.userId,
          }))
        );
      }
      for (const row of toReactivate) {
        await tx
          .update(talentProjectAccess)
          .set({ revokedAt: null, grantedAt: new Date(), grantedBy: session.userId })
          .where(eq(talentProjectAccess.id, row.id));
      }
      if (toRevoke.length) {
        await tx
          .update(talentProjectAccess)
          .set({ revokedAt: new Date() })
          .where(
            and(
              eq(talentProjectAccess.userEmail, email),
              inArray(talentProjectAccess.projectSlug, toRevoke),
              isNull(talentProjectAccess.revokedAt)
            )
          );
      }
    });

    for (const slug of [...toCreate, ...toReactivate.map((r) => r.projectSlug)]) {
      await logAuditEventServer("admin_access_granted", {
        userEmail: session.email,
        projectSlug: slug,
        payload: { grantedTo: email, viaUserEdit: true },
      });
    }
    for (const slug of toRevoke) {
      await logAuditEventServer("admin_access_revoked", {
        userEmail: session.email,
        projectSlug: slug,
        payload: { revokedFrom: email, viaUserEdit: true },
      });
    }

    return NextResponse.json({ ok: true, projects: data.projectSlugs });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    if (msg === "Unauthorized") return NextResponse.json({ error: msg }, { status: 401 });
    if (msg === "Forbidden") return NextResponse.json({ error: msg }, { status: 403 });
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    console.error("PATCH /api/studio/admin/users/[id]/access error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
