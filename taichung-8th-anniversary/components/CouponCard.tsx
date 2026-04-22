"use client";

import type { Reward } from "@/lib/types";

interface CouponCardProps {
  reward: Reward;
  drawDate: string; // "YYYY-MM-DD"
}

const TIER_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  S: { bg: "bg-gradient-to-b from-[#C9A84C] to-[#A07830]", text: "text-white", label: "S" },
  A: { bg: "bg-gradient-to-b from-[#3B82C4] to-[#1A2B4A]", text: "text-white", label: "A" },
  B: { bg: "bg-gradient-to-b from-[#6B7280] to-[#374151]", text: "text-white", label: "B" },
};

const PROVIDER_LABEL: Record<string, string> = {
  WIRED: "WIRED TOKYO",
  TSUTAYA: "TSUTAYA BOOKSTORE",
};

function getExpiryDate(drawDate: string, days: number): string {
  const d = new Date(drawDate);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function isExpired(drawDate: string, days: number): boolean {
  const expiry = new Date(drawDate);
  expiry.setDate(expiry.getDate() + days);
  return new Date() > expiry;
}

export default function CouponCard({ reward, drawDate }: CouponCardProps) {
  const tier = TIER_STYLE[reward.tier] ?? TIER_STYLE.B;
  const expiry = getExpiryDate(drawDate, reward.validity_days);
  const expired = isExpired(drawDate, reward.validity_days);
  const provider = PROVIDER_LABEL[reward.provider] ?? reward.provider;

  return (
    <div className={`relative flex overflow-hidden rounded-2xl shadow-md border border-black/5 ${expired ? "opacity-50 grayscale" : ""}`}>
      {/* 左側等級色帶 */}
      <div className={`${tier.bg} ${tier.text} flex w-12 shrink-0 flex-col items-center justify-center gap-1 py-4`}>
        <span className="text-xl font-black leading-none">{tier.label}</span>
        <span className="text-[7px] font-bold opacity-70 tracking-wider uppercase rotate-180"
          style={{ writingMode: "vertical-rl" }}>
          {reward.tier === "S" ? "Special" : reward.tier === "A" ? "Premium" : "Standard"}
        </span>
      </div>

      {/* 鋸齒分隔線 */}
      <div className="flex flex-col items-center justify-center w-3 shrink-0 bg-[#F5F2ED]">
        <div className="h-full w-px border-l-2 border-dashed border-black/10" />
        <div className="absolute w-3 h-3 rounded-full bg-[#F5F2ED] border border-black/5 -translate-x-0.5 top-0 -mt-1.5" />
        <div className="absolute w-3 h-3 rounded-full bg-[#F5F2ED] border border-black/5 -translate-x-0.5 bottom-0 -mb-1.5" />
      </div>

      {/* 右側內容 */}
      <div className="flex-1 bg-white px-4 py-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{provider}</p>
            <h3 className="text-sm font-bold text-[#1A2B4A] leading-snug">{reward.name}</h3>
          </div>
          {expired ? (
            <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
              已失效
            </span>
          ) : (
            <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-emerald-600 border border-emerald-200 bg-emerald-50 rounded px-1.5 py-0.5">
              有效
            </span>
          )}
        </div>

        <p className="text-[11px] text-gray-500 leading-relaxed">{reward.conditions}</p>

        <div className="flex items-center justify-between pt-1 border-t border-dashed border-gray-100">
          <span className="text-[10px] text-gray-400">
            取得日：{new Date(drawDate).toLocaleDateString("zh-TW", { month: "2-digit", day: "2-digit" })}
          </span>
          <span className="text-[10px] font-semibold text-[#1A2B4A]">
            有效至 {expiry}
          </span>
        </div>
      </div>
    </div>
  );
}
