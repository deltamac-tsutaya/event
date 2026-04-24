"use client";

import { Button } from "@/components/ui/button";
import { Printer, ChevronLeft } from "lucide-react";
import Link from "next/link";
import QRCode from "react-qr-code";

const _LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID;
const APP_URL = _LIFF_ID
  ? `https://liff.line.me/${_LIFF_ID}`
  : process.env.NEXT_PUBLIC_APP_URL ?? "https://taichung-8th-anniversary.vercel.app";

const NAVY = "#1A2B4A";
const GOLD = "#C9A84C";
const CREAM = "#F5F2ED";

const STEPS = [
  { num: "01", title: "用 LINE 登入", desc: "掃描現場活動 QR Code，點擊「用 LINE 帳號參加」登入" },
  { num: "02", title: "掃碼集印", desc: "找出館內 8 個集印點，用活動頁掃碼集印，每點限蓋 1 次" },
  { num: "03", title: "每日解鎖抽獎", desc: "集滿 8 枚後每天可抽 1 次 LINE 優惠券，午夜 00:00 重置" },
  { num: "04", title: "累積加碼獎券", desc: "每日抽獎後自動累積 1 張，全程最多 30 張，越常回訪中獎率越高" },
];

function Poster() {
  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{ width: "210mm", height: "297mm", background: CREAM }}
    >
      {/* 極細格線底紋 */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${NAVY} 0.5px, transparent 0.5px), linear-gradient(90deg, ${NAVY} 0.5px, transparent 0.5px)`,
          backgroundSize: "10mm 10mm",
        }}
      />

      {/* 上半：深藍品牌區 */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden shrink-0" style={{ height: "110mm", background: NAVY }}>
        {/* 大字水印 */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
          <span className="font-bold" style={{ fontSize: "200mm", lineHeight: 1, color: `${GOLD}06`, transform: "translateY(12mm)" }}>8</span>
        </div>
        <div className="absolute inset-[5mm] pointer-events-none" style={{ border: `0.5px solid ${GOLD}22` }} />
        {["top-[4mm] left-[4mm]","top-[4mm] right-[4mm]","bottom-[4mm] left-[4mm]","bottom-[4mm] right-[4mm]"].map((pos, i) => (
          <span key={i} className={`absolute ${pos} text-[10px] font-serif leading-none`} style={{ color: `${GOLD}45` }}>∞</span>
        ))}

        <div className="relative z-10 flex items-center gap-3 mb-5">
          <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-3.5 w-auto opacity-70" style={{ filter: "invert(1)" }} />
          <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>×</span>
          <img src="/wired-tokyo-logo.svg" alt="WIRED" className="h-4 w-auto opacity-60" style={{ filter: "invert(1)" }} />
        </div>

        <div className="relative z-10 text-center space-y-2">
          <p className="text-[8px] font-mono tracking-[0.4em]" style={{ color: `${GOLD}CC` }}>8TH ANNIVERSARY</p>
          <h1 className="text-[36px] font-black tracking-[0.04em] text-white leading-none">Nexus Life</h1>
          <p className="text-[9px] font-mono tracking-[0.25em]" style={{ color: "rgba(255,255,255,0.45)" }}>無限日常 ∞ 連結生活</p>
        </div>

        <div className="relative z-10 mt-5">
          <p className="text-[7px] font-mono tracking-[0.2em] text-center" style={{ color: `${GOLD}80` }}>
            台中市政店 8 週年 · 2026.04.25 — 2026.05.24
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}50, transparent)` }} />
      </div>

      {/* 下半：活動說明區 */}
      <div className="relative flex-1 flex flex-col px-[10mm] py-[7mm] gap-[5mm]">

        <div className="text-center space-y-0.5">
          <p className="text-[11px] font-black tracking-[0.06em]" style={{ color: NAVY }}>找出 8 個印記，解鎖每日抽獎</p>
          <p className="text-[7px]" style={{ color: `${NAVY}50`, letterSpacing: "0.05em" }}>掃描店內各區 QR Code，用 LINE 集章 · 14 項獎品 100% 中獎</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px" style={{ background: `${GOLD}45` }} />
          <span className="text-[9px] font-serif" style={{ color: `${GOLD}70` }}>∞</span>
          <div className="flex-1 h-px" style={{ background: `${GOLD}45` }} />
        </div>

        <div className="space-y-[3.5mm]">
          {STEPS.map((s) => (
            <div key={s.num} className="flex items-start gap-[3.5mm]">
              <span
                className="shrink-0 w-[7mm] h-[7mm] rounded-full flex items-center justify-center text-[6.5px] font-black text-white"
                style={{ background: NAVY, marginTop: "0.5mm" }}
              >
                {s.num}
              </span>
              <div>
                <p className="text-[8px] font-bold leading-tight" style={{ color: NAVY }}>{s.title}</p>
                <p className="text-[6.5px] leading-relaxed" style={{ color: `${NAVY}55` }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px" style={{ background: `${GOLD}45` }} />
          <span className="text-[9px] font-serif" style={{ color: `${GOLD}70` }}>∞</span>
          <div className="flex-1 h-px" style={{ background: `${GOLD}45` }} />
        </div>

        {/* Infinity Day 彩蛋 */}
        <div className="flex items-center gap-[5mm] rounded-xl px-[5mm] py-[3.5mm]" style={{ border: `0.5px solid ${GOLD}45`, background: `${NAVY}08` }}>
          <div className="text-center shrink-0">
            <p className="text-[16px] font-serif leading-none" style={{ color: GOLD }}>∞</p>
          </div>
          <div>
            <p className="text-[7px] font-black tracking-[0.1em]" style={{ color: NAVY }}>INFINITY DAY 加碼大獎</p>
            <p className="text-[6px] leading-relaxed" style={{ color: `${NAVY}55` }}>
              每日抽獎累積加碼獎券，限量 8 份 WIRED TOKYO 雙人和牛牛排套餐（市值 $2,300）
            </p>
            <p className="text-[5.5px] font-mono mt-0.5" style={{ color: `${GOLD}90` }}>2026/05/24 20:00 準時開獎</p>
          </div>
        </div>

        {/* QR code */}
        <div className="flex items-center gap-[5mm]">
          <div className="shrink-0 p-[1.5mm] border bg-white rounded" style={{ borderColor: `${NAVY}20` }}>
            <QRCode
              value={APP_URL}
              size={128}
              fgColor={NAVY}
              bgColor="#FFFFFF"
              level="M"
              viewBox="0 0 128 128"
              style={{ width: "20mm", height: "20mm", display: "block" }}
            />
          </div>
          <div className="space-y-1">
            <p className="text-[7.5px] font-bold" style={{ color: NAVY }}>掃描加入活動</p>
            <p className="text-[6px] leading-relaxed" style={{ color: `${NAVY}50` }}>
              用 LINE 內建掃描器掃此 QR Code<br />開啟活動頁面後，即可開始集章
            </p>
            <p className="text-[5.5px] font-mono" style={{ color: `${GOLD}80` }}>2026.04.25 — 2026.05.24</p>
          </div>
        </div>

        {/* 底部品牌 */}
        <div className="mt-auto flex items-center justify-between">
          <p className="text-[5.5px] font-mono tracking-widest" style={{ color: `${NAVY}30` }}>TSUTAYA BOOKSTORE 台中市政店</p>
          <p className="text-[8px] font-serif" style={{ color: `${GOLD}50` }}>∞</p>
        </div>
      </div>
    </div>
  );
}

export default function FlyerPage() {
  return (
    <div className="bg-gray-100 min-h-svh">

      {/* 控制列 */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/print">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#1A2B4A]">活動主視覺海報</h1>
            <p className="text-xs text-gray-500">A4 直向 · 列印後張貼</p>
          </div>
        </div>
        <Button
          onClick={() => window.print()}
          className="bg-[#1A2B4A] hover:bg-[#1A2B4A]/90 gap-2 h-11 px-6 rounded-full"
        >
          <Printer size={18} /> 列印
        </Button>
      </div>

      {/* 預覽 */}
      <div className="print:hidden flex flex-col items-center py-10 gap-6">
        <p className="text-xs text-gray-400">← 預覽（實際列印尺寸為 A4）</p>
        <div className="shadow-2xl" style={{ transform: "scale(0.65)", transformOrigin: "top center", marginBottom: "-110mm" }}>
          <Poster />
        </div>
      </div>

      {/* 列印輸出 */}
      <div className="hidden print:block">
        <Poster />
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
