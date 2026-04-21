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
    <div className="flex flex-col items-center gap-4 py-12">
      <span className="animate-spin-infinity text-6xl font-bold text-[#1A2B4A] leading-none select-none">
        ∞
      </span>
      <p className="text-sm text-gray-500">抽獎中…</p>
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

    // Artificial 2-second suspense
    await new Promise((r) => setTimeout(r, 2000));

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
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-4 py-10 text-center">
          <span className="font-mono text-5xl font-bold text-[#1A2B4A]/20">∞</span>
          <div className="space-y-1">
            <p className="text-base font-bold text-gray-800">
              需集滿 8 枚印章才能抽獎
            </p>
            <p className="text-sm text-gray-500">
              目前已集 {progress.totalStamps} 枚，還差{" "}
              {8 - progress.totalStamps} 枚
            </p>
          </div>
          <Link href="/stamp">
            <Button className="h-11 rounded-full bg-[#1A2B4A] text-white hover:bg-[#1A2B4A]/90 px-8">
              去集章
            </Button>
          </Link>
          <Link href="/" className="text-xs text-gray-400 hover:underline">
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
          <h1 className="text-base font-bold text-gray-900">獎項抽獎</h1>
          <div className="w-8" />
        </div>

        {/* ── Drawing state ─────────────────────────────────────── */}
        {drawState === "drawing" && <DrawAnimation />}

        {/* ── Revealed ─────────────────────────────────────────── */}
        {drawState === "revealed" && drawnReward && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <p className="text-base font-bold text-[#1A2B4A]">抽獎成功</p>
              <p className="text-xs text-gray-400">
                獎券已存入 LINE 優惠券夾
              </p>
            </div>
            <div className="animate-flip-reveal">
              <RewardCard reward={drawnReward} drawDate={today} />
            </div>
            <StaffRedeemNotice />
            <p className="text-center text-xs text-gray-400">
              明天可以再抽一次，記得回來
            </p>
          </div>
        )}

        {/* ── Error ────────────────────────────────────────────── */}
        {drawState === "error" && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500">Error</p>
            <p className="text-sm text-red-600">{drawError}</p>
            <Button
              variant="outline"
              onClick={() => setDrawState("idle")}
              className="rounded-full"
            >
              返回
            </Button>
          </div>
        )}

        {/* ── Idle: already drawn today ─────────────────────────── */}
        {drawState === "idle" && drawnToday && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#EEE9E2] p-4 text-center space-y-1">
              <p className="text-sm font-semibold text-gray-700">
                今日抽獎已完成
              </p>
              <p className="text-xs text-gray-400">
                明日 00:00 重置，記得回來
              </p>
            </div>
            {history[0] && (
              <>
                <p className="text-xs font-semibold text-gray-500">本日獎項</p>
                <RewardCard reward={history[0].rewards} drawDate={history[0].draw_date} />
                <StaffRedeemNotice />
              </>
            )}
          </div>
        )}

        {/* ── Idle: can draw ────────────────────────────────────── */}
        {drawState === "idle" && !drawnToday && (
          <div className="space-y-4">
            {/* CTA */}
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                集章完成！選擇「立即抽獎」
              </p>
              <Button
                onClick={handleDraw}
                className="h-14 w-full rounded-full bg-[#1A2B4A] text-lg font-bold text-white hover:bg-[#1A2B4A]/90 animate-pulse-cta"
              >
                立即抽獎
              </Button>
            </div>

            <StaffRedeemNotice />

            {/* Rewards list preview */}
            {rewardsList.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-700">可能獲得的獎項</p>
                {rewardsList.map((r) => (
                  <RewardCard key={r.id} reward={r} drawDate={today} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── History (below draw result or already-drawn) ──────── */}
        {(drawState === "revealed" || drawnToday) && history.length > 1 && (
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              過往紀錄
            </p>
            {history.slice(1).map((h, i) => (
              <RewardCard key={i} reward={h.rewards} drawDate={h.draw_date} />
            ))}
          </div>
        )}

        {!progressLoading && !progress && (
          <EmptyState message="尚無抽獎紀錄" />
        )}
      </main>
    </div>
  );
}
