"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { StampIcon } from "@/components/StampIcon";

export interface StampItem {
  stamp_id: string;
  collected_at: string;
}

interface StampCardProps {
  stamps: StampItem[];
  totalStamps: number;
}

/**
 * 集章點位元數據
 * 1-8 為主進度點位
 * A, B, C 為隱藏成就點位
 */
export const STAMP_META: Record<
  string,
  { area: string; element: string; hint: string; isHidden?: boolean }
> = {
  "01": {
    area: "入口主題陳列區",
    element: "♾️無限",
    hint: "這裡是起點，也是 ∞ 的第一筆。",
  },
  "02": {
    area: "生活雜貨區",
    element: "陶杯",
    hint: "手握一只杯，日常便有了份量。",
  },
  "03": {
    area: "露台區",
    element: "風",
    hint: "露台的風，記住了每一個停留的午後。",
  },
  "04": {
    area: "兒童繪本區",
    element: "橡實",
    hint: "一顆橡實，藏著一整片森林的故事。",
  },
  "05": {
    area: "後方深處書櫃",
    element: "書",
    hint: "每一格書牆，都是一個未讀的世界。",
  },
  "06": {
    area: "WIRED TOKYO 吧檯",
    element: "咖啡",
    hint: "一杯咖啡的時間，夠讓生活重新對焦。",
  },
  "07": {
    area: "WIRED TOKYO 座位",
    element: "光點",
    hint: "光從天井落下，這一刻你也在其中。",
  },
  "08": {
    area: "結帳櫃檯旁",
    element: "花朵",
    hint: "八年，每天都有一朵花悄悄開。",
  },
  A: {
    area: "牆角角落",
    element: "墨鏡-松鼠",
    hint: "你找到了松鼠。牠觀察你的時間比你想像的還久。",
    isHidden: true,
  },
  B: {
    area: "窗邊位置",
    element: "墨鏡-小鳥",
    hint: "你讓自己慢下來，小鳥才現身。",
    isHidden: true,
  },
  C: {
    area: "告示牌後",
    element: "墨鏡-小鹿",
    hint: "這不是告示牌，是小鹿留給觀察者的訊息。",
    isHidden: true,
  },
};

export default function StampCard({ stamps, totalStamps }: StampCardProps) {
  const collectedIds = new Set(stamps.map((s) => s.stamp_id));
  
  // 分離主進度印章與隱藏印章
  const mainStamps = Object.keys(STAMP_META).filter(id => !STAMP_META[id].isHidden);
  const hiddenStamps = Object.keys(STAMP_META).filter(id => STAMP_META[id].isHidden);

  const [animating, setAnimating] = useState<Set<string>>(new Set());
  const prevIds = useRef<Set<string>>(new Set(collectedIds));

  useEffect(() => {
    const newlyAdded = new Set<string>();
    collectedIds.forEach((id) => {
      if (!prevIds.current.has(id)) newlyAdded.add(id);
    });
    if (newlyAdded.size > 0) {
      setAnimating((prev) => new Set([...prev, ...newlyAdded]));
      const timer = setTimeout(() => {
        setAnimating((prev) => {
          const next = new Set(prev);
          newlyAdded.forEach((id) => next.delete(id));
          return next;
        });
      }, 1200);
      return () => clearTimeout(timer);
    }
    prevIds.current = new Set(collectedIds);
  }, [stamps, collectedIds]);

  return (
    <div className="space-y-6">
      {/* ── 主進度區 ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-medium">探索進度</span>
          <span className="font-bold text-[#1A2B4A] tabular-nums">{totalStamps} / 8</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#EDEBE5]">
          <div
            className="h-full rounded-full bg-[#C9A84C] transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(201,168,76,0.4)]"
            style={{ width: `${(Math.min(totalStamps, 8) / 8) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-4 gap-3 pt-2">
          {mainStamps.map((id) => {
            const collected = collectedIds.has(id);
            const isNew = animating.has(id);
            const meta = STAMP_META[id];

            return (
              <div key={id} className="flex flex-col items-center gap-1.5 group">
                <div
                  className={`
                    relative w-full aspect-square rounded-full flex items-center justify-center
                    transition-all duration-500 border-2
                    ${collected
                      ? "bg-gradient-to-br from-white to-[#FDF8F0] border-[#C9A84C]/50 shadow-[0_4px_12px_rgba(201,168,76,0.25)] scale-[1.05]"
                      : "bg-[#EDEBE5]/30 border-dashed border-[#B0AEAD]/30 opacity-50 grayscale"
                    }
                    ${isNew ? "animate-stamp-drop" : ""}
                  `}
                >
                  {collected ? (
                    <StampIcon stampId={id} className="w-1/2 h-1/2 text-[#C9A84C]" />
                  ) : (
                    <span className="font-mono text-xs font-medium text-[#B0AEAD]">{id}</span>
                  )}
                </div>
                <span
                  className={`text-[9px] text-center leading-tight transition-colors ${
                    collected ? "text-[#1A2B4A] font-semibold" : "text-transparent select-none"
                  }`}
                >
                  {collected ? meta.element : "·"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 隱藏成就區 (僅在有收集到時顯示或以特殊樣式呈現) ── */}
      {hiddenStamps.some(id => collectedIds.has(id)) && (
        <div className="pt-4 animate-page-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-[#C9A84C]/30" />
            <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest opacity-80">
              BONUS SCAN
            </p>
            <div className="h-px flex-1 bg-[#C9A84C]/30" />
          </div>
          <div className="flex justify-center gap-4">
            {hiddenStamps.map(id => {
              const collected = collectedIds.has(id);
              if (!collected) return null;
              const meta = STAMP_META[id];
              const isNew = animating.has(id);

              return (
                <div key={id} className={`flex flex-col items-center gap-1 ${isNew ? "animate-bounce" : ""}`}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1A2B4A] to-[#3B82C4] flex items-center justify-center shadow-lg border border-white/20">
                    <StampIcon stampId={id} className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-[9px] font-bold text-[#1A2B4A]">{meta.element.split('-')[1]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {totalStamps === 8 && (
        <div className="rounded-xl bg-[#FDF8F0] border border-[#C9A84C]/20 p-3 text-center animate-shine mt-4">
          <p className="text-xs font-bold text-[#C9A84C]">∞ 連結生活・集章完成 ∞</p>
        </div>
      )}
    </div>
  );
}
