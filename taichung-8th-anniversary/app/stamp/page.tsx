"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import QrScanner from "@/components/QrScanner";
import StampCard from "@/components/StampCard";
import { useLiffUser } from "@/hooks/useLiffUser";
import { useStampProgress } from "@/hooks/useStampProgress";
import { showStampSuccess } from "@/components/ui-state/SuccessToast";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, Ticket } from "lucide-react";

type ScanStatus =
  | "idle"
  | "submitting"
  | "success"
  | "already_stamped"
  | "error";

function extractStampUuid(raw: string): string {
  try {
    const url = new URL(raw);
    const id = url.searchParams.get("id");
    if (id) return id;
  } catch {}
  return raw;
}

// ── Draw status cards ────────────────────────────────────────────────────────

function DrawReadyCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A2B4A] to-[#111C33] px-7 py-8 shadow-[0_20px_40px_-15px_rgba(26,43,74,0.5)] space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 blur-3xl rounded-full" />
      <div className="relative flex items-start gap-4">
        <div className="mt-0.5 flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E5C97D] flex items-center justify-center shadow-inner">
          <Sparkles className="text-[#1A2B4A]" size={22} />
        </div>
        <div className="space-y-1.5 pt-1">
          <p className="font-black text-white text-lg tracking-wide leading-snug">今日抽獎已解鎖</p>
          <p className="text-xs text-white/60 font-medium">每日一次機會，前往首頁即可參加抽獎</p>
        </div>
      </div>
      <Link href="/">
        <Button className="relative overflow-hidden group h-14 w-full rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E5C97D] text-[#1A2B4A] text-lg font-black shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]">
          <span className="relative z-10">前往首頁抽獎 →</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        </Button>
      </Link>
    </div>
  );
}

function DrawnTodayCard() {
  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white px-7 py-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 flex-shrink-0 w-12 h-12 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">✓</div>
        </div>
        <div className="space-y-1.5 pt-1">
          <p className="font-black text-[#1A2B4A] text-lg tracking-wide leading-snug">今日抽獎已完成</p>
          <p className="text-xs text-[#8A6F5C] leading-relaxed font-medium">明天 00:00 後將再次開放<br/>抽獎紀錄保存於優惠券匣</p>
        </div>
      </div>
      <Button
        className="h-14 w-full rounded-full font-bold border-2 border-[#1A2B4A]/10 text-[#1A2B4A] bg-transparent hover:bg-[#1A2B4A]/5 hover:border-[#1A2B4A]/30 transition-all flex items-center justify-center gap-2 group"
        onClick={() => window.open('https://line.me/R/ch/1432061434/coupon/')}
      >
        <Ticket size={18} className="group-hover:-rotate-12 transition-transform" />
        查看優惠券匣
      </Button>
    </div>
  );
}

// ── Main stamp page ───────────────────────────────────────────────────────────

function StampPageContent() {
  const searchParams = useSearchParams();
  const urlStampId = searchParams.get("id");
  const { user, loading, login } = useLiffUser();
  const { progress, refetch } = useStampProgress(user?.userId ?? null);

  const [status, setStatus] = useState<ScanStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [lastStampId, setLastStampId] = useState("");

  const totalStamps = progress?.totalStamps ?? 0;

  const handleScan = useCallback(
    async (rawValue: string) => {
      if (!user) return;
      if (status === "submitting") return;

      const stampId = extractStampUuid(rawValue);

      setStatus("submitting");
      setLastStampId(stampId);
      setErrorMsg("");

      try {
        const res = await fetch("/api/stamp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lineUserId: user.userId,
            displayName: user.displayName,
            stampId,
          }),
        });
        const data = await res.json();

        if (data.success) {
          setStatus("success");
          showStampSuccess(stampId);
          await refetch();
          // 不轉頁，2 秒後回到 idle 供繼續掃描
          setTimeout(() => setStatus("idle"), 2000);
        } else if (data.reason === "already_stamped") {
          setStatus("already_stamped");
        } else {
          setStatus("error");
          setErrorMsg(data.reason ?? "蓋章失敗，請稍後再試");
        }
      } catch (e) {
        setStatus("error");
        setErrorMsg(e instanceof Error ? e.message : "網路錯誤");
      }
    },
    [user, status, refetch]
  );

  // 從 URL ?id= 自動觸發集章（手機相機掃碼後直接開啟此頁）
  useEffect(() => {
    if (urlStampId && user && status === "idle") {
      handleScan(urlStampId);
    }
  }, [urlStampId, user, status, handleScan]);

  const reset = () => {
    setStatus("idle");
    setErrorMsg("");
    setLastStampId("");
  };

  const getAchievementMeta = (id: string) => {
    const meta: Record<string, { icon: string; title: string; copy: string }> = {
      "A": { icon: "🐿️", title: "你找到了松鼠", copy: "牠觀察你的時間比你想像的還久。" },
      "B": { icon: "🐦", title: "你讓自己慢下來", copy: "小鳥才現身。" },
      "C": { icon: "🦌", title: "這不是告示牌", copy: "是小鹿留給觀察者的訊息。" },
    };
    return meta[id];
  };

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#F5F2ED]">
        <div className="size-8 animate-spin rounded-full border-4 border-[#1A2B4A] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#F5F2ED] px-8 text-center">
        <div className="space-y-2">
          <p className="text-lg font-bold text-[#1A2B4A]">請透過 LINE 開啟此頁面</p>
          <p className="text-sm text-gray-500 leading-relaxed">
            集章需要 LINE 帳號來記錄您的進度<br />請在 LINE 中點開活動連結
          </p>
        </div>
        <Button
          onClick={login}
          className="h-12 px-8 bg-[#06C755] hover:bg-[#06C755]/90 text-white font-bold rounded-full"
        >
          使用 LINE 登入
        </Button>
        <Link href="/" className="text-xs text-gray-400 underline underline-offset-2">
          返回首頁
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-[#F5F2ED]">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6 gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-400 hover:text-[#1A2B4A]">
            ← 返回
          </Link>
          <span className="text-sm font-semibold text-[#1A2B4A]">
            {totalStamps} / 8 枚
          </span>
        </div>

        <div className="text-center space-y-1.5 mt-2 mb-6">
          <h1 className="text-2xl font-black tracking-tight text-[#1A2B4A]">集章進度</h1>
          <p className="text-xs text-[#8A6F5C] font-medium">找出店內 8 個印記，集滿解鎖每日抽獎</p>
        </div>

        {/* 1. 集章格 — 永遠顯示 */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
          <StampCard stamps={progress?.stamps ?? []} totalStamps={totalStamps} />
        </div>

        {/* 2. 抽獎狀態卡片 — 在集章格正下方 */}
        {progress?.canDraw && <DrawReadyCard />}
        {progress?.drawnToday && <DrawnTodayCard />}

        {/* 3. 分隔線 */}
        <div className="relative flex items-center">
          <div className="flex-1 h-px bg-[#E0DDD6]" />
          <span className="px-3 text-[10px] text-gray-400 font-mono tracking-widest shrink-0">
            {totalStamps >= 8 ? "BONUS SCAN" : "SCAN QR"}
          </span>
          <div className="flex-1 h-px bg-[#E0DDD6]" />
        </div>

        {/* 4. 掃描器 / 狀態區 */}
        {status === "idle" && (
          <div className="space-y-3">
            <p className="text-center text-xs text-gray-400">
              {totalStamps >= 8
                ? "已集齊 8 枚！仍可掃描隱藏點位"
                : "對準店內各區的 QR code 即可蓋章"}
            </p>
            <QrScanner onScan={handleScan} />
          </div>
        )}

        {status === "submitting" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="size-10 animate-spin rounded-full border-4 border-[#1A2B4A] border-t-transparent" />
            <p className="text-sm text-gray-600">蓋章中…</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-6 py-10 text-center animate-in fade-in zoom-in duration-500">
            {["A", "B", "C"].includes(lastStampId) ? (
              <>
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full animate-pulse" />
                  <div className="relative size-28 bg-white rounded-full flex items-center justify-center text-5xl shadow-xl border-4 border-[#C9A84C]">
                    {getAchievementMeta(lastStampId)?.icon}
                  </div>
                </div>
                <div className="space-y-2 px-6">
                  <p className="text-[10px] font-bold tracking-widest text-[#C9A84C] uppercase">Achievement Unlocked</p>
                  <h2 className="text-xl font-bold text-[#1A2B4A]">{getAchievementMeta(lastStampId)?.title}</h2>
                  <p className="text-sm text-[#8A6F5C] italic leading-relaxed">「{getAchievementMeta(lastStampId)?.copy}」</p>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-full bg-[#EEE9E2] p-8 shadow-inner">
                  <span className="font-mono text-5xl font-bold text-[#1A2B4A] leading-none tracking-tighter">
                    {lastStampId}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-[#1A2B4A]">蓋章成功</p>
                  <p className="text-sm text-gray-500 italic">探索 Nexus Life 的第 {totalStamps} 個印記</p>
                </div>
              </>
            )}
          </div>
        )}

        {status === "already_stamped" && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="rounded-full bg-[#EEE9E2] px-5 py-3">
              <span className="font-mono text-sm font-semibold text-[#8A6F5C]">已收集</span>
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-gray-700">此印記已收集過</p>
              <p className="text-xs text-gray-400">每個集印點每人限蓋 1 次</p>
            </div>
            <button onClick={reset} className="text-sm text-[#1A2B4A] underline underline-offset-2">
              掃描其他 QR code
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500">Error</p>
            <p className="text-sm text-red-600">{errorMsg}</p>
            <button
              onClick={reset}
              className="rounded-full bg-[#1A2B4A] px-6 py-2 text-sm font-medium text-white hover:bg-[#1A2B4A]/90"
            >
              重試
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default function StampPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh items-center justify-center bg-[#F5F2ED]">
        <div className="size-8 animate-spin rounded-full border-4 border-[#1A2B4A] border-t-transparent" />
      </div>
    }>
      <StampPageContent />
    </Suspense>
  );
}
