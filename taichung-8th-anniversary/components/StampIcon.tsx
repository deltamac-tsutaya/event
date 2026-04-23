"use client";

import React from "react";

type P = { className?: string; style?: React.CSSProperties };

// 01 — ∞ 無限
function InfinityIcon({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path strokeWidth="2" d="M12 12 C10 7.5 4 7.5 4 12 C4 16.5 10 16.5 12 12 C14 7.5 20 7.5 20 12 C20 16.5 14 16.5 12 12" />
    </svg>
  );
}

// 02 — 陶杯
function CeramicCupIcon({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path strokeWidth="1.5" d="M7 9 L9 19 Q12 21 15 19 L17 9 Z" />
      <path strokeWidth="1.5" d="M6 9 Q12 7.5 18 9" />
      <path strokeWidth="1.5" d="M17 11 Q21 11 21 15 Q21 19 17 19" />
    </svg>
  );
}

// 03 — 風
function WindIcon({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" className={className} style={style}>
      <path strokeWidth="1.8" d="M3 9 Q6 7 9 9 Q12 11 15 9 Q18 7 21 9" />
      <path strokeWidth="1.8" d="M3 13 Q7 11 12 13 Q17 15 21 13" />
      <path strokeWidth="1.8" d="M6 17 Q9 15 12 17 Q15 19 18 17" />
    </svg>
  );
}

// 04 — 橡實
function AcornIcon({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <circle cx="12" cy="16" r="5.5" strokeWidth="1.5" />
      {/* cap (filled) */}
      <path d="M6.5 14 Q12 10.5 17.5 14 Q12 12.5 6.5 14Z" fill="currentColor" stroke="none" />
      <path strokeWidth="1.5" d="M12 10.5 L12 7" />
      <path strokeWidth="1.5" d="M12 7 Q14.5 5.5 16.5 6.5" />
    </svg>
  );
}

// 05 — 書
function BookIcon({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path strokeWidth="1.5" d="M12 7 Q7 5.5 3 7.5 L3 19 Q7 17 12 18.5" />
      <path strokeWidth="1.5" d="M12 7 Q17 5.5 21 7.5 L21 19 Q17 17 12 18.5" />
      <line x1="12" y1="7" x2="12" y2="18.5" strokeWidth="1" />
    </svg>
  );
}

// 06 — 咖啡
function CoffeeIcon({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path strokeWidth="1.5" d="M7 11 L9 19 Q12 21 15 19 L17 11 Z" />
      <path strokeWidth="1.5" d="M6 11 Q12 9.5 18 11" />
      <path strokeWidth="1.5" d="M17 13 Q21 13 21 16 Q21 19 17 19" />
      <path strokeWidth="1.5" d="M10 8 Q11 6 10 4" />
      <path strokeWidth="1.5" d="M14 8 Q15 6 14 4" />
    </svg>
  );
}

// 07 — 光點
function SparkleIcon({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" className={className} style={style}>
      <circle cx="12" cy="12" r="2.5" strokeWidth="1.5" />
      <line x1="12" y1="3.5" x2="12" y2="8"    strokeWidth="1.5" />
      <line x1="12" y1="16"  x2="12" y2="20.5" strokeWidth="1.5" />
      <line x1="3.5" y1="12" x2="8"   y2="12"  strokeWidth="1.5" />
      <line x1="16"  y1="12" x2="20.5" y2="12" strokeWidth="1.5" />
      <line x1="6"   y1="6"  x2="9.2" y2="9.2" strokeWidth="1.5" />
      <line x1="14.8" y1="14.8" x2="18" y2="18" strokeWidth="1.5" />
      <line x1="18"  y1="6"  x2="14.8" y2="9.2" strokeWidth="1.5" />
      <line x1="6"   y1="18" x2="9.2" y2="14.8" strokeWidth="1.5" />
    </svg>
  );
}

// 08 — 花朵  (5 petals at 72° intervals)
function FlowerIcon({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} style={style}>
      <circle cx="12"  cy="7"    r="3.5" strokeWidth="1.5" />
      <circle cx="7.2" cy="10.5" r="3.5" strokeWidth="1.5" />
      <circle cx="9.1" cy="16"   r="3.5" strokeWidth="1.5" />
      <circle cx="14.9" cy="16"  r="3.5" strokeWidth="1.5" />
      <circle cx="16.8" cy="10.5" r="3.5" strokeWidth="1.5" />
      {/* filled center covers overlap */}
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}

// A — 松鼠
function SquirrelIcon({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      {/* head */}
      <circle cx="10" cy="10" r="5" strokeWidth="1.5" />
      {/* ears */}
      <path strokeWidth="1.5" d="M7 6.5 L6 3 L10.5 5.5" />
      <path strokeWidth="1.5" d="M13 6.5 L14.5 3 L11 5.5" />
      {/* eyes */}
      <circle cx="8.5"  cy="9.5"  r="0.8" fill="currentColor" stroke="none" />
      <circle cx="11.5" cy="9.5"  r="0.8" fill="currentColor" stroke="none" />
      {/* nose */}
      <circle cx="10" cy="11.5" r="0.5" fill="currentColor" stroke="none" />
      {/* body */}
      <ellipse cx="10" cy="18.5" rx="4.5" ry="3" strokeWidth="1.5" />
      {/* bushy tail */}
      <path strokeWidth="2.5" d="M14.5 17 Q21 14 20 8 Q19 4 16 5.5" fill="none" />
    </svg>
  );
}

// B — 小鳥
function BirdIcon({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      {/* body */}
      <ellipse cx="10" cy="15" rx="6" ry="4.5" strokeWidth="1.5" />
      {/* head */}
      <circle cx="16.5" cy="10.5" r="3.5" strokeWidth="1.5" />
      {/* beak */}
      <path strokeWidth="1.5" d="M19.5 10 L22.5 9 L19.5 11.5" />
      {/* wing */}
      <path strokeWidth="1.5" d="M7 13.5 Q10 10.5 14 13.5" />
      {/* tail fan */}
      <path strokeWidth="1.5" d="M4 14.5 L2 12 M4 14.5 L2.5 15.5 M4 14.5 L2 18" />
      {/* eye */}
      <circle cx="17.5" cy="10" r="1.2" fill="currentColor" stroke="none" />
      {/* feet */}
      <path strokeWidth="1" d="M10 19.5 L9 22 M10 19.5 L11.5 22" />
      <path strokeWidth="1" d="M13 19.5 L12 22 M13 19.5 L14.5 22" />
    </svg>
  );
}

// C — 小鹿
function DeerIcon({ className, style }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      {/* head */}
      <path strokeWidth="1.5" d="M12 22 Q6.5 22 6.5 15 Q6.5 9 12 9 Q17.5 9 17.5 15 Q17.5 22 12 22Z" />
      {/* ears */}
      <ellipse cx="5"  cy="13" rx="2.5" ry="3.5" strokeWidth="1.5" />
      <ellipse cx="19" cy="13" rx="2.5" ry="3.5" strokeWidth="1.5" />
      {/* antlers */}
      <path strokeWidth="1.5" d="M9 9 L8.5 5 M8.5 5 L6.5 3 M8.5 5 L10.5 3" />
      <path strokeWidth="1.5" d="M15 9 L15.5 5 M15.5 5 L13.5 3 M15.5 5 L17.5 3" />
      {/* eyes */}
      <circle cx="9.5"  cy="14.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
      {/* nose */}
      <ellipse cx="12" cy="19.5" rx="2" ry="1.5" strokeWidth="1.5" />
    </svg>
  );
}

const ICON_MAP: Record<string, React.ComponentType<P>> = {
  "01": InfinityIcon,
  "02": CeramicCupIcon,
  "03": WindIcon,
  "04": AcornIcon,
  "05": BookIcon,
  "06": CoffeeIcon,
  "07": SparkleIcon,
  "08": FlowerIcon,
  "A":  SquirrelIcon,
  "B":  BirdIcon,
  "C":  DeerIcon,
};

export function StampIcon({ stampId, className, style }: { stampId: string; className?: string; style?: React.CSSProperties }) {
  const Icon = ICON_MAP[stampId];
  if (!Icon) return null;
  return <Icon className={className} style={style} />;
}
