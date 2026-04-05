import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: 800, color: "#0a0a0a" }}>
          Y.
        </span>
      </div>
    ),
    size
  );
}
