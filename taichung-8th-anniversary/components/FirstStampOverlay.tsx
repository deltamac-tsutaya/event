"use client";

import React, { useEffect, useState } from "react";
import { StampIcon } from "./StampIcon";
import { STAMP_META } from "./StampCard";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";

interface FirstStampOverlayProps {
  onClose: () => void;
}

export default function FirstStampOverlay({ onClose }: FirstStampOverlayProps) {
  const [visible, setVisible] = useState(false);
  const stampId = "01";
  const meta = STAMP_META[stampId];

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 450);
  };

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
        <div className="h-28 w-full flex items-center justify-center bg-gradient-to-br from-[#1A2B4A] to-[#C9A84C] relative overflow-hidden">
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 rounded-full bg-black/10 p-2 text-white/80 hover:bg-black/20 transition-colors z-10"
          >
            <X size={18} />
          </button>

          {/* Header label */}
          <div className="flex flex-col items-center gap-1">
            <Sparkles className="text-white animate-pulse" size={28} />
            <span className="text-white font-black text-sm tracking-widest">歡迎參加</span>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 pb-10 pt-8 text-center space-y-5">
          {/* Category label */}
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#8A6F5C] uppercase">
            ✦ 首次參加贈禮 ✦
          </p>

          {/* Icon with particle burst */}
          <div className="relative flex items-center justify-center h-28">
            {/* Icon circle */}
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-inner bg-gradient-to-br from-white to-[#FDF8F0] border-2 border-[#C9A84C]/50">
              <StampIcon stampId={stampId} className="w-14 h-14 text-[#C9A84C]" />
            </div>
          </div>

          {/* Stamp name + area */}
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold text-[#1A2B4A]">{meta.element}</h2>
            <span className="inline-block text-[10px] font-mono text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {meta.area}
            </span>
          </div>

          {/* Hint quote */}
          <div className="space-y-2 px-2">
            <div className="h-px w-10 bg-[#8A6F5C]/20 mx-auto" />
            <p className="text-sm leading-relaxed text-[#6B4F3A] italic">
              「{meta.hint}」
            </p>
            <p className="text-xs text-gray-500 mt-3">
              每日重置後會消失，<br />
              往後將需要到店內親自收集
            </p>
          </div>

          {/* CTA button */}
          <div className="flex flex-col gap-2.5 pt-2">
            <Button
              onClick={close}
              className="h-12 w-full rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E5C97D] text-[#1A2B4A] font-black text-base shadow-md hover:scale-[1.02] transition-transform"
            >
              開始探索 →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
