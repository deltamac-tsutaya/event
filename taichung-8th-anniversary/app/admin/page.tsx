"use client";

import { useState, useEffect, useCallback } from "react";
import { type User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  LogOut, RefreshCcw, Users, Trophy, Ticket, QrCode,
  ShieldCheck, Percent, CheckCircle, FileText, Send,
  Layers, ScrollText, KeyRound, BadgeCheck, Radio, SlidersHorizontal,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number; todayStamps: number; todayDraws: number; totalTickets: number;
  distribution: Record<string, number>;
}

function NavCard({
  href, icon, label, sub, color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  sub: string;
  color: string;
}) {
  return (
    <Link href={href} className="block group">
      <div className={`bg-white rounded-2xl border shadow-sm px-4 py-3.5 flex items-center gap-3.5 hover:shadow-md transition-all ${color}`}>
        <div className="p-2.5 rounded-xl shrink-0 transition-colors [&]:group-hover:opacity-90">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm text-gray-800 leading-tight">{label}</p>
          <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{sub}</p>
        </div>
      </div>
    </Link>
  );
}

export default function AdminPage() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading]   = useState(true);
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [loginError, setLoginError]     = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [stats, setStats]       = useState<DashboardStats | null>(null);
  const [loading, setLoading]   = useState(false);
  const [recentLogs, setRecentLogs] = useState<Array<{
    id: string; log_time: string; event_type: string; display_name: string | null; detail: Record<string, unknown>;
  }>>([]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) setStats(data.stats);
      fetch("/api/admin/logs?page=1")
        .then(r => r.json())
        .then(d => { if (d.success) setRecentLogs((d.logs ?? []).slice(0, 6)); })
        .catch(() => {});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), (user) => {
      setFirebaseUser(user);
      setAuthLoading(false);
      if (user) fetchDashboard();
    });
    return () => unsub();
  }, [fetchDashboard]);

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

  const statCards = [
    { icon: <Users size={18} className="text-blue-600" />,   label: "總人數",   text: (stats?.totalUsers  ?? 0).toLocaleString(), bg: "bg-blue-50" },
    { icon: <QrCode size={18} className="text-green-600" />, label: "今日集印", text: (stats?.todayStamps ?? 0).toLocaleString(), bg: "bg-green-50" },
    { icon: <Trophy size={18} className="text-orange-500" />, label: "今日抽獎", text: (stats?.todayDraws  ?? 0).toLocaleString(), bg: "bg-orange-50" },
    { icon: <Percent size={18} className="text-amber-500" />, label: "∞ 中獎率", text: stats?.totalTickets ? (8 / stats.totalTickets * 100).toFixed(1) + "%" : "—", bg: "bg-amber-50" },
  ];

  const EVENT_LABEL: Record<string, string> = {
    stamp_collected:    "集章",
    draw_completed:     "抽獎",
    coupon_redeemed:    "核銷",
    admin_stamp_add:    "補章",
    admin_stamp_delete: "刪章",
    admin_reset_daily:  "重置今日",
    admin_reset_full:   "全部重置",
  };
  const BADGE_COLOR: Record<string, string> = {
    stamp: "bg-blue-50 text-blue-600",
    draw:  "bg-amber-50 text-amber-700",
    coupon_redeemed: "bg-green-50 text-green-700",
  };
  const badgeFor = (t: string) =>
    t.startsWith("stamp") ? BADGE_COLOR.stamp :
    t.startsWith("draw")  ? BADGE_COLOR.draw  :
    t === "coupon_redeemed" ? BADGE_COLOR.coupon_redeemed :
    "bg-orange-50 text-orange-700";

  return (
    <div className="min-h-svh bg-[#F8FAFC]">

      {/* ── 頂部導覽列 ── */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
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
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={fetchDashboard} disabled={loading} className="rounded-full w-9 h-9">
              <RefreshCcw size={15} className={loading ? "animate-spin" : ""} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => signOut(getFirebaseAuth())}
              className="rounded-full w-9 h-9 text-gray-400 hover:text-red-500">
              <LogOut size={15} />
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-5 sm:py-8 space-y-6">

        {/* ── 統計卡片 ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statCards.map(({ icon, label, text, bg }) => (
            <Card key={label} className="border-none shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-xl ${bg} shrink-0`}>{icon}</div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-xl font-black text-gray-900 leading-none mt-0.5">{text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── 活動管理 ── */}
        <section className="space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">活動管理</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <NavCard href="/admin/users"
              icon={<Users size={20} className="text-blue-600" />}
              label="使用者" sub="查詢 · 印章 · 抽獎紀錄"
              color="border-blue-100 hover:border-blue-300" />
            <NavCard href="/admin/configs"
              icon={<QrCode size={20} className="text-violet-600" />}
              label="QR 點位" sub="輪替 · 固定點位管理"
              color="border-violet-100 hover:border-violet-300" />
            <NavCard href="/admin/redeem"
              icon={<BadgeCheck size={20} className="text-emerald-600" />}
              label="前往核銷" sub="現場核銷優惠券"
              color="border-emerald-100 hover:border-emerald-300" />
            <NavCard href="/admin/dispatch"
              icon={<Send size={20} className="text-sky-600" />}
              label="派券管理" sub="補發 LINE 優惠券"
              color="border-sky-100 hover:border-sky-300" />
          </div>
        </section>

        {/* ── 通訊 ── */}
        <section className="space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">通訊</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <NavCard href="/admin/broadcast"
              icon={<Radio size={20} className="text-purple-600" />}
              label="訊息傳送中心" sub="廣播 · 預約排程發送"
              color="border-purple-100 hover:border-purple-300" />
          </div>
        </section>

        {/* ── 報表 & 工具 ── */}
        <section className="space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">報表 &amp; 工具</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <NavCard href="/admin/logs"
              icon={<ScrollText size={20} className="text-emerald-600" />}
              label="活動日誌" sub="集章 · 抽獎 · 核銷紀錄"
              color="border-emerald-100 hover:border-emerald-200" />
            <NavCard href="/admin/rewards"
              icon={<SlidersHorizontal size={20} className="text-[#C9A84C]" />}
              label="獎項機率" sub="權重 · 每日上限調整"
              color="border-[#C9A84C]/30 hover:border-[#C9A84C]/60" />
            <NavCard href="/admin/print/materials"
              icon={<Layers size={20} className="text-[#C9A84C]" />}
              label="文宣 &amp; 列印" sub="設計稿 · QR 批次列印"
              color="border-[#C9A84C]/20 hover:border-[#C9A84C]/50" />
            <NavCard href="/admin/manual"
              icon={<FileText size={20} className="text-gray-600" />}
              label="活動操作手冊" sub="員工操作指引"
              color="border-gray-100 hover:border-gray-300" />
          </div>
        </section>

        {/* ── 系統 ── */}
        <section className="space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">系統</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <NavCard href="/admin/settings"
              icon={<KeyRound size={20} className="text-gray-600" />}
              label="系統設定" sub="核銷 PIN · 進階設定"
              color="border-gray-100 hover:border-gray-300" />
          </div>
        </section>

        {/* ── 最近活動 ── */}
        {recentLogs.length > 0 && (
          <section className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">最近活動</p>
              <Link href="/admin/logs" className="text-[10px] text-gray-400 hover:text-gray-600">查看完整日誌 →</Link>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
              {recentLogs.map(log => {
                const time   = new Date(log.log_time).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit", hour12: false });
                const label  = EVENT_LABEL[log.event_type] ?? log.event_type;
                const badge  = badgeFor(log.event_type);
                const detail =
                  log.event_type === "stamp_collected"  ? `印章 ${log.detail.stamp_id ?? ""}` :
                  log.event_type === "draw_completed"   ? String(log.detail.reward_name ?? log.detail.reward_id ?? "") :
                  log.event_type === "coupon_redeemed"  ? String(log.detail.reward_name ?? "") : "";
                return (
                  <div key={log.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${badge}`}>{label}</span>
                    <p className="flex-1 text-xs text-gray-700 truncate">
                      {log.display_name ?? "—"}{detail ? ` · ${detail}` : ""}
                    </p>
                    <span className="text-[10px] text-gray-400 font-mono shrink-0">{time}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
