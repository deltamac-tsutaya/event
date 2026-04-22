"use client";

import { useEffect, useState } from "react";
import type { LiffUser } from "@/lib/types";
import { MOCK_USER } from "@/lib/liff";

interface UseLiffUserResult {
  user: LiffUser | null;
  loading: boolean;
  login: () => void;
}

export function useLiffUser(): UseLiffUserResult {
  const [user, setUser] = useState<LiffUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const liffId = process.env.NEXT_PUBLIC_LIFF_ID ?? "";

      // No LIFF_ID or non-browser → use mock immediately
      if (!liffId || typeof window === "undefined") {
        if (!cancelled) {
          setUser(MOCK_USER);
          setLoading(false);
        }
        return;
      }

      try {
        const { initLiff, getLiffProfile, liff } = await import("@/lib/liff");
        await initLiff(liffId);

        if (liff.isLoggedIn()) {
          const profile = await getLiffProfile();
          if (!cancelled && profile) {
            setUser({
              userId: profile.userId,
              displayName: profile.displayName,
              pictureUrl: profile.pictureUrl,
            });
          }
        } else {
          // Logged-out in LIFF env → user is null (show CTA to login)
          if (!cancelled) setUser(null);
        }
      } catch {
        // liffId 已設定但初始化失敗 → 非 LINE 環境，設 null 而非 mock
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  function login() {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID ?? "";
    if (!liffId) return;
    import("@/lib/liff").then(({ liff }) => {
      if (!liff.isLoggedIn()) liff.login();
    });
  }

  return { user, loading, login };
}
