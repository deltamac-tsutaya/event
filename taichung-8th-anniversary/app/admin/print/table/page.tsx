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

function TableCard() {
  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{ width: "105mm", height: "148mm", background: NAVY }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${GOLD} 0.5px, transparent 0.5px), linear-gradient(90deg, ${GOLD} 0.5px, transparent 0.5px)`,
          backgroundSize: "10mm 10mm",
        }}
      />
      {/* ∞ watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-serif" style={{ fontSize: "100mm", lineHeight: 1, color: `${GOLD}07` }}>∞</span>
      </div>
      <div className="absolute inset-[3.5mm]" style={{ border: `0.5px solid ${GOLD}22` }} />
      {(["top-[2.5mm] left-[2.5mm]","top-[2.5mm] right-[2.5mm]","bottom-[2.5mm] left-[2.5mm]","bottom-[2.5mm] right-[2.5mm]"] as const).map((p, i) => (
        <span key={i} className={`absolute ${p} font-serif leading-none`} style={{ fontSize: "8px", color: `${GOLD}45` }}>∞</span>
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-[8mm] text-center gap-[4mm]">
        {/* Logos */}
        <div className="flex items-center gap-2">
          <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-2 w-auto opacity-55" style={{ filter: "invert(1)" }} />
          <span className="font-mono" style={{ fontSize: "6px", color: "rgba(255,255,255,0.25)" }}>×</span>
          <img src="/wired-tokyo-logo.svg" alt="WIRED" className="h-2.5 w-auto opacity-50" style={{ filter: "invert(1)" }} />
        </div>

        {/* Event name */}
        <div className="space-y-0.5">
          <p className="font-mono tracking-[0.4em]" style={{ fontSize: "5.5px", color: `${GOLD}75` }}>8TH ANNIVERSARY</p>
          <h1 className="font-black text-white leading-none" style={{ fontSize: "20px", letterSpacing: "0.02em" }}>Nexus Life</h1>
          <p className="font-mono tracking-[0.2em]" style={{ fontSize: "6px", color: "rgba(255,255,255,0.35)" }}>無限日常 ∞ 連結生活</p>
        </div>

        {/* Gold divider */}
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 h-px" style={{ background: `${GOLD}35` }} />
          <span className="font-serif" style={{ fontSize: "8px", color: `${GOLD}60` }}>∞</span>
          <div className="flex-1 h-px" style={{ background: `${GOLD}35` }} />
        </div>

        {/* QR code */}
        <div className="p-[1.5mm] rounded bg-white" style={{ boxShadow: `0 0 0 0.5px ${GOLD}40` }}>
          <QRCode
            value={APP_URL}
            size={128}
            fgColor={NAVY}
            bgColor="#ffffff"
            level="M"
            viewBox="0 0 128 128"
            style={{ width: "22mm", height: "22mm", display: "block" }}
          />
        </div>

        {/* Call to action */}
        <div className="space-y-0.5">
          <p className="font-bold text-white" style={{ fontSize: "7px" }}>掃碼加入活動</p>
          <p className="font-mono" style={{ fontSize: "5px", color: "rgba(255,255,255,0.38)" }}>LINE 掃描 · 集章 · 每日抽獎</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative z-10 flex items-center justify-between px-[6mm] pb-[4mm] shrink-0">
        <p className="font-mono" style={{ fontSize: "4.5px", color: "rgba(255,255,255,0.2)" }}>2026.04.25 — 05.24</p>
        <p className="font-serif" style={{ fontSize: "7px", color: `${GOLD}45` }}>∞</p>
      </div>
    </div>
  );
}

export default function TablePage() {
  return (
    <div className="bg-gray-100 min-h-svh">
      <div className="print:hidden sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/print">
            <Button variant="ghost" size="icon" className="rounded-full"><ChevronLeft /></Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#1A2B4A]">餐廳桌卡</h1>
            <p className="text-xs text-gray-500">A6（105 × 148 mm）· 平放桌面</p>
          </div>
        </div>
        <Button onClick={() => window.print()} className="bg-[#1A2B4A] gap-2 h-11 px-6 rounded-full">
          <Printer size={18} /> 列印
        </Button>
      </div>

      <div className="print:hidden flex flex-col items-center py-10 gap-6">
        <p className="text-xs text-gray-400">← 預覽（實際列印為 A6）</p>
        <div className="shadow-2xl"><TableCard /></div>
      </div>

      <div className="hidden print:block">
        <TableCard />
      </div>

      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 0; background: white !important; }
          @page { size: A6 portrait; margin: 0; }
        }
      `}</style>
    </div>
  );
}
