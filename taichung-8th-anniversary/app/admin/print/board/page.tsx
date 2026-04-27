"use client";

import { Button } from "@/components/ui/button";
import { Printer, ChevronLeft } from "lucide-react";
import Link from "next/link";

const NAVY = "#1A2B4A";
const GOLD = "#C9A84C";
const CREAM = "#F5F2ED";

const GRID_BG = {
  backgroundImage: `linear-gradient(${NAVY} 0.5px, transparent 0.5px), linear-gradient(90deg, ${NAVY} 0.5px, transparent 0.5px)`,
  backgroundSize: "10mm 10mm",
};

// ── 獎項陳列板（A4 直向）────────────────────────────────────────
function PrizeBoard() {
  const tiers = [
    {
      tier: "S", prob: "各 1%",
      color: { bg: "#FEF9EC", border: "#C9A84C60", label: GOLD },
      items: [
        { name: "雙人套餐 188 元抵用券", provider: "WIRED TOKYO" },
        { name: "88 元現金抵用券",       provider: "TSUTAYA BOOKSTORE" },
      ],
    },
    {
      tier: "A", prob: "各 1%",
      color: { bg: "#EFF6FF", border: "#3B82F660", label: "#2563EB" },
      items: [
        { name: "法式巧克力香蕉聖代 體驗券", provider: "WIRED TOKYO" },
        { name: "松露薯條 體驗券",           provider: "WIRED TOKYO" },
        { name: "伯爵茶巴斯克 體驗券",       provider: "TSUTAYA BOOKSTORE" },
        { name: "招牌水果茶 體驗券",         provider: "TSUTAYA BOOKSTORE" },
      ],
    },
    {
      tier: "B", prob: "合計 94%",
      color: { bg: "#F8F8F8", border: "#1A2B4A25", label: "#4B5563" },
      items: [
        { name: "雙人套餐 88 折",           provider: "WIRED TOKYO" },
        { name: "Brunch 套餐 88 折",        provider: "WIRED TOKYO" },
        { name: "草莓煉乳抹茶法式吐司 加碼體驗券", provider: "WIRED TOKYO" },
        { name: "外帶飲品 買一送一",         provider: "WIRED TOKYO" },
        { name: "文具雜貨 88 折",            provider: "TSUTAYA BOOKSTORE" },
        { name: "書籍雜誌 88 折",            provider: "TSUTAYA BOOKSTORE" },
        { name: "88 元抵用券（滿 888 元）",   provider: "WIRED TOKYO & TSUTAYA BOOKSTORE" },
        { name: "8% off（92 折優惠券）",     provider: "WIRED TOKYO & TSUTAYA BOOKSTORE" },
      ],
    },
  ];

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{ width: "210mm", height: "297mm", background: CREAM, fontFamily: "inherit" }}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={GRID_BG} />

      {/* 頂部深藍標題帶 */}
      <div className="relative bg-[#1A2B4A] overflow-hidden shrink-0" style={{ height: "35mm" }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-black" style={{ fontSize: "80mm", lineHeight: 1, color: `${GOLD}08` }}>8</span>
        </div>
        <div className="absolute inset-[3mm]" style={{ border: `0.5px solid ${GOLD}25` }} />

        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-1">
          <p className="text-[6px] font-mono tracking-[0.4em]" style={{ color: `${GOLD}99` }}>NEXUS LIFE 8TH ANNIVERSARY</p>
          <h2 className="text-[18px] font-black text-white leading-none">集滿抽好禮</h2>
          <p className="text-[7px] tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.5)" }}>
            全程 30 天，每日一次機會　14 項獎品　100% 中獎　LINE 優惠券即時發放
          </p>
        </div>
      </div>

      {/* 獎項內容 */}
      <div className="flex-1 flex flex-col px-[7mm] py-[5mm] gap-[4mm]">
        {tiers.map((t) => (
          <div key={t.tier} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${t.color.border}`, background: t.color.bg }}>
            <div className="flex items-center gap-2 px-[4mm] py-[2mm]" style={{ borderBottom: `1px solid ${t.color.border}` }}>
              <span className="text-[9px] font-black w-[6mm] h-[6mm] rounded-full flex items-center justify-center text-white shrink-0" style={{ background: t.color.label }}>{t.tier}</span>
              <span className="text-[7px] font-bold" style={{ color: t.color.label }}>獎項</span>
              <span className="ml-auto text-[6px] font-mono" style={{ color: t.color.label }}>中獎機率 {t.prob}</span>
            </div>
            <div className="px-[4mm] py-[2.5mm] grid grid-cols-2 gap-x-[4mm] gap-y-[1.5mm]">
              {t.items.map((item, i) => (
                <div key={i} className="flex items-baseline gap-1.5">
                  <span className="text-[7px] leading-none shrink-0" style={{ color: `${GOLD}80` }}>·</span>
                  <div>
                    <p className="text-[7px] font-bold leading-tight" style={{ color: NAVY }}>{item.name}</p>
                    <p className="text-[5.5px]" style={{ color: `${NAVY}60` }}>{item.provider}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Infinity Day 加碼獎 */}
        <div className="rounded-xl overflow-hidden" style={{ background: NAVY, border: `1px solid ${GOLD}40` }}>
          <div className="flex items-center gap-2 px-[4mm] py-[2mm]" style={{ borderBottom: `1px solid ${GOLD}25` }}>
            <span className="text-[8px] font-mono tracking-[0.2em]" style={{ color: GOLD }}>✦ INFINITY DAY</span>
            <span className="ml-auto text-[6px] font-mono" style={{ color: `${GOLD}70` }}>2026/05/24 20:00 開獎</span>
          </div>
          <div className="px-[4mm] py-[3mm] flex items-center gap-[4mm]">
            <div className="flex-1">
              <p className="text-[8px] font-black text-white leading-snug">WIRED TOKYO 雙人和牛牛排套餐</p>
              <p className="text-[6px] mt-0.5" style={{ color: `${GOLD}90` }}>市值 $2,300・限量 8 份</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[6px]" style={{ color: "rgba(255,255,255,0.5)" }}>每日完成抽獎</p>
              <p className="text-[6px]" style={{ color: "rgba(255,255,255,0.5)" }}>自動累積加碼獎券</p>
            </div>
          </div>
        </div>

        {/* 底部聲明 */}
        <div className="mt-auto space-y-[1mm]">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px" style={{ background: `${GOLD}30` }} />
            <span className="text-[7px] font-serif" style={{ color: `${GOLD}60` }}>∞</span>
            <div className="flex-1 h-px" style={{ background: `${GOLD}30` }} />
          </div>
          <p className="text-[5.5px] text-center" style={{ color: `${NAVY}50` }}>
            獎項以 LINE 優惠券形式發放，有效期統一至 2026/5/30。加碼獎券兌換期限至 2026/6/23，需提前預約使用。
          </p>
          <p className="text-[5px] text-center font-mono" style={{ color: `${NAVY}35` }}>
            TSUTAYA BOOKSTORE ｜ WIRED TOKYO 台中市政店　活動期間 2026/04/25 — 2026/05/24
          </p>
        </div>
      </div>
    </div>
  );
}

// ── 樓層指引（A4 直向）──────────────────────────────────────────
function FloorGuide() {
  const floors = [
    {
      floor: "3F",
      points: "03 · 04 · 05 · 07",
      names: "戶外座位區 ／ 兒童繪本書櫃 ／ 樓梯書牆 ／ 天井吊燈區",
      note: "含 1 個每日輪替點",
    },
    {
      floor: "2F",
      points: "01 · 02 · 06",
      names: "入口主題陳列區 ／ 職人雜貨區 ／ 吧檯區",
      note: "含 2 個每日輪替點",
    },
    {
      floor: "1F",
      points: "08",
      names: "告示牌",
      note: "",
    },
  ];

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{ width: "210mm", height: "297mm", background: CREAM, fontFamily: "inherit" }}
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={GRID_BG} />

      {/* 頂部 */}
      <div className="relative bg-[#1A2B4A] overflow-hidden shrink-0" style={{ height: "35mm" }}>
        <div className="absolute inset-[3mm]" style={{ border: `0.5px solid ${GOLD}25` }} />
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-1">
          <p className="text-[6px] font-mono tracking-[0.4em]" style={{ color: `${GOLD}99` }}>NEXUS LIFE 8TH ANNIVERSARY</p>
          <h2 className="text-[18px] font-black text-white leading-none">樓層集印指引</h2>
          <p className="text-[7px]" style={{ color: "rgba(255,255,255,0.45)" }}>找印記 · 抽好禮 · 跟著 ∞ 走，集滿 8 枚解鎖每日抽獎</p>
        </div>
      </div>

      {/* 樓層卡 */}
      <div className="flex-1 flex flex-col px-[10mm] py-[8mm] gap-[6mm]">
        {floors.map((f) => (
          <div key={f.floor} className="flex gap-[6mm] items-stretch">
            <div
              className="shrink-0 w-[18mm] rounded-xl flex flex-col items-center justify-center gap-1"
              style={{ background: NAVY }}
            >
              <p className="text-[6px] font-mono tracking-widest text-white opacity-50">Floor</p>
              <p className="text-[28px] font-black text-white leading-none">{f.floor}</p>
            </div>
            <div className="flex-1 rounded-xl px-[5mm] py-[4mm] space-y-[2mm]" style={{ border: `1px solid ${NAVY}18`, background: "white" }}>
              <div className="flex items-center gap-2 flex-wrap">
                {f.points.split(" · ").map((p) => (
                  <span key={p} className="text-[9px] font-black px-2 py-0.5 rounded-full text-white" style={{ background: NAVY }}>{p}</span>
                ))}
                {f.note && <span className="text-[6px] font-mono rounded-full px-2 py-0.5" style={{ background: `${GOLD}20`, color: `${GOLD}CC` }}>{f.note}</span>}
              </div>
              <p className="text-[7.5px] font-medium leading-relaxed" style={{ color: `${NAVY}80` }}>{f.names}</p>
            </div>
          </div>
        ))}

        {/* 隱藏彩蛋提示 */}
        <div className="rounded-xl px-[5mm] py-[4mm] space-y-[2mm]" style={{ background: `${GOLD}12`, border: `1px solid ${GOLD}40` }}>
          <p className="text-[7.5px] font-black" style={{ color: NAVY }}>✦ 隱藏彩蛋點位（A · B · C）</p>
          <p className="text-[6.5px] leading-relaxed" style={{ color: `${NAVY}70` }}>
            彩蛋點不計入主集印進度，但可解鎖隱藏成就。請留心觀察——員工身上、戶外座位桌上、電梯告示，都可能藏有驚喜。
          </p>
        </div>

        {/* 通用提示 */}
        <div className="rounded-xl px-[5mm] py-[3mm]" style={{ background: `${NAVY}08`, border: `1px solid ${NAVY}12` }}>
          <p className="text-[6.5px] leading-relaxed" style={{ color: `${NAVY}70` }}>
            每個帳號每個點位限蓋 1 次。集滿 8 枚可每日抽獎，午夜 00:00 重置。
          </p>
        </div>

        {/* 電梯貼紙文案 */}
        <div className="mt-auto rounded-xl px-[5mm] py-[3mm] flex items-center justify-between" style={{ border: `1px dashed ${NAVY}25`, background: "white" }}>
          <div>
            <p className="text-[7px] font-bold" style={{ color: NAVY }}>上樓找印記，集滿 8 枚抽好禮</p>
            <p className="text-[5.5px]" style={{ color: `${NAVY}50` }}>Nexus Life｜台中市政店 8 週年・活動至 2026/05/24</p>
          </div>
          <p className="text-[10px] font-serif" style={{ color: `${GOLD}70` }}>∞</p>
        </div>

        {/* 底部 */}
        <p className="text-[5px] text-center font-mono" style={{ color: `${NAVY}35` }}>
          TSUTAYA BOOKSTORE ｜ WIRED TOKYO 台中市政店　2026/04/25 — 2026/05/24
        </p>
      </div>
    </div>
  );
}

export default function BoardPage() {
  return (
    <div className="bg-gray-100 min-h-svh">
      {/* 控制列 */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="rounded-full"><ChevronLeft /></Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#1A2B4A]">獎項陳列板 ／ 樓層指引</h1>
            <p className="text-xs text-gray-500">A4 直向 × 2 張・可分開張貼</p>
          </div>
        </div>
        <Button onClick={() => window.print()} className="bg-[#1A2B4A] gap-2 h-11 px-6 rounded-full">
          <Printer size={18} /> 列印
        </Button>
      </div>

      {/* 螢幕預覽 */}
      <div className="print:hidden flex flex-wrap items-start justify-center gap-8 py-10 px-6">
        <div>
          <p className="text-xs text-gray-400 text-center mb-3">獎項陳列板（A4）</p>
          <div className="shadow-2xl" style={{ transform: "scale(0.65)", transformOrigin: "top center", marginBottom: "-120px" }}><PrizeBoard /></div>
        </div>
        <div>
          <p className="text-xs text-gray-400 text-center mb-3">樓層集印指引（A4）</p>
          <div className="shadow-2xl" style={{ transform: "scale(0.65)", transformOrigin: "top center", marginBottom: "-120px" }}><FloorGuide /></div>
        </div>
      </div>

      {/* 列印輸出 */}
      <div className="hidden print:block">
        <div style={{ pageBreakAfter: "always" }}><PrizeBoard /></div>
        <FloorGuide />
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
