import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, talentProjectAccess, talentProjects } from "@/db/schema";
import { requireAdmin, hashPassword } from "@/lib/auth";
import { and, desc, inArray, isNull } from "drizzle-orm";
import { z } from "zod";
import { logAuditEventServer } from "@/lib/talent/audit-log-server";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  projectSlugs: z.array(z.string().min(1)).min(1, "Se requiere al menos un proyecto"),
});

export async function GET() {
  try {
    await requireAdmin();
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        isActive: users.isActive,
        canAccessIntel: users.canAccessIntel,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    const emails = allUsers.map((u) => u.email.toLowerCase());
    const accessRows = emails.length
      ? await db
          .select({
            email: talentProjectAccess.userEmail,
            slug: talentProjectAccess.projectSlug,
          })
          .from(talentProjectAccess)
          .where(
            and(
              inArray(talentProjectAccess.userEmail, emails),
              isNull(talentProjectAccess.revokedAt)
            )
          )
      : [];

    const projectsByEmail = new Map<string, string[]>();
    for (const row of accessRows) {
      const arr = projectsByEmail.get(row.email) ?? [];
      arr.push(row.slug);
      projectsByEmail.set(row.email, arr);
    }

    const result = allUsers.map((u) => ({
      ...u,
      projects: projectsByEmail.get(u.email.toLowerCase()) ?? [],
    }));

    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    if (msg === "Unauthorized") return NextResponse.json({ error: msg }, { status: 401 });
    if (msg === "Forbidden") return NextResponse.json({ error: msg }, { status: 403 });
    console.error("GET /api/studio/admin/users error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await request.json();
    const data = createUserSchema.parse(body);

    const email = data.email.toLowerCase();
    const passwordHash = await hashPassword(data.password);

    // Validar que todos los proyectos existen
    const existingProjects = await db
      .select({ slug: talentProjects.slug })
      .from(talentProjects)
      .where(inArray(talentProjects.slug, data.projectSlugs));
    if (existingProjects.length !== data.projectSlugs.length) {
      return NextResponse.json({ error: "Uno o más proyectos no existen" }, { status: 422 });
    }

    const newUser = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(users)
        .values({
          email,
          passwordHash,
          name: data.name,
          role: "client",
        })
        .returning({
          id: users.id,
          email: users.email,
          name: users.name,
        });

      await tx.insert(talentProjectAccess).values(
        data.projectSlugs.map((slug) => ({
          projectSlug: slug,
          userEmail: email,
          grantedBy: session.userId,
        }))
      );

      return created;
    });

    for (const slug of data.projectSlugs) {
      await logAuditEventServer("admin_access_granted", {
        userEmail: session.email,
        projectSlug: slug,
        payload: { grantedTo: email, viaUserCreate: true },
      });
    }

    return NextResponse.json({ ...newUser, projects: data.projectSlugs }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    if (msg === "Unauthorized") return NextResponse.json({ error: msg }, { status: 401 });
    if (msg === "Forbidden") return NextResponse.json({ error: msg }, { status: 403 });
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    if (msg.includes("23505") || msg.includes("already exists") || (e as { code?: string })?.code === "23505") {
      return NextResponse.json({ error: "Ya existe un usuario con ese email" }, { status: 409 });
    }
    console.error("POST /api/studio/admin/users error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
