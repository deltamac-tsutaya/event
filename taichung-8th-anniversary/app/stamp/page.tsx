"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QrScanner from "@/components/QrScanner";
import { useLiffUser } from "@/hooks/useLiffUser";
import { useStampProgress } from "@/hooks/useStampProgress";
import { showStampSuccess } from "@/components/ui-state/SuccessToast";

type ScanStatus =
  | "idle"
  | "submitting"
  | "success"
  | "already_stamped"
  | "error";

export default function StampPage() {
  const router = useRouter();
  const { user } = useLiffUser();
  const { progress, refetch } = useStampProgress(user?.userId ?? null);

  const [status, setStatus] = useState<ScanStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [lastStampId, setLastStampId] = useState("");

  const totalStamps = progress?.totalStamps ?? 0;

  const handleScan = useCallback(
    async (stampId: string) => {
      if (!user) return;
      if (status === "submitting") return;

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
          // Return to home after 1.5s with collection param
          setTimeout(() => router.push(`/?collect=${stampId}`), 1500);
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
    [user, status, refetch, router]
  );

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

  return (
    <div className="flex min-h-full flex-col bg-[#F5F2ED]">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6 gap-5">
        {/* Progress indicator */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-400 hover:text-[#1A2B4A]">
            ← 返回
          </Link>
          <span className="text-sm font-semibold text-[#1A2B4A]">
            {totalStamps} / 8 枚
          </span>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-lg font-bold text-gray-900">掃描 QR code 集章</h1>
          <p className="text-xs text-gray-400">
            對準店內各區的 QR code 即可蓋章
          </p>
        </div>

        {/* Scanner or result */}
        {status === "idle" && (
          <QrScanner onScan={handleScan} />
        )}

        {status === "submitting" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="size-10 animate-spin rounded-full border-4 border-[#1A2B4A] border-t-transparent" />
            <p className="text-sm text-gray-600">蓋章中…</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-6 py-12 text-center animate-in fade-in zoom-in duration-500">
            {['A', 'B', 'C'].includes(lastStampId) ? (
              // 隱藏成就點特別視覺
              <>
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full animate-pulse" />
                  <div className="relative size-32 bg-white rounded-full flex items-center justify-center text-6xl shadow-xl border-4 border-[#C9A84C] animate-bounce">
                    {getAchievementMeta(lastStampId)?.icon}
                  </div>
                </div>
                <div className="space-y-3 px-6">
                  <p className="text-xs font-bold tracking-widest text-[#C9A84C] uppercase">Achievement Unlocked</p>
                  <h2 className="text-2xl font-bold text-[#1A2B4A]">{getAchievementMeta(lastStampId)?.title}</h2>
                  <p className="text-sm text-[#8A6F5C] italic leading-relaxed">「{getAchievementMeta(lastStampId)?.copy}」</p>
                </div>
              </>
            ) : (
              // 標準點位視覺
              <>
                <div className="animate-stamp-drop rounded-full bg-[#EEE9E2] p-8 shadow-inner">
                  <span className="font-mono text-5xl font-bold text-[#1A2B4A] leading-none tracking-tighter">
                    {lastStampId}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-[#1A2B4A]">蓋章成功</p>
                  <p className="text-sm text-gray-500 italic">
                    探索 Nexus Life 的第 {totalStamps} 個印記
                  </p>
                </div>
              </>
            )}
            
            <div className="pt-4">
               <p className="text-[10px] text-gray-400 animate-pulse">正在為您重新對焦生活，請稍後…</p>
            </div>
          </div>
        )}

        {status === "already_stamped" && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="rounded-full bg-[#EEE9E2] px-5 py-3">
              <span className="font-mono text-sm font-semibold text-[#8A6F5C]">已收集</span>
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-gray-700">
                此印記已收集過
              </p>
              <p className="text-xs text-gray-400">
                每個集印點每人限蓋 1 次
              </p>
            </div>
            <button
              onClick={reset}
              className="text-sm text-[#1A2B4A] underline underline-offset-2"
            >
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
