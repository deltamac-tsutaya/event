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
          background: "#6D28D9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 96,
        }}
      >
        {/* Shield shape */}
        <svg
          width="260"
          height="300"
          viewBox="0 0 260 300"
          fill="none"
        >
          {/* Shield body */}
          <path
            d="M 130 10 L 240 55 L 240 155 C 240 220, 180 270, 130 295 C 80 270, 20 220, 20 155 L 20 55 Z"
            fill="rgba(255,255,255,0.12)"
            stroke="rgba(255,255,255,0.9)"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          {/* Shield inner border */}
          <path
            d="M 130 32 L 222 70 L 222 158 C 222 212, 172 255, 130 276 C 88 255, 38 212, 38 158 L 38 70 Z"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Crown */}
          <g transform="translate(70, 95)">
            {/* Crown base */}
            <rect x="0" y="55" width="120" height="22" rx="4" fill="white" />
            {/* Crown body */}
            <path
              d="M 5 55 L 5 20 L 30 40 L 60 5 L 90 40 L 115 20 L 115 55 Z"
              fill="white"
            />
            {/* Crown jewels */}
            <circle cx="60" cy="10" r="7" fill="#A78BFA" />
            <circle cx="12" cy="22" r="5" fill="#A78BFA" />
            <circle cx="108" cy="22" r="5" fill="#A78BFA" />
          </g>
        </svg>
        {/* ADMIN label */}
        <div
          style={{
            position: "absolute",
            bottom: 82,
            display: "flex",
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 28,
              fontWeight: 700,
              fontFamily: "sans-serif",
              letterSpacing: 6,
            }}
          >
            ADMIN
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
