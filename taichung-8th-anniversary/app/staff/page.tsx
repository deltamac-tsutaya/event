"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
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
  Users,
  Trophy,
  Ticket,
  BarChart3,
  Search,
  Settings2,
  LogOut
} from "lucide-react";

interface StampConfig {
  uuid: string;
  stamp_id: string;
  variant_id: number;
  is_active: boolean;
  area_name?: string;
}

interface DashboardStats {
  totalUsers: number;
  todayStamps: number;
  todayDraws: number;
  totalTickets: number;
  distribution: Record<string, number>;
}

export default function StaffPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"configs" | "stats">("configs");
  const [configs, setConfigs] = useState<StampConfig[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedQR, setSelectedQR] = useState<StampConfig | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      if (firebaseUser) fetchAllData();
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setLoginError("帳號或密碼錯誤，請再試一次");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => signOut(auth);

  const fetchAllData = async () => {
    setLoading(true);
    setError("");
    try {
      const [confRes, statsRes] = await Promise.all([
        fetch("/api/staff/configs"),
        fetch("/api/staff/stats")
      ]);
      const confData = await confRes.json();
      const statsData = await statsRes.json();
      
      if (confData.success) setConfigs(confData.configs);
      if (statsData.success) setStats(statsData.stats);
    } catch (err) {
      setError("連線失敗，請檢查網路狀態");
    } finally {
      setLoading(false);
    }
  };

  const getQRUrl = (uuid: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${baseUrl}/stamp?id=${uuid}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(fullUrl)}`;
  };

  if (authLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#0F172A]">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#0F172A] p-4">
        <Card className="w-full max-w-sm shadow-2xl border-none">
          <CardHeader className="text-center pt-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Lock size={32} />
            </div>
            <CardTitle className="text-2xl font-bold">Nexus Admin</CardTitle>
            <p className="text-sm text-gray-400">台中市政店 8 週年管理系統</p>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="管理員 Email"
                value={email}
                className="h-12 bg-gray-50 border-gray-200"
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
              <Input
                type="password"
                placeholder="密碼"
                value={password}
                className="h-12 bg-gray-50 border-gray-200"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {loginError && (
                <p className="text-sm text-red-500 text-center">{loginError}</p>
              )}
              <Button
                type="submit"
                disabled={loginLoading}
                className="h-12 w-full bg-blue-600 hover:bg-blue-700 shadow-lg"
              >
                {loginLoading ? "登入中..." : "認證並登入"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-[#F8FAFC] pb-20">
      {/* 頂部導覽列 */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Settings2 size={20} />
            </div>
            <h1 className="font-bold text-gray-900 hidden sm:block">Nexus Life 管理儀表板</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={activeTab === "configs" ? "default" : "ghost"}
              onClick={() => setActiveTab("configs")}
              className="h-9 gap-2 rounded-full px-4"
            >
              <QrCode size={16} /> 點位配置
            </Button>
            <Button 
              variant={activeTab === "stats" ? "default" : "ghost"}
              onClick={() => setActiveTab("stats")}
              className="h-9 gap-2 rounded-full px-4"
            >
              <BarChart3 size={16} /> 數據概覽
            </Button>
            <div className="w-px h-4 bg-gray-200 mx-2" />
            <Button variant="outline" size="icon" onClick={fetchAllData} disabled={loading} className="rounded-full">
              <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-gray-500 hover:text-red-600">
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8 animate-in fade-in duration-500">
        
        {/* 快速數據卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Users className="text-blue-600" />} label="總參與人數" value={stats?.totalUsers || 0} />
          <StatCard icon={<Trophy className="text-orange-600" />} label="今日抽獎數" value={stats?.todayDraws || 0} />
          <StatCard icon={<Ticket className="text-purple-600" />} label="加碼獎券池" value={stats?.totalTickets || 0} />
          <StatCard icon={<QrCode className="text-green-600" />} label="今日集印次數" value={stats?.todayStamps || 0} />
        </div>

        {activeTab === "configs" ? (
          <div className="grid gap-8 lg:grid-cols-3">
             <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-sm overflow-hidden">
                  <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
                    <h2 className="text-orange-800 font-bold flex items-center gap-2">
                      <RefreshCcw size={18} /> 每日輪替點位 (必檢項目)
                    </h2>
                    <span className="text-[10px] bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full font-bold">每日 00:00 自動更換</span>
                  </div>
                  <div className="p-6 grid gap-4">
                    {configs.filter(c => ["02", "05", "06"].includes(c.stamp_id)).map(config => (
                      <ConfigListItem key={config.uuid} config={config} onShowQR={() => setSelectedQR(config)} />
                    ))}
                  </div>
                </Card>

                <Card className="border-none shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b bg-gray-50">
                    <h2 className="text-gray-700 font-bold flex items-center gap-2">
                      <CheckCircle size={18} /> 固定與隱藏點位
                    </h2>
                  </div>
                  <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {configs.filter(c => !["02", "05", "06"].includes(c.stamp_id)).map(config => (
                      <button key={config.uuid} onClick={() => setSelectedQR(config)} className="group">
                        <div className="border border-gray-100 rounded-xl p-3 hover:border-blue-600 hover:bg-blue-50 transition-all text-left">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-gray-900">{config.stamp_id}</span>
                            <QrCode size={12} className="text-gray-300 group-hover:text-blue-600" />
                          </div>
                          <p className="text-[10px] text-gray-400 truncate uppercase">{config.area_name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
             </div>

             <div className="space-y-6">
               <Card className="border-none shadow-sm">
                 <CardHeader>
                   <CardTitle className="text-sm flex items-center gap-2"><Search size={16}/> 顧客進度查詢</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="flex gap-2">
                     <Input placeholder="輸入 LINE ID" className="h-10 bg-gray-50 border-gray-200" />
                     <Button variant="outline" className="shrink-0">查詢</Button>
                   </div>
                   <p className="text-[10px] text-gray-400">目前僅支援全 ID 精確匹配查詢</p>
                 </CardContent>
               </Card>

               <Card className="border-none shadow-sm bg-blue-900 text-white">
                 <CardContent className="p-6 space-y-4">
                   <h3 className="font-bold flex items-center gap-2"><InfoIcon size={18} /> 管理提示</h3>
                   <ul className="text-xs space-y-2 opacity-80 leading-relaxed list-disc pl-4">
                     <li>每日開店前請務必檢查 02, 05, 06 點位的實體 QR Code 是否正確。</li>
                     <li>若點位受損，請點擊對應按鈕重新列印。</li>
                     <li>加碼獎抽獎將於 5/13 20:00 準時由系統執行。</li>
                   </ul>
                 </CardContent>
               </Card>
             </div>
          </div>
        ) : (
          <div className="grid gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>今日獎項發放分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats?.distribution || {}).map(([rewardId, count]) => (
                    <div key={rewardId} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>獎項 {rewardId}</span>
                        <span className="font-bold text-blue-600">{count} 份</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                          style={{ width: `${Math.min(100, (count / 10) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                  {!stats?.distribution || Object.keys(stats.distribution).length === 0 && (
                    <div className="py-10 text-center text-gray-400 text-sm italic">今日尚未有人中獎</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* QR Code 預覽彈窗 (保留原本功能但樣式升級) */}
      {selectedQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-md p-4">
          <Card className="w-full max-w-md animate-in zoom-in-95 duration-200 border-none shadow-2xl overflow-hidden">
            <div className="bg-[#1A2B4A] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <QrCode size={20} />
                </div>
                <div>
                   <h3 className="font-bold leading-none">QR Code 列印預覽</h3>
                   <p className="text-[10px] opacity-70 mt-1">點位 {selectedQR.stamp_id} · {selectedQR.area_name}</p>
                </div>
              </div>
              <button onClick={() => setSelectedQR(null)} className="text-white/60 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 flex flex-col items-center gap-8 bg-white">
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-50 flex flex-col items-center gap-4">
                <img src={getQRUrl(selectedQR.uuid)} alt="QR" className="w-64 h-64" />
                <div className="text-center">
                   <p className="text-2xl font-black text-gray-900 tracking-widest">{selectedQR.stamp_id}</p>
                   <p className="text-[10px] text-gray-400 font-mono mt-1 uppercase">Variant {selectedQR.variant_id}</p>
                </div>
              </div>
              <div className="w-full space-y-3">
                <Button onClick={() => window.print()} className="w-full h-12 bg-[#1A2B4A] gap-2 rounded-xl text-lg font-bold shadow-lg shadow-blue-900/20">
                  <Printer size={20} /> 立即列印
                </Button>
                <Button variant="ghost" onClick={() => setSelectedQR(null)} className="w-full h-12 rounded-xl text-gray-500">
                  返回列表
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex flex-col items-center justify-center gap-2">
        <div className="p-2 rounded-xl bg-gray-50">{icon}</div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-gray-900 font-serif">{value.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}

function ConfigListItem({ config, onShowQR }: { config: StampConfig; onShowQR: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-orange-50 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-xl flex items-center justify-center text-xl font-black">
          {config.stamp_id}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-900">{config.area_name}</h4>
            <span className="text-[10px] font-bold bg-orange-200 text-orange-800 px-1.5 py-0.5 rounded">變體 {config.variant_id}</span>
          </div>
          <p className="text-[10px] text-gray-400 font-mono mt-1 truncate max-w-[200px]">UUID: {config.uuid}</p>
        </div>
      </div>
      <Button onClick={onShowQR} size="sm" className="bg-orange-600 hover:bg-orange-700 gap-2 rounded-full px-4 shadow-md shadow-orange-200">
        <QrCode size={14} /> 顯示 QR
      </Button>
    </div>
  );
}

function InfoIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  );
}
