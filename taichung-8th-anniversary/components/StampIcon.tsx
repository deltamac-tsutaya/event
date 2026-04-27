"use client";

import React from "react";

type P = { className?: string; style?: React.CSSProperties };

// Monochrome icons: CSS mask lets them follow currentColor.
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

// Coloured icons: rendered as <img> to preserve original SVG colours.
function ImgIcon({ src, className, style }: { src: string } & P) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={className} style={{ display: "inline-block", ...style }} />
  );
}

// Monochrome stamps (01–08): follow currentColor via CSS mask.
const MONO_ICONS: Record<string, string> = {
  "01": "/endless_1745143%202.svg",
  "02": "/african-drum_520119%202.svg",
  "03": "/wind_3026423%202.svg",
  "04": "/acorn_120142%202.svg",
  "05": "/open-book_2702134%202.svg",
  "06": "/coffee_391898%202.svg",
  "07": "/flare_14778858%202.svg",
  "08": "/flower_6778042%202.svg",
};

// Coloured hidden stamps (A/B/C): preserve original SVG colours.
const COLOR_ICONS: Record<string, string> = {
  "A": "/squirrel-color.svg",
  "B": "/bird-color.svg",
  "C": "/deer-color.svg",
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
  const monoSrc = MONO_ICONS[stampId];
  if (monoSrc) return <MaskIcon src={monoSrc} className={className} style={style} />;

  const colorSrc = COLOR_ICONS[stampId];
  if (colorSrc) return <ImgIcon src={colorSrc} className={className} style={style} />;

  return null;
}
