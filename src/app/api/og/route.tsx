import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawTitle = searchParams.get("title") ?? "YUTRO.";
  // Sanitize: strip control chars, limit length to prevent layout abuse
  const title = rawTitle.replace(/[\x00-\x1F\x7F]/g, "").slice(0, 100) || "YUTRO.";
  const rawLocale = searchParams.get("locale") ?? "es";
  const locale = rawLocale === "en" ? "en" : "es";
  const subtitle =
    locale === "es"
      ? "Productora Audiovisual con IA"
      : "AI Audiovisual Production";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        {/* Brand accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #e8623a, #f0845c, #e8623a)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#e8623a",
            letterSpacing: "0.1em",
            marginBottom: "40px",
          }}
        >
          YUTRO.
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 30 ? "48px" : "64px",
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "24px",
            color: "#888888",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
