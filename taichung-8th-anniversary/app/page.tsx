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
import { toast } from "sonner";
import { Ticket, Sparkles } from "lucide-react";
import type { Reward } from "@/lib/types";
import { DynamicHero } from "@/components/DynamicHero";
import SideDrawer from "@/components/SideDrawer";

// ── 活動期間 & 加碼獎時間常數 ────────────────────────────────────────────
const ACTIVITY_END    = new Date("2026-05-24T23:59:59+08:00");
const LOTTERY_DRAW    = new Date("2026-05-24T12:00:00Z"); // 20:00 Taipei
const LOTTERY_REVEAL  = new Date("2026-05-24T12:05:00Z"); // 20:05 Taipei

function isActivityEnded(): boolean { return new Date() > ACTIVITY_END; }

function getLotteryStatus(): "countdown" | "processing" | "revealed" {
  const now = new Date();
  if (now < LOTTERY_DRAW)   return "countdown";
  if (now < LOTTERY_REVEAL) return "processing";
  return "revealed";
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
              <span className="text-[#2B5CE6]/80 font-bold">2026 / 04 / 25 — 05 / 24</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Infinity Day Section ─────────────────────────────────────────────────
function InfinityDaySection({
  tickets,
  lotteryStatus,
  won,
}: {
  tickets: number;
  lotteryStatus: "countdown" | "processing" | "revealed";
  won?: boolean;
}) {
  if (lotteryStatus === "revealed") {
    return won ? (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#C9A84C] to-[#E5C97D] text-[#1A2B4A] shadow-[0_20px_40px_-15px_rgba(201,168,76,0.5)] animate-in zoom-in-95 duration-500">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 blur-3xl rounded-full" />
        <div className="relative p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#1A2B4A]/10 p-2 rounded-xl"><Sparkles size={18} className="text-[#1A2B4A]" /></div>
            <span className="font-black tracking-widest text-sm uppercase">Infinity Day</span>
          </div>
          <p className="text-2xl font-black leading-snug">🎉 恭喜中獎！</p>
          <p className="text-sm font-bold leading-relaxed">WIRED TOKYO 雙人和牛牛排套餐</p>
          <p className="text-xs opacity-70">對外價值 $2,300 ・兌換期限 2026/06/23</p>
          <p className="text-[10px] opacity-60">請至 WIRED TOKYO 台中市政店提前訂位使用，LINE 訊息已傳送詳細說明。</p>
        </div>
      </div>
    ) : (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A2B4A] to-[#2B5CE6] text-white shadow-[0_20px_40px_-15px_rgba(43,92,230,0.4)]">
        <div className="relative p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl"><Sparkles size={18} className="text-white/80" /></div>
            <span className="font-black tracking-widest text-sm uppercase">Infinity Day</span>
          </div>
          <p className="text-sm font-bold opacity-80">感謝您的參與</p>
          <p className="text-xs text-white/60 leading-relaxed">您共累積 {tickets} 張加碼獎券。本次 8 份和牛套餐已完成開獎，期待下次再見！</p>
        </div>
      </div>
    );
  }

  if (lotteryStatus === "processing") {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A2B4A] to-[#2B5CE6] text-white shadow-[0_20px_40px_-15px_rgba(43,92,230,0.5)]">
        <div className="relative p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl"><Sparkles size={18} className="text-yellow-300 animate-spin" /></div>
            <span className="font-black tracking-widest text-sm uppercase">Infinity Day</span>
          </div>
          <p className="text-sm font-bold animate-pulse">開獎中⋯⋯</p>
          <p className="text-xs text-white/60">系統正在從 {tickets} 張加碼獎券中抽出 8 位幸運得主，請稍候片刻。</p>
        </div>
      </div>
    );
  }

  // countdown
  const totalPool = 1250 + tickets;
  const userProb  = ((tickets * (8 / totalPool)) * 100).toFixed(2);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A2B4A] to-[#2B5CE6] text-white shadow-[0_20px_40px_-15px_rgba(43,92,230,0.5)] transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(43,92,230,0.6)] hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/20 blur-2xl rounded-full" />
      <div className="relative p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md shadow-inner border border-white/10">
              <Sparkles size={18} className="text-yellow-300 animate-pulse" />
            </div>
            <span className="font-black tracking-widest text-sm uppercase">Infinity Day</span>
          </div>
          <div className="text-[10px] bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 font-bold tracking-wider">
            5/24 20:00 開獎
          </div>
        </div>
        <p className="text-xs text-white/80 font-medium tracking-wide">抽出 8 份 WIRED TOKYO 雙人和牛牛排套餐</p>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10 shadow-sm transition-transform hover:scale-[1.02]">
            <p className="text-[10px] text-white/60 mb-1 font-bold tracking-wider">已累積券數</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black font-serif tracking-tighter">{tickets}</span>
              <span className="text-[10px] font-bold opacity-60">張</span>
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10 shadow-sm transition-transform hover:scale-[1.02]">
            <p className="text-[10px] text-white/60 mb-1 font-bold tracking-wider">預估中獎機率</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black font-serif tracking-tighter text-yellow-300 drop-shadow-sm">{userProb}</span>
              <span className="text-[10px] font-bold text-yellow-300/60">%</span>
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

  const [drawLoading, setDrawLoading]   = useState(false);
  const [lastReward, setLastReward]     = useState<Reward | null>(null);
  const [userHeroExpanded, setUserHeroExpanded] = useState(false);
  const [bonusWon, setBonusWon]         = useState<boolean | null>(null);
  const lotteryStatus = getLotteryStatus();

  const isLoading = userLoading || (!!user && progressLoading);

  const totalStamps = progress?.totalStamps ?? 0;
  const bitmask = useMemo(() => {
    if (!progress?.stamps) return 0;
    return progress.stamps.reduce((mask, s) => {
      const idNum = parseInt(s.stamp_id);
      if (isNaN(idNum)) return mask;
      return mask | (1 << (idNum - 1));
    }, 0);
  }, [progress?.stamps]);

  useEffect(() => {
    if (!user || lotteryStatus !== "revealed") return;
    fetch(`/api/bonus-draw/result?lineUserId=${user.userId}`)
      .then(r => r.json())
      .then(d => setBonusWon(d.won ?? false))
      .catch(() => {});
  }, [user, lotteryStatus]);

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
          <PageCard className="p-8 shadow-[0_20px_50px_-12px_rgba(26,43,74,0.1)] border border-white/50 space-y-8 bg-white/80 backdrop-blur-xl transition-all hover:shadow-[0_20px_50px_-12px_rgba(26,43,74,0.15)]">
            <div className="space-y-3 text-center">
              <h2 className="text-2xl font-black tracking-tight text-[#1A2B4A]">歡迎參加週年慶活動</h2>
              <p className="text-sm text-[#8A6F5C] font-medium">集印完成即可享受每日抽獎驚喜</p>
            </div>
            <StepFlow />
            <Button onClick={login} className="h-14 w-full rounded-full bg-gradient-to-r from-[#1A2B4A] to-[#2B5CE6] text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
              用 LINE 帳號參加
            </Button>
          </PageCard>
        )}

        {/* 集章格 — 永遠顯示於頁面頂部 */}
        {user && state !== "F" && (
          <PageCard className="p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white space-y-6 bg-white/90 backdrop-blur-xl">
            <StampCard stamps={progress?.stamps ?? []} totalStamps={totalStamps} />
            
            <Link href="/stamp" className="block mt-4">
              <Button 
                variant={totalStamps >= 8 ? "outline" : "default"}
                className={`h-14 w-full rounded-full text-lg font-bold shadow-sm transition-all duration-300 ${
                  totalStamps >= 8 
                    ? "border-2 border-[#1A2B4A]/20 text-[#1A2B4A] bg-transparent hover:bg-[#1A2B4A]/5 hover:border-[#1A2B4A]/40" 
                    : "bg-[#1A2B4A] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                }`}
              >
                {totalStamps >= 8 ? "繼續尋找隱藏點位" : "前往掃描 QR code"}
              </Button>
            </Link>
          </PageCard>
        )}



        {/* 狀態 C: 今日抽獎已解鎖 */}
        {state === "C" && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A2B4A] to-[#111C33] px-7 py-8 shadow-[0_20px_40px_-15px_rgba(26,43,74,0.5)] space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 blur-3xl rounded-full" />
            <div className="relative flex items-start gap-4">
              <div className="mt-0.5 flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E5C97D] flex items-center justify-center shadow-inner">
                <Sparkles className="text-[#1A2B4A]" size={22} />
              </div>
              <div className="space-y-1.5 pt-1">
                <p className="font-black text-white text-lg tracking-wide leading-snug">今日抽獎已解鎖</p>
                <p className="text-xs text-white/60 font-medium">每個帳號每天可抽獎 1 次</p>
              </div>
            </div>
            <Button onClick={handleDraw} disabled={drawLoading} className="relative overflow-hidden group h-14 w-full rounded-full bg-gradient-to-r from-[#C9A84C] to-[#E5C97D] text-[#1A2B4A] text-lg font-black shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]">
              <span className="relative z-10">{drawLoading ? "抽獎中..." : "立即抽獎"}</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </Button>
          </div>
        )}

        {/* 狀態 D: 剛抽完獎 */}
        {state === "D" && lastReward && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500 ease-out">
            <RewardCard reward={lastReward} />
            <Button className="h-14 w-full rounded-full bg-gradient-to-r from-[#1A2B4A] to-[#2B5CE6] font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" onClick={() => window.open('https://line.me/R/ch/1432061434/coupon/')}>
              查看我的獎券
            </Button>
          </div>
        )}

        {/* 狀態 E: 今日已抽完 */}
        {state === "E" && (
          <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white px-7 py-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex-shrink-0 w-12 h-12 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">✓</div>
              </div>
              <div className="space-y-1.5 pt-1">
                <p className="font-black text-[#1A2B4A] text-lg tracking-wide leading-snug">今日抽獎已完成</p>
                <p className="text-xs text-[#8A6F5C] leading-relaxed font-medium">明天 00:00 後將再次開放<br/>抽獎紀錄保存於優惠券匣</p>
              </div>
            </div>
            <Button
              className="h-14 w-full rounded-full font-bold border-2 border-[#1A2B4A]/10 text-[#1A2B4A] bg-transparent hover:bg-[#1A2B4A]/5 hover:border-[#1A2B4A]/30 transition-all flex items-center justify-center gap-2 group"
              onClick={() => window.open('https://line.me/R/ch/1432061434/coupon/')}
            >
              <Ticket size={18} className="group-hover:-rotate-12 transition-transform" />
              查看優惠券匣
            </Button>
          </div>
        )}

        {/* 狀態 F */}
        {state === "F" && (
          <PageCard className="p-8 shadow-xl border-none space-y-5 bg-white/90 backdrop-blur-xl text-center">
            <div className="space-y-2">
              <p className="text-xs font-mono tracking-widest text-[#8A6F5C] opacity-60">2026 · 04/25 — 05/24</p>
              <h2 className="text-2xl font-black text-[#1A2B4A]">感謝 30 天的相伴</h2>
              <p className="text-sm text-[#8A6F5C]">Nexus Life 8 週年活動圓滿結束</p>
            </div>
            <Button className="h-12 w-full rounded-full bg-[#1A2B4A] font-bold" onClick={() => window.open('https://line.me/R/ch/1432061434/coupon/')}>
              查看我的獎券
            </Button>
          </PageCard>
        )}

        {/* Infinity Day 區塊 — 有票就顯示；state F 時一律顯示 */}
        {user && (state === "F" || (progress?.ticketsCount ?? 0) > 0) && (
          <InfinityDaySection
            tickets={progress?.ticketsCount ?? 0}
            lotteryStatus={lotteryStatus}
            won={bonusWon ?? undefined}
          />
        )}

        {/* 底部導覽 */}
        <div className="flex justify-center gap-6 pt-4 pb-2">
          <Link href="/terms" className="text-xs text-[#1A2B4A]/40 hover:text-[#1A2B4A]/70 transition-colors">
            活動規則
          </Link>
          <span className="text-[#1A2B4A]/20">·</span>
          <Link href="/faq" className="text-xs text-[#1A2B4A]/40 hover:text-[#1A2B4A]/70 transition-colors">
            常見問題
          </Link>
          <span className="text-[#1A2B4A]/20">·</span>
          <Link href="/privacy" className="text-xs text-[#1A2B4A]/40 hover:text-[#1A2B4A]/70 transition-colors">
            隱私聲明
          </Link>
        </div>
      </main>
      <Footer />
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
