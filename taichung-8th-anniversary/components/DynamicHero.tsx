"use client";

import React, { useMemo } from "react";

interface DynamicHeroProps {
  bitmask: number; // 0–255
  compact?: boolean;
}

/**
 * 印章在背景網格中的相對座標 (百分比)
 * 這裡採用隨機但平衡的佈局，確保在 Hero 區域分布均勻
 */
const STAMP_POSITIONS = [
  { x: 18, y: 28 },
  { x: 45, y: 22 },
  { x: 78, y: 32 },
  { x: 12, y: 58 },
  { x: 38, y: 68 },
  { x: 62, y: 52 },
  { x: 88, y: 72 },
  { x: 52, y: 88 },
];

export const DynamicHero: React.FC<DynamicHeroProps> = ({
  bitmask,
  compact,
}) => {
  // 計算已收集的印章數量
  const count = useMemo(() => {
    let c = 0;
    let b = bitmask;
    while (b > 0) {
      if (b & 1) c++;
      b >>= 1;
    }
    return c;
  }, [bitmask]);

  /**
   * 漸進式視覺層次設計：
   * 1. 背景色相漸變 (灰 -> 米 -> 金)
   * 0枚: HSL(40, 4%, 96%) - 淺冷灰
   * 8枚: HSL(45, 35%, 90%) - 暖金色
   */
  const bgColor = `hsl(${40 + count * 0.6}, ${4 + count * 4}%, ${96 - count * 0.8}%)`;

  /**
   * 關鍵節點動畫觸發
   */
  const getMilestoneClass = () => {
    if (count === 8) return "animate-hero-complete";
    if (count === 7) return "animate-hero-near";
    if (count >= 4) return "animate-hero-half";
    return "";
  };

  return (
    <div
      className={`absolute inset-0 overflow-hidden transition-colors duration-1000 ease-in-out pointer-events-none ${getMilestoneClass()}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* 1. 基底層：0.5pt 極細格線 */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-navy, #1A2B4A) 0.5px, transparent 0.5px),
            linear-gradient(90deg, var(--color-navy, #1A2B4A) 0.5px, transparent 0.5px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* 2. ∞ 水印錨點 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          className="font-heading font-semibold transition-all duration-1000 ease-out"
          style={{
            fontSize: "clamp(12rem, 60vw, 26rem)",
            color: "rgba(26, 43, 74, 0.04)",
            transform: `rotate(90deg) scale(${1 + count * 0.025})`,
            filter: `blur(${Math.max(0, 4 - count * 0.5)}px)`,
          }}
        >
          8
        </span>
      </div>

      {/* 3. 裝飾密度 (背景花紋 ∞ 符號與光點) */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: Math.floor(count * 1.5) }).map((_, i) => (
          <div
            key={i}
            className="absolute text-[#1A2B4A]/5 font-serif transition-opacity duration-1000"
            style={{
              left: `${(i * 167) % 100}%`,
              top: `${(i * 131) % 100}%`,
              fontSize: `${12 + (i % 3) * 8}px`,
              transform: `rotate(${(i * 45) % 360}deg)`,
              opacity: 0.3 + (count / 8) * 0.7,
            }}
          >
            ∞
          </div>
        ))}
      </div>

      {/* 4. 印章層：依 bitmask 決定狀態 */}
      <div className="absolute inset-0">
        {STAMP_POSITIONS.map((pos, i) => {
          const isCollected = (bitmask >> i) & 1;
          return (
            <div
              key={i}
              className="absolute transition-all duration-700 ease-out"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
                opacity: compact ? 0.3 : 0.8,
                scale: compact ? "0.6" : "1",
              }}
            >
              <StampIcon id={i + 1} collected={!!isCollected} />
            </div>
          );
        })}
      </div>

      {/* 5. 漸層疊加：增加質感深淺 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1A2B4A]/10" />
      
      {/* 額外動畫：集滿時的光影效果 */}
      {count === 8 && (
        <div className="absolute inset-0 animate-shine opacity-30 pointer-events-none" />
      )}
    </div>
  );
};

const StampIcon = ({ id, collected }: { id: number; collected: boolean }) => {
  const formattedId = id.toString().padStart(2, "0");
  
  // 品牌色定義
  const colorActive = "#C9A84C"; // 質感金
  const colorInactive = "#B0AEAD"; // 灰階
  const nexusBlue = "#2B5CE6"; // Nexus Blue 點綴

  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-sm"
    >
      {/* 外圈 */}
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke={collected ? colorActive : colorInactive}
        strokeWidth={collected ? "1.5" : "1"}
        strokeDasharray={collected ? "0" : "4 3"}
        className="transition-all duration-1000"
      />
      
      {/* 內裝飾 */}
      {collected && (
        <>
          <circle
            cx="32"
            cy="32"
            r="24"
            fill={colorActive}
            fillOpacity="0.06"
            className="animate-pulse"
          />
          <path
            d="M32 8L34 12M32 56L30 52M56 32L52 30M8 32L12 34"
            stroke={nexusBlue}
            strokeWidth="1"
            strokeOpacity="0.4"
          />
        </>
      )}

      {/* 數字 */}
      <text
        x="32"
        y="38"
        textAnchor="middle"
        fontFamily="var(--font-serif)"
        fontSize="18"
        fontWeight="bold"
        fill={collected ? colorActive : colorInactive}
        className="transition-all duration-1000 tabular-nums"
        style={{ letterSpacing: "0.05em" }}
      >
        {formattedId}
      </text>
    </svg>
  );
};

export default DynamicHero;
