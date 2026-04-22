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
import ScanResultOverlay from "@/components/ScanResultOverlay";
import { toast } from "sonner";
import { Info, Ticket, Sparkles } from "lucide-react";
import type { Reward } from "@/lib/types";
import { DynamicHero } from "@/components/DynamicHero";
import SideDrawer from "@/components/SideDrawer";

// ── 活動期間常數 ─────────────────────────────────────────────────────────
const ACTIVITY_END = new Date("2026-05-13T23:59:59+08:00");

function isActivityEnded(): boolean {
  return new Date() > ACTIVITY_END;
}

// ── Hero Section ─────────────────────────────────────────────────────────
function HeroSection({ 
  compact, 
  bitmask, 
  onToggle,
  user
}: { 
  compact: boolean; 
  bitmask: number; 
  onToggle: () => void; 
  user: any;
}) {
  return (
    <section
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`relative z-10 flex flex-col justify-end overflow-hidden w-full transition-[height] duration-700 ease-in-out cursor-pointer active:scale-[0.99] transition-transform ${
        compact ? "h-[42svh]" : "h-[100svh]"
      }`}
    >
      <DynamicHero bitmask={bitmask} compact={compact} />

      {/* Side Drawer trigger at Top Left */}
      <div className="absolute top-6 left-6 z-20">
        <SideDrawer />
      </div>

      {/* User Profile Pill at Top Right */}
      {user && (
        <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
          {user.pictureUrl ? (
            <img src={user.pictureUrl} alt={user.displayName} className="w-6 h-6 rounded-full object-cover border border-white/40" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#1A2B4A]/40 flex items-center justify-center text-[10px] text-white font-bold border border-white/40">
              {user.displayName?.charAt(0) || "U"}
            </div>
          )}
          <span className="text-[10px] font-bold text-[#1A2B4A] tracking-wider truncate max-w-[80px]">
            {user.displayName}
          </span>
        </div>
      )}

      <div className="relative z-10 px-6 pb-8 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-4 w-auto opacity-80" />
          <span className="text-[#1A2B4A]/20 font-mono text-[10px]">×</span>
          <img src="/wired-tokyo-logo.svg" alt="WIRED" className="h-5 w-auto opacity-70" />
        </div>

        <div onClick={(e) => { e.stopPropagation(); onToggle(); }}>
          <p className="brand-mono-label text-[#8A6F5C] mb-1 font-bold tracking-widest text-[10px]">
            台中市政店 8 週年
          </p>
          <h1
            className="font-heading font-semibold text-[#1A2B4A] leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(2.4rem, 10vw, 4rem)" }}
          >
            Nexus Life
            <br />
            <span className="text-[0.65em] opacity-80 font-normal">無限日常 ∞ 連結生活</span>
          </h1>
        </div>

        {!compact && (
          <div className="mt-2 space-y-4">
             <p className="text-sm text-[#1A2B4A]/70 font-medium">
               找出店內 8 個印記，集滿抽獎，每天一次機會
             </p>
             <div className="flex items-center gap-3 text-[10px] font-mono text-[#8A6F5C]/60 tracking-widest">
              <span>2,922 Days</span>
              <span className="w-px h-3 bg-[#1A2B4A]/10" />
              <span>Est. 2018</span>
              <span className="w-px h-3 bg-[#1A2B4A]/10" />
              <span className="text-[#2B5CE6]/80 font-bold">2026 / 04 / 23 — 05 / 13</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Infinity Day Section ─────────────────────────────────────────────────
function InfinityDaySection({ tickets }: { tickets: number }) {
  const totalPool = 1250 + tickets; 
  const userProb = ((tickets * (8 / totalPool)) * 100).toFixed(2);

  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A2B4A] to-[#2B5CE6] text-white shadow-xl">
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
              <Sparkles size={18} className="text-yellow-300" />
            </div>
            <span className="font-bold tracking-wider text-sm uppercase">Infinity Day</span>
          </div>
          <div className="text-[10px] bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm opacity-80">
            5/13 20:00 開獎
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-white/70">抽出 8 份 WIRED TOKYO 雙人和牛牛排套餐</p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-[10px] text-white/50 mb-1">已累積券數</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-serif">{tickets}</span>
              <span className="text-[10px] opacity-60">張</span>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
            <p className="text-[10px] text-white/50 mb-1">預估中獎機率</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-serif text-yellow-300">{userProb}</span>
              <span className="text-[10px] opacity-60">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Content ──
function MainContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, loading: userLoading } = useLiffUser();
  const { progress, loading: progressLoading, refetch } = useStampProgress(user?.userId ?? null);

  const [drawLoading, setDrawLoading] = useState(false);
  const [lastReward, setLastReward] = useState<Reward | null>(null);
  const [userHeroExpanded, setUserHeroExpanded] = useState(false);

  const isLoading = userLoading || (!!user && progressLoading);
  const collectParam = searchParams.get("collect");
  const [showScanResult, setShowScanResult] = useState(false);

  useEffect(() => {
    if (collectParam) setShowScanResult(true);
  }, [collectParam]);

  const totalStamps = progress?.totalStamps ?? 0;
  const bitmask = useMemo(() => {
    if (!progress?.stamps) return 0;
    return progress.stamps.reduce((mask, s) => {
      const idNum = parseInt(s.stamp_id);
      if (isNaN(idNum)) return mask;
      return mask | (1 << (idNum - 1));
    }, 0);
  }, [progress?.stamps]);

  const handleDraw = async () => {
    if (!user) return;
    setDrawLoading(true);
    try {
      const res = await fetch("/api/reward/draw", {
        method: "POST",
        body: JSON.stringify({ lineUserId: user.userId }),
      });
      const data = await res.json();
      if (data.success) {
        setLastReward(data.reward);
        toast.success("抽獎成功！今日加碼獎券 +1", { icon: "🎫" });
        refetch();
      } else {
        toast.error(data.error || "抽獎失敗");
      }
    } catch (e) {
      toast.error("連線錯誤");
    } finally {
      setDrawLoading(false);
    }
  };

  type State = "loading" | "A" | "B" | "C" | "D" | "E" | "F";
  const state: State = useMemo(() => {
    if (isLoading) return "loading";
    if (isActivityEnded()) return "F";
    if (!user) return "A";
    if (lastReward) return "D";
    if (totalStamps < 8) return "B";
    if (progress?.drawnToday) return "E";
    return "C";
  }, [isLoading, user, totalStamps, progress?.drawnToday, lastReward]);

  const isCompact = state !== "A" && !userHeroExpanded;

  if (state === "loading") {
    return (
      <div className="flex h-svh flex-col items-center justify-center gap-4 bg-[#F5F2ED]">
        <div className="size-10 animate-spin rounded-full border-4 border-[#1A2B4A] border-t-transparent" />
        <p className="text-xs font-mono tracking-widest text-[#8A6F5C]">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col bg-[#F5F2ED] pb-10">
      <HeroSection 
        compact={isCompact} 
        bitmask={bitmask} 
        onToggle={() => setUserHeroExpanded(!userHeroExpanded)} 
        user={user}
      />

      <main className={`relative z-20 -mt-10 mx-auto w-full max-w-2xl px-5 space-y-6 transition-all duration-700 ${
        userHeroExpanded ? "opacity-0 pointer-events-none translate-y-10" : "opacity-100 translate-y-0"
      }`}>
        {/* 狀態 A */}
        {state === "A" && (
          <PageCard className="p-8 shadow-2xl border-none space-y-8 bg-white/90 backdrop-blur-md">
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-bold text-[#1A2B4A]">歡迎參加週年慶活動</h2>
              <p className="text-sm text-gray-500">集印完成即可享受每日抽獎驚喜</p>
            </div>
            <StepFlow />
            <Button onClick={login} className="h-14 w-full rounded-full bg-[#1A2B4A] text-lg font-bold">
              用 LINE 帳號參加
            </Button>
          </PageCard>
        )}

        {/* 集章格 — 永遠顯示於頁面頂部 */}
        {user && state !== "F" && (
          <PageCard className="p-6 shadow-xl border-none space-y-6">
            <StampCard stamps={progress?.stamps ?? []} totalStamps={totalStamps} />
            
            <Link href="/stamp" className="block">
              <Button className="h-14 w-full rounded-full bg-[#1A2B4A] text-lg font-bold shadow-lg">
                {totalStamps >= 8 ? "繼續尋找隱藏點位" : "前往掃描 QR code"}
              </Button>
            </Link>
          </PageCard>
        )}



        {/* 狀態 C: 今日抽獎已解鎖 */}
        {state === "C" && (
          <div className="rounded-2xl bg-[#1A2B4A] px-6 py-6 shadow-xl space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
                <Sparkles className="text-[#C9A84C]" size={20} />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-white text-base leading-snug">集印完成・今日抽獎已解鎖</p>
                <p className="text-xs text-white/50 leading-relaxed">每個帳號每天可抽獎 1 次</p>
              </div>
            </div>
            <Button onClick={handleDraw} disabled={drawLoading} className="h-14 w-full rounded-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#1A2B4A] text-lg font-bold animate-pulse shadow-md">
              {drawLoading ? "抽獎中..." : "立即抽獎"}
            </Button>
          </div>
        )}

        {/* 狀態 D: 剛抽完獎 */}
        {state === "D" && lastReward && (
          <div className="space-y-6">
            <RewardCard reward={lastReward} />
            <Button className="h-14 w-full rounded-full bg-[#1A2B4A] font-bold" onClick={() => window.open('https://line.me/R/ch/1432061434/coupon/')}>
              查看我的獎券
            </Button>
          </div>
        )}

        {/* 狀態 E: 今日已抽完 */}
        {state === "E" && (
          <div className="rounded-2xl bg-white border border-[#E8E4DE] px-6 py-6 shadow-sm space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-[#1A2B4A] text-base leading-snug">今日抽獎已完成</p>
                <p className="text-xs text-gray-400 leading-relaxed">明天 00:00 後將再次開放，抽獎紀錄保存於優惠券匣</p>
              </div>
            </div>
            <Button
              className="h-14 w-full rounded-full font-bold border border-[#1A2B4A]/30 text-[#1A2B4A] bg-transparent hover:bg-[#1A2B4A]/5 flex items-center justify-center gap-2"
              onClick={() => window.open('https://line.me/R/ch/1432061434/coupon/')}
            >
              <Ticket size={18} />
              查看優惠券匣
            </Button>
          </div>
        )}

        {/* 狀態 F */}
        {state === "F" && (
          <PageCard className="p-10 text-center shadow-xl border-none space-y-6 bg-gray-50">
             <h2 className="text-2xl font-bold text-[#1A2B4A]">感謝 21 天的相伴</h2>
             <Button className="h-14 w-full rounded-full bg-[#1A2B4A] font-bold" onClick={() => window.open('https://line.me/R/ch/1432061434/coupon/')}>
                查看我的獎券
             </Button>
          </PageCard>
        )}

        {user && state !== "F" && progress?.canDraw && (
          <InfinityDaySection tickets={progress?.ticketsCount ?? 0} />
        )}

        {/* 底部導覽 */}
        <div className="flex justify-center gap-6 pt-4">
          <Link href="/terms" className="text-xs font-bold text-[#1A2B4A]/50 flex items-center gap-1">
             <Info size={12} /> 活動規則
          </Link>
          <Link href="/faq" className="text-xs font-bold text-[#1A2B4A]/50 flex items-center gap-1">
             <Info size={12} /> 常見問題
          </Link>
        </div>
      </main>
      <Footer />
      {showScanResult && collectParam && (
        <ScanResultOverlay
          stampId={collectParam}
          onClose={() => {
            setShowScanResult(false);
            window.history.replaceState(null, "", window.location.pathname);
          }}
        />
      )}
    </div>
  );
}

function PageCard({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-3xl bg-white ${className}`} {...props}>
      {children}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <MainContent />
    </Suspense>
  );
}
