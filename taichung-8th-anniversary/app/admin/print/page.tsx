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

// 點位 02/05/06 有多個 variant，以顏色區別方便工作人員識別
const VARIANT_COLORS: Record<number, string> = {
  1: "#1A2B4A",
  2: "#2B5CE6",
  3: "#C9A84C",
};

// 旋轉點位
const ROTATING_IDS = ["02", "05", "06"];

export default function PrintPage() {
  const [configs, setConfigs] = useState<StampConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConfigs() {
      try {
        const res = await fetch("/api/admin/configs?all=true");
        const data = await res.json();
        if (data.success) {
          const sorted = data.configs.sort((a: StampConfig, b: StampConfig) => {
            if (a.stamp_id !== b.stamp_id) return a.stamp_id.localeCompare(b.stamp_id);
            return a.variant_id - b.variant_id;
          });
          setConfigs(sorted);
        }
      } catch (e) {
        console.error("Fetch failed", e);
      } finally {
        setLoading(false);
      }
    }
    fetchConfigs();
  }, []);

  const getStampUrl = (uuid: string) => {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    return `${base}/stamp?id=${uuid}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-gray-400 text-sm">正在載入 QR Code 資料…</p>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-white p-4 sm:p-8">

      {/* ── 控制列（列印時隱藏）── */}
      <div className="print:hidden max-w-5xl mx-auto mb-6 flex items-center justify-between bg-[#1A2B4A]/5 p-5 rounded-2xl border border-[#1A2B4A]/10">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#1A2B4A]">QR Code 批次列印</h1>
            <p className="text-xs text-gray-500">共 {configs.length} 張・建議 A4 橫向、關閉縮放</p>
          </div>
        </div>
        <Button
          onClick={() => window.print()}
          className="bg-[#1A2B4A] hover:bg-[#1A2B4A]/90 gap-2 h-11 px-6 rounded-full"
        >
          <Printer size={18} /> 列印全部
        </Button>
      </div>

      <div className="print:hidden max-w-5xl mx-auto mb-8 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
        <Info size={14} className="mt-0.5 shrink-0" />
        <span>
          旋轉點位（02 / 05 / 06）有 3 個版本，每天輪替使用一個。
          版本顏色：<strong className="text-[#1A2B4A]">V1 深藍</strong>、
          <strong className="text-[#2B5CE6]">V2 藍</strong>、
          <strong className="text-[#C9A84C]">V3 金</strong>。
        </span>
      </div>

      {/* ── QR Code 網格 ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-5xl mx-auto print:grid-cols-3 print:gap-4">
        {configs.map((config) => {
          const isRotating = ROTATING_IDS.includes(config.stamp_id);
          const accentColor = isRotating
            ? VARIANT_COLORS[config.variant_id] ?? "#1A2B4A"
            : "#1A2B4A";
          const stampUrl = getStampUrl(config.uuid);

          return (
            <div
              key={config.uuid}
              className="break-inside-avoid rounded-3xl border-2 p-5 flex flex-col items-center gap-4 shadow-sm print:shadow-none print:rounded-2xl print:p-4"
              style={{ borderColor: `${accentColor}22` }}
            >
              {/* 標題列 */}
              <div className="w-full flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="text-3xl font-black tracking-tighter"
                    style={{ color: accentColor }}
                  >
                    {config.stamp_id}
                  </span>
                  {isRotating && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        color: accentColor,
                        backgroundColor: `${accentColor}18`,
                      }}
                    >
                      V{config.variant_id}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-gray-300 uppercase">
                  {config.stamp_id === "A" || config.stamp_id === "B" || config.stamp_id === "C"
                    ? "hidden"
                    : "stamp"}
                </span>
              </div>

              {/* QR Code (純 SVG，不依賴外部服務) */}
              <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-inner">
                <QRCode
                  value={stampUrl}
                  size={160}
                  fgColor={accentColor}
                  bgColor="#FFFFFF"
                  level="M"
                />
              </div>

              {/* 區域名稱 */}
              <div className="text-center space-y-0.5 w-full">
                <p className="text-xs font-bold text-gray-800 leading-snug">{config.area_name}</p>
                <p className="text-[8px] text-gray-300 font-mono truncate">{config.uuid}</p>
              </div>

              {/* 品牌頁尾 */}
              <div className="flex items-center gap-1 opacity-15 pt-1">
                <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-2 w-auto" />
                <span className="text-[7px] font-mono text-gray-800">× 8th Anniv.</span>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; }
          @page { margin: 0.8cm; size: A4; }
        }
      `}</style>
    </div>
  );
}
