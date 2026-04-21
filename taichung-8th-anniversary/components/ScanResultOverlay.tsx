"use client";

import React, { useEffect, useState } from "react";
import { STAMP_META } from "./StampCard";
import { Button } from "@/components/ui/button";
import { X, Share2, Sparkles } from "lucide-react";

interface ScanResultOverlayProps {
  stampId: string;
  onClose: () => void;
}

export default function ScanResultOverlay({
  stampId,
  onClose,
}: ScanResultOverlayProps) {
  const meta = STAMP_META[stampId];
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 延遲一點點觸發進入動畫
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!meta) return null;

  const isHidden = meta.isHidden;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "TSUTAYA BOOKSTORE 8th Anniversary",
        text: `我找到了「${meta.element}」！${meta.hint}`,
        url: window.location.origin,
      });
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-6 transition-all duration-500 ${
        isVisible ? "bg-black/80 backdrop-blur-md opacity-100" : "bg-black/0 backdrop-blur-0 opacity-0"
      }`}
    >
      <div
        className={`relative w-full max-w-sm overflow-hidden rounded-3xl bg-[#F5F2ED] transition-all duration-500 transform ${
          isVisible ? "scale-100 translate-y-0" : "scale-90 translate-y-8"
        }`}
      >
        {/* 頂部裝飾 */}
        <div
          className={`h-24 w-full flex items-center justify-center ${
            isHidden
              ? "bg-gradient-to-br from-[#1A2B4A] to-[#3B82C4]"
              : "bg-gradient-to-br from-[#C9A84C] to-[#E5C97D]"
          }`}
        >
          <div className="absolute top-4 right-4">
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 500);
              }}
              className="rounded-full bg-black/10 p-2 text-white/80 hover:bg-black/20"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center gap-1">
             {isHidden ? (
               <Sparkles className="text-white animate-pulse" size={32} />
             ) : (
               <div className="text-white font-serif text-3xl font-bold">8</div>
             )}
          </div>
        </div>

        <div className="px-8 pb-10 pt-8 text-center space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#8A6F5C] uppercase">
              {isHidden ? "✦ Hidden Achievement ✦" : "✧ Stamp Collected ✧"}
            </p>
            <h2 className="text-2xl font-bold text-[#1A2B4A]">{meta.element}</h2>
          </div>

          {/* 元素大圖示 (Emoji 暫代，後續可換成 SVG) */}
          <div className="py-4">
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-inner ${
              isHidden ? "bg-[#1A2B4A]/5" : "bg-[#C9A84C]/5"
            }`}>
              {meta.element.includes('♾️') ? '♾️' : 
               meta.element.includes('陶杯') ? '☕' :
               meta.element.includes('風') ? '🍃' :
               meta.element.includes('橡實') ? '🌰' :
               meta.element.includes('書') ? '📚' :
               meta.element.includes('咖啡') ? '☕' :
               meta.element.includes('光點') ? '✨' :
               meta.element.includes('花朵') ? '🌸' : '🕶️'}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-[#6B4F3A] font-medium italic px-2">
              「{meta.hint}」
            </p>
            <div className="h-px w-12 bg-[#8A6F5C]/20 mx-auto" />
            <p className="text-xs text-gray-400">
              {isHidden 
                ? "這個發現不會計入主進度，但證明了你敏銳的觀察力。" 
                : "已成功收集此印記。繼續找出店內其餘的驚喜吧！"}
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={handleShare}
              className="h-12 w-full rounded-full bg-[#1A2B4A] text-white flex items-center justify-center gap-2"
            >
              <Share2 size={18} />
              分享成就
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 500);
              }}
              className="text-[#8A6F5C] text-xs"
            >
              關閉視窗
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
