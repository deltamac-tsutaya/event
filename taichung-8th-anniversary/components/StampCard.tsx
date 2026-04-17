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
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-[#1A2B4A] transition-all duration-700"
          style={{ width: `${(totalStamps / 8) * 100}%` }}
        />
      </div>

      {/* Grid */}
      <div
        className={`grid grid-cols-4 gap-2 ${
          isComplete ? "animate-all-complete rounded-2xl" : ""
        }`}
      >
        {Object.entries(STAMP_META).map(([id, { area }]) => {
          const collected = collectedIds.has(id);
          const isNew = animating.has(id);
          const collectedAt = collectedMap[id];

          return (
            <div
              key={id}
              className={`
                relative flex flex-col items-center justify-center rounded-xl p-2 text-center
                transition-all duration-300 aspect-square
                ${
                  collected
                    ? "bg-[#EEE9E2] border border-[#8A6F5C]/20 shadow-sm"
                    : "bg-gray-100 border border-transparent opacity-50"
                }
                ${isNew ? "animate-stamp-drop" : ""}
                ${isComplete && collected ? "ring-1 ring-[#1A2B4A]/40" : ""}
              `}
            >
              <span
                className={`font-mono text-sm font-bold leading-none ${
                  collected ? "text-[#1A2B4A]" : "text-gray-300"
                }`}
              >
                {id}
              </span>
              <span
                className={`mt-1 text-[9px] leading-tight font-medium ${
                  collected ? "text-[#1A2B4A]" : "text-gray-400"
                }`}
              >
                {area}
              </span>
              {collected && collectedAt && (
                <span className="mt-0.5 text-[8px] text-gray-400 leading-tight">
                  {formatCollectedAt(collectedAt)}
                </span>
              )}
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
