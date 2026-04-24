"use client";

import { Button } from "@/components/ui/button";
import { Printer, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { StampIcon } from "@/components/StampIcon";

const NAVY = "#1A2B4A";
const GOLD = "#C9A84C";
const CREAM = "#F5F2ED";

const STAMP_DATA: Record<string, { area: string; element: string; phrase: string }> = {
  "01": { area: "入口主題陳列區（2F）", element: "♾️ 無限",  phrase: "從這裡走出去，8 與 ∞ 同時開始。" },
  "02": { area: "職人雜貨區（2F）",     element: "陶杯",      phrase: "手溫傳過陶杯，8 年的 ∞ 就在掌心。" },
  "03": { area: "戶外座位區（3F）",     element: "風",        phrase: "露台吹來 ∞ 的風，繞了 8 個年頭才停。" },
  "04": { area: "兒童繪本書櫃（3F）",   element: "橡實",      phrase: "一顆橡實用 8 年 ∞ 生長，長成整片森林。" },
  "05": { area: "樓梯書牆（3F）",       element: "書",        phrase: "8 層書牆向 ∞ 展開，每格都是新世界。" },
  "06": { area: "吧檯區（2F）",         element: "咖啡",      phrase: "一杯咖啡，8 年的 ∞ 日常，從未厭倦。" },
  "07": { area: "天井吊燈區（3F）",     element: "光點",      phrase: "光從天井 ∞ 落，你離第 8 枚只剩一步。" },
  "08": { area: "告示牌（1F）",         element: "花朵",      phrase: "8 年 ∞ 循環，每天都有一朵花記住你。" },
  "A":  { area: "員工身上（隨機）",     element: "墨鏡-松鼠", phrase: "牠等了你 8 分鐘。或者是 ∞ 分鐘——松鼠自己也數不清。" },
  "B":  { area: "戶外座位桌上",         element: "墨鏡-小鳥", phrase: "這個位子空著。小鳥只停在不趕路的人身邊。" },
  "C":  { area: "電梯告示",             element: "墨鏡-小鹿", phrase: "電梯只有上下，沒有 ∞。小鹿選擇住在這裡，等一個看得懂的人。" },
};

const MAIN_IDS = ["01", "02", "03", "04", "05", "06", "07", "08"];
const HIDDEN_IDS = ["A", "B", "C"];

function StandCard({ id }: { id: string }) {
  const data = STAMP_DATA[id];
  const isHidden = HIDDEN_IDS.includes(id);

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{ width: "100mm", height: "150mm", background: CREAM }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${NAVY} 0.5px, transparent 0.5px), linear-gradient(90deg, ${NAVY} 0.5px, transparent 0.5px)`,
          backgroundSize: "10mm 10mm",
        }}
      />

      {/* Top navy band */}
      <div className="relative overflow-hidden shrink-0" style={{ height: "42mm", background: NAVY }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-black" style={{ fontSize: "90mm", lineHeight: 1, color: `${GOLD}07`, transform: "translateY(5mm)" }}>
            {isHidden ? "∞" : "8"}
          </span>
        </div>
        <div className="absolute inset-[2.5mm]" style={{ border: `0.5px solid ${GOLD}28` }} />
        {(["top-[2mm] left-[2mm]","top-[2mm] right-[2mm]","bottom-[2mm] left-[2mm]","bottom-[2mm] right-[2mm]"] as const).map((p, i) => (
          <span key={i} className={`absolute ${p} font-serif leading-none`} style={{ fontSize: "8px", color: `${GOLD}45` }}>∞</span>
        ))}

        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-[2mm]">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: "11mm", height: "11mm", border: `0.8px solid ${GOLD}55`, background: `${GOLD}15` }}
          >
            <span className="font-black text-white" style={{ fontSize: isHidden ? "9px" : "7px" }}>
              {isHidden ? "★" : id}
            </span>
          </div>
          <div className="text-center">
            <p className="font-black text-white" style={{ fontSize: "8px", letterSpacing: "0.1em", lineHeight: 1 }}>Nexus Life</p>
            <p className="font-mono" style={{ fontSize: "4.5px", color: `${GOLD}75`, letterSpacing: "0.3em", marginTop: "1mm" }}>8TH ANNIVERSARY</p>
          </div>
        </div>
      </div>

      {/* Gold gradient separator */}
      <div className="h-px shrink-0" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}70, transparent)` }} />

      {/* Content */}
      <div className="relative flex-1 flex flex-col justify-between px-[7mm] pt-[5mm] pb-[4mm]">
        <div className="space-y-[3mm]">
          <p className="font-bold tracking-[0.2em] uppercase" style={{ fontSize: "5.5px", color: GOLD }}>
            {data.element}
          </p>
          <p className="font-bold leading-[1.85]" style={{ fontSize: "8px", color: NAVY }}>
            {data.phrase}
          </p>
        </div>

        <div className="space-y-[3mm]">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px" style={{ background: `${GOLD}40` }} />
            <span className="font-serif" style={{ fontSize: "8px", color: `${GOLD}65` }}>∞</span>
            <div className="flex-1 h-px" style={{ background: `${GOLD}40` }} />
          </div>
          <div>
            <p className="font-mono" style={{ fontSize: "4.5px", color: `${NAVY}45`, letterSpacing: "0.2em", marginBottom: "0.8mm" }}>STAMP POINT</p>
            <p className="font-bold" style={{ fontSize: "7px", color: NAVY }}>{data.area}</p>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div
        className="flex items-center justify-between px-[5mm] py-[2.5mm] shrink-0"
        style={{ borderTop: `0.5px solid ${GOLD}30`, background: `${NAVY}06` }}
      >
        <p style={{ fontSize: "4.5px", color: `${NAVY}38`, lineHeight: 1.4 }}>
          用 LINE 掃描現場 QR Code 集印
        </p>
        <span style={{ color: `${NAVY}35` }}>
          <StampIcon stampId={id} className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}

export default function StandPage() {
  const allIds = [...MAIN_IDS, ...HIDDEN_IDS];
  const pairs: string[][] = [];
  for (let i = 0; i < allIds.length; i += 2) {
    pairs.push(allIds.slice(i, i + 2));
  }

  return (
    <div className="bg-gray-100 min-h-svh">
      <div className="print:hidden sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/print">
            <Button variant="ghost" size="icon" className="rounded-full"><ChevronLeft /></Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#1A2B4A]">集印點立牌（文字版）</h1>
            <p className="text-xs text-gray-500">10 × 15 cm · 共 11 張 · 護貝直式 · QR Code 另外輸出</p>
          </div>
        </div>
        <Button onClick={() => window.print()} className="bg-[#1A2B4A] gap-2 h-11 px-6 rounded-full">
          <Printer size={18} /> 列印
        </Button>
      </div>

      <div className="print:hidden flex flex-col items-center py-10 gap-10 px-6">
        <div>
          <p className="text-xs text-gray-400 text-center mb-4">主路徑 01–08</p>
          <div className="flex flex-wrap justify-center gap-5">
            {MAIN_IDS.map(id => (
              <div key={id} className="flex flex-col items-center gap-2">
                <p className="text-[10px] font-mono text-gray-400">{id}</p>
                <div className="shadow-xl"><StandCard id={id} /></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-400 text-center mb-4">隱藏彩蛋 A–C</p>
          <div className="flex flex-wrap justify-center gap-5">
            {HIDDEN_IDS.map(id => (
              <div key={id} className="flex flex-col items-center gap-2">
                <p className="text-[10px] font-mono text-gray-400">{id}</p>
                <div className="shadow-xl"><StandCard id={id} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 列印輸出：每頁 2 張，A4 直向 */}
      <div className="hidden print:block">
        {pairs.map((pair, idx) => (
          <div
            key={idx}
            className="print:break-after-page"
            style={{ display: "flex", gap: "5mm", padding: "10mm", width: "210mm", height: "297mm", boxSizing: "border-box", alignItems: "flex-start" }}
          >
            {pair.map(id => <StandCard key={id} id={id} />)}
          </div>
        ))}
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
