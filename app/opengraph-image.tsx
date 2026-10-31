import { ImageResponse } from "next/og";

export const alt = "Terrantia, a beachfront retreat";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #0d3640 0%, #09222a 55%, #07181e 100%)",
          color: "#f6faf9",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 40, left: 40, right: 40, bottom: 40, border: "1px solid rgba(246,250,249,0.18)", display: "flex" }} />
        <div style={{ fontSize: 184, lineHeight: 1, fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: -4 }}>Terrantia</div>
        <div style={{ marginTop: 36, width: 120, height: 3, background: "#0f6b73", display: "flex" }} />
        <div style={{ marginTop: 36, fontSize: 40, color: "#c4d8da", letterSpacing: 8, textTransform: "uppercase", display: "flex" }}>
          A beachfront retreat
        </div>
      </div>
    ),
    { ...size },
  );
}
