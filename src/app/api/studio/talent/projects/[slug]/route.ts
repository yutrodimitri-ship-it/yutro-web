import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import {
  getProjectBySlug,
  userHasTalentAccess,
} from "@/lib/talent/data-source";

/**
 * GET /api/studio/talent/projects/[slug]
 *
 * Devuelve la configuracion del proyecto Talent. Auth + ownership obligatorios.
 *
 *   401  sin cookie de sesion valida
 *   403  email autenticado pero sin acceso al modulo Talent
 *   404  slug inexistente
 *   200  ProjectConfig (no-store; cookie-scoped)
 *
 * En Sprint 5 los layouts/pages siguen leyendo via `data-source.ts` directo
 * desde el server. Esta API queda lista para client-side fetching futuro y
 * para validar que el contrato funciona end-to-end.
 */
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  const project = await getProjectBySlug(slug);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const hasAccess = await userHasTalentAccess(session.email);
  if (!hasAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(project, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
