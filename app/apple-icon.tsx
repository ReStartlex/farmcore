import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #5B5BD6 0%, #7A6CF0 100%)",
          color: "white",
          fontSize: 116,
          fontWeight: 800,
          borderRadius: 40,
        }}
      >
        F
      </div>
    ),
    { ...size }
  );
}
