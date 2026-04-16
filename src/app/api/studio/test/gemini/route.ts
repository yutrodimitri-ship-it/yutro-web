export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { testConnection } from "@/lib/studio/gemini";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await testConnection();
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
