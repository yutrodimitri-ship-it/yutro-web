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
};

export default withNextIntl(nextConfig);
