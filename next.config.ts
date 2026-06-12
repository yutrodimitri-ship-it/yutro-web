import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

// Security headers are applied dynamically (with CSP nonce) in src/proxy.ts.
// Only static, non-CSP headers are set here as a fallback for static assets.
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "comfy.yutro.cl",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  // Silence the "Critical dependency: the request of a dependency is an expression"
  // warning emitted by @opentelemetry/instrumentation (transitive via
  // @sentry/node → @sentry/nextjs). It's a known false-positive: the dynamic
  // require is gated behind feature detection and never reached in our build.
  // See: https://github.com/open-telemetry/opentelemetry-js/issues/4297
  serverExternalPackages: [
    "@sentry/nextjs",
    "@sentry/node",
    "@opentelemetry/instrumentation",
    "@prisma/instrumentation",
  ],

  // Redirects 301 a nivel servidor — el brief Sprint 1 los pide
  // explicitos asi para preservar SEO de las URLs antiguas.
  //   /servicios -> /produccion        (Tarea 1.5)
  //   /influencer -> /casting/featured (Tarea 1.6)
  async redirects() {
    return [
      {
        source: "/:locale(es|en)/servicios",
        destination: "/:locale/produccion",
        permanent: true,
      },
      {
        source: "/:locale(es|en)/servicios/:path*",
        destination: "/:locale/produccion/:path*",
        permanent: true,
      },
      {
        source: "/:locale(es|en)/influencer",
        destination: "/:locale/casting/featured",
        permanent: true,
      },
      {
        source: "/:locale(es|en)/influencer/:path*",
        destination: "/:locale/casting/featured",
        permanent: true,
      },
      // Alias amigable: yutro.cl/catalogo -> /casting (canonica para SEO).
      // Sin locale tambien funciona: el middleware de next-intl resuelve.
      {
        source: "/catalogo",
        destination: "/es/casting",
        permanent: false,
      },
      {
        source: "/:locale(es|en)/catalogo",
        destination: "/:locale/casting",
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
