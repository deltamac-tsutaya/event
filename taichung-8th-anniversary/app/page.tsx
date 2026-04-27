"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import StampCard from "@/components/StampCard";
import RewardCard from "@/components/RewardCard";
import StepFlow from "@/components/StepFlow";
import LifeGantt from "@/components/LifeGantt";
import ScanResultOverlay from "@/components/ScanResultOverlay";
import { Button } from "@/components/ui/button";
import { useLiffUser } from "@/hooks/useLiffUser";
import { useStampProgress } from "@/hooks/useStampProgress";
import { toast } from "sonner";
import { Ticket, Sparkles, ChevronDown, Lock } from "lucide-react";
import type { Reward } from "@/lib/types";
import { DynamicHero } from "@/components/DynamicHero";
import SideDrawer from "@/components/SideDrawer";
import FirstStampOverlay from "@/components/FirstStampOverlay";

// ── 活動期間常數 ─────────────────────────────────────────────────────────
const ACTIVITY_END = new Date("2026-05-24T23:59:59+08:00");

function isActivityEnded(): boolean {
  return new Date() > ACTIVITY_END;
}

// ── Hero Section ─────────────────────────────────────────────────────────
function HeroSection({
  compact,
  bitmask,
  onToggle,
  user,
  infinityMode
}: {
  compact: boolean;
  bitmask: number;
  onToggle: () => void;
  user: any;
  infinityMode?: boolean;
}) {
  return (
    <section
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`relative z-10 flex flex-col justify-end overflow-hidden w-full transition-[height] duration-500 ease-in-out cursor-pointer active:scale-[0.995] ${
        compact ? "h-[42svh]" : "h-[100svh]"
      }`}
    >
      <DynamicHero bitmask={bitmask} compact={compact} infinityMode={infinityMode} />

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

      <div className="relative z-10 px-6 pb-12 flex flex-col gap-4">
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

        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${compact ? "max-h-0 opacity-0" : "max-h-40 opacity-100"}`}>
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
        </div>

        <div className={`h-5 flex items-center justify-center gap-1.5 transition-opacity duration-500 ${compact ? "opacity-50" : "opacity-0"}`}>
          <span className="text-[9px] font-bold tracking-widest text-[#1A2B4A]/60">點擊展開</span>
          <ChevronDown size={10} className="text-[#1A2B4A]/50" />
        </div>
      </div>
    </section>
  );
}

// ── Helper: Calculate time remaining to draw ──────────────────────────────
function calcTimeLeft() {
  const now = new Date();
  const target = new Date("2026-05-24T20:00:00+08:00");
  const diff = target.getTime() - now.getTime();

  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalSeconds,
  };
}

// ── TabButton Component ────────────────────────────────────────────────────
function TabButton({
  label,
  active,
  locked,
  onClick,
}: {
  label: string;
  active: boolean;
  locked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={`flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
        locked
          ? "opacity-40 cursor-not-allowed bg-white/20 text-[#1A2B4A]/40"
          : active
          ? "bg-[#1A2B4A] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          : "bg-white/50 text-[#1A2B4A]/70 hover:bg-white/70 hover:text-[#1A2B4A]"
      }`}
    >
      {locked && <Lock size={14} />}
      {label}
    </button>
  );
}

// ── InfinityDayTab Component ──────────────────────────────────────────────
function InfinityDayTab({ tickets }: { tickets: number }) {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalPool = 1250 + tickets;
  const userProb = ((tickets * (8 / totalPool)) * 100).toFixed(2);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A2B4A] to-[#2B5CE6] text-white shadow-[0_20px_40px_-15px_rgba(43,92,230,0.5)]">
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/20 blur-2xl rounded-full" />

      <div className="relative p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md shadow-inner border border-white/10">
              <Sparkles size={20} className="text-yellow-300 animate-pulse" />
            </div>
            <span className="font-black tracking-widest text-lg uppercase">Infinity Day</span>
          </div>
          <div className="text-[10px] bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 font-bold tracking-wider">
            5/24 20:00 開獎
          </div>
        </div>

        {/* Prize Info */}
        <div className="space-y-1">
          <p className="text-xs text-white/80 font-medium tracking-wide">抽出 8 份 WIRED TOKYO 雙人和牛牛排套餐</p>
        </div>

        {/* Countdown Grid */}
        <div className="grid grid-cols-4 gap-2.5 pt-2">
          {[
            { label: "天", value: timeLeft.days },
            { label: "小時", value: timeLeft.hours },
            { label: "分", value: timeLeft.minutes },
            { label: "秒", value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label} className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10 text-center">
              <div className="text-2xl font-black font-mono tracking-tighter mb-1">
                {String(item.value).padStart(2, "0")}
              </div>
              <p className="text-[9px] text-white/60 font-bold">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Tickets & Probability */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
            <p className="text-[10px] text-white/60 mb-2 font-bold tracking-wider">已累積券數</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black font-serif tracking-tighter">{tickets}</span>
              <span className="text-[10px] font-bold opacity-60">張</span>
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
            <p className="text-[10px] text-white/60 mb-2 font-bold tracking-wider">預估中獎機率</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black font-serif tracking-tighter text-yellow-300">{userProb}</span>
              <span className="text-[10px] font-bold text-yellow-300/60">%</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
          <p className="text-xs text-white/80 leading-relaxed">
            <span className="font-bold">集章說明：</span>完成任一印章集點後，自動獲得 1 張獎券。集滿 8 個印章可立即參加抽獎！
          </p>
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
  const [selectedStampId, setSelectedStampId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"stamps" | "infinity">("stamps");
  const [showFirstStampOverlay, setShowFirstStampOverlay] = useState(false);
  const [firstStampShown, setFirstStampShown] = useState(false);

  const infinityUnlocked = (progress?.ticketsCount ?? 0) > 0;

  // Show first stamp overlay once when progress is loaded and isFirstTime is true
  useEffect(() => {
    if (progress && progress.isFirstTime && !firstStampShown) {
      setShowFirstStampOverlay(true);
      setFirstStampShown(true);
    }
  }, [progress, firstStampShown]);

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
        infinityMode={activeTab === "infinity"}
      />

      {/* Tab Bar */}
      {user && state !== "F" && infinityUnlocked && (
        <div className="relative z-20 -mt-6 mx-auto w-full max-w-2xl px-5 flex gap-3 justify-center pb-6">
          <TabButton
            label="集章探索"
            active={activeTab === "stamps"}
            locked={false}
            onClick={() => setActiveTab("stamps")}
          />
          <TabButton
            label="無限夥伴"
            active={activeTab === "infinity"}
            locked={false}
            onClick={() => setActiveTab("infinity")}
          />
        </div>
      )}

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

        {/* Stamps View */}
        {user && state !== "F" && activeTab === "stamps" && (
          <PageCard className="p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white space-y-6 bg-white/90 backdrop-blur-xl">
            <StampCard stamps={progress?.stamps ?? []} totalStamps={totalStamps} onStampClick={setSelectedStampId} />

            <Link href="/stamp" className="block mt-4">
              <Button
                variant={totalStamps >= 8 ? "outline" : "default"}
                className={`h-14 w-full rounded-full text-lg font-bold shadow-sm transition-all duration-300 ${
                  totalStamps >= 8
                    ? "border-2 border-[#1A2B4A]/20 text-[#1A2B4A] bg-transparent hover:bg-[#1A2B4A]/5 hover:border-[#1A2B4A]/40"
                    : "bg-[#1A2B4A] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                }`}
              >
                {totalStamps >= 8 ? "尋找無限夥伴" : "前往掃描 QR code"}
              </Button>
            </Link>
          </PageCard>
        )}

        {/* Infinity Day View */}
        {user && state !== "F" && activeTab === "infinity" && infinityUnlocked && (
          <PageCard className="p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white bg-white/90 backdrop-blur-xl">
            <InfinityDayTab tickets={progress?.ticketsCount ?? 0} />
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
            <Button className="h-14 w-full rounded-full bg-gradient-to-r from-[#1A2B4A] to-[#2B5CE6] font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" onClick={() => router.push('/coupons')}>
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
              onClick={() => router.push('/coupons')}
            >
              <Ticket size={18} className="group-hover:-rotate-12 transition-transform" />
              查看優惠券匣
            </Button>
          </div>
        )}

        {/* 狀態 F */}
        {state === "F" && (
          <PageCard className="p-10 text-center shadow-xl border-none space-y-6 bg-gray-50">
             <h2 className="text-2xl font-bold text-[#1A2B4A]">感謝 30 天的相伴</h2>
             <Button className="h-14 w-full rounded-full bg-[#1A2B4A] font-bold" onClick={() => router.push('/coupons')}>
                查看我的獎券
             </Button>
          </PageCard>
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

      {/* 點擊印章查看詳情彈窗 */}
      {selectedStampId && (
        <ScanResultOverlay
          stampId={selectedStampId}
          totalStamps={totalStamps}
          onClose={() => setSelectedStampId(null)}
        />
      )}

      {/* 首次參加贈禮彈窗 */}
      {showFirstStampOverlay && (
        <FirstStampOverlay onClose={() => setShowFirstStampOverlay(false)} />
      )}

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
