"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { LiffUser } from "@/lib/types";

export default function ConsentPage() {
  const router = useRouter();
  const [user, setUser] = useState<LiffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
        router.replace("/");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  async function handleConsent() {
    if (!user) return;
    setSubmitting(true);
    try {
      await fetch("/api/user/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineUserId: user.userId, displayName: user.displayName }),
      });
      router.replace("/welcome");
    } catch {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#F5F2ED]">
        <div className="w-8 h-8 rounded-full border-[3px] border-[#1A2B4A] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col bg-[#F5F2ED]">

      {/* 頂部品牌帶 */}
      <div className="flex items-center justify-center gap-3 pt-12 pb-8 opacity-60">
        <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-3.5 w-auto" />
        <span className="text-[#1A2B4A]/30 font-mono text-xs">×</span>
        <img src="/wired-tokyo-logo.svg" alt="WIRED" className="h-4.5 w-auto" />
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pb-10 max-w-sm mx-auto w-full">

        {/* 用戶頭像 */}
        <div className="mb-6">
          {user?.pictureUrl ? (
            <img
              src={user.pictureUrl}
              alt={user.displayName}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#1A2B4A] flex items-center justify-center text-2xl text-white font-bold border-4 border-white shadow-lg">
              {user?.displayName?.charAt(0) ?? "?"}
            </div>
          )}
        </div>

        <h1 className="text-xl font-black text-[#1A2B4A] mb-1 tracking-tight text-center">
          您好，{user?.displayName}
        </h1>
        <p className="text-xs text-[#8A6F5C] mb-8 text-center">
          歡迎參加 Nexus Life 集章活動
        </p>

        {/* 同意說明卡片 */}
        <div className="w-full rounded-2xl bg-white border border-[#E8E4DC] shadow-sm p-5 mb-6 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#C9A84C]" />
            <span className="text-xs font-bold text-[#1A2B4A] tracking-wide">個人資料使用說明</span>
          </div>
          <p className="text-xs text-[#8A6F5C] leading-relaxed">
            本活動將透過 LINE 登入取得您的帳號資訊，用於辨識您的集章進度與抽獎資格：
          </p>
          <ul className="space-y-2">
            {[
              "LINE 使用者 ID（用於識別帳號）",
              "顯示名稱（用於活動紀錄）",
              "集章與抽獎進度",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[#1A2B4A]">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-[#8A6F5C]/70 leading-relaxed">
            上述資料僅用於本次活動（2026/04/23–05/13），活動結束後依法規處理。
          </p>
          <Link
            href="/privacy"
            className="flex items-center gap-1 text-[10px] text-[#1A2B4A]/50 hover:text-[#1A2B4A] transition-colors"
          >
            閱讀完整隱私聲明 <ChevronRight size={10} />
          </Link>
        </div>

        {/* 按鈕 */}
        <Button
          onClick={handleConsent}
          disabled={submitting || !user}
          className="h-14 w-full rounded-full bg-gradient-to-r from-[#1A2B4A] to-[#2B5CE6] text-white font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 mb-3"
        >
          {submitting ? "處理中…" : "同意並開始集章"}
        </Button>
        <button
          onClick={() => router.back()}
          className="text-xs text-[#8A6F5C]/60 hover:text-[#8A6F5C] transition-colors py-2"
        >
          不參加
        </button>
      </div>
    </div>
  );
}
