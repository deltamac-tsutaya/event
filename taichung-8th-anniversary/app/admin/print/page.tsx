"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Printer, ChevronLeft, Info } from "lucide-react";
import Link from "next/link";
import QRCode from "react-qr-code";

interface StampConfig {
  uuid: string;
  stamp_id: string;
  variant_id: number;
  area_name?: string;
}

const ROTATING_IDS = ["02", "05", "06"];
const VARIANT_COLORS: Record<number, string> = {
  1: "#1A2B4A",
  2: "#2B5CE6",
  3: "#C9A84C",
};

function QRCard({ config }: { config: StampConfig }) {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const stampUrl = `${base}/stamp?id=${config.uuid}`;
  const isRotating = ROTATING_IDS.includes(config.stamp_id);
  const isHidden = ["A", "B", "C"].includes(config.stamp_id);
  const accentColor = isRotating ? (VARIANT_COLORS[config.variant_id] ?? "#1A2B4A") : "#1A2B4A";

  return (
    <div
      className="flex flex-col items-center justify-between border-2 rounded-3xl p-6 print:rounded-2xl print:p-5 bg-white"
      style={{ borderColor: `${accentColor}30` }}
    >
      {/* 頂部：點位編號 + 標籤 */}
      <div className="w-full flex items-start justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black tracking-tighter" style={{ color: accentColor }}>
            {config.stamp_id}
          </span>
          {isRotating && (
            <span
              className="text-xs font-black px-2 py-0.5 rounded-full"
              style={{ color: accentColor, background: `${accentColor}15` }}
            >
              V{config.variant_id}
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono text-gray-300 uppercase mt-2">
          {isHidden ? "hidden" : "stamp"}
        </span>
      </div>

      {/* QR Code — 縮放填滿可用空間 */}
      <div className="w-full flex items-center justify-center py-2">
        <div className="w-full max-w-[220px] sm:max-w-[240px] p-3 bg-white rounded-2xl border border-gray-100 shadow-inner">
          <QRCode
            value={stampUrl}
            size={256}
            fgColor={accentColor}
            bgColor="#FFFFFF"
            level="M"
            style={{ width: "100%", height: "auto" }}
            viewBox="0 0 256 256"
          />
        </div>
      </div>

      {/* 底部：區域名稱 + UUID */}
      <div className="w-full text-center mt-3 space-y-1">
        <p className="text-sm font-bold text-gray-800 leading-tight">{config.area_name}</p>
        <p className="text-[8px] font-mono text-gray-300 break-all leading-tight">{config.uuid}</p>
      </div>

      {/* 品牌 */}
      <div className="flex items-center gap-1.5 opacity-15 mt-3">
        <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-2.5 w-auto" />
        <span className="text-[8px] font-mono">× 8th Anniv.</span>
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

  // 每4張一頁 (2×2)，共5頁
  const pages: StampConfig[][] = [];
  for (let i = 0; i < configs.length; i += 4) {
    pages.push(configs.slice(i, i + 4));
  }

  return (
    <div className="bg-white min-h-svh">

      {/* ── 控制列（列印時隱藏）── */}
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
          <span>
            每頁 4 張 QR Code（2×2），A4 直向列印。
            旋轉點位顏色：
            <strong className="text-[#1A2B4A]">V1 深藍</strong>、
            <strong className="text-[#2B5CE6]">V2 藍</strong>、
            <strong className="text-[#C9A84C]">V3 金</strong>。
          </span>
        </div>
      </div>

      {/* ── 分頁列印區域 ── */}
      {pages.map((page, pageIdx) => (
        <div
          key={pageIdx}
          className="print:break-after-page px-6 py-4 print:px-0 print:py-0 max-w-4xl mx-auto print:max-w-none"
        >
          {/* 螢幕上顯示頁碼 */}
          <p className="print:hidden text-[10px] font-mono text-gray-300 mb-3 text-right">
            第 {pageIdx + 1} 頁 / 共 {pages.length} 頁
          </p>
          <div className="grid grid-cols-2 gap-5 print:gap-0 print:h-screen print:grid-rows-2">
            {page.map((config) => (
              <div key={config.uuid} className="print:p-4 print:border-b print:border-r print:border-gray-100 last:border-r-0 [&:nth-child(2)]:border-r-0">
                <QRCard config={config} />
              </div>
            ))}
            {/* 若最後一頁不足4張，補空白佔位 */}
            {page.length < 4 &&
              Array.from({ length: 4 - page.length }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
          </div>
        </div>
      ))}

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            margin: 0;
            padding: 0;
          }
          @page {
            size: A4 portrait;
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}
