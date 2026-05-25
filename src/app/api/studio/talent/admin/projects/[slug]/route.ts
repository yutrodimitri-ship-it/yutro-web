import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { castingSubmissions, talentProjects } from "@/db/schema";
import { verifySession } from "@/lib/auth";
import { projectInputSchema } from "@/lib/talent/admin-schemas";
import { logAuditEventServer } from "@/lib/talent/audit-log-server";

export const dynamic = "force-dynamic";

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
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdminSession();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { slug } = await params;
  const [row] = await db
    .select()
    .from(talentProjects)
    .where(eq(talentProjects.slug, slug))
    .limit(1);
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(row);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdminSession();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { slug } = await params;
  const body = await request.json().catch(() => null);
  const parsed = projectInputSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 }
    );
  }

  // slug es immutable
  const { slug: _ignore, ...updates } = parsed.data;
  void _ignore;

  await db
    .update(talentProjects)
    .set(updates)
    .where(eq(talentProjects.slug, slug));

  await logAuditEventServer("admin_project_updated", {
    userEmail: guard.session.email,
    projectSlug: slug,
    payload: { fields: Object.keys(updates) },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdminSession();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const { slug } = await params;

  const [project] = await db
    .select({ slug: talentProjects.slug })
    .from(talentProjects)
    .where(eq(talentProjects.slug, slug))
    .limit(1);

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // castingSubmissions no tiene cascade — borrar manualmente antes del proyecto
  await db.delete(castingSubmissions).where(eq(castingSubmissions.projectSlug, slug));
  // talentProjectAccess y talentProjectNdaAcceptances tienen onDelete: cascade
  await db.delete(talentProjects).where(eq(talentProjects.slug, slug));

  await logAuditEventServer("admin_project_deleted", {
    userEmail: guard.session.email,
    projectSlug: slug,
    payload: {},
  });

  return NextResponse.json({ ok: true });
}
