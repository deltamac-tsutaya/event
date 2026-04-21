"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lock, RefreshCcw, CheckCircle, AlertCircle } from "lucide-react";

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 簡單密碼驗證 (實務上建議透過 API 驗證)
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
            刷新
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
                <Card key={config.uuid} className="border-l-4 border-l-orange-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-[#1A2B4A]">{config.stamp_id}</span>
                          <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
                            變體 {config.variant_id}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                          {config.stamp_id === "02" ? "職人雜貨區" : config.stamp_id === "05" ? "樓梯書牆" : "吧檯區"}
                        </p>
                        <code className="block rounded bg-gray-100 p-1.5 text-[10px] text-gray-400 break-all">
                          UUID: {config.uuid}
                        </code>
                      </div>
                      <CheckCircle className="text-green-500" size={24} />
                    </div>
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
                  <Card key={config.uuid} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">{config.stamp_id}</span>
                        <span className="text-[10px] text-gray-400">Active</span>
                      </div>
                      <p className="mt-1 text-[10px] text-gray-500 truncate font-mono">
                        {config.uuid.slice(0, 8)}...
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        </div>

        <footer className="rounded-xl bg-blue-50 p-4 text-xs text-blue-700 leading-relaxed">
          <p className="font-bold mb-1">注意事項：</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>系統已於今日午夜隨機選出 active QR code。</li>
            <li>請確認實體卡片上的編號與上方「變體 ID」一致。</li>
            <li>非 active 的 QR code 會被後端拒絕掃描。</li>
          </ul>
        </footer>
      </div>
    </div>
  );
}
