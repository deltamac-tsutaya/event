"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import QRCode from "react-qr-code";

const APP_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL ?? "https://taichung-8th-anniversary.vercel.app";

// ── 共用樣式常數 ──────────────────────────────────────────────────
const NAVY = "#1A2B4A";
const GOLD = "#C9A84C";
const CREAM = "#F5F2ED";

const GRID_BG = {
  backgroundImage: `linear-gradient(${NAVY} 0.5px, transparent 0.5px), linear-gradient(90deg, ${NAVY} 0.5px, transparent 0.5px)`,
  backgroundSize: "40px 40px",
};

const GOLD_INNER_BORDER = { border: `0.5px solid ${GOLD}66` };

function CornerInfinity({ className = "" }: { className?: string }) {
  return (
    <>
      {(["top-[5px] left-[5px]", "top-[5px] right-[5px]", "bottom-[5px] left-[5px]", "bottom-[5px] right-[5px]"] as const).map(
        (pos, i) => (
          <span key={i} className={`absolute ${pos} font-serif leading-none text-[10px] ${className}`} style={{ color: `${GOLD}99` }}>
            ∞
          </span>
        )
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// 1. Instagram 貼文 1:1  (1080 × 1080 → 預覽 540 × 540)
// ══════════════════════════════════════════════════════════════════
function InstagramPost() {
  return (
    <div className="relative flex flex-col items-center justify-between overflow-hidden bg-[#1A2B4A]" style={{ width: 540, height: 540 }}>
      {/* 格線 */}
      <div className="absolute inset-0 opacity-[0.06]" style={GRID_BG} />
      {/* 金色內框 */}
      <div className="absolute inset-[10px] pointer-events-none" style={GOLD_INNER_BORDER} />
      <CornerInfinity />
      {/* 大字 8 水印 */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
        <span className="font-black" style={{ fontSize: 480, lineHeight: 1, color: `${GOLD}0D`, transform: "translateY(40px)" }}>8</span>
      </div>

      {/* Logos */}
      <div className="relative z-10 flex items-center gap-4 pt-10">
        <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-5 w-auto opacity-60" style={{ filter: "invert(1)" }} />
        <span className="text-xs font-mono" style={{ color: `${GOLD}66` }}>×</span>
        <img src="/wired-tokyo-logo.svg" alt="WIRED" className="h-6 w-auto opacity-50" style={{ filter: "invert(1)" }} />
      </div>

      {/* 主文案 */}
      <div className="relative z-10 text-center space-y-3">
        <p className="text-[11px] font-mono tracking-[0.5em] uppercase" style={{ color: `${GOLD}CC` }}>8th Anniversary</p>
        <h1 className="text-6xl font-black tracking-tight text-white leading-none">Nexus Life</h1>
        <p className="text-sm font-mono tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.4)" }}>∞ TAICHUNG · 2025</p>
      </div>

      {/* 底部 CTA */}
      <div className="relative z-10 pb-10 text-center space-y-2">
        <div className="flex items-center gap-3 justify-center">
          <div className="h-px w-12" style={{ background: `${GOLD}66` }} />
          <span className="text-[11px] font-mono tracking-[0.15em] text-white/60">找出 8 個印記 · 解鎖每日抽獎</span>
          <div className="h-px w-12" style={{ background: `${GOLD}66` }} />
        </div>
        <p className="text-[10px] font-mono tracking-widest" style={{ color: `${GOLD}80` }}>TSUTAYA BOOKSTORE 台中市政店</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 2. Instagram Stories 9:16  (1080 × 1920 → 預覽 304 × 540)
// ══════════════════════════════════════════════════════════════════
function InstagramStories() {
  return (
    <div className="relative flex flex-col overflow-hidden" style={{ width: 304, height: 540, background: CREAM }}>
      {/* 格線 */}
      <div className="absolute inset-0 opacity-[0.04]" style={GRID_BG} />

      {/* ── 頂部深藍品牌區 ── */}
      <div className="relative flex flex-col items-center justify-center bg-[#1A2B4A] overflow-hidden shrink-0" style={{ height: 200 }}>
        <div className="absolute inset-0 opacity-[0.06]" style={GRID_BG} />
        <div className="absolute inset-[6px]" style={GOLD_INNER_BORDER} />
        <CornerInfinity />
        {/* 8 水印 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-black" style={{ fontSize: 260, lineHeight: 1, color: `${GOLD}0E`, transform: "translateY(20px)" }}>8</span>
        </div>
        <div className="relative z-10 flex items-center gap-2 mb-3">
          <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-3 opacity-60" style={{ filter: "invert(1)" }} />
          <span className="text-[8px] font-mono" style={{ color: `${GOLD}50` }}>×</span>
          <img src="/wired-tokyo-logo.svg" alt="WIRED" className="h-3.5 opacity-50" style={{ filter: "invert(1)" }} />
        </div>
        <p className="relative z-10 text-[8px] font-mono tracking-[0.4em] mb-1" style={{ color: `${GOLD}BB` }}>8TH ANNIVERSARY</p>
        <h1 className="relative z-10 text-3xl font-black tracking-tight text-white leading-none">Nexus Life</h1>
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}60, transparent)` }} />
      </div>

      {/* ── 說明區 ── */}
      <div className="flex-1 flex flex-col px-6 py-4 gap-3">
        <p className="text-[9px] font-black text-center tracking-[0.1em]" style={{ color: NAVY }}>找出 8 個印記，解鎖每日抽獎</p>

        {/* 步驟 */}
        {[
          { n: "01", t: "LINE 掃描 QR Code", d: "用 LINE 掃描店內各區的 QR Code" },
          { n: "02", t: "集滿 8 枚印記",     d: "找出散落在空間各處的 8 個印記" },
          { n: "03", t: "每日解鎖抽獎",       d: "抽取餐飲體驗券、書籍折扣等好禮" },
        ].map((s) => (
          <div key={s.n} className="flex items-start gap-2.5">
            <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-black text-white" style={{ background: NAVY }}>
              {s.n}
            </span>
            <div>
              <p className="text-[8px] font-bold leading-tight" style={{ color: NAVY }}>{s.t}</p>
              <p className="text-[6.5px] leading-relaxed" style={{ color: `${NAVY}80` }}>{s.d}</p>
            </div>
          </div>
        ))}

        {/* 分隔 */}
        <div className="flex items-center gap-2 my-1">
          <div className="flex-1 h-px" style={{ background: `${GOLD}50` }} />
          <span className="text-[10px] font-serif" style={{ color: `${GOLD}90` }}>∞</span>
          <div className="flex-1 h-px" style={{ background: `${GOLD}50` }} />
        </div>

        {/* QR */}
        <div className="flex items-center gap-3">
          <div className="shrink-0 p-1 bg-white border rounded" style={{ borderColor: `${NAVY}20` }}>
            <QRCode value={APP_URL} size={64} fgColor={NAVY} bgColor="#fff" level="M" viewBox="0 0 64 64" style={{ width: 44, height: 44, display: "block" }} />
          </div>
          <div>
            <p className="text-[7px] font-bold" style={{ color: NAVY }}>掃描加入活動</p>
            <p className="text-[5.5px] leading-relaxed" style={{ color: `${NAVY}60` }}>用 LINE 掃此 QR Code<br />即可開始集章</p>
          </div>
        </div>

        {/* 底部 */}
        <div className="mt-auto flex justify-between items-end">
          <p className="text-[5.5px] font-mono" style={{ color: `${NAVY}40` }}>TSUTAYA BOOKSTORE 台中市政店</p>
          <p className="text-[8px] font-serif" style={{ color: `${GOLD}70` }}>∞</p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 3. Facebook 貼文  (1200 × 630 → 預覽 720 × 378)
// ══════════════════════════════════════════════════════════════════
function FacebookPost() {
  return (
    <div className="relative flex overflow-hidden" style={{ width: 720, height: 378 }}>
      {/* 左：深藍品牌 */}
      <div className="relative flex flex-col items-center justify-center bg-[#1A2B4A] overflow-hidden" style={{ width: 280 }}>
        <div className="absolute inset-0 opacity-[0.06]" style={GRID_BG} />
        <div className="absolute inset-[8px]" style={GOLD_INNER_BORDER} />
        <CornerInfinity />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-black" style={{ fontSize: 320, lineHeight: 1, color: `${GOLD}0D` }}>8</span>
        </div>
        <div className="relative z-10 flex items-center gap-2 mb-4">
          <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-3.5 opacity-60" style={{ filter: "invert(1)" }} />
          <span className="text-[8px] font-mono" style={{ color: `${GOLD}50` }}>×</span>
          <img src="/wired-tokyo-logo.svg" alt="WIRED" className="h-4 opacity-50" style={{ filter: "invert(1)" }} />
        </div>
        <p className="relative z-10 text-[8px] font-mono tracking-[0.4em] mb-1" style={{ color: `${GOLD}BB` }}>8TH ANNIVERSARY</p>
        <h1 className="relative z-10 text-4xl font-black text-white tracking-tight leading-none">Nexus Life</h1>
        <p className="relative z-10 text-[9px] font-mono mt-2 tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.35)" }}>∞ TAICHUNG · 2025</p>
      </div>

      {/* 右：內容 */}
      <div className="flex-1 flex flex-col justify-center px-8 py-6 gap-3" style={{ background: CREAM }}>
        <div className="absolute inset-0 opacity-[0.04]" style={GRID_BG} />
        <div className="relative z-10 space-y-0.5">
          <p className="text-[11px] font-black tracking-[0.1em]" style={{ color: NAVY }}>找出 8 個印記，解鎖每日抽獎</p>
          <p className="text-[8px]" style={{ color: `${NAVY}70` }}>掃描店內各區 QR Code，用 LINE 集章參加抽獎</p>
        </div>

        <div className="relative z-10 flex items-center gap-2 my-1">
          <div className="h-px w-6" style={{ background: `${GOLD}60` }} />
          <span className="text-[9px] font-serif" style={{ color: `${GOLD}90` }}>∞</span>
          <div className="flex-1 h-px" style={{ background: `${GOLD}30` }} />
        </div>

        <div className="relative z-10 space-y-2">
          {[
            { n: "01", t: "LINE 掃描 QR Code" },
            { n: "02", t: "集滿 8 枚印記" },
            { n: "03", t: "每日解鎖抽獎好禮" },
          ].map((s) => (
            <div key={s.n} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-black text-white shrink-0" style={{ background: NAVY }}>{s.n}</span>
              <p className="text-[8px] font-semibold" style={{ color: NAVY }}>{s.t}</p>
            </div>
          ))}
        </div>

        <div className="relative z-10 flex items-center gap-3 mt-1">
          <div className="p-1 bg-white border rounded shrink-0" style={{ borderColor: `${NAVY}20` }}>
            <QRCode value={APP_URL} size={64} fgColor={NAVY} bgColor="#fff" level="M" viewBox="0 0 64 64" style={{ width: 52, height: 52, display: "block" }} />
          </div>
          <div>
            <p className="text-[8px] font-bold" style={{ color: NAVY }}>掃描加入活動</p>
            <p className="text-[6px] leading-relaxed" style={{ color: `${NAVY}60` }}>活動至 2026/5/30 止<br />TSUTAYA BOOKSTORE 台中市政店</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 4. LINE 推播圖  (1040 × 520 → 預覽 720 × 360)
// ══════════════════════════════════════════════════════════════════
function LinePush() {
  return (
    <div className="relative flex overflow-hidden bg-[#1A2B4A]" style={{ width: 720, height: 360 }}>
      <div className="absolute inset-0 opacity-[0.06]" style={GRID_BG} />
      <div className="absolute inset-[10px]" style={GOLD_INNER_BORDER} />
      <CornerInfinity />

      {/* 左：大字 */}
      <div className="relative flex flex-col justify-center pl-14 pr-8 z-10" style={{ width: 380 }}>
        <div className="flex items-center gap-2 mb-5">
          <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-3.5 opacity-60" style={{ filter: "invert(1)" }} />
          <span className="text-[9px] font-mono" style={{ color: `${GOLD}50` }}>×</span>
          <img src="/wired-tokyo-logo.svg" alt="WIRED" className="h-4 opacity-50" style={{ filter: "invert(1)" }} />
        </div>
        <p className="text-[10px] font-mono tracking-[0.4em] mb-1" style={{ color: `${GOLD}CC` }}>8TH ANNIVERSARY</p>
        <h1 className="text-5xl font-black text-white tracking-tight leading-none mb-3">Nexus Life</h1>
        <p className="text-sm font-semibold text-white leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
          找出店內 8 個印記<br />集滿解鎖每日抽獎
        </p>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-px w-8" style={{ background: `${GOLD}60` }} />
          <p className="text-[9px] font-mono tracking-widest" style={{ color: `${GOLD}99` }}>TAICHUNG · 2025</p>
        </div>
      </div>

      {/* 右：QR + CTA */}
      <div className="relative flex flex-col items-center justify-center flex-1 z-10">
        <div className="absolute left-0 top-8 bottom-8 w-px" style={{ background: `${GOLD}30` }} />
        <div className="p-2 rounded-lg bg-white shadow-lg mb-3">
          <QRCode value={APP_URL} size={128} fgColor={NAVY} bgColor="#fff" level="M" viewBox="0 0 128 128" style={{ width: 100, height: 100, display: "block" }} />
        </div>
        <p className="text-xs font-bold text-white mb-1">立即掃碼加入</p>
        <p className="text-[9px] text-center font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>用 LINE 掃描開始集章</p>
      </div>

      {/* 大字 8 水印 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="font-black" style={{ fontSize: 500, lineHeight: 1, color: `${GOLD}07` }}>8</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 5. LINE 圖文選單  (2500 × 1686 → 預覽 750 × 506, scale 0.3x)
//    3 欄佈局：掃碼集章 | 我的印章 | 活動獎品
// ══════════════════════════════════════════════════════════════════
function LineRichMenu() {
  const CELL_W = 250;  // 750 / 3
  const H = 506;

  const cells = [
    {
      icon: "⊙",
      label: "掃碼集章",
      sub: "LINE 掃描 QR Code",
      bg: NAVY,
      textColor: "white",
    },
    {
      icon: "∞",
      label: "我的印章",
      sub: "查看集章進度",
      bg: "#233660",
      textColor: "white",
    },
    {
      icon: "✦",
      label: "活動獎品",
      sub: "抽獎 & 優惠券",
      bg: "#1E3258",
      textColor: "white",
    },
  ];

  return (
    <div className="relative flex overflow-hidden" style={{ width: 750, height: H }}>
      {/* 格線底紋 */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ ...GRID_BG, backgroundSize: "30px 30px" }} />

      {/* 左大區：品牌 + 主 CTA */}
      <div className="relative flex flex-col items-center justify-center bg-[#1A2B4A] overflow-hidden shrink-0" style={{ width: CELL_W * 1.4 }}>
        <div className="absolute inset-0 opacity-[0.06]" style={GRID_BG} />
        {/* 8 水印 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-black" style={{ fontSize: 380, lineHeight: 1, color: `${GOLD}0E` }}>8</span>
        </div>
        <div className="absolute inset-[8px]" style={GOLD_INNER_BORDER} />
        <CornerInfinity />
        <div className="relative z-10 flex items-center gap-2 mb-4">
          <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-3.5 opacity-60" style={{ filter: "invert(1)" }} />
          <span className="text-[9px] font-mono" style={{ color: `${GOLD}50` }}>×</span>
          <img src="/wired-tokyo-logo.svg" alt="WIRED" className="h-4 opacity-50" style={{ filter: "invert(1)" }} />
        </div>
        <p className="relative z-10 text-[8px] font-mono tracking-[0.4em] mb-1" style={{ color: `${GOLD}BB` }}>8TH ANNIVERSARY</p>
        <h2 className="relative z-10 text-4xl font-black text-white tracking-tight leading-none mb-4">Nexus Life</h2>
        <div
          className="relative z-10 px-5 py-2 rounded-full text-xs font-black tracking-widest"
          style={{ background: GOLD, color: NAVY }}
        >
          找出 8 個印記 →
        </div>
      </div>

      {/* 右側 3 個功能格 */}
      <div className="flex-1 flex flex-col">
        {cells.map((c, i) => (
          <div
            key={i}
            className="relative flex flex-col items-center justify-center flex-1 gap-1 overflow-hidden"
            style={{ background: c.bg, borderTop: i > 0 ? `1px solid ${GOLD}20` : undefined }}
          >
            <div className="absolute inset-0 opacity-[0.05]" style={GRID_BG} />
            <span className="relative z-10 text-2xl font-serif" style={{ color: `${GOLD}CC` }}>{c.icon}</span>
            <p className="relative z-10 text-sm font-black text-white tracking-wide">{c.label}</p>
            <p className="relative z-10 text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.45)" }}>{c.sub}</p>
            {/* 右側邊線 */}
            <div className="absolute left-0 top-4 bottom-4 w-px" style={{ background: `${GOLD}25` }} />
          </div>
        ))}
      </div>

      {/* 底部說明 */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
        <p className="text-[8px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>TSUTAYA BOOKSTORE 台中市政店 · 活動至 2026/5/30</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// 主頁
// ══════════════════════════════════════════════════════════════════

type Format = { id: string; label: string; size: string; note: string; Component: React.FC };

const FORMATS: Format[] = [
  { id: "ig-post",      label: "Instagram 貼文",    size: "1:1",       note: "截圖後直接上傳 IG",              Component: InstagramPost },
  { id: "ig-story",     label: "Instagram 限時動態",  size: "9:16",      note: "截圖後裁切至 1080 × 1920",       Component: InstagramStories },
  { id: "fb-post",      label: "Facebook 貼文",     size: "1.91:1",    note: "截圖後上傳 FB 相片貼文",          Component: FacebookPost },
  { id: "line-push",    label: "LINE 推播圖片",      size: "2:1",       note: "截圖後用於 LINE 訊息",            Component: LinePush },
  { id: "line-richmenu",label: "LINE 圖文選單",      size: "2500×1686", note: "截圖後上傳至 LINE Official Account Manager", Component: LineRichMenu },
];

export default function SocialPage() {
  return (
    <div className="bg-gray-50 min-h-svh">
      {/* 控制列 */}
      <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#1A2B4A]">社群媒體文宣</h1>
            <p className="text-xs text-gray-500">對各格式按右鍵→另存圖片，或截圖後使用</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/print/flyer">
            <Button variant="outline" className="gap-2 h-10 px-4 rounded-full border-[#1A2B4A]/30 text-[#1A2B4A] text-sm">
              A5 文宣
            </Button>
          </Link>
        </div>
      </div>

      {/* 格式列表 */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-12">
        {FORMATS.map(({ id, label, size, note, Component }) => (
          <section key={id} className="space-y-3">
            <div className="flex items-baseline gap-3">
              <h2 className="text-base font-bold text-[#1A2B4A]">{label}</h2>
              <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{size}</span>
              <span className="text-xs text-gray-400">{note}</span>
            </div>
            <div className="overflow-x-auto">
              <div className="inline-block shadow-lg rounded overflow-hidden">
                <Component />
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
