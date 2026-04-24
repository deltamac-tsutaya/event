"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { QrCode, Stamp, Gift } from "lucide-react";
import type { LiffUser } from "@/lib/types";

const STEPS = [
  {
    icon: QrCode,
    title: "掃描 QR Code",
    desc: "找到店內 8 個集印點位，逐一掃描",
  },
  {
    icon: Stamp,
    title: "集滿 8 枚印章",
    desc: "每次到店限集 1 枚，仔細探索每個角落",
  },
  {
    icon: Gift,
    title: "每日抽好禮",
    desc: "集滿後解鎖每日抽獎，還有隱藏印章等你發現",
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const [user, setUser] = useState<LiffUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const liffId = process.env.NEXT_PUBLIC_LIFF_ID ?? "";
      if (!liffId) { router.replace("/"); return; }

      try {
        const { initLiff, liff } = await import("@/lib/liff");
        await initLiff(liffId);

        if (!liff.isLoggedIn()) {
          router.replace("/liff");
          return;
        }

        const profile = await liff.getProfile();
        setUser({
          userId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl,
        });
      } catch {
        // Continue without profile
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#F5F2ED]">
        <div className="w-8 h-8 rounded-full border-[3px] border-[#1A2B4A] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col bg-[#F5F2ED]">

      {/* 頂部深色區 */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1A2B4A] to-[#0F1A30] px-6 pt-14 pb-16 text-center">
        {/* 裝飾光暈 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#C9A84C]/10 blur-3xl rounded-full" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 opacity-50 mb-2">
            <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-3.5 w-auto invert" />
            <span className="text-white/30 font-mono text-xs">×</span>
            <img src="/wired-tokyo-logo.svg" alt="WIRED" className="h-4 w-auto invert" />
          </div>

          <p className="text-[10px] font-mono tracking-[0.3em] text-[#C9A84C]/80 uppercase">
            8th Anniversary
          </p>
          <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
            Nexus Life
          </h1>
          <p className="text-sm text-white/50 font-mono tracking-widest">∞ 連結生活</p>

          {/* 用戶資訊 */}
          {user && (
            <div className="mt-4 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10">
              {user.pictureUrl ? (
                <img src={user.pictureUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#C9A84C] flex items-center justify-center text-xs font-bold text-[#1A2B4A]">
                  {user.displayName?.charAt(0)}
                </div>
              )}
              <span className="text-sm text-white font-medium">{user.displayName}</span>
            </div>
          )}
        </div>
      </div>

      {/* 活動說明 */}
      <div className="flex-1 flex flex-col px-6 -mt-6 pb-8 max-w-sm mx-auto w-full">
        <div className="rounded-2xl bg-white border border-[#E8E4DC] shadow-sm p-5 mb-6 space-y-5">
          <p className="text-xs font-bold text-[#1A2B4A] tracking-widest uppercase text-center">
            活動說明
          </p>
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-[#F5F2ED] flex items-center justify-center shrink-0">
                <Icon size={16} className="text-[#C9A84C]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1A2B4A] mb-0.5">{title}</p>
                <p className="text-xs text-[#8A6F5C] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 活動期間 */}
        <div className="text-center mb-8">
          <p className="text-[10px] font-mono text-[#8A6F5C]/60 tracking-widest">
            活動期間
          </p>
          <p className="text-xs font-bold text-[#1A2B4A] mt-0.5">
            2026 / 04 / 23 — 05 / 13
          </p>
        </div>

        <Button
          onClick={() => router.replace("/")}
          className="h-14 w-full rounded-full bg-gradient-to-r from-[#1A2B4A] to-[#2B5CE6] text-white font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          開始集章 ∞
        </Button>
      </div>
    </div>
  );
}
