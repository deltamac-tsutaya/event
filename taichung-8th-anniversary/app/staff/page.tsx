"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Lock, 
  RefreshCcw, 
  CheckCircle, 
  AlertCircle, 
  QrCode, 
  X, 
  Printer,
  ChevronRight
} from "lucide-react";

interface StampConfig {
  uuid: string;
  stamp_id: string;
  variant_id: number;
  is_active: boolean;
  area_name?: string;
}

export default function StaffPage() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [configs, setConfigs] = useState<StampConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedQR, setSelectedQR] = useState<StampConfig | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "nexus8th") {
      setIsAuthorized(true);
      fetchConfigs();
    } else {
      alert("密碼錯誤");
    }
  };

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/staff/configs");
      const data = await res.json();
      if (data.success) {
        setConfigs(data.configs);
      } else {
        setError(data.error || "無法載入資料");
      }
    } catch (err) {
      setError("連線失敗");
    } finally {
      setLoading(false);
    }
  };

  const getQRUrl = (uuid: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${baseUrl}/stamp?id=${uuid}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(fullUrl)}`;
  };

  if (!isAuthorized) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#1A2B4A] p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Lock size={24} />
            </div>
            <CardTitle>店員管理後台</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="請輸入後台密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <Button type="submit" className="w-full bg-[#1A2B4A]">
                進入系統
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-gray-50 p-4 pb-12 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">今日點位配置</h1>
            <p className="text-sm text-gray-500">
              請根據下方列表更換實體 QR Code 卡片
            </p>
          </div>
          <Button variant="outline" onClick={fetchConfigs} disabled={loading}>
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            刷新數據
          </Button>
        </header>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700 flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {/* 輪替點位區塊 */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-orange-600">
              <RefreshCcw size={18} />
              每日輪替點位 (必檢)
            </h2>
            {configs
              .filter((c) => ["02", "05", "06"].includes(c.stamp_id))
              .map((config) => (
                <Card key={config.uuid} className="border-l-4 border-l-orange-500 overflow-hidden group">
                  <CardContent className="p-0">
                    <button 
                      onClick={() => setSelectedQR(config)}
                      className="w-full text-left p-6 hover:bg-orange-50 transition-colors flex items-start justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-[#1A2B4A]">{config.stamp_id}</span>
                          <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
                            變體 {config.variant_id}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-600">{config.area_name}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                         <QrCode className="text-orange-400 group-hover:text-orange-600 transition-colors" />
                         <span className="text-[10px] text-orange-600 font-bold">點擊顯示 QR</span>
                      </div>
                    </button>
                  </CardContent>
                </Card>
              ))}
          </section>

          {/* 固定與隱藏點位區塊 */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <CheckCircle size={18} />
              固定與隱藏點位
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {configs
                .filter((c) => !["02", "05", "06"].includes(c.stamp_id))
                .sort((a, b) => a.stamp_id.localeCompare(b.stamp_id))
                .map((config) => (
                  <button 
                    key={config.uuid} 
                    onClick={() => setSelectedQR(config)}
                    className="text-left"
                  >
                    <Card className="bg-white hover:border-[#1A2B4A] transition-all group">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">{config.stamp_id}</span>
                          <QrCode size={16} className="text-gray-300 group-hover:text-[#1A2B4A]" />
                        </div>
                        <p className="mt-1 text-[9px] text-gray-400 truncate uppercase tracking-tighter">
                          {config.area_name || '固定點位'}
                        </p>
                      </CardContent>
                    </Card>
                  </button>
                ))}
            </div>
          </section>
        </div>

        {/* QR Code 預覽彈窗 */}
        {selectedQR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="w-full max-w-sm animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b p-4">
                <h3 className="font-bold text-[#1A2B4A]">
                  點位 {selectedQR.stamp_id} {selectedQR.variant_id > 1 && `(變體 ${selectedQR.variant_id})`}
                </h3>
                <button onClick={() => setSelectedQR(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 flex flex-col items-center gap-6">
                <div className="bg-white p-4 rounded-2xl shadow-inner border">
                  <img 
                    src={getQRUrl(selectedQR.uuid)} 
                    alt="QR Code" 
                    className="w-48 h-48 sm:w-64 sm:h-64"
                  />
                </div>
                <div className="text-center space-y-2">
                   <p className="text-sm font-bold text-gray-700">{selectedQR.area_name}</p>
                   <code className="text-[10px] text-gray-400 break-all bg-gray-50 p-2 rounded block">
                     {selectedQR.uuid}
                   </code>
                </div>
                <Button 
                  onClick={() => window.print()}
                  className="w-full bg-[#1A2B4A] gap-2"
                >
                  <Printer size={18} />
                  列印此 QR Code
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
