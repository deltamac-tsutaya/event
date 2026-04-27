"use client";

import { useState } from "react";
import { KeyRound, RefreshCcw, X, CheckCircle2 } from "lucide-react";
import type { Reward } from "@/lib/types";

interface CouponCardProps {
  drawId: string;
  reward: Reward;
  drawDate: string;
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
  BOTH: "TSUTAYA BOOKSTORE & WIRED TOKYO",
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
  const [showPin,     setShowPin]     = useState(false);
  const [pin,         setPin]         = useState("");
  const [redeeming,   setRedeeming]   = useState(false);
  const [pinError,    setPinError]    = useState("");
  const [redeemed,    setRedeemed]    = useState(isUsed === true);
  const [redeemedAt,  setRedeemedAt]  = useState(usedAt ?? null);
  const [showSuccess, setShowSuccess] = useState(false);

  const tier     = TIER_STYLE[reward.tier] ?? TIER_STYLE.B;
  const expiry   = getExpiryDate(drawDate, reward.validity_days);
  const expired  = isExpiredFn(drawDate, reward.validity_days);
  const provider = PROVIDER_LABEL[reward.provider] ?? reward.provider;
  const dimmed   = redeemed || expired;

  const handleRedeem = async () => {
    if (!pin.trim()) return;
    setRedeeming(true);
    setPinError("");
    try {
      const res = await fetch("/api/admin/coupon/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drawId, pin, staffName: "staff" }),
      });
      const data = await res.json();
      if (data.success) {
        setRedeemed(true);
        setRedeemedAt(new Date().toISOString());
        setShowPin(false);
        setPin("");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setPinError(
          data.error === "wrong_pin"          ? "密碼錯誤，請重試"
          : data.error === "already_redeemed" ? "此券已核銷過"
          : data.error === "expired"          ? "此券已過期"
          : data.error ?? "核銷失敗"
        );
      }
    } catch {
      setPinError("網路錯誤，請重試");
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <>
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

            <p className="text-[11px] text-gray-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: reward.conditions }} />

            {redeemed && redeemedAt && (
              <p className="text-[10px] text-orange-500">
                核銷於 {formatUsedAt(redeemedAt)}{usedBy ? `（${usedBy}）` : ""}
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

            {/* Redeem button — only for valid unredeemed coupons */}
            {!redeemed && !expired && (
              <button
                onClick={() => setShowPin(true)}
                className="w-full py-2.5 rounded-xl bg-[#1A2B4A] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#1A2B4A]/90 active:scale-[0.98] transition-all"
              >
                <KeyRound size={12} />
                向店員核銷
              </button>
            )}

            {/* Success flash */}
            {showSuccess && (
              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 rounded-xl px-3 py-2 animate-in fade-in duration-200">
                <CheckCircle2 size={14} className="shrink-0" />
                核銷成功！
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PIN Modal */}
      {showPin && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-t-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-bold text-[#1A2B4A] text-base">核銷確認</h2>
                <p className="text-xs text-gray-400 mt-1">請將手機交給店員，由店員輸入核銷密碼</p>
              </div>
              <button
                onClick={() => { setShowPin(false); setPin(""); setPinError(""); }}
                className="text-gray-400 hover:text-gray-600 p-1 -mt-1 -mr-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Coupon summary */}
            <div className="bg-gray-50 rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
              <div className={`${tier.bg} w-8 h-8 rounded-lg flex items-center justify-center shrink-0`}>
                <span className="text-white text-xs font-black">{tier.label}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#1A2B4A] truncate">{reward.name}</p>
                <p className="text-[10px] text-gray-400">{provider}</p>
              </div>
            </div>

            {/* PIN input */}
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={e => { setPin(e.target.value); setPinError(""); }}
              placeholder="輸入核銷密碼"
              className={`w-full h-14 text-center text-2xl font-mono tracking-[0.5em] border-2 rounded-2xl focus:outline-none mb-3 transition-colors ${
                pinError ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#1A2B4A]"
              }`}
              onKeyDown={e => e.key === "Enter" && handleRedeem()}
              autoFocus
            />

            {pinError && (
              <p className="text-sm text-red-500 text-center mb-3">{pinError}</p>
            )}

            <button
              onClick={handleRedeem}
              disabled={redeeming || !pin.trim()}
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              {redeeming
                ? <><RefreshCcw size={16} className="animate-spin" /> 核銷中…</>
                : "✓ 確認核銷"
              }
            </button>
          </div>
        </div>
      )}
    </>
  );
}
