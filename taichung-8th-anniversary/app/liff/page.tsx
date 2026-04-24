"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LiffPage() {
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const liffId = process.env.NEXT_PUBLIC_LIFF_ID ?? "";

      // No LIFF ID → fallback to main page
      if (!liffId) {
        router.replace("/");
        return;
      }

      try {
        const { initLiff, liff } = await import("@/lib/liff");
        await initLiff(liffId);

        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: `${window.location.origin}/liff` });
          return;
        }

        const profile = await liff.getProfile();
        const res = await fetch(`/api/user/status?lineUserId=${profile.userId}`);
        const data = await res.json();

        if (data.consented) {
          router.replace("/");
        } else {
          router.replace("/consent");
        }
      } catch {
        router.replace("/");
      }
    }

    init();
  }, [router]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#F5F2ED]">
      <div className="flex items-center gap-3 opacity-60">
        <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-4 w-auto" />
        <span className="text-[#1A2B4A]/30 font-mono text-xs">×</span>
        <img src="/wired-tokyo-logo.svg" alt="WIRED" className="h-5 w-auto" />
      </div>
      <div className="w-8 h-8 rounded-full border-[3px] border-[#1A2B4A] border-t-transparent animate-spin" />
      <p className="text-[10px] font-mono tracking-[0.25em] text-[#8A6F5C]">LOADING...</p>
    </div>
  );
}
