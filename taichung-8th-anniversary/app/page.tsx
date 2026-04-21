"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import StampCard from "@/components/StampCard";
import RewardCard from "@/components/RewardCard";
import StepFlow from "@/components/StepFlow";
import LifeGantt from "@/components/LifeGantt";
import { Button } from "@/components/ui/button";
import { useLiffUser } from "@/hooks/useLiffUser";
import { useStampProgress } from "@/hooks/useStampProgress";
import type { DrawHistory, Reward } from "@/lib/types";

// ── 活動期間常數 ─────────────────────────────────────────────────────────
const ACTIVITY_END = new Date("2026-05-13T23:59:59+08:00");

function isActivityEnded(): boolean {
  return new Date() > ACTIVITY_END;
}

// ── 倒數至台北午夜 ────────────────────────────────────────────────────────
function getMidnightMs(): number {
  const now = new Date();
  const offset = 8 * 3_600_000;
  const taipeiNow = new Date(now.getTime() + offset);
  const midnight = new Date(
    Date.UTC(taipeiNow.getUTCFullYear(), taipeiNow.getUTCMonth(), taipeiNow.getUTCDate() + 1)
  );
  return midnight.getTime() - offset - now.getTime();
}

function useCountdown() {
  const [ms, setMs] = useState(getMidnightMs());
  useEffect(() => {
    const id = setInterval(() => setMs(getMidnightMs()), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1_000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ── Loading skeleton ──────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="px-4 pt-6 space-y-4 animate-pulse">
      <div className="skeleton h-5 w-1/2 rounded mx-auto" />
      <div className="grid grid-cols-4 gap-3 pt-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton aspect-square rounded-full" />
        ))}
      </div>
    </div>
  );
}

// ── Hero Section（全時顯示，登入後縮為 compact）──────────────────────────
import { DynamicHero } from "@/components/DynamicHero";

function HeroSection({ compact, bitmask }: { compact: boolean; bitmask: number }) {
  return (
    <section
      className={`relative flex flex-col justify-end overflow-hidden w-full transition-[height] duration-500 ease-out ${
        compact ? "h-[44svh]" : "h-[100svh]"
      }`}
    >
      {/* 動態底圖層 */}
      <DynamicHero bitmask={bitmask} compact={compact} />

      {/* 內容區 */}
      <div className="relative z-10 px-4 pb-6 flex flex-col gap-3">
        {/* 雙品牌 logo */}
        <div className="flex items-center gap-2">
          <img
            src="/tsutaya-logo.svg"
            alt="TSUTAYA BOOKSTORE"
            className="h-4 w-auto opacity-80"
          />
          <span className="text-[#1A2B4A]/20 font-mono text-[10px]">×</span>
          <img
            src="/wired-tokyo-logo.svg"
            alt="WIRED TOKYO"
            className="h-5 w-auto opacity-70"
          />
        </div>

        {/* 主標題 */}
        <div>
          <p className="brand-mono-label text-[#8A6F5C] mb-2">
            台中市政店 · 8th Anniversary
          </p>
          <h1
            className="font-heading font-semibold text-[#1A2B4A] leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(2.2rem, 9vw, 3.8rem)" }}
          >
            無限日常
            <br />
            <span className="opacity-70">∞ 連結生活</span>
          </h1>
        </div>

        {/* Landing 專用裝飾（非 compact） */}
        {!compact && (
          <div className="mt-2 space-y-3">
            <LifeGantt />
            <div className="flex items-center gap-3 text-[10px] font-mono text-[#8A6F5C]/60 tracking-widest">
              <span>2,922 Days</span>
              <span className="w-px h-3 bg-[#1A2B4A]/10" />
              <span>Est. 2018</span>
              <span className="w-px h-3 bg-[#1A2B4A]/10" />
              <span className="text-[#2B5CE6]/80 font-bold">2026 / 04 / 23</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── 底部導覽連結（共用）────────────────────────────────────────────────────
function FooterLinks() {
  return (
    <div className="flex justify-center gap-6 text-xs text-gray-400 pt-2">
      <Link href="/faq" className="hover:text-[#1A2B4A] hover:underline transition-colors">
        常見問題
      </Link>
      <Link href="/terms" className="hover:text-[#1A2B4A] hover:underline transition-colors">
        活動規則
      </Link>
    </div>
  );
}

// ── State A：未登入（集章說明 + 登入 CTA）────────────────────────────────
function LoginSection({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="px-4 pt-6 pb-12 space-y-6">
      <div className="text-center space-y-1">
        <p className="text-base font-semibold text-[#1A2B4A]">
          找出店內 8 個印記，集滿抽獎
        </p>
        <p className="text-xs text-[#8A6F5C]">
          每天一次抽獎機會 · 活動期間 2026/04/23—05/13
        </p>
      </div>

      <StepFlow />

      <Button
        onClick={onLogin}
        className="h-12 w-full rounded-full bg-[#1A2B4A] text-base font-semibold text-white hover:bg-[#1A2B4A]/90 animate-pulse-cta"
      >
        用 LINE 帳號參加
      </Button>

      <FooterLinks />
    </div>
  );
}

// ── State B / C：集章中 / 集滿可抽獎 ─────────────────────────────────────
function StampSection({
  totalStamps,
  stamps,
  canDraw,
}: {
  totalStamps: number;
  stamps: Array<{ stamp_id: string; collected_at: string }>;
  canDraw: boolean;
}) {
  const router = useRouter();
  const remaining = 8 - totalStamps;

  return (
    <div className="px-4 pt-5 pb-12 space-y-5 animate-page-in">
      {/* 進度標題 */}
      <div className="text-center space-y-0.5">
        <h2 className="text-xl font-bold text-[#1A2B4A] tabular-nums">
          {totalStamps} <span className="text-base font-normal text-[#8A6F5C]">/ 8 枚</span>
        </h2>
        {canDraw ? (
          <p className="text-sm font-semibold text-[#2B5CE6]">集印完成！今日抽獎已解鎖</p>
        ) : totalStamps === 7 ? (
          <p className="text-sm font-semibold text-orange-500">再 1 枚即可抽獎</p>
        ) : totalStamps >= 4 ? (
          <p className="text-sm text-[#1A2B4A]">已完成一半，繼續前進！</p>
        ) : (
          <p className="text-sm text-gray-500">還差 {remaining} 枚，繼續探索店內各區</p>
        )}
      </div>

      {/* 印章卡 */}
      <StampCard stamps={stamps} totalStamps={totalStamps} />

      {/* 主要 CTA */}
      {canDraw ? (
        <Button
          onClick={() => router.push("/rewards")}
          className="w-full h-12 rounded-full bg-[#2B5CE6] text-white text-base font-semibold hover:bg-[#2B5CE6]/90 animate-pulse-cta"
        >
          立即抽獎
        </Button>
      ) : (
        <Link href="/stamp">
          <Button className="w-full h-12 rounded-full bg-[#1A2B4A] text-white text-base font-semibold hover:bg-[#1A2B4A]/90">
            掃描 QR code 集章
          </Button>
        </Link>
      )}

      <FooterLinks />
    </div>
  );
}

// ── State D：抽獎結果 ──────────────────────────────────────────────────────
function DrawResultSection({ reward, drawDate }: { reward: Reward; drawDate: string }) {
  const router = useRouter();
  return (
    <div className="px-4 pt-5 pb-12 space-y-5 animate-page-in">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-900">抽獎結果</h2>
        <p className="text-xs text-gray-500">獎券已存入 LINE 優惠券夾</p>
      </div>
      <div className="animate-flip-reveal">
        <RewardCard reward={reward} drawDate={drawDate} />
      </div>
      <p className="text-center text-xs text-gray-400">明天可以再抽一次，記得回來</p>
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
          onClick={() =>
            navigator.share?.({
              title: "TSUTAYA BOOKSTORE × WIRED TOKYO 8th Anniversary",
              text: `我抽到了「${reward.name}」！快來一起集章抽獎吧！`,
            })
          }
        >
          分享給朋友
        </Button>
      </div>
    </div>
  );
}

// ── State E：今日已抽（倒數 + 歷史紀錄）─────────────────────────────────
function AlreadyDrawnSection({ lineUserId }: { lineUserId: string }) {
  const countdown = useCountdown();
  const [history, setHistory] = useState<DrawHistory[]>([]);

  useEffect(() => {
    fetch(`/api/reward/history?lineUserId=${encodeURIComponent(lineUserId)}`)
      .then((r) => r.json())
      .then((d) => setHistory(d.history ?? []));
  }, [lineUserId]);

  return (
    <div className="px-4 pt-5 pb-12 space-y-5 animate-page-in">
      <div className="rounded-2xl bg-[#F5F2ED] border border-[#8A6F5C]/15 p-5 text-center space-y-2">
        <p className="text-sm font-semibold text-[#1A2B4A]">今日抽獎已完成</p>
        <p className="text-xs text-[#8A6F5C]">距離下次抽獎機會</p>
        <p className="text-3xl font-mono font-bold text-[#1A2B4A] tabular-nums animate-countdown">
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
          <h2 className="text-sm font-bold text-[#1A2B4A]">抽獎紀錄</h2>
          {history.map((h, i) => (
            <RewardCard key={i} reward={h.rewards} drawDate={h.draw_date} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── State F：活動結束 ──────────────────────────────────────────────────────
function ActivityEndedSection() {
  return (
    <div className="px-4 pt-6 pb-12 flex flex-col items-center gap-6 text-center animate-page-in">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-[#1A2B4A]">感謝 2,922 個日子的相伴</h2>
        <p className="text-sm text-[#8A6F5C] leading-relaxed">期待下次與你連結。</p>
      </div>
      <div className="w-full rounded-2xl bg-amber-50 border border-amber-200 p-4 text-left text-sm text-amber-800 space-y-1">
        <p className="font-semibold">獎券使用提醒</p>
        <p>已抽中的獎券有效期為發放日起 14 天，請盡速至店內使用。</p>
      </div>
      <Link href="/rewards" className="w-full">
        <Button className="w-full h-11 bg-[#1A2B4A] text-white hover:bg-[#1A2B4A]/90 rounded-full">
          查看我的獎券
        </Button>
      </Link>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────
function HomeContent() {
  const searchParams = useSearchParams();
  const { user, loading: userLoading, login } = useLiffUser();
  const { progress, loading: progressLoading, error } = useStampProgress(
    user?.userId ?? null
  );

  const rewardParam   = searchParams.get("reward");
  const drawDateParam = searchParams.get("drawDate");
  const rewardFromUrl: Reward | null = rewardParam
    ? (() => { try { return JSON.parse(decodeURIComponent(rewardParam)); } catch { return null; } })()
    : null;

  const isLoading = userLoading || (!!user && progressLoading);

  type State = "loading" | "A" | "B" | "C" | "D" | "E" | "F";

  function determineState(): State {
    if (isLoading) return "loading";
    if (isActivityEnded()) return "F";
    if (!user) return "A";
    if (rewardFromUrl && drawDateParam) return "D";
    if (!progress) return "B";
    if (progress.drawnToday) return "E";
    if (progress.totalStamps >= 8) return "C";
    return "B";
  }

  const state = determineState();

  // 計算 Bitmask
  const bitmask = useMemo(() => {
    if (!progress?.stamps) return 0;
    return progress.stamps.reduce((mask, s) => {
      const idNum = parseInt(s.stamp_id, 10);
      if (isNaN(idNum) || idNum < 1 || idNum > 8) return mask;
      return mask | (1 << (idNum - 1));
    }, 0);
  }, [progress?.stamps]);

  const [compactHero, setCompactHero] = useState(false);
  useEffect(() => {
    const shouldCompact = state !== "A" && state !== "loading";
    if (shouldCompact === compactHero) return;
    const raf = requestAnimationFrame(() => setCompactHero(shouldCompact));
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="flex min-h-full flex-col bg-[#F5F2ED]">
      {/* Hero：全時可見，compact 動態切換 */}
      <HeroSection compact={compactHero} bitmask={bitmask} />

      {/* 錯誤提示 */}
      {error && (
        <div className="mx-4 mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-xs text-red-700">
          資料載入失敗：{error}。請重新整理頁面。
        </div>
      )}

      {/* 各狀態內容 */}
      {state === "loading" && <LoadingSkeleton />}
      {state === "A"       && <LoginSection onLogin={login} />}
      {(state === "B" || state === "C") && (
        <StampSection
          totalStamps={progress?.totalStamps ?? 0}
          stamps={progress?.stamps ?? []}
          canDraw={state === "C"}
        />
      )}
      {state === "D" && rewardFromUrl && drawDateParam && (
        <DrawResultSection reward={rewardFromUrl} drawDate={drawDateParam} />
      )}
      {state === "E" && user && <AlreadyDrawnSection lineUserId={user.userId} />}
      {state === "F"       && <ActivityEndedSection />}

      {/* DEV ONLY — 清除快取 */}
      {(process.env.NODE_ENV === "development" || searchParams.get("dev") === "1") && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg opacity-70 hover:opacity-100"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            Clear Cache
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-[#1A2B4A]">
          <div className="animate-spin size-8 rounded-full border-4 border-white/30 border-t-white" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
