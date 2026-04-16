import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getCachedImage } from "@/lib/studio/image-cache";

const SAFE_FILENAME = /^[a-zA-Z0-9_.-]+\.png$/;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename } = await params;

  // Prevent path traversal
  if (!SAFE_FILENAME.test(filename) || filename.includes("..")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  // Try in-memory cache first (cloud-generated images)
  const cached = getCachedImage(filename);
  if (cached) {
    return new NextResponse(new Uint8Array(cached), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  }

  // Fallback: try tunnel (for old/in-progress generations)
  const tunnelUrl = process.env.COMFY_TUNNEL_URL;
  if (tunnelUrl) {
    const tunnelSecret = process.env.COMFY_TUNNEL_SECRET || "";
    try {
      const res = await fetch(`${tunnelUrl}/images/${filename}`, {
        headers: tunnelSecret ? { "X-Tunnel-Secret": tunnelSecret } : {},
      });
      if (res.ok) {
        return new NextResponse(res.body, {
          headers: {
            "Content-Type": res.headers.get("Content-Type") || "image/png",
            "Cache-Control": "public, max-age=86400, immutable",
          },
        });
      }
    } catch {
      // Tunnel unavailable, fall through to 404
    }
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
