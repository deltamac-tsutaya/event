"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StampCard from "@/components/StampCard";
import RewardCard from "@/components/RewardCard";
import StepFlow from "@/components/StepFlow";
import LifeGantt from "@/components/LifeGantt";
import { Button } from "@/components/ui/button";
import { useLiffUser } from "@/hooks/useLiffUser";
import { useStampProgress } from "@/hooks/useStampProgress";
import type { DrawHistory, Reward } from "@/lib/types";

// ── Constants ───────────────────────────────────────────────────────────────
const ACTIVITY_START = new Date("2026-04-23T00:00:00+08:00");
const ACTIVITY_END   = new Date("2026-05-13T23:59:59+08:00");

function isActivityActive(): boolean {
  const now = new Date();
  return now >= ACTIVITY_START && now <= ACTIVITY_END;
}
function isActivityEnded(): boolean {
  return new Date() > ACTIVITY_END;
}

// ── Countdown to next midnight (UTC+8) ──────────────────────────────────────
function getMidnightMs(): number {
  const now = new Date();
  const taipeiOffset = 8 * 60 * 60 * 1000;
  const taipeiNow = new Date(now.getTime() + taipeiOffset);
  const midnight = new Date(
    Date.UTC(
      taipeiNow.getUTCFullYear(),
      taipeiNow.getUTCMonth(),
      taipeiNow.getUTCDate() + 1
    )
  );
  return midnight.getTime() - taipeiOffset - now.getTime();
}

function useCountdown() {
  const [remaining, setRemaining] = useState(getMidnightMs());
  useEffect(() => {
    const id = setInterval(() => setRemaining(getMidnightMs()), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1_000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ── Loading skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="skeleton h-6 w-2/3 rounded" />
      <div className="skeleton h-4 w-1/2 rounded" />
      <div className="grid grid-cols-4 gap-2 mt-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton aspect-square rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ── State A: Landing (not logged in) ────────────────────────────────────────
function StateA({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex flex-col -mx-4 -mt-6">

      {/* ── Hero visual (full-viewport feel) ── */}
      <div className="relative flex flex-col items-center justify-between min-h-[calc(100svh-3.5rem)] px-6 pt-10 pb-8 text-center overflow-hidden bg-[#F5F2ED]">

        {/* Background: giant "8" watermark */}
        <div
          aria-hidden
          className="pointer-events-none select-none absolute inset-0 flex items-center justify-center"
        >
          <span className="font-heading font-semibold text-[#1A2B4A]/[0.05]"
                style={{ fontSize: "clamp(14rem, 60vw, 22rem)", lineHeight: 1 }}>
            8
          </span>
        </div>

        {/* Top: dual-brand logo lockup */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/tsutaya-logo.svg"
              alt="TSUTAYA BOOKSTORE"
              className="h-9 w-auto"
            />
            <span className="text-sm font-mono text-[#8A6F5C]/60">×</span>
            <img
              src="/wired-tokyo-logo.svg"
              alt="WIRED TOKYO"
              className="h-5 w-auto"
            />
          </div>
          <p className="text-[10px] tracking-[0.22em] uppercase text-[#8A6F5C] font-mono">
            台中市政店 8th Anniversary
          </p>
        </div>

        {/* Center: headline */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-10 h-px bg-[#8A6F5C]/40" />
          <h1 className="font-heading font-semibold text-[#1A2B4A] leading-[0.9]"
              style={{ fontSize: "clamp(4rem, 22vw, 6.5rem)" }}>
            8<sup className="text-[0.45em] align-super">th</sup>
            <br />
            <span style={{ fontSize: "0.72em" }}>Anniversary</span>
          </h1>
          <div className="w-10 h-px bg-[#8A6F5C]/40" />
          <p className="text-sm font-medium text-[#1A2B4A] tracking-wide">
            無限日常 ∞ 連結生活
          </p>
          <p className="text-xs italic text-[#8A6F5C]">
            ∞ Connecting Life, Living in Stride.
          </p>
        </div>

        {/* Bottom: Gantt + date badge */}
        <div className="relative z-10 w-full flex flex-col items-center gap-4">
          <LifeGantt />
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-[#8A6F5C] tracking-widest">
              2,922 Days
            </span>
            <span className="w-px h-3 bg-[#8A6F5C]/30" />
            <span className="text-[10px] font-mono text-[#8A6F5C] tracking-widest">
              Est. 2018
            </span>
            <span className="w-px h-3 bg-[#8A6F5C]/30" />
            <span className="text-[10px] font-mono text-[#3B82C4] tracking-widest">
              2026 / 04 / 23
            </span>
          </div>
        </div>
      </div>

      {/* ── Below fold: how-to + CTA ── */}
      <div className="px-4 pt-8 pb-10 space-y-6 bg-[#F5F2ED]">
        <div className="text-center space-y-1">
          <p className="text-base font-semibold text-[#1A2B4A]">
            找出店內 8 個印記，集滿抽獎
          </p>
          <p className="text-xs text-[#8A6F5C]">每天一次抽獎機會 · 活動期間 2026/04/23—05/13</p>
        </div>

        <StepFlow />

        <Button
          onClick={onLogin}
          className="h-12 w-full rounded-full bg-[#1A2B4A] text-base font-semibold text-white hover:bg-[#1A2B4A]/90 animate-pulse-cta"
        >
          用 LINE 帳號參加
        </Button>

        <div className="flex justify-center gap-6 text-xs text-gray-400">
          <Link href="/faq" className="hover:text-[#1A2B4A] hover:underline">
            常見問題
          </Link>
          <Link href="/terms" className="hover:text-[#1A2B4A] hover:underline">
            活動規則
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── State B: Collecting stamps ───────────────────────────────────────────────
function StateB({
  totalStamps,
  stamps,
}: {
  totalStamps: number;
  stamps: Array<{ stamp_id: string; collected_at: string }>;
}) {
  const remaining = 8 - totalStamps;
  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold text-gray-900">
          已收集 <span className="text-[#1A2B4A]">{totalStamps}</span> / 8 枚
        </h1>
        {totalStamps === 7 ? (
          <p className="text-sm font-semibold text-orange-600">
            再 1 枚即可抽獎
          </p>
        ) : totalStamps >= 4 ? (
          <p className="text-sm text-[#1A2B4A]">
            已完成一半，繼續前進！
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            還差 {remaining} 枚，繼續探索店內各區
          </p>
        )}
      </div>

      <StampCard stamps={stamps} totalStamps={totalStamps} />

      <Link href="/stamp">
        <Button className="w-full h-12 rounded-full bg-[#1A2B4A] text-white text-base font-semibold hover:bg-[#1A2B4A]/90">
          掃描 QR code 集章
        </Button>
      </Link>

      <div className="flex justify-center gap-6 text-xs text-gray-400">
        <Link href="/faq" className="hover:text-[#1A2B4A] hover:underline">
          常見問題
        </Link>
        <Link href="/terms" className="hover:text-[#1A2B4A] hover:underline">
          活動規則
        </Link>
      </div>
    </div>
  );
}

// ── State C: Ready to draw ───────────────────────────────────────────────────
function StateC({
  stamps,
}: {
  stamps: Array<{ stamp_id: string; collected_at: string }>;
}) {
  const router = useRouter();
  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold text-gray-900">集印完成</h1>
        <p className="text-sm text-[#1A2B4A] font-medium">
          今日抽獎已解鎖。立即前往抽獎！
        </p>
      </div>
      <StampCard stamps={stamps} totalStamps={8} />
      <Button
        onClick={() => router.push("/rewards")}
        className="w-full h-12 rounded-full bg-[#1A2B4A] text-white text-base font-semibold hover:bg-[#1A2B4A]/90 animate-pulse-cta"
      >
        立即抽獎
      </Button>
    </div>
  );
}

// ── State D: Draw result ─────────────────────────────────────────────────────
function StateD({ reward, drawDate }: { reward: Reward; drawDate: string }) {
  const router = useRouter();
  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold text-gray-900">抽獎結果</h1>
        <p className="text-xs text-gray-500">獎券已存入 LINE 優惠券夾</p>
      </div>
      <div className="animate-flip-reveal">
        <RewardCard reward={reward} drawDate={drawDate} />
      </div>
      <p className="text-center text-xs text-gray-400">
        明天可以再抽一次，記得回來
      </p>
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => router.push("/rewards")}
          className="w-full h-11 bg-[#1A2B4A] text-white hover:bg-[#1A2B4A]/90 rounded-full"
        >
          查看我的獎券
        </Button>
        <Button
          variant="outline"
          className="w-full h-11 rounded-full"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "TSUTAYA BOOKSTORE × WIRED TOKYO 8th Anniversary",
                text: `我抽到了「${reward.name}」！快來一起集章抽獎吧！`,
              });
            }
          }}
        >
          分享給朋友
        </Button>
      </div>
    </div>
  );
}

// ── State E: Already drawn today ─────────────────────────────────────────────
function StateE({ lineUserId }: { lineUserId: string }) {
  const countdown = useCountdown();
  const [history, setHistory] = useState<DrawHistory[]>([]);

  useEffect(() => {
    fetch(`/api/reward/history?lineUserId=${encodeURIComponent(lineUserId)}`)
      .then((r) => r.json())
      .then((d) => setHistory(d.history ?? []));
  }, [lineUserId]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gray-50 p-5 text-center space-y-2">
        <p className="text-base font-semibold text-gray-700">今日抽獎已完成</p>
        <p className="text-xs text-gray-400">距離下次抽獎機會</p>
        <p className="text-3xl font-mono font-bold text-[#1A2B4A] animate-countdown">
          {countdown}
        </p>
      </div>

      <Link href="/rewards">
        <Button className="w-full h-11 bg-[#1A2B4A] text-white hover:bg-[#1A2B4A]/90 rounded-full">
          查看我的獎券
        </Button>
      </Link>

      {history.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-gray-700">抽獎紀錄</h2>
          {history.map((h, i) => (
            <RewardCard
              key={i}
              reward={h.rewards}
              drawDate={h.draw_date}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── State F: Activity ended ──────────────────────────────────────────────────
function StateF() {
  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <p className="text-4xl">∞</p>
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-gray-900">
          感謝 2,922 個日子的相伴
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          期待下次與你連結。
        </p>
      </div>
      <div className="w-full rounded-2xl bg-amber-50 border border-amber-200 p-4 text-left text-sm text-amber-800 space-y-1">
        <p className="font-semibold">⏰ 獎券使用提醒</p>
        <p>
          已抽中的獎券有效期為發放日起 14 天，請盡速至店內使用。
        </p>
      </div>
      <Link href="/rewards">
        <Button className="w-full h-11 bg-[#1A2B4A] text-white hover:bg-[#1A2B4A]/90 rounded-full">
          查看我的獎券
        </Button>
      </Link>
    </div>
  );
}

// ── Root page ────────────────────────────────────────────────────────────────
function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: userLoading, login } = useLiffUser();
  const { progress, loading: progressLoading, error } = useStampProgress(
    user?.userId ?? null
  );

  // State D: reward from URL (after draw redirect)
  const rewardParam = searchParams.get("reward");
  const drawDateParam = searchParams.get("drawDate");
  const rewardFromUrl: Reward | null = rewardParam
    ? (() => {
        try {
          return JSON.parse(decodeURIComponent(rewardParam));
        } catch {
          return null;
        }
      })()
    : null;

  const isLoading = userLoading || (!!user && progressLoading);

  function determineState():
    | "loading"
    | "A"
    | "B"
    | "C"
    | "D"
    | "E"
    | "F" {
    if (isLoading) return "loading";
    if (isActivityEnded()) return "F";
    if (!user) return "A";
    if (rewardFromUrl && drawDateParam) return "D";
    if (!progress) return "B"; // logged in but no data yet
    if (progress.drawnToday) return "E";
    if (progress.totalStamps >= 8) return "C";
    return "B";
  }

  const state = determineState();

  return (
    <div className="flex min-h-full flex-col bg-[#F5F2ED]">
      <Header
        pictureUrl={user?.pictureUrl}
        displayName={user?.displayName}
      />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-xs text-red-700">
            資料載入失敗：{error}。請重新整理頁面。
          </div>
        )}

        {state === "loading" && <LoadingSkeleton />}
        {state === "A" && <StateA onLogin={login} />}
        {state === "B" && (
          <StateB
            totalStamps={progress?.totalStamps ?? 0}
            stamps={progress?.stamps ?? []}
          />
        )}
        {state === "C" && <StateC stamps={progress?.stamps ?? []} />}
        {state === "D" && rewardFromUrl && drawDateParam && (
          <StateD reward={rewardFromUrl} drawDate={drawDateParam} />
        )}
        {state === "E" && user && <StateE lineUserId={user.userId} />}
        {state === "F" && <StateF />}
      </main>

      <Footer />

      {/* DEV ONLY: cache-clear button — delete before launch */}
      <button
        onClick={async () => {
          localStorage.clear();
          sessionStorage.clear();
          if ("caches" in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map((k) => caches.delete(k)));
          }
          window.location.reload();
        }}
        className="fixed bottom-4 right-4 z-[9999] rounded-full bg-red-600 px-3 py-1.5 text-[11px] font-mono font-bold text-white shadow-lg opacity-80 hover:opacity-100"
      >
        Clear Cache
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-gray-50"><div className="animate-spin size-8 rounded-full border-4 border-[#1A2B4A] border-t-transparent" /></div>}>
      <HomeContent />
    </Suspense>
  );
}
