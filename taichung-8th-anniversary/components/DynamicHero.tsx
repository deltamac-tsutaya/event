"use client";

import React, { useMemo } from "react";

interface DynamicHeroProps {
  bitmask: number;
  compact?: boolean;
  infinityMode?: boolean;
}

export const DynamicHero: React.FC<DynamicHeroProps> = ({ bitmask, infinityMode = false }) => {
  const count = useMemo(() => {
    let c = 0, b = bitmask;
    while (b > 0) { if (b & 1) c++; b >>= 1; }
    return c;
  }, [bitmask]);

  const t = count / 8; // 0（未集） → 1（集滿）

  // 水印色（僅在集章模式用）：藍 #2B5CE6 → 琥珀 #C9A84C
  const wmR = Math.round(43  + t * 158);
  const wmG = Math.round(92  + t * 76);
  const wmB = Math.round(230 - t * 154);
  const wmOpacity = 0.04 + t * 0.05;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* 1. 基底 — 米白 ↔ 深藍夜空 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: infinityMode ? "#0D1B36" : "#F5F2ED",
          transition: "background-color 0.7s ease-in-out",
        }}
      />

      {/* 2. 藍色光暈 — 集章淡出，infinity mode 隱藏 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 65% 35%, rgba(43,92,230,0.22) 0%, transparent 70%)",
          opacity: infinityMode ? 0 : 1 - t,
          transition: "opacity 0.7s ease-in-out",
        }}
      />

      {/* 3. 琥珀光暈 — 集章淡入，infinity mode 最強 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 65% 35%, rgba(201,168,76,0.28) 0%, transparent 70%)",
          opacity: infinityMode ? 1 : t,
          transition: "opacity 0.7s ease-in-out",
        }}
      />

      {/* 4. 格線 — 深藍 ↔ 金色 */}
      <div
        className="absolute inset-0"
        style={{
          opacity: infinityMode ? 0.12 : 0.07,
          backgroundImage: `
            linear-gradient(${infinityMode ? "#C9A84C" : "#1A2B4A"} 0.5px, transparent 0.5px),
            linear-gradient(90deg, ${infinityMode ? "#C9A84C" : "#1A2B4A"} 0.5px, transparent 0.5px)
          `,
          backgroundSize: "40px 40px",
          transition: "opacity 0.7s ease-in-out",
        }}
      />

      {/* 5. 水印符號 — "8" ↔ "∞" */}
      <div className="absolute inset-0 flex items-center justify-center select-none">
        <span
          className={`font-heading font-semibold ${infinityMode ? "animate-infinity-breathe" : ""}`}
          style={{
            fontSize: "clamp(12rem, 60vw, 26rem)",
            color: infinityMode
              ? "rgba(201,168,76,0.85)"
              : `rgba(${wmR}, ${wmG}, ${wmB}, ${wmOpacity})`,
            transform: infinityMode ? "scale(1.1)" : `rotate(90deg) scale(${1 + t * 0.04})`,
            filter: infinityMode
              ? "drop-shadow(0 0 40px rgba(201,168,76,0.4))"
              : `blur(${Math.max(0, 3 - t * 3)}px)`,
            transition: "color 0.7s ease-in-out, transform 0.7s ease-in-out, filter 0.7s ease-in-out",
          }}
        >
          {infinityMode ? "∞" : "8"}
        </span>
      </div>

      {/* 6. 底部漸層收邊 */}
      <div
        className="absolute inset-0"
        style={{
          background: infinityMode
            ? "linear-gradient(to bottom, transparent, transparent, rgba(201,168,76,0.1))"
            : "linear-gradient(to bottom, transparent, transparent, rgba(26,43,74,0.1))",
          transition: "background 0.7s ease-in-out",
        }}
      />

      {/* 7. 集滿閃光（僅集章模式） */}
      {count === 8 && !infinityMode && (
        <div className="absolute inset-0 animate-shine opacity-20" />
      )}
    </div>
  );
};

export default DynamicHero;
