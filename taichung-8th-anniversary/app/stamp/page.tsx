"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
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
          // Return to home after 3 s
          setTimeout(() => router.push("/"), 3000);
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

  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      <Header
        pictureUrl={user?.pictureUrl}
        displayName={user?.displayName}
      />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6 gap-5">
        {/* Progress indicator */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-400 hover:text-[#00694B]">
            ← 返回
          </Link>
          <span className="text-sm font-semibold text-[#00694B]">
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
            <div className="size-10 animate-spin rounded-full border-4 border-[#00694B] border-t-transparent" />
            <p className="text-sm text-gray-600">蓋章中…</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="animate-stamp-drop rounded-full bg-[#e6f4ef] p-6">
              <span className="text-5xl leading-none">✅</span>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-[#00694B]">蓋章成功！</p>
              <p className="text-sm text-gray-500">
                印章 {lastStampId} 已收集
              </p>
              <p className="text-xs text-gray-400">3 秒後返回首頁…</p>
            </div>
          </div>
        )}

        {status === "already_stamped" && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <span className="text-4xl">🔒</span>
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
              className="text-sm text-[#00694B] underline underline-offset-2"
            >
              掃描其他 QR code
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <span className="text-4xl">⚠️</span>
            <p className="text-sm text-red-600">{errorMsg}</p>
            <button
              onClick={reset}
              className="rounded-full bg-[#00694B] px-6 py-2 text-sm font-medium text-white hover:bg-[#00694B]/90"
            >
              重試
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
