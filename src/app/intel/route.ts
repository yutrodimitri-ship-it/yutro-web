import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await verifySession();

  if (!session) {
    return NextResponse.redirect(new URL("/es/studio/login", "https://yutro.cl"));
  }

  const [user] = await db
    .select({ canAccessIntel: users.canAccessIntel, role: users.role })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  const hasAccess = user?.canAccessIntel || user?.role === "admin";

  if (!hasAccess) {
    return new NextResponse(
      `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
      <title>Acceso denegado — YUTRO</title>
      <style>
        body { font-family: system-ui, sans-serif; background: #080808; color: #F0EDE8;
               display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .box { text-align: center; }
        .logo { font-size: 28px; font-weight: 900; letter-spacing: -0.04em; margin-bottom: 16px; }
        .logo em { color: #ff7404; font-style: italic; }
        h1 { font-size: 16px; color: #A09890; font-weight: 400; }
        a { color: #ff7404; text-decoration: none; font-size: 13px; margin-top: 24px; display: inline-block; }
      </style></head>
      <body><div class="box">
        <div class="logo"><em>Y</em>UTRO — Intel</div>
        <h1>No tienes acceso a esta sección.</h1>
        <p style="color:#5A524A;font-size:13px;">Contacta al administrador para obtener acceso.</p>
        <a href="/es/studio">← Volver al Studio</a>
      </div></body></html>`,
      { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  const htmlPath = path.join(process.cwd(), "public", "intel", "dashboard.html");
  const html = await fs.readFile(htmlPath, "utf-8");

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}