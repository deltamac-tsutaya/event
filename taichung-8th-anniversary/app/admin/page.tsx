"use client";

import { useState, useEffect, useCallback } from "react";
import { type User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Lock, LogOut, RefreshCcw, Users, Trophy, Ticket, QrCode,
  BarChart3, ShieldCheck, Search, RotateCcw, Plus,
  ChevronDown, ChevronUp, Zap, Settings2, CheckCircle, AlertCircle,
  X, Printer
} from "lucide-react";

// ── 型別 ──────────────────────────────────────────────────────────────────
interface AdminUser {
  id: string;
  line_user_id: string;
  display_name: string;
  tickets_count: number;
  created_at: string;
  stamp_count: number;
  draw_count: number;
}

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

const STAMP_IDS = ["01","02","03","04","05","06","07","08","A","B","C"];

// ── 子元件：使用者列 ───────────────────────────────────────────────────────
function UserRow({ user, onRefresh }: { user: AdminUser; onRefresh: () => void }) {
  const [expanded, setExpanded]   = useState(false);
  const [busy, setBusy]           = useState<string | null>(null);
  const [message, setMessage]     = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const flash = (type: "ok" | "err", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const resetUser = async () => {
    if (!confirm(`確定重置「${user.display_name}」的所有紀錄？`)) return;
    setBusy("reset");
    const res = await fetch("/api/admin/user/reset", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    }).then(r => r.json());
    setBusy(null);
    res.success ? flash("ok", "重置成功") : flash("err", res.error);
    onRefresh();
  };

  const addStamp = async (stampId: string) => {
    setBusy(`add-${stampId}`);
    const res = await fetch("/api/admin/user/stamp", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, stampId }),
    }).then(r => r.json());
    setBusy(null);
    res.success ? flash("ok", `新增 ${stampId} 成功`) : flash("err", res.error === "already_stamped" ? `${stampId} 已存在` : res.error);
    onRefresh();
  };

  const removeStamp = async (stampId: string) => {
    setBusy(`del-${stampId}`);
    const res = await fetch("/api/admin/user/stamp", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, stampId }),
    }).then(r => r.json());
    setBusy(null);
    res.success ? flash("ok", `移除 ${stampId} 成功`) : flash("err", res.error);
    onRefresh();
  };

  const fillAllStamps = async () => {
    setBusy("fill");
    for (const id of ["01","02","03","04","05","06","07","08"]) {
      await fetch("/api/admin/user/stamp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, stampId: id }),
      });
    }
    setBusy(null);
    flash("ok", "已補齊 8 枚主印章");
    onRefresh();
  };

  const forceDraw = async () => {
    setBusy("draw");
    const res = await fetch("/api/admin/user/draw", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    }).then(r => r.json());
    setBusy(null);
    res.success ? flash("ok", `抽到：${res.reward.name}`) : flash("err", res.error);
    onRefresh();
  };

  const stampProgress = Math.min(8, user.stamp_count);

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
      <div
        className="flex items-center gap-3 p-4 cursor-pointer select-none hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1A2B4A] to-[#3B82C4] flex items-center justify-center text-white text-xs font-bold shrink-0">
          {user.display_name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 truncate">{user.display_name}</p>
          <p className="text-[10px] text-gray-400 font-mono truncate">{user.line_user_id}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 shrink-0">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
            {user.stamp_count} 印
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
            {user.draw_count} 抽
          </span>
          <span className="flex items-center gap-1">
            <Ticket size={10} className="text-yellow-500" />
            {user.tickets_count}
          </span>
        </div>
        {expanded ? <ChevronUp size={14} className="text-gray-400 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-4">
          {message && (
            <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${message.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
              {message.type === "ok" ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
              {message.text}
            </div>
          )}

          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">印章操作 ({stampProgress}/8)</p>
            <div className="flex flex-wrap gap-1.5">
              {STAMP_IDS.map(id => (
                <div key={id} className="flex flex-col items-center gap-0.5">
                  <button
                    onClick={() => addStamp(id)}
                    disabled={!!busy}
                    className="w-9 h-9 rounded-lg border-2 border-dashed border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 flex items-center justify-center text-xs font-bold text-gray-600 transition-all disabled:opacity-50"
                  >
                    {busy === `add-${id}` ? <RefreshCcw size={10} className="animate-spin" /> : `+${id}`}
                  </button>
                  <button
                    onClick={() => removeStamp(id)}
                    disabled={!!busy}
                    className="w-9 h-5 rounded border border-red-100 bg-white hover:bg-red-50 text-red-400 flex items-center justify-center text-[9px] transition-all disabled:opacity-50"
                  >
                    {busy === `del-${id}` ? "…" : "−"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm" variant="outline"
              onClick={fillAllStamps} disabled={!!busy}
              className="h-8 text-xs gap-1.5 rounded-full border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              {busy === "fill" ? <RefreshCcw size={10} className="animate-spin" /> : <Plus size={10} />}
              補齊 8 枚
            </Button>
            <Button
              size="sm" variant="outline"
              onClick={forceDraw} disabled={!!busy}
              className="h-8 text-xs gap-1.5 rounded-full border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              {busy === "draw" ? <RefreshCcw size={10} className="animate-spin" /> : <Zap size={10} />}
              強制抽獎
            </Button>
            <Button
              size="sm" variant="outline"
              onClick={resetUser} disabled={!!busy}
              className="h-8 text-xs gap-1.5 rounded-full border-red-200 text-red-600 hover:bg-red-50 ml-auto"
            >
              {busy === "reset" ? <RefreshCcw size={10} className="animate-spin" /> : <RotateCcw size={10} />}
              全部重置
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 主頁面 ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading]   = useState(true);
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [loginError, setLoginError]     = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab]   = useState<"users" | "configs" | "stats">("users");
  const [users, setUsers]           = useState<AdminUser[]>([]);
  const [configs, setConfigs]       = useState<StampConfig[]>([]);
  const [stats, setStats]           = useState<DashboardStats | null>(null);
  const [loading, setLoading]       = useState(false);
  const [search, setSearch]         = useState("");
  const [selectedQR, setSelectedQR] = useState<StampConfig | null>(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [uRes, cRes, sRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/configs"),
        fetch("/api/admin/stats"),
      ]);
      const [uData, cData, sData] = await Promise.all([uRes.json(), cRes.json(), sRes.json()]);
      if (uData.success) setUsers(uData.users);
      if (cData.success) setConfigs(cData.configs);
      if (sData.success) setStats(sData.stats);
    } catch (e) {
      console.error("Fetch failed", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setFirebaseUser(session?.user ?? null);
      setAuthLoading(false);
      if (session?.user) fetchAllData();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setFirebaseUser(session?.user ?? null);
      if (session?.user) fetchAllData();
      else setUsers([]);
    });

    return () => subscription.unsubscribe();
  }, [fetchAllData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(""); setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError("帳號或密碼錯誤");
    setLoginLoading(false);
  };

  const getQRUrl = (uuid: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${baseUrl}/stamp?id=${uuid}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(fullUrl)}`;
  };

  const filteredUsers = users.filter(u =>
    u.display_name.toLowerCase().includes(search.toLowerCase()) ||
    u.line_user_id.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading) return (
    <div className="flex min-h-svh items-center justify-center bg-[#0F172A]">
      <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!firebaseUser) return (
    <div className="flex min-h-svh items-center justify-center bg-[#0F172A] p-4">
      <Card className="w-full max-w-sm shadow-2xl border-none">
        <CardHeader className="text-center pt-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-50 text-purple-600">
            <ShieldCheck size={32} />
          </div>
          <CardTitle className="text-2xl font-bold">Nexus Admin</CardTitle>
          <p className="text-sm text-gray-400">開發者 / 測試管理後台</p>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="管理員 Email" value={email} autoFocus required
              className="h-12 bg-gray-50 border-gray-200" onChange={e => setEmail(e.target.value)} />
            <Input type="password" placeholder="密碼" value={password} required
              className="h-12 bg-gray-50 border-gray-200" onChange={e => setPassword(e.target.value)} />
            {loginError && <p className="text-sm text-red-500 text-center">{loginError}</p>}
            <Button type="submit" disabled={loginLoading} className="h-12 w-full bg-purple-600 hover:bg-purple-700 shadow-lg">
              {loginLoading ? "登入中..." : "進入管理後台"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-svh bg-[#F8FAFC] pb-20">
      <nav className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 text-white p-1.5 rounded-lg"><ShieldCheck size={20} /></div>
            <div className="hidden sm:block">
              <p className="font-bold text-gray-900 text-sm leading-tight">Nexus Admin</p>
              <p className="text-[10px] text-gray-400">{firebaseUser.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {(["users","configs","stats"] as const).map(tab => (
              <Button key={tab} variant={activeTab === tab ? "default" : "ghost"}
                onClick={() => setActiveTab(tab)} className="h-9 gap-1.5 rounded-full px-4 text-xs">
                {tab === "users"   && <><Users size={14}/>   使用者</>}
                {tab === "configs" && <><QrCode size={14}/>  QR 點位</>}
                {tab === "stats"   && <><BarChart3 size={14}/> 統計</>}
              </Button>
            ))}
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <Link href="/admin/print">
              <Button variant="outline" className="h-9 gap-1.5 rounded-full px-4 text-xs border-purple-200 text-purple-700 hover:bg-purple-50">
                <Printer size={14} /> 列印 QR
              </Button>
            </Link>
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <Button variant="outline" size="icon" onClick={fetchAllData} disabled={loading} className="rounded-full">
              <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => supabase.auth.signOut()} className="rounded-full text-gray-400 hover:text-red-500">
              <LogOut size={14} />
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Users className="text-blue-600"/>,   label: "總人數",   value: stats?.totalUsers ?? 0 },
            { icon: <QrCode className="text-green-600"/>, label: "今日集印", value: stats?.todayStamps ?? 0 },
            { icon: <Trophy className="text-orange-600"/>,label: "今日抽獎", value: stats?.todayDraws ?? 0 },
            { icon: <Ticket className="text-purple-600"/>,label: "獎券池",   value: stats?.totalTickets ?? 0 },
          ].map(({ icon, label, value }) => (
            <Card key={label} className="border-none shadow-sm">
              <CardContent className="p-5 flex flex-col items-center gap-2">
                <div className="p-2 rounded-xl bg-gray-50">{icon}</div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-black text-gray-900">{value.toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="搜尋名稱或 LINE ID…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-8 h-10 bg-white" />
              </div>
              <p className="text-xs text-gray-400">{filteredUsers.length} / {users.length} 位</p>
            </div>
            {filteredUsers.length === 0 && !loading && (
              <div className="py-16 text-center text-gray-400 text-sm">尚無使用者資料</div>
            )}
            <div className="space-y-2">
              {filteredUsers.map(u => <UserRow key={u.id} user={u} onRefresh={fetchAllData} />)}
            </div>
          </div>
        )}

        {activeTab === "configs" && (
          <div className="space-y-4">
            <Card className="border-none shadow-sm overflow-hidden">
              <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
                <h2 className="text-orange-800 font-bold flex items-center gap-2"><RefreshCcw size={16}/> 輪替點位</h2>
                <span className="text-[10px] bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full font-bold">每日自動更換</span>
              </div>
              <div className="p-6 grid gap-3">
                {configs.filter(c => ["02","05","06"].includes(c.stamp_id)).map(c => (
                  <div key={c.uuid} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-orange-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center font-black">{c.stamp_id}</div>
                      <div>
                        <p className="font-bold text-sm">{c.area_name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{c.uuid}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded">v{c.variant_id}</span>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedQR(c)} className="rounded-full h-8 w-8 p-0"><QrCode size={14}/></Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="border-none shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50"><h2 className="text-gray-700 font-bold flex items-center gap-2"><CheckCircle size={16}/> 固定點位</h2></div>
              <div className="p-6 grid grid-cols-3 sm:grid-cols-4 gap-2">
                {configs.filter(c => !["02","05","06"].includes(c.stamp_id)).map(c => (
                  <button key={c.uuid} onClick={() => setSelectedQR(c)} className="border border-gray-100 rounded-xl p-3 text-center hover:border-purple-400 hover:bg-purple-50 transition-all">
                    <p className="font-black text-lg text-[#1A2B4A]">{c.stamp_id}</p>
                    <p className="text-[9px] text-gray-400 truncate">{c.area_name}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "stats" && (
          <Card className="border-none shadow-sm">
            <CardHeader><CardTitle className="text-sm">今日獎項發放分布</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(stats?.distribution ?? {}).map(([id, count]) => (
                <div key={id} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium"><span>獎項 {id}</span><span className="font-bold text-purple-600">{count} 份</span></div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (count / 10) * 100)}%` }} />
                  </div>
                </div>
              ))}
              {Object.keys(stats?.distribution ?? {}).length === 0 && <p className="py-8 text-center text-gray-400 text-sm italic">今日尚無發放紀錄</p>}
            </CardContent>
          </Card>
        )}
      </main>

      {selectedQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-md p-4">
          <Card className="w-full max-w-md animate-in zoom-in-95 duration-200 border-none shadow-2xl overflow-hidden">
            <div className="bg-[#1A2B4A] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg"><QrCode size={20} /></div>
                <div><h3 className="font-bold leading-none">QR Code 列印預覽</h3><p className="text-[10px] opacity-70 mt-1">點位 {selectedQR.stamp_id} · {selectedQR.area_name}</p></div>
              </div>
              <button onClick={() => setSelectedQR(null)} className="text-white/60 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-8 flex flex-col items-center gap-8 bg-white">
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-50 flex flex-col items-center gap-4">
                <img src={getQRUrl(selectedQR.uuid)} alt="QR" className="w-64 h-64" />
                <div className="text-center"><p className="text-2xl font-black text-gray-900 tracking-widest">{selectedQR.stamp_id}</p><p className="text-[10px] text-gray-400 font-mono mt-1 uppercase">Variant {selectedQR.variant_id}</p></div>
              </div>
              <div className="w-full space-y-3">
                <Button onClick={() => window.print()} className="w-full h-12 bg-[#1A2B4A] gap-2 rounded-xl text-lg font-bold"><Printer size={20} /> 立即列印</Button>
                <Button variant="ghost" onClick={() => setSelectedQR(null)} className="w-full h-12 rounded-xl text-gray-500">返回列表</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
