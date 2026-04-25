"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { STAMP_META } from "./StampCard";
import { StampIcon } from "./StampIcon";
import { Button } from "@/components/ui/button";
import { X, Share2, Sparkles } from "lucide-react";

interface ScanResultOverlayProps {
  stampId: string;
  totalStamps: number;
  onClose: () => void;
}

const PARTICLES: { dx: number; dy: number }[] = [
  { dx: 55,  dy: -30 }, { dx: 20,  dy: -65 }, { dx: -20, dy: -65 },
  { dx: -55, dy: -30 }, { dx: -65, dy:  20 }, { dx: -40, dy:  60 },
  { dx: 0,   dy:  75 }, { dx: 40,  dy:  60 }, { dx: 65,  dy:  20 },
  { dx: 55,  dy:  30 },
];

export default function ScanResultOverlay({ stampId, totalStamps, onClose }: ScanResultOverlayProps) {
  const meta = STAMP_META[stampId];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  if (!meta) return null;

  const isHidden = !!meta.isHidden;
  const isComplete = !isHidden && totalStamps >= 8;

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 450);
  };

  // Header gradient: completion = navy→gold, hidden = navy→blue, regular = gold
  const headerGradient = isComplete
    ? "from-[#1A2B4A] to-[#C9A84C]"
    : isHidden
    ? "from-[#1A2B4A] to-[#3B82C4]"
    : "from-[#C9A84C] to-[#E5C97D]";

  const iconColor = isHidden ? "text-white" : isComplete ? "text-white" : "text-[#C9A84C]";
  const iconBg    = isHidden ? "bg-white/10" : isComplete ? "bg-white/15" : "bg-[#C9A84C]/10";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-6 transition-all duration-450 ${
        visible ? "bg-black/75 backdrop-blur-md opacity-100" : "bg-black/0 backdrop-blur-0 opacity-0"
      }`}
    >
      <div
        className={`relative w-full max-w-sm overflow-hidden rounded-3xl bg-[#F5F2ED] shadow-2xl transition-all duration-450 ${
          visible ? "scale-100 translate-y-0" : "scale-90 translate-y-8"
        }`}
      >
        {/* Header */}
        <div className={`h-28 w-full flex items-center justify-center bg-gradient-to-br ${headerGradient} relative overflow-hidden`}>
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 rounded-full bg-black/10 p-2 text-white/80 hover:bg-black/20 transition-colors z-10"
          >
            <X size={18} />
          </button>

          {/* Header label */}
          <div className="flex flex-col items-center gap-1">
            {isHidden ? (
              <Sparkles className="text-white animate-pulse" size={28} />
            ) : isComplete ? (
              <span className="text-white font-black text-sm tracking-widest">集章完成</span>
            ) : (
              <span className="text-white/80 font-bold text-xs tracking-[0.2em] uppercase">
                Stamp Collected
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-8 pb-10 pt-8 text-center space-y-5">

          {/* Category label */}
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#8A6F5C] uppercase">
            {isHidden ? "✦ Hidden Achievement ✦" : isComplete ? "✦ All 8 Stamps ✦" : "✧ Stamp Collected ✧"}
          </p>

          {/* Icon with particle burst */}
          <div className="relative flex items-center justify-center h-28">
            {/* Particles */}
            {visible && PARTICLES.map((p, i) => (
              <span
                key={i}
                className="particle"
                style={{
                  "--dx": `${p.dx}px`,
                  "--dy": `${p.dy}px`,
                  animationDelay: `${i * 30}ms`,
                  backgroundColor: isHidden ? "#3B82C4" : "#C9A84C",
                } as React.CSSProperties}
              />
            ))}

            {/* Icon circle */}
            <div className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-inner ${iconBg} border-2 ${isHidden ? "border-[#3B82C4]/30" : "border-[#C9A84C]/30"}`}>
              <StampIcon stampId={stampId} className={`w-14 h-14 ${iconColor}`} />
            </div>
          </div>

          {/* Stamp name + area */}
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold text-[#1A2B4A]">{meta.element}</h2>
            <span className="inline-block text-[10px] font-mono text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {meta.area}
            </span>
          </div>

          {/* Progress badge (regular stamps only) */}
          {!isHidden && (
            <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border ${
              isComplete
                ? "bg-[#1A2B4A] text-white border-[#1A2B4A]"
                : "bg-[#C9A84C]/10 text-[#8A5E00] border-[#C9A84C]/30"
            }`}>
              {isComplete ? "∞ 今日抽獎已解鎖" : `第 ${totalStamps} / 8 枚`}
            </div>
          )}

          {/* Hint quote */}
          <div className="space-y-2 px-2">
            <div className="h-px w-10 bg-[#8A6F5C]/20 mx-auto" />
            <p className="text-sm leading-relaxed text-[#6B4F3A] italic">
              「{meta.hint}」
            </p>
            {isHidden && (
              <p className="text-xs text-gray-400 mt-1">
                這個發現不會計入主進度，但證明了你敏銳的觀察力。
              </p>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-2.5 pt-2">
            {isComplete ? (
              <Link href="/" onClick={close} className="block">
                <Button className="h-12 w-full rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E5C97D] text-[#1A2B4A] font-black text-base shadow-md hover:scale-[1.02] transition-transform">
                  前往首頁抽獎 →
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "TSUTAYA BOOKSTORE 8th Anniversary",
                      text: `我找到了「${meta.element}」！${meta.hint}`,
                      url: window.location.origin,
                    });
                  }
                }}
                className="h-12 w-full rounded-full bg-[#1A2B4A] text-white flex items-center justify-center gap-2 hover:bg-[#1A2B4A]/90 transition-colors"
              >
                <Share2 size={16} />
                分享成就
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={close}
              className="text-[#8A6F5C] text-xs hover:text-[#1A2B4A]"
            >
              關閉
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
