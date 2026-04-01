import { NextResponse } from "next/server";
import { generateCsrfToken } from "@/lib/csrf";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed, resetIn } = await checkRateLimit(`csrf:${ip}`, 10, 60_000);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(Math.ceil(resetIn / 1000)) } }
    );
  }

  const { token, signature } = generateCsrfToken();

  const response = NextResponse.json({ csrfToken: token });
  response.cookies.set("csrf_sig", signature, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 3600,
  });

  return response;
}
