import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: "#1A2B4A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 96,
        }}
      >
        {/* Outer gold ring */}
        <div
          style={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            border: "6px solid #C9A84C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
        {/* ∞ symbol */}
        <svg
          width="280"
          height="140"
          viewBox="0 0 280 140"
          fill="none"
        >
          {/* Left loop */}
          <path
            d="M 70 70 C 70 40, 30 20, 10 40 C -10 60, -10 80, 10 100 C 30 120, 80 110, 140 70"
            stroke="#C9A84C"
            strokeWidth="18"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right loop */}
          <path
            d="M 140 70 C 200 30, 250 20, 270 40 C 290 60, 290 80, 270 100 C 250 120, 210 110, 140 70"
            stroke="#C9A84C"
            strokeWidth="18"
            strokeLinecap="round"
            fill="none"
          />
          {/* Inner highlights */}
          <path
            d="M 70 70 C 70 40, 30 20, 10 40"
            stroke="#E8C97A"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 210 70 C 210 40, 250 20, 270 40"
            stroke="#E8C97A"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
        </svg>
        {/* "8th" text */}
        <div
          style={{
            position: "absolute",
            bottom: 88,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <span
            style={{
              color: "#C9A84C",
              fontSize: 36,
              fontWeight: 700,
              fontFamily: "serif",
              letterSpacing: 2,
            }}
          >
            8
          </span>
          <span
            style={{
              color: "#C9A84C",
              fontSize: 22,
              fontWeight: 400,
              fontFamily: "serif",
              marginTop: -8,
            }}
          >
            th
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
