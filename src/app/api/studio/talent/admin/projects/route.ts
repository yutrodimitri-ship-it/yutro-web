import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { talentProjects } from "@/db/schema";
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

export async function GET() {
  const guard = await requireAdminSession();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const rows = await db.select().from(talentProjects);
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const guard = await requireAdminSession();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const body = await request.json().catch(() => null);
  const parsed = projectInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 }
    );
  }

  const existing = await db
    .select({ slug: talentProjects.slug })
    .from(talentProjects)
    .where(eq(talentProjects.slug, parsed.data.slug))
    .limit(1);
  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Project slug already exists" },
      { status: 409 }
    );
  }

  await db.insert(talentProjects).values(parsed.data);

  await logAuditEventServer("admin_project_created", {
    userEmail: guard.session.email,
    projectSlug: parsed.data.slug,
    payload: { name: parsed.data.name, client: parsed.data.client },
  });

  return NextResponse.json({ ok: true, slug: parsed.data.slug }, { status: 201 });
}
