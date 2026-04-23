"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Printer, ChevronLeft, Info } from "lucide-react";
import Link from "next/link";
import QRCode from "react-qr-code";
import { StampIcon } from "@/components/StampIcon";

interface StampConfig {
  uuid: string;
  stamp_id: string;
  variant_id: number;
  area_name?: string;
}

const QR_COLOR = "#1A2B4A";

const STAMP_DESC: Record<string, { title: string; desc: string }> = {
  "01": { title: "入口主題陳列區", desc: "踏入空間的第一個印記。本季策展陳列，迎接每一位到訪的旅人。" },
  "02": { title: "生活選品區",     desc: "生活即選品。這裡匯集了我們認為值得放進日常的物件。" },
  "03": { title: "露台區",         desc: "城市之上，靜謐一隅。帶一本書，讓台中的風輕輕翻頁。" },
  "04": { title: "兒童繪本區",     desc: "最初的閱讀記憶，從這裡開始。那些圖畫，藏著比文字更大的世界。" },
  "05": { title: "書櫃深處",       desc: "不是每本書都等在明顯的地方。有些故事，需要你走進來才能發現。" },
  "06": { title: "WIRED TOKYO 吧檯", desc: "餐飲與靈感的交會點。一杯飲料的時間，剛好夠想清楚一件事。" },
  "07": { title: "天井區",         desc: "光從上方落下。在這個空間，時間的流動變得可見。" },
  "08": { title: "結帳櫃檯旁",     desc: "帶走你選擇的一切。每一次結帳，都是一個生活主張的確認。" },
  "A":  { title: "∞",             desc: "有些印記，只留給真正觀察的人。" },
  "B":  { title: "∞",             desc: "有些印記，只留給真正觀察的人。" },
  "C":  { title: "∞",             desc: "有些印記，只留給真正觀察的人。" },
};

function QRCard({ config }: { config: StampConfig }) {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const stampUrl = `${base}/stamp?id=${config.uuid}`;
  const isHidden = ["A", "B", "C"].includes(config.stamp_id);

  return (
    <div className="flex flex-col items-center w-full">

      {/* ── 裝飾框（印刷主體）── */}
      <div
        className="relative w-full flex flex-col border-2 overflow-hidden"
        style={{ borderColor: QR_COLOR }}
      >
        {/* 內框線（金色） */}
        <div
          className="absolute inset-[5px] pointer-events-none z-10"
          style={{ border: "0.5px solid rgba(201,168,76,0.5)" }}
        />

        {/* 四角 ∞ */}
        {["top-[3px] left-[3px]", "top-[3px] right-[3px]", "bottom-[3px] left-[3px]", "bottom-[3px] right-[3px]"].map((pos, i) => (
          <span
            key={i}
            className={`absolute ${pos} text-[10px] font-serif z-20 leading-none`}
            style={{ color: "#C9A84C" }}
          >
            ∞
          </span>
        ))}

        {/* ── 頂部品牌帶 ── */}
        <div
          className="flex items-center justify-center gap-2 py-1.5 px-4 shrink-0"
          style={{ borderBottom: "0.5px solid rgba(201,168,76,0.3)" }}
        >
          <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-2.5 w-auto opacity-60" />
          <span className="text-[7px] font-mono text-[#1A2B4A]/40">×</span>
          <img src="/wired-tokyo-logo.svg" alt="WIRED" className="h-3 w-auto opacity-50" />
        </div>

        {/* ── QR Code — 強制正方形，不留空白 ── */}
        <div className="w-full bg-white p-3" style={{ aspectRatio: "1 / 1" }}>
          <QRCode
            value={stampUrl}
            size={256}
            fgColor={QR_COLOR}
            bgColor="#FFFFFF"
            level="M"
            viewBox="0 0 256 256"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* ── 活動說明帶 ── */}
        {STAMP_DESC[config.stamp_id] && (
          <div className="px-5 py-2.5 shrink-0 bg-[#F9F7F3]" style={{ borderTop: "0.5px solid rgba(201,168,76,0.2)" }}>
            <p className="text-[7.5px] font-bold tracking-[0.1em] text-[#1A2B4A] mb-0.5">
              {STAMP_DESC[config.stamp_id].title}
            </p>
            <p className="text-[6.5px] leading-[1.6] text-[#1A2B4A]/60">
              {STAMP_DESC[config.stamp_id].desc}
            </p>
          </div>
        )}

        {/* ── 底部印章帶 ── */}
        <div
          className="flex flex-col items-center gap-1 py-2 px-4 shrink-0"
          style={{ borderTop: "0.5px solid rgba(201,168,76,0.3)" }}
        >
          <div className="w-full flex items-center gap-1.5">
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(201,168,76,0.3)" }} />
            <span className="text-[8px] font-serif" style={{ color: "rgba(201,168,76,0.6)" }}>∞</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(201,168,76,0.3)" }} />
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: QR_COLOR }}>
              <StampIcon stampId={config.stamp_id} className="w-4 h-4" />
            </span>
            <div className="flex flex-col items-start">
              <span className="text-[7px] font-mono tracking-[0.2em] uppercase" style={{ color: QR_COLOR }}>
                Nexus Life
              </span>
              <span className="text-[6px] font-mono tracking-[0.15em]" style={{ color: "rgba(26,43,74,0.5)" }}>
                8th Anniversary
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 框外資訊（僅供店員核對）── */}
      <div className="w-full mt-1 px-0.5 space-y-0.5">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-bold text-gray-700 leading-tight">{config.area_name}</p>
          {isHidden && (
            <span className="text-[7px] font-mono bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">hidden</span>
          )}
        </div>
        <p className="text-[7px] font-mono text-gray-300 leading-tight truncate">{config.uuid}</p>
      </div>

    </div>
  );
}

export default function PrintPage() {
  const [configs, setConfigs] = useState<StampConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConfigs() {
      try {
        const res = await fetch("/api/admin/configs?all=true");
        const data = await res.json();
        if (data.success) {
          setConfigs(
            data.configs.sort((a: StampConfig, b: StampConfig) => {
              if (a.stamp_id !== b.stamp_id) return a.stamp_id.localeCompare(b.stamp_id);
              return a.variant_id - b.variant_id;
            })
          );
        }
      } catch (e) {
        console.error("Fetch failed", e);
      } finally {
        setLoading(false);
      }
    }
    fetchConfigs();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">正在載入 QR Code 資料…</p>
      </div>
    );
  }

  const pages: StampConfig[][] = [];
  for (let i = 0; i < configs.length; i += 4) {
    pages.push(configs.slice(i, i + 4));
  }

  return (
    <div className="bg-white min-h-svh">

      {/* ── 控制列 ── */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#1A2B4A]">QR Code 批次列印</h1>
            <p className="text-xs text-gray-500">
              共 {configs.length} 張 · {pages.length} 頁 · 每頁 4 張（A4 直向）
            </p>
          </div>
        </div>
        <Button
          onClick={() => window.print()}
          className="bg-[#1A2B4A] hover:bg-[#1A2B4A]/90 gap-2 h-11 px-6 rounded-full"
        >
          <Printer size={18} /> 列印全部
        </Button>
      </div>

      <div className="print:hidden max-w-4xl mx-auto mt-4 mb-6 px-6">
        <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-100">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>框外的區域名稱與 UUID 僅供店員核對用。</span>
        </div>
      </div>

      {/* ── 列印頁面 ── */}
      {pages.map((page, pageIdx) => (
        <div
          key={pageIdx}
          className="print:break-after-page px-6 py-4 print:p-[8mm] max-w-4xl mx-auto print:max-w-none"
        >
          <p className="print:hidden text-[10px] font-mono text-gray-300 mb-3 text-right">
            第 {pageIdx + 1} 頁 / 共 {pages.length} 頁
          </p>
          <div className="grid grid-cols-2 gap-6 print:gap-[6mm]">
            {page.map((config) => (
              <QRCard key={config.uuid} config={config} />
            ))}
            {page.length < 4 &&
              Array.from({ length: 4 - page.length }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
          </div>
        </div>
      ))}

      <style jsx global>{`
        @media print {
          body { background: white !important; margin: 0; padding: 0; }
          @page { size: A4 portrait; margin: 0; }
        }
      `}</style>
    </div>
  );
}
