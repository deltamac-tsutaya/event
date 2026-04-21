"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Printer, ChevronLeft, Info } from "lucide-react";
import Link from "next/link";

interface StampConfig {
  uuid: string;
  stamp_id: string;
  variant_id: number;
  area_name?: string;
}

export default function PrintPage() {
  const [configs, setConfigs] = useState<StampConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConfigs() {
      try {
        const res = await fetch("/api/staff/configs");
        const data = await res.json();
        if (data.success) {
          // 排序：01, 02-v1, 02-v2... A, B, C
          const sorted = data.configs.sort((a: any, b: any) => {
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

  const getQRUrl = (uuid: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${baseUrl}/stamp?id=${uuid}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(fullUrl)}`;
  };

  if (loading) return <div className="p-20 text-center">正在準備 QR Code 資料...</div>;

  return (
    <div className="min-h-svh bg-white p-4 sm:p-8">
      {/* 僅在螢幕上顯示的控制列 */}
      <div className="print:hidden max-w-5xl mx-auto mb-8 flex items-center justify-between bg-blue-50 p-6 rounded-2xl border border-blue-100">
        <div className="flex items-center gap-4">
          <Link href="/staff">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-blue-900">QR Code 批次列印</h1>
            <p className="text-sm text-blue-700">共計 {configs.length} 張 QR Code</p>
          </div>
        </div>
        <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 gap-2 h-12 px-6 rounded-full shadow-lg">
          <Printer size={20} /> 立即列印 (A4 網格)
        </Button>
      </div>

      <div className="print:hidden max-w-5xl mx-auto mb-6 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-3 rounded-lg">
        <Info size={14} />
        <span>提示：列印設定中建議開啟「列印背景圖形」以獲得最佳視覺效果。</span>
      </div>

      {/* 列印網格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-6xl mx-auto print:grid-cols-2 print:gap-x-4 print:gap-y-8">
        {configs.map((config) => (
          <div 
            key={config.uuid} 
            className="border-2 border-gray-100 rounded-[2rem] p-6 flex flex-col items-center justify-center space-y-4 break-inside-avoid shadow-sm print:shadow-none print:border-gray-200"
          >
            <div className="text-center">
              <span className="text-4xl font-black text-[#1A2B4A] tracking-tighter">
                {config.stamp_id}
              </span>
              {config.variant_id > 1 && (
                <span className="ml-2 text-xs font-bold bg-gray-100 px-2 py-0.5 rounded-full">
                  v{config.variant_id}
                </span>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-3xl border shadow-inner">
              <img 
                src={getQRUrl(config.uuid)} 
                alt={`QR ${config.stamp_id}`} 
                className="w-40 h-40 sm:w-48 sm:h-48"
              />
            </div>

            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-gray-800">{config.area_name}</p>
              <p className="text-[9px] text-gray-300 font-mono uppercase truncate max-w-[150px]">
                {config.uuid}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-1 opacity-20">
              <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-2 w-auto" />
              <span className="text-[8px] font-mono">8th Anniv.</span>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            padding: 0 !important;
          }
          @page {
            margin: 1cm;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
