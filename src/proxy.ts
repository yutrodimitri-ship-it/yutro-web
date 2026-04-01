import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  // Skip i18n for studio, api, and static files
  if (
    pathname.startsWith("/studio") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    const response = NextResponse.next();
    applySecurityHeaders(response, nonce, isDev);

    // Prevent indexing of studio and api routes
    if (pathname.startsWith("/studio") || pathname.startsWith("/api")) {
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
    }

    return response;
  }

  // Pass nonce to request headers so Next.js can extract it
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = intlMiddleware(request);
  applySecurityHeaders(response, nonce, isDev);

  // Set nonce in request headers for downstream use
  response.headers.set("x-nonce", nonce);

  return response;
}

function applySecurityHeaders(
  response: NextResponse,
  nonce: string,
  isDev: boolean
) {
  // Content Security Policy with nonce
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'unsafe-inline'`,
    "connect-src 'self' https://*.sanity.io https://cdn.sanity.io",
    "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
    "img-src 'self' data: https://cdn.sanity.io blob:",
    "font-src 'self'",
    "media-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ]
    .join("; ")
    .trim();

  response.headers.set("Content-Security-Policy", csp);

  // Clickjacking protection
  response.headers.set("X-Frame-Options", "DENY");

  // MIME sniffing protection
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions policy — disable all sensitive APIs
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), magnetometer=(), gyroscope=(), accelerometer=()"
  );

  // Cross-Origin isolation headers
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  // HSTS only in production (2 years + preload)
  if (!isDev) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
