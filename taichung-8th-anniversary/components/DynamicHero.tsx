"use client";

import React, { useMemo } from "react";

interface DynamicHeroProps {
  bitmask: number;
  compact?: boolean;
}

export const DynamicHero: React.FC<DynamicHeroProps> = ({ bitmask }) => {
  const count = useMemo(() => {
    let c = 0, b = bitmask;
    while (b > 0) { if (b & 1) c++; b >>= 1; }
    return c;
  }, [bitmask]);

  const t = count / 8; // 0（未集） → 1（集滿）

  // ∞ 水印顏色：藍 #2B5CE6 → 琥珀 #C9A84C
  const wmR = Math.round(43  + t * 158);
  const wmG = Math.round(92  + t * 76);
  const wmB = Math.round(230 - t * 154);
  const wmOpacity = 0.04 + t * 0.05;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* 1. 基底 */}
      <div className="absolute inset-0" style={{ backgroundColor: "#F5F2ED" }} />

      {/* 2. 藍色光暈 — 初始狀態，隨集章淡出 */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 65% 35%, rgba(43,92,230,0.22) 0%, transparent 70%)",
          opacity: 1 - t,
        }}
      />

      {/* 3. 琥珀光暈 — 隨集章淡入 */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 65% 35%, rgba(201,168,76,0.28) 0%, transparent 70%)",
          opacity: t,
        }}
      />

      {/* 4. 極細格線 */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(#1A2B4A 0.5px, transparent 0.5px),
            linear-gradient(90deg, #1A2B4A 0.5px, transparent 0.5px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* 5. ∞ 大字水印 — 藍→琥珀色變 */}
      <div className="absolute inset-0 flex items-center justify-center select-none">
        <span
          className="font-heading font-semibold transition-all duration-1000 ease-out"
          style={{
            fontSize: "clamp(12rem, 60vw, 26rem)",
            color: `rgba(${wmR}, ${wmG}, ${wmB}, ${wmOpacity})`,
            transform: `rotate(90deg) scale(${1 + t * 0.04})`,
            filter: `blur(${Math.max(0, 3 - t * 3)}px)`,
          }}
        >
          8
        </span>
      </div>

      {/* 6. 底部漸層收邊 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1A2B4A]/10" />

      {/* 7. 集滿閃光 */}
      {count === 8 && (
        <div className="absolute inset-0 animate-shine opacity-20" />
      )}
    </div>
  );
};

export default DynamicHero;
