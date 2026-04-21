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
import { Sparkles, Ticket, Info, ChevronRight, CheckCircle } from "lucide-react";
import type { DrawHistory, Reward } from "@/lib/types";
import { DynamicHero } from "@/components/DynamicHero";

// ── 活動期間常數 ─────────────────────────────────────────────────────────
const ACTIVITY_END = new Date("2026-05-13T23:59:59+08:00");
const INFINITY_DAY = new Date("2026-05-13T20:00:00+08:00");

function isActivityEnded(): boolean {
  return new Date() > ACTIVITY_END;
}

// ── Hero Section（全時顯示，支援點擊切換展開/收合）──────────────────────────
function HeroSection({ 
  compact, 
  bitmask, 
  onToggle 
}: { 
  compact: boolean; 
  bitmask: number; 
  onToggle: () => void; 
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

      <div className="relative z-10 px-6 pb-8 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-4 w-auto opacity-80" />
          <span className="text-[#1A2B4A]/20 font-mono text-[10px]">×</span>
          <img src="/wired-tokyo-logo.svg" alt="WIRED" className="h-5 w-auto opacity-70" />
        </div>

        <div>
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
          <div className="mt-2 space-y-4 animate-page-in">
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

// ── Infinity Day Section (狀態 G) ─────────────────────────────────────────
function InfinityDaySection({ tickets }: { tickets: number }) {
  // 模擬全池數據 (實務上應從 API 獲取)
  const totalPool = 1250 + tickets; 
  const winRate = ((8 / totalPool) * 100).toFixed(3);
  const userProb = ((tickets * (8 / totalPool)) * 100).toFixed(2);

  return (
    <Card className="overflow-hidden border-none bg-gradient-to-br from-[#1A2B4A] to-[#2B5CE6] text-white shadow-xl">
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
          <h3 className="text-lg font-bold">無限回饋日加碼獎</h3>
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
        
        <p className="text-[9px] text-white/40 text-center italic">
          每完成一次每日抽獎，即可獲得一張加碼獎券。
        </p>
      </div>
    </Card>
  );
}

// ── Main Content ──
function MainContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, isLoading: userLoading } = useLiffUser();
  const { progress, isLoading: progressLoading, refetch } = useStampProgress(user?.userId ?? null);

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
        toast.success("抽獎成功！今日加碼獎券 +1", { icon: <Ticket className="text-blue-500" /> });
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

  // ── 狀態判定邏輯 ──────────────────────────────────────────────────────────
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

  // 只要 userHeroExpanded 為 true，就強制不 compact
  const isCompact = state !== "A" && !userHeroExpanded;

  if (state === "loading") {
    return (
      <div className="flex h-svh flex-col items-center justify-center gap-4 bg-[#F5F2ED]">
        <div className="size-10 animate-spin rounded-full border-4 border-[#1A2B4A] border-t-transparent" />
        <p className="text-xs font-mono tracking-widest text-[#8A6F5C]">LOADING NEXUS...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col bg-[#F5F2ED] pb-10">
      <HeroSection 
        compact={isCompact} 
        bitmask={bitmask} 
        onToggle={() => setUserHeroExpanded(!userHeroExpanded)} 
      />

      <main className={`relative z-20 -mt-10 mx-auto w-full max-w-2xl px-5 space-y-6 transition-all duration-700 ${
        userHeroExpanded ? "opacity-0 pointer-events-none translate-y-10" : "opacity-100 translate-y-0"
      }`}>
        {/* 狀態 A：未登入 */}
        {state === "A" && (
          <PageCard className="p-8 shadow-2xl border-none space-y-8 bg-white/90 backdrop-blur-md">
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-bold text-[#1A2B4A]">歡迎參加週年慶活動</h2>
              <p className="text-sm text-gray-500">集印完成即可享受每日抽獎驚喜</p>
            </div>
            
            <StepFlow />

            <Button
              onClick={login}
              className="h-14 w-full rounded-full bg-[#1A2B4A] text-lg font-bold shadow-lg hover:shadow-xl transition-all"
            >
              用 LINE 帳號參加
            </Button>
          </Card>
        )}

        {/* 狀態 B：集印中 */}
        {state === "B" && (
          <PageCard className="p-6 shadow-xl border-none space-y-6">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-[#1A2B4A] flex items-center gap-2">
                 <div className="w-1 h-4 bg-[#C9A84C] rounded-full" />
                 {totalStamps === 0 ? "探索開始" : 
                  totalStamps === 7 ? "再 1 枚即可抽獎" :
                  totalStamps >= 4 ? "已完成一半，繼續前進" : "探索進度中"}
              </h2>
              <p className="text-xs text-gray-400">
                還差 {8 - totalStamps} 枚，繼續探索店內各區
              </p>
            </div>

            <StampCard stamps={progress?.stamps ?? []} totalStamps={totalStamps} />

            <div className="grid grid-cols-2 gap-3">
              <Link href="/stamp" className="block col-span-2">
                <Button className="h-14 w-full rounded-full bg-[#1A2B4A] text-lg font-bold shadow-lg">
                  前往掃描 QR code
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* 狀態 C：集滿可抽獎 */}
        {state === "C" && (
          <PageCard className="p-8 shadow-xl border-none space-y-6 bg-white text-center">
            <div className="space-y-2">
              <div className="mx-auto w-16 h-16 bg-[#C9A84C]/10 rounded-full flex items-center justify-center text-[#C9A84C]">
                <Sparkles size={32} />
              </div>
              <h2 className="text-xl font-bold text-[#1A2B4A]">集印完成。今日抽獎已解鎖。</h2>
              <p className="text-sm text-gray-500">每個帳號每天可抽獎 1 次，明天再來還有機會</p>
            </div>
            
            <Button
              onClick={handleDraw}
              disabled={drawLoading}
              className="h-14 w-full rounded-full bg-[#C9A84C] text-lg font-bold shadow-lg animate-pulse"
            >
              {drawLoading ? "抽獎中..." : "立即抽獎"}
            </Button>
          </Card>
        )}

        {/* 狀態 D：抽獎結果 */}
        {state === "D" && lastReward && (
          <div className="space-y-6">
            <RewardCard reward={lastReward} />
            <div className="flex flex-col gap-3">
              <Button className="h-14 rounded-full bg-[#1A2B4A] font-bold" onClick={() => window.open('https://line.me/R/ch/1432061434/coupon/')}>
                查看我的獎券
              </Button>
              <Button variant="outline" className="h-12 rounded-full border-[#1A2B4A]/20 text-[#1A2B4A]">
                分享給朋友
              </Button>
            </div>
            <p className="text-center text-xs text-gray-400">明天可以再抽一次，記得回來</p>
          </div>
        )}

        {/* 狀態 E：今日已抽 */}
        {state === "E" && (
          <PageCard className="p-8 text-center shadow-xl border-none space-y-6">
             <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
               <CheckCircle2 size={32} />
             </div>
             <div className="space-y-1">
               <h2 className="text-xl font-bold text-[#1A2B4A]">今日抽獎已完成</h2>
               <p className="text-sm text-gray-500">明天 00:00 後將再次開放抽獎</p>
             </div>
             <Button className="h-14 w-full rounded-full bg-[#1A2B4A] font-bold" onClick={() => window.open('https://line.me/R/ch/1432061434/coupon/')}>
                查看我的獎券
             </Button>
          </Card>
        )}

        {/* 狀態 F：活動結束 */}
        {state === "F" && (
          <PageCard className="p-10 text-center shadow-xl border-none space-y-6 bg-gray-50">
             <h2 className="text-2xl font-bold text-[#1A2B4A]">感謝 21 天的相伴</h2>
             <p className="text-sm text-gray-500 leading-relaxed">
               期待下次與你連結。<br />
               已抽中的獎券有效期為發放日起 14 天，請盡速至店內使用。
             </p>
             <Button className="h-14 w-full rounded-full bg-[#1A2B4A] font-bold" onClick={() => window.open('https://line.me/R/ch/1432061434/coupon/')}>
                查看我的獎券
             </Button>
          </Card>
        )}

        {/* 狀態 G：Infinity Day 專區 (僅登入後顯示) */}
        {user && state !== "F" && (
          <InfinityDaySection tickets={progress?.ticketsCount ?? 0} />
        )}

        {/* 底部導覽 */}
        <div className="flex justify-center gap-6 pt-4">
          <Link href="#rules" className="text-xs font-bold text-[#1A2B4A]/50 hover:text-[#1A2B4A] flex items-center gap-1">
             <Info size={12} /> 活動規則
          </Link>
          <Link href="#faq" className="text-xs font-bold text-[#1A2B4A]/50 hover:text-[#1A2B4A] flex items-center gap-1">
             <Info size={12} /> 常見問題
          </Link>
        </div>
        
        <div id="rules" className="pt-10 scroll-mt-10">
          <SectionHeader title="活動規則" />
          <div className="mt-4 text-[13px] text-gray-600 space-y-3 leading-relaxed">
            <p>• 至店內找到 8 個集印點 QR code，使用手機掃描完成集印。</p>
            <p>• 每個 QR code 每人限掃描 1 次，重複掃描不累計。</p>
            <p>• 集滿 8 枚後，每日可抽獎 1 次（每日午夜 00:00 重置）。</p>
            <p>• 8 枚印章中的 stamp-02、05、06 為每日輪替點位，每日午夜隨機抽換變體。當日未掃到輪替點則無法當日集滿。</p>
          </div>
        </div>

        <div id="faq" className="pt-10 scroll-mt-10">
          <SectionHeader title="常見問題" />
          <div className="mt-4 space-y-4">
            <FaqItem question="掃描後沒有蓋印？" answer="請確認已透過 LINE 登入活動頁面，重新整理後再試。" />
            <FaqItem question="今天已經抽過獎了？" answer="每個帳號每天可抽 1 次。午夜 00:00 後重新開放。" />
            <FaqItem question="獎券在哪裡查看？" answer="抽中的獎券會自動存入 LINE 優惠券夾，可從 LINE 主頁進入查看。" />
          </div>
        </div>
      </main>

      <Footer />

      {showScanResult && collectParam && (
        <ScanResultOverlay
          stampId={collectParam}
          onClose={() => {
            setShowScanResult(false);
            const newPath = window.location.pathname;
            window.history.replaceState(null, "", newPath);
          }}
        />
      )}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-[10px] font-bold text-[#8A6F5C] uppercase tracking-[0.2em]">{title}</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-sm font-bold text-[#1A2B4A] mb-1">{question}</p>
      <p className="text-[12px] text-gray-500 leading-relaxed">{answer}</p>
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

function CheckCircle2(props: any) {
  return (
    <CheckCircle {...props} />
  );
}

export default function Page() {
  return (
    <Suspense>
      <MainContent />
    </Suspense>
  );
}
