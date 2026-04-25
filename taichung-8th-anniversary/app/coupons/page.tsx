"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Wallet } from "lucide-react";
import CouponCard from "@/components/CouponCard";
import Footer from "@/components/Footer";
import { useLiffUser } from "@/hooks/useLiffUser";
import type { DrawHistory } from "@/lib/types";

export default function CouponsPage() {
  const { user, loading: userLoading, login } = useLiffUser();
  const [history, setHistory] = useState<DrawHistory[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    fetch(`/api/reward/history?lineUserId=${encodeURIComponent(user.userId)}`)
      .then((r) => r.json())
      .then((d) => setHistory(d.history ?? []))
      .finally(() => setFetching(false));
  }, [user]);

  const validCoupons   = history.filter((h) => {
    if (!h.rewards) return false;
    if (h.is_used) return false;
    const expiry = new Date(h.draw_date);
    expiry.setDate(expiry.getDate() + h.rewards.validity_days);
    return new Date() <= expiry;
  });
  const redeemedCoupons = history.filter((h) => h.is_used);
  const expiredCoupons = history.filter((h) => {
    if (!h.rewards || h.is_used) return false;
    const expiry = new Date(h.draw_date);
    expiry.setDate(expiry.getDate() + h.rewards.validity_days);
    return new Date() > expiry;
  });

  return (
    <div className="min-h-svh bg-[#F5F2ED] pb-10">
      <header className="sticky top-0 z-30 flex items-center gap-4 bg-white/80 px-4 py-4 backdrop-blur-md border-b border-black/5">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Wallet size={18} className="text-[#1A2B4A]" />
          <h1 className="text-lg font-bold text-[#1A2B4A]">優惠券匣</h1>
        </div>
        {!userLoading && history.length > 0 && (
          <span className="ml-auto text-xs font-bold text-[#C9A84C] bg-[#C9A84C]/10 rounded-full px-2 py-0.5">
            {validCoupons.length} 張有效
          </span>
        )}
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-8">

        {/* 未登入 */}
        {!userLoading && !user && (
          <div className="flex flex-col items-center gap-6 py-16 text-center">
            <Wallet size={48} className="text-[#1A2B4A]/20" />
            <div className="space-y-1">
              <p className="font-bold text-[#1A2B4A]">請先登入 LINE</p>
              <p className="text-sm text-gray-500">登入後即可查看您的優惠券記錄</p>
            </div>
            <Button onClick={login} className="h-12 px-8 bg-[#06C755] hover:bg-[#06C755]/90 text-white font-bold rounded-full">
              使用 LINE 登入
            </Button>
          </div>
        )}

        {/* 載入中 */}
        {(userLoading || fetching) && (
          <div className="flex justify-center py-16">
            <div className="size-8 animate-spin rounded-full border-4 border-[#1A2B4A] border-t-transparent" />
          </div>
        )}

        {/* 有效優惠券 */}
        {!fetching && user && validCoupons.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#1A2B4A]/50">
              有效優惠券 · {validCoupons.length} 張
            </h2>
            <p className="text-[11px] text-gray-400 -mt-1">點擊「展開核銷 QR Code」出示給店員掃描</p>
            <div className="space-y-3">
              {validCoupons.map((h) => (
                <CouponCard
                  key={h.id}
                  drawId={h.id}
                  reward={h.rewards}
                  drawDate={h.draw_date}
                  isUsed={h.is_used}
                  usedAt={h.used_at}
                  usedBy={h.used_by}
                />
              ))}
            </div>
          </section>
        )}

        {/* 已核銷 */}
        {!fetching && user && redeemedCoupons.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-orange-400">
              已核銷 · {redeemedCoupons.length} 張
            </h2>
            <div className="space-y-3">
              {redeemedCoupons.map((h) => (
                <CouponCard
                  key={h.id}
                  drawId={h.id}
                  reward={h.rewards}
                  drawDate={h.draw_date}
                  isUsed={h.is_used}
                  usedAt={h.used_at}
                  usedBy={h.used_by}
                />
              ))}
            </div>
          </section>
        )}

        {/* 已失效 */}
        {!fetching && user && expiredCoupons.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              已失效 · {expiredCoupons.length} 張
            </h2>
            <div className="space-y-3">
              {expiredCoupons.map((h) => (
                <CouponCard
                  key={h.id}
                  drawId={h.id}
                  reward={h.rewards}
                  drawDate={h.draw_date}
                  isUsed={h.is_used}
                  usedAt={h.used_at}
                  usedBy={h.used_by}
                />
              ))}
            </div>
          </section>
        )}

        {/* 空狀態 */}
        {!fetching && user && history.length === 0 && (
          <div className="flex flex-col items-center gap-6 py-16 text-center">
            <Wallet size={48} className="text-[#1A2B4A]/20" />
            <div className="space-y-1">
              <p className="font-bold text-[#1A2B4A]">尚無優惠券</p>
              <p className="text-sm text-gray-500">集滿 8 枚印章後即可開始抽獎</p>
            </div>
            <Link href="/stamp">
              <Button className="h-12 rounded-full bg-[#1A2B4A] px-8 text-white">
                去集章
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
