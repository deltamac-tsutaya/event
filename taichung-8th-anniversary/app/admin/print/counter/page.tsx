"use client";

import { Button } from "@/components/ui/button";
import { Printer, ChevronLeft } from "lucide-react";
import Link from "next/link";
import QRCode from "react-qr-code";

const APP_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL ?? "https://taichung-8th-anniversary.vercel.app";

const NAVY = "#1A2B4A";
const GOLD = "#C9A84C";
const CREAM = "#F5F2ED";

function CounterCard() {
  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{ width: "210mm", height: "297mm" }}
    >
      {/* ── 頂部深藍品牌帶 ── */}
      <div className="relative overflow-hidden shrink-0" style={{ height: "78mm", background: NAVY }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-black" style={{ fontSize: "160mm", lineHeight: 1, color: `${GOLD}07`, transform: "translateY(10mm)" }}>8</span>
        </div>
        <div className="absolute inset-[4mm]" style={{ border: `0.5px solid ${GOLD}28` }} />
        {(["top-[3mm] left-[3mm]","top-[3mm] right-[3mm]","bottom-[3mm] left-[3mm]","bottom-[3mm] right-[3mm]"] as const).map((p, i) => (
          <span key={i} className={`absolute ${p} font-serif text-[10px] leading-none`} style={{ color: `${GOLD}50` }}>∞</span>
        ))}

        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-[3mm]">
          <div className="flex items-center gap-3">
            <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-3 w-auto opacity-60" style={{ filter: "invert(1)" }} />
            <span className="text-[8px] font-mono" style={{ color: `${GOLD}40` }}>×</span>
            <img src="/wired-tokyo-logo.svg" alt="WIRED" className="h-3.5 w-auto opacity-55" style={{ filter: "invert(1)" }} />
          </div>
          <div className="text-center">
            <p className="text-[7px] font-mono tracking-[0.4em] mb-1" style={{ color: `${GOLD}CC` }}>8TH ANNIVERSARY</p>
            <h1 className="text-[28px] font-black tracking-tight text-white leading-none">Nexus Life</h1>
            <p className="text-[8px] font-mono mt-1 tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.35)" }}>無限日常 ∞ 連結生活</p>
          </div>
          <p className="text-[6px] font-mono tracking-widest" style={{ color: `${GOLD}60` }}>台中市政店 8 週年 · 2026/04/23 — 05/13</p>
        </div>
      </div>

      {/* ── 活動說明區 ── */}
      <div className="relative flex flex-col px-[10mm] py-[7mm] gap-[5mm] shrink-0" style={{ height: "131mm", background: CREAM }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: `linear-gradient(${NAVY} 0.5px, transparent 0.5px), linear-gradient(90deg, ${NAVY} 0.5px, transparent 0.5px)`,
          backgroundSize: "10mm 10mm",
        }} />

        <div className="text-center">
          <p className="text-[10px] font-black tracking-[0.08em]" style={{ color: NAVY }}>參加方式</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px" style={{ background: `${GOLD}50` }} />
          <span className="text-[8px] font-serif" style={{ color: `${GOLD}80` }}>∞</span>
          <div className="flex-1 h-px" style={{ background: `${GOLD}50` }} />
        </div>

        <div className="space-y-[3.5mm]">
          {[
            { n: "1", t: "掃描現場活動 QR Code", d: "點擊「用 LINE 帳號參加」登入" },
            { n: "2", t: "找出館內 8 個集印點", d: "用活動頁掃碼集印，每個點位限蓋 1 次" },
            { n: "3", t: "集滿後每天可抽 1 次", d: "抽取 LINE 優惠券，14 項獎品 100% 中獎" },
            { n: "4", t: "每日 00:00 重置機會", d: "全程 21 天，每日回訪累積加碼獎券" },
          ].map((s) => (
            <div key={s.n} className="flex items-start gap-[3mm]">
              <span className="shrink-0 w-[6mm] h-[6mm] rounded-full flex items-center justify-center text-[7px] font-black text-white mt-[0.3mm]" style={{ background: NAVY }}>
                {s.n}
              </span>
              <div>
                <p className="text-[7.5px] font-bold leading-tight" style={{ color: NAVY }}>{s.t}</p>
                <p className="text-[6px] leading-relaxed" style={{ color: `${NAVY}60` }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px" style={{ background: `${GOLD}50` }} />
          <span className="text-[8px] font-serif" style={{ color: `${GOLD}80` }}>∞</span>
          <div className="flex-1 h-px" style={{ background: `${GOLD}50` }} />
        </div>

        <div className="flex items-center gap-[6mm]">
          <div className="shrink-0 p-[1.5mm] border bg-white rounded" style={{ borderColor: `${NAVY}20` }}>
            <QRCode value={APP_URL} size={128} fgColor={NAVY} bgColor="#fff" level="M" viewBox="0 0 128 128" style={{ width: "18mm", height: "18mm", display: "block" }} />
          </div>
          <div className="space-y-1">
            <p className="text-[7px] font-bold" style={{ color: NAVY }}>掃描加入活動</p>
            <p className="text-[5.5px] leading-relaxed" style={{ color: `${NAVY}55` }}>
              用 LINE 內建掃描器掃此 QR Code<br />開啟活動頁面後，即可開始集章
            </p>
            <p className="text-[5px] font-mono" style={{ color: `${GOLD}80` }}>活動期間 2026/04/23 — 2026/05/13</p>
          </div>
        </div>
      </div>

      {/* ── Infinity Day 加碼大獎 ── */}
      <div className="relative flex flex-col items-center justify-center flex-1 px-[10mm] text-center gap-[3.5mm]" style={{ background: NAVY }}>
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
          backgroundImage: `linear-gradient(${GOLD} 0.5px, transparent 0.5px), linear-gradient(90deg, ${GOLD} 0.5px, transparent 0.5px)`,
          backgroundSize: "10mm 10mm",
        }} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-serif" style={{ fontSize: "100mm", lineHeight: 1, color: `${GOLD}07` }}>∞</span>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-[3.5mm] w-full">
          <div className="space-y-0.5">
            <p className="text-[6px] font-mono tracking-[0.4em]" style={{ color: `${GOLD}80` }}>INFINITY DAY · 加碼大獎</p>
            <p className="text-[9px] font-black text-white tracking-[0.08em]">限量 8 份</p>
          </div>

          <div className="rounded-lg px-[6mm] py-[3mm] w-full" style={{ border: `0.5px solid ${GOLD}40`, background: `${GOLD}10` }}>
            <p className="text-[7px] font-mono tracking-widest mb-1" style={{ color: `${GOLD}90` }}>大獎獎品</p>
            <p className="text-[11px] font-black text-white leading-snug">WIRED TOKYO</p>
            <p className="text-[11px] font-black text-white leading-snug">雙人和牛牛排套餐</p>
            <p className="text-[5.5px] mt-1.5" style={{ color: `${GOLD}70` }}>市值 $2,300 · 湯品 ／ 前菜 ／ 主食 ／ 和牛牛排 ／ 飲品</p>
          </div>

          <div className="rounded-lg px-[6mm] py-[2.5mm] w-full text-center" style={{ background: `${GOLD}18`, border: `0.5px solid ${GOLD}50` }}>
            <p className="text-[5.5px] font-mono tracking-[0.3em] mb-0.5" style={{ color: `${GOLD}90` }}>開獎時間</p>
            <p className="text-[13px] font-black" style={{ color: GOLD }}>2026 / 05 / 13 · 20:00</p>
          </div>

          <p className="text-[4.5px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
            每日完成抽獎自動累積加碼獎券，全程最多 21 張，越常回訪中獎機率越高
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CounterPage() {
  return (
    <div className="bg-gray-100 min-h-svh">
      {/* 控制列 */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/print">
            <Button variant="ghost" size="icon" className="rounded-full"><ChevronLeft /></Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#1A2B4A]">櫃檯說明立卡</h1>
            <p className="text-xs text-gray-500">A4 直向 × 1 張</p>
          </div>
        </div>
        <Button onClick={() => window.print()} className="bg-[#1A2B4A] gap-2 h-11 px-6 rounded-full">
          <Printer size={18} /> 列印
        </Button>
      </div>

      {/* 螢幕預覽 */}
      <div className="print:hidden flex flex-col items-center py-10 gap-6">
        <p className="text-xs text-gray-400">← 預覽（實際列印尺寸為 A4）</p>
        <div className="shadow-2xl" style={{ transform: "scale(0.65)", transformOrigin: "top center", marginBottom: "-110mm" }}>
          <CounterCard />
        </div>
      </div>

      {/* 列印輸出 */}
      <div className="hidden print:block">
        <CounterCard />
      </div>

      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 0; background: white !important; }
          @page { size: A4 portrait; margin: 0; }
        }
      `}</style>
    </div>
  );
}
