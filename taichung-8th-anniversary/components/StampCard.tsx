"use client";

import { useEffect, useRef, useState } from "react";

export interface StampItem {
  stamp_id: string;
  collected_at: string;
}

interface StampCardProps {
  stamps: StampItem[];
  totalStamps: number;
}

const STAMP_META: Record<string, { area: string }> = {
  "01": { area: "入口主題陳列區" },
  "02": { area: "生活雜貨區" },
  "03": { area: "文具選品牆" },
  "04": { area: "兒童繪本區" },
  "05": { area: "後方深處書櫃" },
  "06": { area: "WIRED TOKYO 吧檯" },
  "07": { area: "WIRED TOKYO 座位" },
  "08": { area: "結帳櫃檯旁" },
};

function formatCollectedAt(iso: string): string {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${mm}/${dd} ${hh}:${min}`;
}

export default function StampCard({ stamps, totalStamps }: StampCardProps) {
  const collectedIds = new Set(stamps.map((s) => s.stamp_id));
  const collectedMap = Object.fromEntries(
    stamps.map((s) => [s.stamp_id, s.collected_at])
  );

  const isComplete = totalStamps >= 8;

  // Track which stamp_ids are newly animated
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stamps]);

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>集印進度</span>
        <span className="font-semibold text-[#1A2B4A]">{totalStamps} / 8</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EDEBE5]">
        <div
          className="h-full rounded-full bg-[#C9A84C] transition-all duration-700"
          style={{ width: `${(totalStamps / 8) * 100}%` }}
        />
      </div>

      {/* Grid */}
      <div
        className={`grid grid-cols-4 gap-3 ${
          isComplete ? "animate-all-complete" : ""
        }`}
      >
        {Object.entries(STAMP_META).map(([id, { area }]) => {
          const collected = collectedIds.has(id);
          const isNew = animating.has(id);

          return (
            <div key={id} className="flex flex-col items-center gap-1.5">
              {/* 圓形印章 */}
              <div
                className={`
                  relative w-full aspect-square rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${collected
                    ? "bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.4)] shadow-[0_2px_10px_rgba(201,168,76,0.35)]"
                    : "bg-[#EDEBE5] border border-dashed border-[#B0AEAD] opacity-45"
                  }
                  ${isNew ? "animate-stamp-drop" : ""}
                  ${isComplete && collected ? "ring-2 ring-[#C9A84C]/30" : ""}
                `}
              >
                <span
                  className={`font-serif text-base font-bold leading-none tabular-nums ${
                    collected ? "text-[#C9A84C]" : "text-[#B0AEAD]"
                  }`}
                >
                  {id}
                </span>
              </div>
              {/* 區域名稱 */}
              <span
                className={`text-[9px] text-center leading-snug ${
                  collected ? "text-[#1A2B4A] font-medium" : "text-[#B0AEAD]"
                }`}
              >
                {area}
              </span>
            </div>
          );
        })}
      </div>

      {isComplete && (
        <p className="text-center text-sm font-semibold text-[#1A2B4A]">
          集章完成！可以抽獎了
        </p>
      )}
    </div>
  );
}
