"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import type { Reward } from "@/lib/types";

interface CouponCardProps {
  drawId: string;
  reward: Reward;
  drawDate: string;   // "YYYY-MM-DD"
  isUsed?: boolean;
  usedAt?: string | null;
  usedBy?: string | null;
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

function isExpiredFn(drawDate: string, days: number): boolean {
  const expiry = new Date(drawDate);
  expiry.setDate(expiry.getDate() + days);
  return new Date() > expiry;
}

function formatUsedAt(usedAt: string): string {
  return new Date(usedAt).toLocaleString("zh-TW", {
    month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function CouponCard({ drawId, reward, drawDate, isUsed, usedAt, usedBy }: CouponCardProps) {
  const [showQR, setShowQR] = useState(false);

  const tier     = TIER_STYLE[reward.tier] ?? TIER_STYLE.B;
  const expiry   = getExpiryDate(drawDate, reward.validity_days);
  const expired  = isExpiredFn(drawDate, reward.validity_days);
  const provider = PROVIDER_LABEL[reward.provider] ?? reward.provider;

  const verifyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/admin/redeem?id=${drawId}`
    : `/admin/redeem?id=${drawId}`;

  const redeemed = isUsed === true;
  const dimmed   = redeemed || expired;

  return (
    <div className={`relative flex flex-col overflow-hidden rounded-2xl shadow-md border border-black/5 transition-opacity ${dimmed ? "opacity-60" : ""}`}>

      {/* Main row */}
      <div className="flex">
        {/* Left tier bar */}
        <div className={`${tier.bg} ${tier.text} flex w-12 shrink-0 flex-col items-center justify-center gap-1 py-4`}>
          <span className="text-xl font-black leading-none">{tier.label}</span>
          <span className="text-[7px] font-bold opacity-70 tracking-wider uppercase rotate-180"
            style={{ writingMode: "vertical-rl" }}>
            {reward.tier === "S" ? "Special" : reward.tier === "A" ? "Premium" : "Standard"}
          </span>
        </div>

        {/* Perforation */}
        <div className="flex flex-col items-center justify-center w-3 shrink-0 bg-[#F5F2ED] relative">
          <div className="h-full w-px border-l-2 border-dashed border-black/10" />
          <div className="absolute w-3 h-3 rounded-full bg-[#F5F2ED] border border-black/5 -translate-x-0.5 top-0 -mt-1.5" />
          <div className="absolute w-3 h-3 rounded-full bg-[#F5F2ED] border border-black/5 -translate-x-0.5 bottom-0 -mb-1.5" />
        </div>

        {/* Content */}
        <div className="flex-1 bg-white px-4 py-4 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{provider}</p>
              <h3 className={`text-sm font-bold text-[#1A2B4A] leading-snug ${redeemed ? "line-through opacity-60" : ""}`}>
                {reward.name}
              </h3>
            </div>
            {redeemed ? (
              <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-orange-600 border border-orange-200 bg-orange-50 rounded px-1.5 py-0.5">
                已核銷
              </span>
            ) : expired ? (
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

          {redeemed && usedAt && (
            <p className="text-[10px] text-orange-500">
              核銷於 {formatUsedAt(usedAt)}{usedBy ? `（${usedBy}）` : ""}
            </p>
          )}

          <div className="flex items-center justify-between pt-1 border-t border-dashed border-gray-100">
            <span className="text-[10px] text-gray-400">
              取得日：{new Date(drawDate).toLocaleDateString("zh-TW", { month: "2-digit", day: "2-digit" })}
            </span>
            {redeemed ? (
              <span className="text-[10px] font-semibold text-orange-500">已核銷使用</span>
            ) : (
              <span className="text-[10px] font-semibold text-[#1A2B4A]">有效至 {expiry}</span>
            )}
          </div>

          {/* QR toggle — only for valid, unredeemed coupons */}
          {!redeemed && !expired && (
            <button
              onClick={() => setShowQR(v => !v)}
              className="w-full text-[10px] text-[#1A2B4A]/50 hover:text-[#1A2B4A] font-medium pt-0.5 transition-colors text-center"
            >
              {showQR ? "▲ 收起核銷 QR Code" : "▼ 展開核銷 QR Code（供店員掃描）"}
            </button>
          )}
        </div>
      </div>

      {/* QR panel */}
      {showQR && !redeemed && !expired && (
        <div className="bg-white border-t border-dashed border-gray-100 px-4 pb-5 pt-4 flex flex-col items-center gap-3">
          <p className="text-[10px] text-gray-400 text-center">
            請將此 QR Code 出示給店員掃描核銷<br />
            <span className="text-red-400 font-bold">請勿自行點擊核銷頁面</span>
          </p>
          <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
            <QRCode value={verifyUrl} size={160} fgColor="#1A2B4A" bgColor="#FFFFFF" level="M"
              style={{ width: 160, height: 160, display: "block" }} />
          </div>
          <p className="text-[9px] font-mono text-gray-300 text-center break-all max-w-full">{drawId}</p>
        </div>
      )}
    </div>
  );
}
