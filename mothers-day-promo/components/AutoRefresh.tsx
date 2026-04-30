"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const INTERVAL_SEC = 300; // 5 minutes

export default function AutoRefresh() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(INTERVAL_SEC);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const doRefresh = () => {
    setRefreshing(true);
    router.refresh();
    setLastRefreshed(new Date());
    setCountdown(INTERVAL_SEC);
    setTimeout(() => setRefreshing(false), 800);
  };

  useEffect(() => {
    setLastRefreshed(new Date());

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          doRefresh();
          return INTERVAL_SEC;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}:${String(sec).padStart(2, "0")}` : `${sec}s`;
  };

  const formatLastRefreshed = (d: Date) => {
    return d.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full text-xs shadow-lg"
      style={{
        background: "rgba(42,31,24,0.88)",
        color: "#E5CBA8",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(200,132,94,0.25)",
      }}
    >
      {/* Auto-refresh ring indicator */}
      <svg width="14" height="14" viewBox="0 0 14 14" className={refreshing ? "animate-spin" : ""}>
        <circle cx="7" cy="7" r="5.5" stroke="#C8845E" strokeWidth="1.5" fill="none" strokeOpacity="0.3"/>
        <circle
          cx="7" cy="7" r="5.5"
          stroke="#C8845E" strokeWidth="1.5" fill="none"
          strokeDasharray={`${2 * Math.PI * 5.5}`}
          strokeDashoffset={`${2 * Math.PI * 5.5 * (1 - (INTERVAL_SEC - countdown) / INTERVAL_SEC)}`}
          strokeLinecap="round"
          transform="rotate(-90 7 7)"
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>

      {/* Last refreshed time */}
      {lastRefreshed && (
        <span style={{ color: "#A08060" }}>
          {formatLastRefreshed(lastRefreshed)}
        </span>
      )}

      <span style={{ color: "#C8A882" }}>·</span>

      {/* Countdown */}
      <span>{formatTime(countdown)}</span>

      {/* Manual refresh button */}
      <button
        onClick={doRefresh}
        className="ml-0.5 hover:opacity-80 transition-opacity"
        title="立即刷新"
        style={{ color: "#E5CBA8" }}
      >
        ↺
      </button>
    </div>
  );
}
