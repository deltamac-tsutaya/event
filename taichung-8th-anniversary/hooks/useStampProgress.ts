"use client";

import { useCallback, useEffect, useState } from "react";
import type { StampProgress } from "@/lib/types";

interface UseStampProgressResult {
  progress: StampProgress | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStampProgress(lineUserId: string | null): UseStampProgressResult {
  const [progress, setProgress] = useState<StampProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!lineUserId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await window.fetch(
        `/api/stamp/progress?lineUserId=${encodeURIComponent(lineUserId)}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: StampProgress = await res.json();
      setProgress(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "載入失敗");
    } finally {
      setLoading(false);
    }
  }, [lineUserId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { progress, loading, error, refetch: fetch };
}
