"use client";

import React from "react";

type P = { className?: string; style?: React.CSSProperties };

// Uses SVG file from /public as a CSS mask, so it respects currentColor.
function MaskIcon({ src, className, style }: { src: string } & P) {
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        backgroundColor: "currentColor",
        WebkitMaskImage: `url('${src}')`,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskImage: `url('${src}')`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        ...style,
      }}
    />
  );
}

// stamp_id → 公開資料夾中的 SVG 路徑（空格需 %20 編碼）
const SVG_ICONS: Record<string, string> = {
  "01": "/endless_1745143%202.svg",
  "02": "/african-drum_520119%202.svg",
  "03": "/wind_3026423%202.svg",
  "04": "/acorn_120142%202.svg",
  "05": "/open-book_2702134%202.svg",
  "06": "/coffee_391898%202.svg",
  "07": "/flare_14778858%202.svg",
  "08": "/flower_6778042%202.svg",
  "A":  "/squirrel_1864554.svg",
  "B":  "/bird_7105157.svg",
  "C":  "/deer-illustration-1-svgrepo-com.svg",
};

export function StampIcon({
  stampId,
  className,
  style,
}: {
  stampId: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const src = SVG_ICONS[stampId];
  if (src) return <MaskIcon src={src} className={className} style={style} />;
  return null;
}
