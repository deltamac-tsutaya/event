"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RewardCard from "@/components/RewardCard";
import StaffRedeemNotice from "@/components/StaffRedeemNotice";
import EmptyState from "@/components/ui-state/EmptyState";
import ErrorState from "@/components/ui-state/ErrorState";
import { showDrawSuccess } from "@/components/ui-state/SuccessToast";
import { Button } from "@/components/ui/button";
import { useLiffUser } from "@/hooks/useLiffUser";
import { useStampProgress } from "@/hooks/useStampProgress";
import type { DrawHistory, Reward } from "@/lib/types";

type DrawState = "idle" | "drawing" | "revealed" | "error";

function getTaipeiDateString(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// ── Draw animation overlay ────────────────────────────────────────────────────
function DrawAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1A2B4A]/95 text-white backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[#C9A84C]/20 blur-3xl rounded-full animate-pulse" />
        <span className="relative animate-spin-infinity text-8xl font-bold leading-none select-none text-[#C9A84C]">
          ∞
        </span>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold tracking-widest uppercase">正在開啟 Nexus Life</h2>
        <p className="text-sm text-white/60 animate-pulse">正在為您匯集 8 枚印章的能量…</p>
      </div>
      
      {/* 粒子效果裝飾 */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         {Array.from({ length: 20 }).map((_, i) => (
           <div 
             key={i} 
             className="absolute bg-white rounded-full animate-ping"
             style={{
               left: `${Math.random() * 100}%`,
               top: `${Math.random() * 100}%`,
               width: `${Math.random() * 4}px`,
               height: `${Math.random() * 4}px`,
               animationDelay: `${Math.random() * 2}s`
             }}
           />
         ))}
      </div>
    </div>
  );
}

export default function RewardsPage() {
  const router = useRouter();
  const { user } = useLiffUser();
  const { progress, loading: progressLoading, error: progressError, refetch } =
    useStampProgress(user?.userId ?? null);

  const [rewardsList, setRewardsList] = useState<Reward[]>([]);
  const [history, setHistory] = useState<DrawHistory[]>([]);
  const [drawState, setDrawState] = useState<DrawState>("idle");
  const [drawnReward, setDrawnReward] = useState<Reward | null>(null);
  const [drawError, setDrawError] = useState("");

  const today = getTaipeiDateString();

  // Fetch rewards list and history
  useEffect(() => {
    fetch("/api/rewards")
      .then((r) => r.json())
      .then((d) => setRewardsList(d.rewards ?? []));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/reward/history?lineUserId=${encodeURIComponent(user.userId)}`)
      .then((r) => r.json())
      .then((d) => setHistory(d.history ?? []));
  }, [user]);

  const handleDraw = async () => {
    if (!user || drawState === "drawing") return;
    setDrawState("drawing");
    setDrawError("");

    // Suspense to let the animation breathe
    await new Promise((r) => setTimeout(r, 2800));

    try {
      const res = await fetch("/api/reward/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineUserId: user.userId }),
      });
      const data = await res.json();

      if (data.success) {
        setDrawnReward(data.reward);
        setDrawState("revealed");
        showDrawSuccess(data.reward.name);
        await refetch();
        // Update history
        fetch(`/api/reward/history?lineUserId=${encodeURIComponent(user.userId)}`)
          .then((r) => r.json())
          .then((d) => setHistory(d.history ?? []));
      } else {
        setDrawState("error");
        setDrawError(data.error ?? "抽獎失敗，請稍後再試");
      }
    } catch (e) {
      setDrawState("error");
      setDrawError(e instanceof Error ? e.message : "網路錯誤");
    }
  };

  // ── Insufficient stamps ──────────────────────────────────────────────────
  if (!progressLoading && progress && progress.totalStamps < 8) {
    return (
      <div className="flex min-h-full flex-col bg-[#F5F2ED]">
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-4 py-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative">
             <span className="font-mono text-8xl font-bold text-[#1A2B4A]/10 select-none">∞</span>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#1A2B4A]/40">{progress.totalStamps}/8</span>
             </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#1A2B4A]">尚未開啟 Nexus Life</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              集滿 8 枚印章即可啟動年度慶典抽獎。<br />
              目前還差 <span className="font-bold text-[#C9A84C]">{8 - progress.totalStamps} 枚</span>，繼續探索吧。
            </p>
          </div>
          <Link href="/stamp">
            <Button className="h-12 rounded-full bg-[#1A2B4A] text-white hover:bg-[#1A2B4A]/90 px-10 shadow-lg shadow-blue-900/10">
              立即去集章
            </Button>
          </Link>
          <Link href="/" className="text-xs text-gray-400 hover:text-[#1A2B4A] transition-colors">
            ← 返回首頁
          </Link>
        </main>
      </div>
    );
  }

  if (progressError) {
    return (
      <div className="flex min-h-full flex-col bg-[#F5F2ED]">
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
          <ErrorState message={progressError} onRetry={refetch} />
        </main>
      </div>
    );
  }

  const drawnToday = progress?.drawnToday ?? false;

  return (
    <div className="flex min-h-full flex-col bg-[#F5F2ED]">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-6">
        {/* Back link */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-400 hover:text-[#1A2B4A]">
            ← 返回
          </Link>
          <h1 className="text-base font-bold text-[#1A2B4A] uppercase tracking-widest">Rewards</h1>
          <div className="w-8" />
        </div>

        {/* ── Drawing state ─────────────────────────────────────── */}
        {drawState === "drawing" && <DrawAnimation />}

        {/* ── Revealed ─────────────────────────────────────────── */}
        {drawState === "revealed" && drawnReward && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-1 py-4">
              <div className="inline-block px-3 py-1 bg-[#C9A84C]/10 rounded-full mb-2">
                <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest">Congratulations</p>
              </div>
              <h2 className="text-2xl font-bold text-[#1A2B4A]">獲得今日限定獎券</h2>
              <p className="text-xs text-gray-400">
                獎券已自動存入您的 LINE 優惠券夾
              </p>
            </div>
            <div className="animate-flip-reveal">
              <RewardCard reward={drawnReward} drawDate={today} />
            </div>
            <StaffRedeemNotice />
            <div className="text-center pt-4">
               <Link href="/">
                 <Button variant="outline" className="rounded-full border-[#1A2B4A]/20 text-[#1A2B4A]">回首頁</Button>
               </Link>
            </div>
          </div>
        )}

        {/* ── Error ────────────────────────────────────────────── */}
        {drawState === "error" && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="size-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-2xl">⚠️</div>
            <div className="space-y-1">
              <p className="text-base font-bold text-gray-800">抽獎發生錯誤</p>
              <p className="text-sm text-red-600/70">{drawError}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setDrawState("idle")}
              className="rounded-full px-8"
            >
              返回重試
            </Button>
          </div>
        )}

        {/* ── Idle: already drawn today ─────────────────────────── */}
        {drawState === "idle" && drawnToday && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white border border-[#1A2B4A]/5 p-8 text-center space-y-2 shadow-sm">
              <p className="text-lg font-bold text-[#1A2B4A]">
                今日抽獎已完成
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">
                感謝參與 Nexus Life 8 週年慶典。<br />
                明日 00:00 將重新開啟，記得再回來探索！
              </p>
            </div>
            {history[0] && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">本日獲得獎項</p>
                <RewardCard reward={history[0].rewards} drawDate={history[0].draw_date} />
                <StaffRedeemNotice />
              </div>
            )}
          </div>
        )}

        {/* ── Idle: can draw ────────────────────────────────────── */}
        {drawState === "idle" && !drawnToday && (
          <div className="space-y-8 py-4">
            {/* CTA */}
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#1A2B4A]">集章已完成</h2>
                <p className="text-sm text-gray-500 italic">能量匯集完畢，開啟您的 Nexus Life 驚喜</p>
              </div>
              <Button
                onClick={handleDraw}
                className="h-16 w-full rounded-full bg-[#1A2B4A] text-xl font-bold text-white hover:bg-[#1A2B4A]/90 animate-pulse-cta shadow-xl shadow-blue-900/20"
              >
                立即啟動抽獎
              </Button>
            </div>

            <StaffRedeemNotice />

            {/* Rewards list preview */}
            {rewardsList.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-[#1A2B4A]/5">
                <p className="text-sm font-bold text-[#1A2B4A] uppercase tracking-widest">Possible Rewards</p>
                <div className="grid gap-4">
                  {rewardsList.slice(0, 3).map((r) => (
                    <div key={r.id} className="opacity-60 scale-95 origin-center">
                      <RewardCard reward={r} drawDate={today} />
                    </div>
                  ))}
                  <p className="text-center text-[10px] text-gray-400">…以及更多驚喜</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── History (below draw result or already-drawn) ──────── */}
        {(drawState === "revealed" || drawnToday) && history.length > 1 && (
          <div className="space-y-4 pt-8 border-t border-[#1A2B4A]/5">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
              過往探索紀錄
            </p>
            <div className="grid gap-4 opacity-70">
              {history.slice(1, 4).map((h, i) => (
                <RewardCard key={i} reward={h.rewards} drawDate={h.draw_date} />
              ))}
            </div>
          </div>
        )}

        {!progressLoading && !progress && (
          <EmptyState message="尚無抽獎紀錄" />
        )}
      </main>
    </div>
  );
}
