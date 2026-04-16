"use client";

import { useEffect, useState } from "react";

export default function NetworkStatusBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      setWasOffline(true);
      setShowBack(false);
    };
    const handleOnline = () => {
      setIsOffline(false);
      if (wasOffline) {
        setShowBack(true);
        const t = setTimeout(() => setShowBack(false), 3000);
        return () => clearTimeout(t);
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [wasOffline]);

  if (!isOffline && !showBack) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 py-2 text-sm font-medium transition-all duration-300 ${
        isOffline
          ? "bg-red-500 text-white"
          : "bg-green-500 text-white"
      }`}
    >
      {isOffline ? (
        <>
          <span aria-hidden>📵</span>
          網路連線已中斷，請稍候再試
        </>
      ) : (
        <>
          <span aria-hidden>✅</span>
          網路已恢復連線
        </>
      )}
    </div>
  );
}
