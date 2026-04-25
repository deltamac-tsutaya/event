"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Layers, Printer, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";

interface StampConfig {
  uuid: string;
  stamp_id: string;
  variant_id: number;
  area_name?: string;
}

const NAVY = "#1A2B4A";
const GOLD = "#C9A84C";
const CREAM = "#F5F2ED";

const STAMP_META: Record<string, { kw: string; floor: string; phrase: string }> = {
  "01": { kw: "無限", floor: "2F", phrase: "從這裡走出去，8 與 ∞ 同時開始。" },
  "02": { kw: "陶杯", floor: "2F", phrase: "手溫傳過陶杯，8 年的 ∞ 就在掌心。" },
  "03": { kw: "風",   floor: "3F", phrase: "露台吹來 ∞ 的風，繞了 8 個年頭才停。" },
  "04": { kw: "橡實", floor: "3F", phrase: "一顆橡實用 8 年 ∞ 生長，長成整片森林。" },
  "05": { kw: "書",   floor: "3F", phrase: "8 層書牆向 ∞ 展開，每格都是新世界。" },
  "06": { kw: "咖啡", floor: "2F", phrase: "一杯咖啡，8 年的 ∞ 日常，從未厭倦。" },
  "07": { kw: "光點", floor: "3F", phrase: "光從天井 ∞ 落，你離第 8 枚只剩一步。" },
  "08": { kw: "花朵", floor: "1F", phrase: "8 年 ∞ 循環，每天都有一朵花記住你。" },
  A:    { kw: "松鼠", floor: "★", phrase: "牠等了你 8 分鐘。或者是 ∞ 分鐘——松鼠自己也數不清。" },
  B:    { kw: "小鳥", floor: "★", phrase: "這個位子空著。小鳥只停在不趕路的人身邊。" },
  C:    { kw: "小鹿", floor: "★", phrase: "電梯只有上下，沒有 ∞。小鹿選擇住在這裡，等一個看得懂的人。" },
};

const STAMP_ICON: Record<string, string> = {
  "01": "/materials/assets/stamps/endless.svg",
  "02": "/materials/assets/stamps/drum.svg",
  "03": "/materials/assets/stamps/wind.svg",
  "04": "/materials/assets/stamps/acorn.svg",
  "05": "/materials/assets/stamps/book.svg",
  "06": "/materials/assets/stamps/coffee.svg",
  "07": "/materials/assets/stamps/flare.svg",
  "08": "/materials/assets/stamps/flower.svg",
  A:    "/materials/assets/stamps/squirrel.svg",
  B:    "/materials/assets/stamps/bird.svg",
  C:    "/materials/assets/stamps/deer.svg",
};

const ICON_FILTER = "brightness(0) saturate(100%) invert(12%) sepia(35%) saturate(700%) hue-rotate(190deg) brightness(90%) opacity(0.75)";

function QRCard({ config }: { config: StampConfig }) {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const stampUrl = `${base}/stamp?id=${config.uuid}`;
  const isHidden = ["A", "B", "C"].includes(config.stamp_id);
  const meta = STAMP_META[config.stamp_id] ?? { kw: config.stamp_id, floor: "—", phrase: "" };
  const iconSrc = STAMP_ICON[config.stamp_id];
  const pid = `${config.stamp_id}-${config.variant_id}`.replace(/[^a-z0-9-]/gi, "");

  return (
    <div className="flex flex-col items-center">
      {/* ── Card body: 100×150mm ── */}
      <div className="relative overflow-hidden flex flex-col"
        style={{ width: "100mm", height: "150mm", background: CREAM }}>

        {/* Dot grid + number watermark */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id={pid} x="0" y="0" width="11.3" height="11.3" patternUnits="userSpaceOnUse">
              <path d="M 11.3 0 L 0 0 0 11.3" fill="none" stroke="rgba(138,111,92,0.07)" strokeWidth="0.5"/>
              <circle cx="0" cy="0" r="0.7" fill="rgba(26,43,74,0.06)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${pid})`}/>
          <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle"
            fontFamily="serif" fontSize="250" fontWeight="600"
            fill="rgba(26,43,74,0.04)" style={{ userSelect: "none", pointerEvents: "none" }}>
            {isHidden ? "∞" : config.stamp_id}
          </text>
        </svg>

        {/* ── Top navy band ── */}
        <div className="relative overflow-hidden shrink-0" style={{ height: "42mm", background: NAVY }}>
          {/* "8" / "∞" backdrop */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-black"
              style={{ fontSize: "90mm", lineHeight: 1, color: `${GOLD}07`, transform: "translateY(5mm)" }}>
              {isHidden ? "∞" : "8"}
            </span>
          </div>
          {/* Inner gold border */}
          <div className="absolute inset-[2.5mm]" style={{ border: `0.5px solid ${GOLD}28` }} />
          {/* Corner ∞ */}
          {(["top-[2mm] left-[2mm]", "top-[2mm] right-[2mm]", "bottom-[2mm] left-[2mm]", "bottom-[2mm] right-[2mm]"] as const).map((p, i) => (
            <span key={i} className={`absolute ${p} font-serif leading-none`}
              style={{ fontSize: "8px", color: `${GOLD}45` }}>∞</span>
          ))}

          <div className="relative z-10 h-full flex flex-col px-[4mm] pt-[3.5mm] pb-[3mm]">
            {/* Brand row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[1.5mm]">
                <img src="/tsutaya-logo.svg" alt="TSUTAYA"
                  style={{ height: "6px", opacity: 0.65, filter: "invert(1)" }} />
                <span className="font-mono" style={{ fontSize: "5px", color: "rgba(255,255,255,0.28)" }}>×</span>
                <img src="/wired-tokyo-logo.svg" alt="WIRED"
                  style={{ height: "7px", opacity: 0.55, filter: "invert(1)" }} />
              </div>
              <span className="font-mono"
                style={{ fontSize: "5.5px", color: `${GOLD}90`, letterSpacing: "0.18em" }}>
                {isHidden ? `EGG / ${config.stamp_id}` : `${meta.floor} · ${config.stamp_id}`}
              </span>
            </div>

            {/* Number badge + wordmark */}
            <div className="flex-1 flex flex-col items-center justify-center gap-[1.5mm]">
              <div className="flex items-center justify-center rounded-full"
                style={{ width: "12mm", height: "12mm", border: `0.8px solid ${GOLD}55`, background: `${GOLD}15` }}>
                <span className="font-black text-white"
                  style={{ fontSize: isHidden ? "9px" : "7px" }}>
                  {isHidden ? "★" : config.stamp_id}
                </span>
              </div>
              <div className="text-center">
                <p className="font-black text-white"
                  style={{ fontSize: "7.5px", letterSpacing: "0.08em", lineHeight: 1 }}>Nexus Life</p>
                <p className="font-mono"
                  style={{ fontSize: "4px", color: `${GOLD}75`, letterSpacing: "0.3em", marginTop: "1mm" }}>
                  8TH ANNIVERSARY
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gold gradient separator */}
        <div className="h-px shrink-0"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}70, transparent)` }} />

        {/* ── QR section ── */}
        <div className="flex flex-col items-center px-[5mm] pt-[3.5mm] pb-[2mm] gap-[2mm] shrink-0">
          <span className="font-mono"
            style={{ fontSize: "4.5px", letterSpacing: "0.3em", color: "rgba(26,43,74,0.38)" }}>
            {isHidden ? "★  HIDDEN  STAMP" : "SCAN  TO  COLLECT"}
          </span>
          <div style={{ background: "#FDFAF6", border: "1px solid rgba(138,111,92,0.18)", borderRadius: "2mm", padding: "2mm" }}>
            <QRCode value={stampUrl} size={128} fgColor={NAVY} bgColor="#FDFAF6" level="M"
              viewBox="0 0 128 128" style={{ width: "22mm", height: "22mm", display: "block" }} />
          </div>
          <span className="font-mono text-center"
            style={{ fontSize: "4px", color: "rgba(26,43,74,0.28)", letterSpacing: "0.06em" }}>
            {meta.floor === "★" ? `★  ${config.area_name}` : `${meta.floor} · ${config.area_name}`}
          </span>
        </div>

        {/* ∞ divider */}
        <div className="flex items-center gap-[2mm] px-[5mm] shrink-0">
          <div className="flex-1 h-px" style={{ background: `${GOLD}40` }} />
          <span className="font-serif" style={{ fontSize: "7px", color: `${GOLD}65` }}>∞</span>
          <div className="flex-1 h-px" style={{ background: `${GOLD}40` }} />
        </div>

        {/* ── Stamp content section ── */}
        <div className="relative flex-1 flex flex-col justify-between px-[5mm] pt-[2.5mm] pb-[2mm]">
          {/* Icon + keyword + phrase */}
          <div className="flex items-start gap-[3mm]">
            <div className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: "11mm", height: "11mm", border: "1px solid rgba(138,111,92,0.2)", background: "#EEE9E2" }}>
              <img src={iconSrc} alt={meta.kw}
                style={{ width: "7mm", height: "7mm", objectFit: "contain", filter: ICON_FILTER }} />
            </div>
            <div>
              <p className="font-bold tracking-[0.2em] uppercase"
                style={{ fontSize: "5.5px", color: GOLD }}>{meta.kw}</p>
              <p className="font-bold leading-[1.85]"
                style={{ fontSize: "6.5px", color: NAVY }}>{meta.phrase}</p>
            </div>
          </div>

          {/* Area name */}
          <div>
            <p className="font-mono"
              style={{ fontSize: "4px", color: `${NAVY}45`, letterSpacing: "0.2em", marginBottom: "0.8mm" }}>
              STAMP POINT
            </p>
            <p className="font-bold" style={{ fontSize: "7px", color: NAVY }}>{config.area_name}</p>
          </div>
        </div>

        {/* ── Bottom strip ── */}
        <div className="flex items-center justify-between px-[5mm] py-[2mm] shrink-0"
          style={{ borderTop: `0.5px solid ${GOLD}30`, background: `${NAVY}06` }}>
          <p style={{ fontSize: "4px", color: `${NAVY}38` }}>用 LINE 掃描現場 QR Code 集印</p>
          <img src={iconSrc} alt={meta.kw}
            style={{ width: "5mm", height: "5mm", objectFit: "contain",
              filter: "brightness(0) saturate(100%) invert(12%) sepia(35%) saturate(700%) hue-rotate(190deg) brightness(90%) opacity(0.35)" }} />
        </div>
      </div>

      {/* Out-of-card label (screen only) */}
      <div className="print:hidden mt-1 space-y-0.5" style={{ width: "100mm" }}>
        <div className="flex items-center justify-between px-0.5">
          <p className="text-[9px] font-bold text-gray-700 leading-tight">{config.area_name}</p>
          {isHidden && (
            <span className="text-[7px] font-mono bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">hidden</span>
          )}
        </div>
        <p className="text-[7px] font-mono text-gray-300 px-0.5 leading-tight truncate">{config.uuid}</p>
      </div>
    </div>
  );
}

export default function MaterialsPage() {
  const [tab, setTab] = useState<"design" | "qr">("design");
  const [configs, setConfigs] = useState<StampConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (tab !== "qr" || fetched) return;
    setLoading(true);
    fetch("/api/admin/configs?all=true")
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setConfigs(
            d.configs.sort((a: StampConfig, b: StampConfig) => {
              if (a.stamp_id !== b.stamp_id) return a.stamp_id.localeCompare(b.stamp_id);
              return a.variant_id - b.variant_id;
            })
          );
        }
      })
      .catch(console.error)
      .finally(() => { setLoading(false); setFetched(true); });
  }, [tab, fetched]);

  // 2-up per A4 page (matches stand print layout)
  const pairs: StampConfig[][] = [];
  for (let i = 0; i < configs.length; i += 2) pairs.push(configs.slice(i, i + 2));

  return (
    <div className="flex flex-col h-svh bg-white">

      {/* ── Header ── */}
      <header className="shrink-0 flex items-center gap-2 bg-white border-b shadow-sm px-4 h-12 z-10 print:hidden">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
            <ChevronLeft size={16} />
          </Button>
        </Link>
        <Layers size={15} className="text-[#1A2B4A]" />
        <span className="font-bold text-sm text-[#1A2B4A]">文宣 &amp; 列印</span>

        <div className="ml-4 flex items-center gap-1 bg-gray-100 rounded-full p-0.5">
          <button
            onClick={() => setTab("design")}
            className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
              tab === "design" ? "bg-white text-[#1A2B4A] shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            設計稿
          </button>
          <button
            onClick={() => setTab("qr")}
            className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
              tab === "qr" ? "bg-white text-[#1A2B4A] shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            QR 批次列印
          </button>
        </div>

        {tab === "qr" && configs.length > 0 && (
          <Button
            onClick={() => window.print()}
            className="ml-auto bg-[#1A2B4A] hover:bg-[#1A2B4A]/90 gap-2 h-8 px-4 rounded-full text-xs"
          >
            <Printer size={14} /> 列印全部 ({configs.length} 張)
          </Button>
        )}
      </header>

      {/* ── 設計稿 tab ── */}
      {tab === "design" && (
        <iframe
          src="/materials/index.html"
          className="flex-1 w-full border-0"
          title="Nexus Life Materials"
          allow="clipboard-write"
        />
      )}

      {/* ── QR 批次列印 tab ── */}
      {tab === "qr" && (
        <div className="flex-1 overflow-auto bg-gray-50">
          {loading && (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-400 text-sm animate-pulse">正在載入 QR Code 資料…</p>
            </div>
          )}

          {!loading && configs.length > 0 && (
            <>
              {/* Screen info bar */}
              <div className="print:hidden max-w-5xl mx-auto mt-4 mb-2 px-6 flex items-center gap-4">
                <p className="text-xs text-gray-400">
                  共 {configs.length} 張 · {pairs.length} 頁 · 每頁 2 張（A4 直向）
                </p>
                <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                  <Info size={12} className="mt-0.5 shrink-0" />
                  <span>框外的區域名稱與 UUID 僅供店員核對用。</span>
                </div>
              </div>

              {/* Screen preview: wrap grid */}
              <div className="print:hidden max-w-5xl mx-auto px-6 pb-10">
                <div className="flex flex-wrap gap-6 justify-center">
                  {configs.map(c => <QRCard key={c.uuid} config={c} />)}
                </div>
              </div>

              {/* Print output: 2-up per A4 page */}
              {pairs.map((pair, idx) => (
                <div key={idx} className="hidden print:flex print:break-after-page"
                  style={{
                    gap: "5mm", padding: "10mm",
                    width: "210mm", height: "297mm",
                    boxSizing: "border-box", alignItems: "flex-start",
                  }}>
                  {pair.map(c => <QRCard key={c.uuid} config={c} />)}
                </div>
              ))}
            </>
          )}
        </div>
      )}

      <style jsx global>{`
        @media print {
          body { background: white !important; margin: 0; padding: 0; }
          @page { size: A4 portrait; margin: 0; }
        }
      `}</style>
    </div>
  );
}
