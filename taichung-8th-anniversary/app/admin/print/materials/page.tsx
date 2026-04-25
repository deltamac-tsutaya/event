"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Layers, Printer, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { StampIcon } from "@/components/StampIcon";

interface StampConfig {
  uuid: string;
  stamp_id: string;
  variant_id: number;
  area_name?: string;
}

const QR_COLOR = "#1A2B4A";

function QRCard({ config }: { config: StampConfig }) {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const stampUrl = `${base}/stamp?id=${config.uuid}`;
  const isHidden = ["A", "B", "C"].includes(config.stamp_id);

  return (
    <div className="flex flex-col items-center w-full">
      <div
        className="relative w-full flex flex-col border-2 overflow-hidden"
        style={{ borderColor: QR_COLOR }}
      >
        <div
          className="absolute inset-[5px] pointer-events-none z-10"
          style={{ border: "0.5px solid rgba(201,168,76,0.5)" }}
        />
        {["top-[3px] left-[3px]", "top-[3px] right-[3px]", "bottom-[3px] left-[3px]", "bottom-[3px] right-[3px]"].map((pos, i) => (
          <span key={i} className={`absolute ${pos} text-[10px] font-serif z-20 leading-none`} style={{ color: "#C9A84C" }}>∞</span>
        ))}
        <div className="flex items-center justify-center gap-2 py-1.5 px-4 shrink-0" style={{ borderBottom: "0.5px solid rgba(201,168,76,0.3)" }}>
          <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-2.5 w-auto opacity-60" />
          <span className="text-[7px] font-mono text-[#1A2B4A]/40">×</span>
          <img src="/wired-tokyo-logo.svg" alt="WIRED" className="h-3 w-auto opacity-50" />
        </div>
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
        <div className="px-5 py-2 shrink-0" style={{ borderTop: "0.5px solid rgba(201,168,76,0.15)", backgroundColor: "#F5F2ED" }}>
          <p className="text-[5.5px] leading-[1.6] text-[#1A2B4A]/40 text-center">
            每個帳號每個點位限蓋 1 次。集滿 8 枚可每日抽獎，午夜 00:00 重置。
          </p>
        </div>
        <div className="flex flex-col items-center gap-1 py-2 px-4 shrink-0" style={{ borderTop: "0.5px solid rgba(201,168,76,0.3)" }}>
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
              <span className="text-[7px] font-mono tracking-[0.2em] uppercase" style={{ color: QR_COLOR }}>Nexus Life</span>
              <span className="text-[6px] font-mono tracking-[0.15em]" style={{ color: "rgba(26,43,74,0.5)" }}>8th Anniversary</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-1 px-0.5 space-y-0.5">
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-bold text-gray-700 leading-tight">{config.area_name}</p>
          {isHidden && <span className="text-[7px] font-mono bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">hidden</span>}
        </div>
        <p className="text-[7px] font-mono text-gray-300 leading-tight truncate">{config.uuid}</p>
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

  const pages: StampConfig[][] = [];
  for (let i = 0; i < configs.length; i += 4) pages.push(configs.slice(i, i + 4));

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

        {/* Tab switcher */}
        <div className="ml-4 flex items-center gap-1 bg-gray-100 rounded-full p-0.5">
          <button
            onClick={() => setTab("design")}
            className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
              tab === "design"
                ? "bg-white text-[#1A2B4A] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            設計稿
          </button>
          <button
            onClick={() => setTab("qr")}
            className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
              tab === "qr"
                ? "bg-white text-[#1A2B4A] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
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
        <div className="flex-1 overflow-auto bg-white">
          {loading && (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-400 text-sm animate-pulse">正在載入 QR Code 資料…</p>
            </div>
          )}

          {!loading && configs.length > 0 && (
            <>
              <div className="print:hidden max-w-4xl mx-auto mt-4 mb-2 px-6">
                <p className="text-xs text-gray-400">共 {configs.length} 張 · {pages.length} 頁 · 每頁 4 張（A4 直向）</p>
              </div>
              <div className="print:hidden max-w-4xl mx-auto mb-4 px-6">
                <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <Info size={14} className="mt-0.5 shrink-0" />
                  <span>框外的區域名稱與 UUID 僅供店員核對用。</span>
                </div>
              </div>
              {pages.map((page, pageIdx) => (
                <div
                  key={pageIdx}
                  className="print:break-after-page px-6 py-4 print:p-[8mm] max-w-4xl mx-auto print:max-w-none"
                >
                  <p className="print:hidden text-[10px] font-mono text-gray-300 mb-3 text-right">
                    第 {pageIdx + 1} 頁 / 共 {pages.length} 頁
                  </p>
                  <div className="grid grid-cols-2 gap-6 print:gap-[6mm]">
                    {page.map(c => <QRCard key={c.uuid} config={c} />)}
                    {page.length < 4 && Array.from({ length: 4 - page.length }).map((_, i) => <div key={`e-${i}`} />)}
                  </div>
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
