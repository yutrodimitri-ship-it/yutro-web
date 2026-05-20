import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifySession } from "@/lib/auth";
import { getProjectBySlug, getUsersForProject } from "@/lib/talent/data-source";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectSlug } = await params;

  const project = await getProjectBySlug(projectSlug);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [userRow] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  const activeEmail = session.email.toLowerCase();
  const activeUserName = userRow?.name ?? activeEmail.split("@")[0];

  const projectUsers = await getUsersForProject(projectSlug);
  const otherUsers = projectUsers.filter((u) => u.email !== activeEmail);

  return NextResponse.json({
    projectName: project.name,
    activeUserName,
    activeUserEmail: activeEmail,
    otherUsers,
  });
}
