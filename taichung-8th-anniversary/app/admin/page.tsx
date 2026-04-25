"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { type User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import QRCode from "react-qr-code";
import {
  LogOut, RefreshCcw, Users, Trophy, Ticket, QrCode,
  BarChart3, ShieldCheck, Search, RotateCcw, Plus,
  ChevronDown, ChevronUp, Zap, Settings2, CheckCircle, AlertCircle,
  X, Printer, Image, FileText, ChevronRight, Send, BadgeCheck,
} from "lucide-react";

// ── 型別 ──────────────────────────────────────────────────────────────────
interface AdminUser {
  id: string; line_user_id: string; display_name: string;
  tickets_count: number; created_at: string; stamp_count: number; draw_count: number;
}
interface StampConfig {
  uuid: string; stamp_id: string; variant_id: number; is_active: boolean; area_name?: string;
}
interface DashboardStats {
  totalUsers: number; todayStamps: number; todayDraws: number; totalTickets: number;
  distribution: Record<string, number>;
}

const STAMP_IDS = ["01","02","03","04","05","06","07","08","A","B","C"];

// ── 工具下拉選單 ───────────────────────────────────────────────────────────
function ToolsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const items = [
    { href: "/admin/redeem",        icon: <BadgeCheck size={15} />, label: "優惠券核銷站",       sub: "掃描 QR 核銷券" },
    { href: "/admin/print",         icon: <Printer size={15} />,    label: "列印 QR Code",       sub: "A4 批次列印" },
    { href: "/admin/print/stand",   icon: <FileText size={15} />,   label: "集印點立牌（文字）", sub: "10×15 cm × 11 張" },
    { href: "/admin/print/flyer",   icon: <FileText size={15} />,   label: "活動主視覺海報",     sub: "A4 直向" },
    { href: "/admin/print/counter", icon: <FileText size={15} />,   label: "櫃檯說明立卡",       sub: "A4 × 1 張" },
    { href: "/admin/print/table",   icon: <FileText size={15} />,   label: "餐廳桌卡",           sub: "A6 平放" },
    { href: "/admin/print/board",   icon: <FileText size={15} />,   label: "獎項板 ／ 樓層指引", sub: "A4 × 2 張" },
    { href: "/admin/manual",        icon: <FileText size={15} />,   label: "活動操作手冊",       sub: "員工操作指引" },
  ];

  return (
    <div ref={ref} className="relative">
      <Button
        variant="outline"
        onClick={() => setOpen(v => !v)}
        className="h-9 gap-1.5 rounded-full px-3 text-xs border-[#1A2B4A]/20 text-[#1A2B4A]"
      >
        <Settings2 size={14} />
        <span className="hidden sm:inline">工具</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>

      {open && (
        <div className="absolute right-0 top-11 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {items.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
                <span className="text-[#1A2B4A]/60 group-hover:text-[#1A2B4A]">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  <p className="text-[10px] text-gray-400">{item.sub}</p>
                </div>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-gray-500" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 抽獎紀錄（含核銷） ────────────────────────────────────────────────────────
interface DrawRecord {
  id: string; draw_date: string; reward_id: string;
  rewards: { name: string; tier: string; provider: string } | null;
  is_used: boolean; used_at: string | null; used_by: string | null;
}

function DrawHistory({ lineUserId }: { lineUserId: string }) {
  const [draws,    setDraws]    = useState<DrawRecord[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ id: string; type: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch(`/api/reward/history?lineUserId=${encodeURIComponent(lineUserId)}`);
    const data = await res.json();
    setDraws(data.history ?? []);
    setLoading(false);
  }, [lineUserId]);

  useEffect(() => { load(); }, [load]);

  const redeem = async (drawId: string) => {
    setRedeeming(drawId);
    try {
      const res  = await fetch("/api/admin/coupon/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drawId, staffName: "admin" }),
      });
      const data = await res.json();
      setMsg({
        id: drawId,
        type: data.success ? "ok" : "err",
        text: data.success ? "核銷成功"
          : data.error === "already_redeemed" ? "已核銷"
          : data.error === "expired"          ? "已失效"
          : data.error ?? "核銷失敗",
      });
      if (data.success) load();
    } catch {
      setMsg({ id: drawId, type: "err", text: "網路錯誤" });
    } finally {
      setRedeeming(null);
    }
  };

  if (loading) return <div className="py-3 text-center text-xs text-gray-400">載入中…</div>;
  if (!draws.length) return <div className="py-3 text-center text-xs text-gray-400">尚無抽獎紀錄</div>;

  const TIER_BADGE: Record<string, string> = {
    S: "bg-yellow-100 text-yellow-700 border-yellow-200",
    A: "bg-blue-100 text-blue-700 border-blue-200",
    B: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <div className="space-y-2">
      {draws.map(d => (
        <div key={d.id} className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 px-3 py-2">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${TIER_BADGE[d.rewards?.tier ?? "B"]}`}>
            {d.rewards?.tier ?? "?"}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-700 truncate">{d.rewards?.name ?? d.reward_id}</p>
            <p className="text-[10px] text-gray-400">{d.draw_date}</p>
          </div>
          {msg?.id === d.id && (
            <span className={`text-[10px] font-bold shrink-0 ${msg.type === "ok" ? "text-green-600" : "text-red-500"}`}>
              {msg.text}
            </span>
          )}
          {d.is_used ? (
            <span className="text-[9px] font-bold text-orange-500 border border-orange-200 bg-orange-50 rounded px-1.5 py-0.5 shrink-0">
              已核銷
            </span>
          ) : (
            <button
              onClick={() => redeem(d.id)}
              disabled={redeeming === d.id}
              className="text-[10px] font-bold text-emerald-700 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 rounded px-2 py-0.5 shrink-0 transition-colors disabled:opacity-50"
            >
              {redeeming === d.id ? "…" : "核銷"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ── 使用者列 ───────────────────────────────────────────────────────────────
function UserRow({ user, onRefresh }: { user: AdminUser; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy]         = useState<string | null>(null);
  const [message, setMessage]   = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const flash = (type: "ok" | "err", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const call = async (url: string, method: string, body: object) => {
    const r = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok && r.headers.get("content-type")?.includes("text/html")) {
      throw new Error(`HTTP ${r.status}`);
    }
    return r.json() as Promise<{ success: boolean; error?: string; reward?: { name: string } }>;
  };

  const resetUser = async () => {
    if (!confirm(`確定重置「${user.display_name}」的所有紀錄？`)) return;
    setBusy("reset");
    try {
      const res = await call("/api/admin/user/reset", "POST", { userId: user.id });
      res.success ? flash("ok", "重置成功") : flash("err", res.error ?? "重置失敗");
    } catch (e) {
      flash("err", e instanceof Error ? e.message : "網路錯誤");
    } finally {
      setBusy(null);
      onRefresh();
    }
  };

  const addStamp = async (stampId: string) => {
    setBusy(`add-${stampId}`);
    try {
      const res = await call("/api/admin/user/stamp", "POST", { userId: user.id, stampId });
      res.success
        ? flash("ok", `新增 ${stampId}`)
        : flash("err", res.error === "already_stamped" ? `${stampId} 已存在` : (res.error ?? "新增失敗"));
    } catch (e) {
      flash("err", e instanceof Error ? e.message : "網路錯誤");
    } finally {
      setBusy(null);
      onRefresh();
    }
  };

  const removeStamp = async (stampId: string) => {
    setBusy(`del-${stampId}`);
    try {
      const res = await call("/api/admin/user/stamp", "DELETE", { userId: user.id, stampId });
      res.success ? flash("ok", `移除 ${stampId}`) : flash("err", res.error ?? "移除失敗");
    } catch (e) {
      flash("err", e instanceof Error ? e.message : "網路錯誤");
    } finally {
      setBusy(null);
      onRefresh();
    }
  };

  const fillAllStamps = async () => {
    setBusy("fill");
    try {
      let added = 0;
      for (const id of ["01","02","03","04","05","06","07","08"]) {
        const res = await call("/api/admin/user/stamp", "POST", { userId: user.id, stampId: id });
        if (res.success) added++;
      }
      flash("ok", added > 0 ? `已補 ${added} 枚印章` : "8 枚印章已全部存在");
    } catch (e) {
      flash("err", e instanceof Error ? e.message : "網路錯誤");
    } finally {
      setBusy(null);
      onRefresh();
    }
  };

  const forceDraw = async () => {
    setBusy("draw");
    try {
      const res = await call("/api/admin/user/draw", "POST", { userId: user.id });
      res.success ? flash("ok", `抽到：${res.reward?.name}`) : flash("err", res.error ?? "抽獎失敗");
    } catch (e) {
      flash("err", e instanceof Error ? e.message : "網路錯誤");
    } finally {
      setBusy(null);
      onRefresh();
    }
  };

  const pushCoupon = async () => {
    if (user.draw_count === 0) { flash("err", "此用戶尚無抽獎紀錄"); return; }
    setBusy("push");
    try {
      const res = await call("/api/admin/user/push-coupon", "POST", { userId: user.id });
      res.success ? flash("ok", "LINE 訊息已發送") : flash("err", res.error ?? "發送失敗");
    } catch (e) {
      flash("err", e instanceof Error ? e.message : "網路錯誤");
    } finally {
      setBusy(null);
    }
  };

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
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500 shrink-0">
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
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              印章操作 ({Math.min(8, user.stamp_count)}/8)
            </p>
            <div className="overflow-x-auto -mx-1 px-1">
              <div className="flex gap-1.5 w-max">
                {STAMP_IDS.map(id => (
                  <div key={id} className="flex flex-col items-center gap-0.5">
                    <button
                      onClick={() => addStamp(id)} disabled={!!busy}
                      className="w-9 h-9 rounded-lg border-2 border-dashed border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 flex items-center justify-center text-xs font-bold text-gray-600 transition-all disabled:opacity-50"
                    >
                      {busy === `add-${id}` ? <RefreshCcw size={10} className="animate-spin" /> : `+${id}`}
                    </button>
                    <button
                      onClick={() => removeStamp(id)} disabled={!!busy}
                      className="w-9 h-5 rounded border border-red-100 bg-white hover:bg-red-50 text-red-400 flex items-center justify-center text-[9px] transition-all disabled:opacity-50"
                    >
                      {busy === `del-${id}` ? "…" : "−"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={fillAllStamps} disabled={!!busy}
              className="h-8 text-xs gap-1.5 rounded-full border-blue-200 text-blue-700 hover:bg-blue-50">
              {busy === "fill" ? <RefreshCcw size={10} className="animate-spin" /> : <Plus size={10} />} 補齊 8 枚
            </Button>
            <Button size="sm" variant="outline" onClick={forceDraw} disabled={!!busy}
              className="h-8 text-xs gap-1.5 rounded-full border-purple-200 text-purple-700 hover:bg-purple-50">
              {busy === "draw" ? <RefreshCcw size={10} className="animate-spin" /> : <Zap size={10} />} 強制抽獎
            </Button>
            <Button size="sm" variant="outline" onClick={pushCoupon} disabled={!!busy}
              className="h-8 text-xs gap-1.5 rounded-full border-green-200 text-green-700 hover:bg-green-50">
              {busy === "push" ? <RefreshCcw size={10} className="animate-spin" /> : <Send size={10} />} 發送優惠券
            </Button>
            <Button size="sm" variant="outline" onClick={resetUser} disabled={!!busy}
              className="h-8 text-xs gap-1.5 rounded-full border-red-200 text-red-600 hover:bg-red-50 ml-auto">
              {busy === "reset" ? <RefreshCcw size={10} className="animate-spin" /> : <RotateCcw size={10} />} 全部重置
            </Button>
          </div>

          {user.draw_count > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                抽獎紀錄 · 核銷 ({user.draw_count} 筆)
              </p>
              <DrawHistory lineUserId={user.line_user_id} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── QR 預覽 Modal ──────────────────────────────────────────────────────────
function QRModal({ config, onClose }: { config: StampConfig; onClose: () => void }) {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${base}/stamp?id=${config.uuid}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/80 backdrop-blur-md p-0 sm:p-4">
      <Card className="w-full sm:max-w-sm animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 border-none shadow-2xl overflow-hidden rounded-t-3xl sm:rounded-3xl">
        <div className="bg-[#1A2B4A] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <p className="font-bold text-sm leading-tight">點位 {config.stamp_id}</p>
            <p className="text-[10px] opacity-60 mt-0.5">{config.area_name}</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 flex flex-col items-center gap-5 bg-white">
          <div className="p-4 bg-white rounded-2xl shadow-inner border border-gray-100">
            <QRCode value={url} size={200} fgColor="#1A2B4A" bgColor="#FFFFFF" level="M" viewBox="0 0 200 200"
              style={{ width: 180, height: 180, display: "block" }} />
          </div>
          <p className="text-[9px] font-mono text-gray-300 text-center break-all max-w-full px-2">{config.uuid}</p>
          <div className="w-full space-y-2">
            <Link href="/admin/print" className="block">
              <Button className="w-full h-11 bg-[#1A2B4A] gap-2 rounded-xl font-bold">
                <Printer size={16} /> 前往批次列印
              </Button>
            </Link>
            <Button variant="ghost" onClick={onClose} className="w-full h-11 rounded-xl text-gray-400">
              關閉
            </Button>
          </div>
        </div>
      </Card>
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
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      setFirebaseUser(user);
      setAuthLoading(false);
      if (user) fetchAllData();
      else setUsers([]);
    });
    return () => unsubscribe();
  }, [fetchAllData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(""); setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    } catch {
      setLoginError("帳號或密碼錯誤");
    }
    setLoginLoading(false);
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

  const TAB_ITEMS = [
    { id: "users"   as const, icon: <Users size={18} />,     label: "使用者" },
    { id: "configs" as const, icon: <QrCode size={18} />,    label: "QR 點位" },
    { id: "stats"   as const, icon: <BarChart3 size={18} />, label: "統計" },
  ];

  return (
    <div className="min-h-svh bg-[#F8FAFC] pb-24 sm:pb-10">

      {/* ── 頂部導覽列 ── */}
      <nav className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between gap-2">

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="bg-purple-600 text-white p-1.5 rounded-lg">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-none">Nexus Admin</p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5 hidden sm:block">{firebaseUser.email}</p>
            </div>
          </div>

          {/* 中：分頁（桌機） */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-full">
            {TAB_ITEMS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === t.id ? "bg-white text-[#1A2B4A] shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <ToolsMenu />
            <Button variant="ghost" size="icon" onClick={fetchAllData} disabled={loading} className="rounded-full w-9 h-9">
              <RefreshCcw size={15} className={loading ? "animate-spin" : ""} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => signOut(getFirebaseAuth())}
              className="rounded-full w-9 h-9 text-gray-400 hover:text-red-500">
              <LogOut size={15} />
            </Button>
          </div>
        </div>
      </nav>

      {/* ── 主內容 ── */}
      <main className="mx-auto max-w-5xl px-4 py-5 sm:py-8 space-y-5">

        {/* 統計卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <Users size={18} className="text-blue-600" />,    label: "總人數",   value: stats?.totalUsers ?? 0 },
            { icon: <QrCode size={18} className="text-green-600" />,  label: "今日集印", value: stats?.todayStamps ?? 0 },
            { icon: <Trophy size={18} className="text-orange-500" />, label: "今日抽獎", value: stats?.todayDraws ?? 0 },
            { icon: <Ticket size={18} className="text-purple-600" />, label: "獎券池",   value: stats?.totalTickets ?? 0 },
          ].map(({ icon, label, value }) => (
            <Card key={label} className="border-none shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-50 shrink-0">{icon}</div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-xl font-black text-gray-900 leading-none mt-0.5">{value.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 使用者 */}
        {activeTab === "users" && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="搜尋名稱或 LINE ID…" value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-8 h-10 bg-white rounded-full" />
              </div>
              <p className="text-xs text-gray-400 shrink-0">{filteredUsers.length} / {users.length}</p>
            </div>
            {filteredUsers.length === 0 && !loading ? (
              <div className="py-16 text-center text-gray-400 text-sm">尚無使用者資料</div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map(u => <UserRow key={u.id} user={u} onRefresh={fetchAllData} />)}
              </div>
            )}
          </div>
        )}

        {/* QR 點位 */}
        {activeTab === "configs" && (
          <div className="space-y-4">
            <Card className="border-none shadow-sm overflow-hidden">
              <div className="bg-orange-50 px-5 py-3.5 border-b border-orange-100 flex items-center justify-between">
                <h2 className="text-orange-800 font-bold text-sm flex items-center gap-2">
                  <RefreshCcw size={14} /> 輪替點位
                </h2>
                <span className="text-[10px] bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full font-bold">每日自動更換</span>
              </div>
              <div className="p-4 space-y-2">
                {configs.filter(c => ["02","05","06"].includes(c.stamp_id)).map(c => (
                  <div key={c.uuid} className="flex items-center justify-between p-3.5 border border-gray-100 rounded-xl hover:bg-orange-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center font-black text-sm shrink-0">{c.stamp_id}</div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{c.area_name}</p>
                        <p className="text-[10px] text-gray-400 font-mono truncate">{c.uuid}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded hidden sm:block">v{c.variant_id}</span>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedQR(c)} className="rounded-full h-8 w-8 p-0">
                        <QrCode size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b bg-gray-50 flex items-center gap-2">
                <CheckCircle size={14} className="text-gray-500" />
                <h2 className="text-gray-700 font-bold text-sm">固定點位</h2>
              </div>
              <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {configs.filter(c => !["02","05","06"].includes(c.stamp_id)).map(c => (
                  <button key={c.uuid} onClick={() => setSelectedQR(c)}
                    className="border border-gray-100 rounded-xl p-3 text-center hover:border-purple-400 hover:bg-purple-50 transition-all active:scale-95">
                    <p className="font-black text-base text-[#1A2B4A]">{c.stamp_id}</p>
                    <p className="text-[9px] text-gray-400 truncate mt-0.5">{c.area_name}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* 統計 */}
        {activeTab === "stats" && (
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-700">今日獎項發放分布</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(stats?.distribution ?? {}).map(([id, count]) => (
                <div key={id} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-600">獎項 {id}</span>
                    <span className="font-bold text-purple-600">{count} 份</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, (count / 10) * 100)}%` }} />
                  </div>
                </div>
              ))}
              {Object.keys(stats?.distribution ?? {}).length === 0 && (
                <p className="py-8 text-center text-gray-400 text-sm italic">今日尚無發放紀錄</p>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* ── 手機版底部 Tab Bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg">
        <div className="flex">
          {TAB_ITEMS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`relative flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
                activeTab === t.id ? "text-[#1A2B4A]" : "text-gray-400"
              }`}>
              {t.icon}
              <span className="text-[10px] font-semibold">{t.label}</span>
              {activeTab === t.id && (
                <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-[#1A2B4A]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {selectedQR && <QRModal config={selectedQR} onClose={() => setSelectedQR(null)} />}
    </div>
  );
}
