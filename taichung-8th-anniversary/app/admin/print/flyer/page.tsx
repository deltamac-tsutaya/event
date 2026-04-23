"use client";

import { Button } from "@/components/ui/button";
import { Printer, ChevronLeft } from "lucide-react";
import Link from "next/link";
import QRCode from "react-qr-code";

const APP_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL ?? "https://taichung-8th-anniversary.vercel.app";

const STEPS = [
  { num: "01", title: "開啟 LINE 掃描", desc: "用 LINE 內建掃描器，對準店內各區的 QR Code" },
  { num: "02", title: "集滿 8 枚印記", desc: "找出散落在空間各處的 8 個 Nexus Life 印記" },
  { num: "03", title: "每日解鎖抽獎", desc: "集滿後每天可抽一次，獎品含餐飲體驗券與書籍折扣" },
];

function Flyer() {
  return (
    <div
      className="relative flex flex-col overflow-hidden bg-[#F5F2ED]"
      style={{ width: "148mm", height: "210mm", fontFamily: "inherit" }}
    >
      {/* ── 極細格線底紋 ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#1A2B4A 0.5px, transparent 0.5px), linear-gradient(90deg, #1A2B4A 0.5px, transparent 0.5px)`,
          backgroundSize: "10mm 10mm",
        }}
      />

      {/* ══ 上半：深藍品牌區 ══════════════════════════════ */}
      <div className="relative flex flex-col items-center justify-center bg-[#1A2B4A] overflow-hidden" style={{ height: "88mm" }}>

        {/* 大字水印 "8" */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
          <span
            className="font-bold"
            style={{
              fontSize: "160mm",
              lineHeight: 1,
              color: "rgba(201,168,76,0.07)",
              transform: "translateY(10mm)",
            }}
          >
            8
          </span>
        </div>

        {/* 金色內框 */}
        <div className="absolute inset-[4mm] pointer-events-none" style={{ border: "0.5px solid rgba(201,168,76,0.25)" }} />
        {/* 四角 ∞ */}
        {["top-[3mm] left-[3mm]", "top-[3mm] right-[3mm]", "bottom-[3mm] left-[3mm]", "bottom-[3mm] right-[3mm]"].map((pos, i) => (
          <span key={i} className={`absolute ${pos} text-[8px] font-serif leading-none`} style={{ color: "rgba(201,168,76,0.5)" }}>∞</span>
        ))}

        {/* Logos */}
        <div className="relative z-10 flex items-center gap-3 mb-4">
          <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-3 w-auto opacity-70" style={{ filter: "invert(1)" }} />
          <span className="text-[8px] font-mono text-white/30">×</span>
          <img src="/wired-tokyo-logo.svg" alt="WIRED" className="h-3.5 w-auto opacity-60" style={{ filter: "invert(1)" }} />
        </div>

        {/* 標題 */}
        <div className="relative z-10 text-center space-y-1.5">
          <p className="text-[7px] font-mono tracking-[0.4em] text-[#C9A84C]/80 uppercase">8th Anniversary</p>
          <h1 className="text-[22px] font-black tracking-[0.05em] text-white leading-none">Nexus Life</h1>
          <p className="text-[8px] font-mono tracking-[0.25em] text-white/50">∞ TAICHUNG · 2025</p>
        </div>

        {/* 金色下分隔線 */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)" }} />
      </div>

      {/* ══ 下半：活動說明區 ══════════════════════════════ */}
      <div className="relative flex-1 flex flex-col px-[7mm] py-[5mm] gap-[3.5mm]">

        {/* 副標 */}
        <div className="text-center space-y-0.5">
          <p className="text-[9px] font-black text-[#1A2B4A] tracking-[0.1em]">找出 8 個印記，解鎖每日抽獎</p>
          <p className="text-[6.5px] text-[#1A2B4A]/50 tracking-[0.05em]">掃描店內各區 QR Code，用 LINE 集章</p>
        </div>

        {/* 金色分隔 */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px" style={{ background: "rgba(201,168,76,0.4)" }} />
          <span className="text-[8px] font-serif" style={{ color: "rgba(201,168,76,0.7)" }}>∞</span>
          <div className="flex-1 h-px" style={{ background: "rgba(201,168,76,0.4)" }} />
        </div>

        {/* 步驟 */}
        <div className="space-y-[2.5mm]">
          {STEPS.map((s) => (
            <div key={s.num} className="flex items-start gap-[3mm]">
              <span
                className="shrink-0 w-[6mm] h-[6mm] rounded-full flex items-center justify-center text-[6px] font-black text-white"
                style={{ background: "#1A2B4A", marginTop: "0.3mm" }}
              >
                {s.num}
              </span>
              <div>
                <p className="text-[7.5px] font-bold text-[#1A2B4A] leading-tight">{s.title}</p>
                <p className="text-[6px] text-[#1A2B4A]/55 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 金色分隔 */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px" style={{ background: "rgba(201,168,76,0.4)" }} />
          <span className="text-[8px] font-serif" style={{ color: "rgba(201,168,76,0.7)" }}>∞</span>
          <div className="flex-1 h-px" style={{ background: "rgba(201,168,76,0.4)" }} />
        </div>

        {/* QR code + 說明 */}
        <div className="flex items-center gap-[4mm]">
          <div className="shrink-0 p-[1.5mm] border border-[#1A2B4A]/20 bg-white rounded">
            <QRCode
              value={APP_URL}
              size={128}
              fgColor="#1A2B4A"
              bgColor="#FFFFFF"
              level="M"
              viewBox="0 0 128 128"
              style={{ width: "18mm", height: "18mm", display: "block" }}
            />
          </div>
          <div className="space-y-1">
            <p className="text-[7px] font-bold text-[#1A2B4A]">掃描加入活動</p>
            <p className="text-[5.5px] text-[#1A2B4A]/50 leading-relaxed">
              用 LINE 內建掃描器掃此 QR Code<br />開啟活動頁面後，即可開始集章
            </p>
            <p className="text-[5px] font-mono text-[#C9A84C]/70 mt-0.5">活動至 2026/5/30 止</p>
          </div>
        </div>

        {/* 底部品牌 */}
        <div className="mt-auto flex items-center justify-between">
          <p className="text-[5.5px] font-mono text-[#1A2B4A]/30 tracking-widest">TSUTAYA BOOKSTORE 台中市政店</p>
          <p className="text-[7px] font-serif text-[#C9A84C]/50">∞</p>
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
            <h1 className="text-lg font-bold text-[#1A2B4A]">A5 活動文宣</h1>
            <p className="text-xs text-gray-500">A5 直向 · 列印後裁切</p>
          </div>
        </div>
        <Button
          onClick={() => window.print()}
          className="bg-[#1A2B4A] hover:bg-[#1A2B4A]/90 gap-2 h-11 px-6 rounded-full"
        >
          <Printer size={18} /> 列印
        </Button>
      </div>

      {/* 預覽（螢幕用） */}
      <div className="print:hidden flex flex-col items-center py-10 gap-6">
        <p className="text-xs text-gray-400">← 預覽（實際列印尺寸為 A5）</p>
        <div className="shadow-2xl">
          <Flyer />
        </div>
      </div>

      {/* 列印輸出（一張 A5） */}
      <div className="hidden print:block">
        <Flyer />
      </div>

      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 0; background: white !important; }
          @page { size: A5 portrait; margin: 0; }
        }
      `}</style>
    </div>
  );
}
