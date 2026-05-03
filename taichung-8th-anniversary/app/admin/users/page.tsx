"use client";

import { useState, useEffect, useCallback } from "react";
import { type User, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirebaseAuth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";
import {
  ChevronLeft, RefreshCcw, Search, Lock, Ticket, ChevronRight,
  Zap, CheckCircle, AlertCircle, Send, CalendarX, RotateCcw, Plus, Minus,
} from "lucide-react";

interface AdminUser {
  id: string; line_user_id: string; display_name: string;
  tickets_count: number; created_at: string; stamp_count: number; draw_count: number;
}

interface DrawRecord {
  id: string; draw_date: string; reward_id: string;
  rewards: { name: string; tier: string; provider: string } | null;
  is_used: boolean; used_at: string | null; used_by: string | null;
}

const STAMP_IDS = ["01","02","03","04","05","06","07","08","A","B","C"];

function maskName(name: string) {
  if (!name) return "—";
  const chars = [...name];
  if (chars.length === 1) return chars[0];
  return chars[0] + "○".repeat(chars.length - 2) + chars[chars.length - 1];
}

function DrawHistory({ lineUserId }: { lineUserId: string }) {
  const [draws,     setDraws]     = useState<DrawRecord[]>([]);
  const [loading,   setLoading]   = useState(true);
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
        body: JSON.stringify({ drawId, staffName: "admin", adminOverride: true }),
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

function StampPanel({ user, onRefresh, verified, onVerify }: {
  user: AdminUser; onRefresh: () => void; verified: boolean; onVerify: () => void;
}) {
  const [busy, setBusy]           = useState<string | null>(null);
  const [message, setMessage]     = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pin, setPin]             = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyErr, setVerifyErr] = useState("");
  const [tickets, setTickets]     = useState(user.tickets_count);

  const flash = (type: "ok" | "err", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };
  const call = async (url: string, method: string, body: object) => {
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok && r.headers.get("content-type")?.includes("text/html")) throw new Error(`HTTP ${r.status}`);
    return r.json() as Promise<{ success: boolean; error?: string; reward?: { name: string }; tickets_count?: number }>;
  };

  const handleVerify = async () => {
    setVerifying(true); setVerifyErr("");
    try {
      const res  = await fetch("/api/admin/rewards/verify", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.success) { onVerify(); }
      else { setVerifyErr("授權碼錯誤"); }
    } catch { setVerifyErr("網路錯誤"); }
    setVerifying(false);
  };

  const resetUser = async () => {
    if (!confirm(`確定重置「${user.display_name}」的所有紀錄？`)) return;
    setBusy("reset");
    try {
      const res = await call("/api/admin/user/reset", "POST", { userId: user.id });
      res.success ? flash("ok", "重置成功") : flash("err", res.error ?? "重置失敗");
    } catch (e) { flash("err", e instanceof Error ? e.message : "網路錯誤"); }
    finally { setBusy(null); onRefresh(); }
  };
  const resetTodayStamps = async () => {
    if (!confirm(`確定清除今日印章？`)) return;
    setBusy("reset-today");
    try {
      const res = await call("/api/admin/user/reset-today-stamps", "POST", { userId: user.id });
      res.success ? flash("ok", "今日印章已清除") : flash("err", res.error ?? "重置失敗");
    } catch (e) { flash("err", e instanceof Error ? e.message : "網路錯誤"); }
    finally { setBusy(null); onRefresh(); }
  };
  const addStamp = async (stampId: string) => {
    setBusy(`add-${stampId}`);
    try {
      const res = await call("/api/admin/user/stamp", "POST", { userId: user.id, stampId });
      res.success
        ? flash("ok", `新增 ${stampId}`)
        : flash("err", res.error === "already_stamped" ? `${stampId} 已存在` : (res.error ?? "新增失敗"));
    } catch (e) { flash("err", e instanceof Error ? e.message : "網路錯誤"); }
    finally { setBusy(null); onRefresh(); }
  };
  const removeStamp = async (stampId: string) => {
    setBusy(`del-${stampId}`);
    try {
      const res = await call("/api/admin/user/stamp", "DELETE", { userId: user.id, stampId });
      res.success ? flash("ok", `移除 ${stampId}`) : flash("err", res.error ?? "移除失敗");
    } catch (e) { flash("err", e instanceof Error ? e.message : "網路錯誤"); }
    finally { setBusy(null); onRefresh(); }
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
    } catch (e) { flash("err", e instanceof Error ? e.message : "網路錯誤"); }
    finally { setBusy(null); onRefresh(); }
  };
  const forceDraw = async () => {
    setBusy("draw");
    try {
      const res = await call("/api/admin/user/draw", "POST", { userId: user.id });
      res.success ? flash("ok", `抽到：${res.reward?.name}`) : flash("err", res.error ?? "抽獎失敗");
    } catch (e) { flash("err", e instanceof Error ? e.message : "網路錯誤"); }
    finally { setBusy(null); onRefresh(); }
  };
  const pushCoupon = async () => {
    if (user.draw_count === 0) { flash("err", "此用戶尚無抽獎紀錄"); return; }
    setBusy("push");
    try {
      const res = await call("/api/admin/user/push-coupon", "POST", { userId: user.id });
      res.success ? flash("ok", "LINE 訊息已發送") : flash("err", res.error ?? "發送失敗");
    } catch (e) { flash("err", e instanceof Error ? e.message : "網路錯誤"); }
    finally { setBusy(null); }
  };
  const adjustTickets = async (delta: number) => {
    const prev = tickets;
    const next = Math.max(0, tickets + delta);
    if (next === prev) return;
    setTickets(next);
    try {
      const res = await call("/api/admin/user/tickets", "PATCH", { userId: user.id, delta });
      if (res.success && res.tickets_count !== undefined) setTickets(res.tickets_count);
      else setTickets(prev);
    } catch { setTickets(prev); }
  };

  if (!verified) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-center py-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3">
            <Lock size={20} className="text-purple-600" />
          </div>
          <p className="font-bold text-gray-800 text-sm">進階授權</p>
          <p className="text-xs text-gray-400 mt-1">此操作需要更高級別的授權碼</p>
        </div>
        <input type="password" value={pin} onChange={e => { setPin(e.target.value); setVerifyErr(""); }}
          onKeyDown={e => e.key === "Enter" && pin && handleVerify()}
          placeholder="輸入授權碼"
          className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none focus:border-[#1A2B4A]" />
        {verifyErr && <p className="text-xs text-red-500">{verifyErr}</p>}
        <Button onClick={handleVerify} disabled={verifying || !pin}
          className="w-full h-10 bg-[#1A2B4A] text-white rounded-xl text-sm font-bold gap-2">
          {verifying ? <RefreshCcw size={13} className="animate-spin" /> : <Lock size={13} />} 確認授權
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
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
                <button onClick={() => addStamp(id)} disabled={!!busy}
                  className="w-9 h-9 rounded-lg border-2 border-dashed border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 flex items-center justify-center text-xs font-bold text-gray-600 transition-all disabled:opacity-50">
                  {busy === `add-${id}` ? <RefreshCcw size={10} className="animate-spin" /> : `+${id}`}
                </button>
                <button onClick={() => removeStamp(id)} disabled={!!busy}
                  className="w-9 h-5 rounded border border-red-100 bg-white hover:bg-red-50 text-red-400 flex items-center justify-center text-[9px] transition-all disabled:opacity-50">
                  {busy === `del-${id}` ? "…" : <Minus size={8} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
        <div>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">∞ Infinity 抽獎券</p>
          <p className="text-lg font-black text-indigo-700 leading-none mt-0.5">{tickets}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => adjustTickets(-1)} disabled={tickets <= 0}
            className="w-8 h-8 rounded-full border border-indigo-200 bg-white text-indigo-600 flex items-center justify-center hover:bg-indigo-100 disabled:opacity-40 transition-colors">
            <Minus size={14} />
          </button>
          <button onClick={() => adjustTickets(1)}
            className="w-8 h-8 rounded-full border border-indigo-200 bg-white text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors">
            <Plus size={14} />
          </button>
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
        <Button size="sm" variant="outline" onClick={resetTodayStamps} disabled={!!busy}
          className="h-8 text-xs gap-1.5 rounded-full border-amber-200 text-amber-700 hover:bg-amber-50">
          {busy === "reset-today" ? <RefreshCcw size={10} className="animate-spin" /> : <CalendarX size={10} />} 重置今日印章
        </Button>
        <Button size="sm" variant="outline" onClick={resetUser} disabled={!!busy}
          className="h-8 text-xs gap-1.5 rounded-full border-red-200 text-red-600 hover:bg-red-50 ml-auto">
          {busy === "reset" ? <RefreshCcw size={10} className="animate-spin" /> : <RotateCcw size={10} />} 全部重置
        </Button>
      </div>
    </div>
  );
}

function UserSheet({ user, open, onOpenChange, onRefresh, superVerified, onSuperVerify }: {
  user: AdminUser | null; open: boolean; onOpenChange: (v: boolean) => void;
  onRefresh: () => void; superVerified: boolean; onSuperVerify: () => void;
}) {
  const [tab, setTab] = useState<"overview" | "stamps">("overview");
  if (!user) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-0 flex flex-col w-full sm:max-w-md gap-0">
        <SheetHeader className="shrink-0 px-5 pt-5 pb-3 border-b">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1A2B4A] to-[#3B82C4] flex items-center justify-center text-white font-bold text-base shrink-0">
              {user.display_name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-sm font-bold leading-tight text-left">
                {superVerified ? user.display_name : maskName(user.display_name)}
              </SheetTitle>
              <p className="text-[10px] text-gray-400 font-mono truncate">{user.line_user_id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" /> {user.stamp_count} 印
            </span>
            <span className="flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" /> {user.draw_count} 抽
            </span>
            <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
              <Ticket size={9} /> {user.tickets_count}
            </span>
          </div>
        </SheetHeader>

        <div className="shrink-0 flex border-b">
          <button onClick={() => setTab("overview")}
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${tab === "overview" ? "text-[#1A2B4A] border-b-2 border-[#1A2B4A]" : "text-gray-400 hover:text-gray-600"}`}>
            概況
          </button>
          <button onClick={() => setTab("stamps")}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${tab === "stamps" ? "text-[#1A2B4A] border-b-2 border-[#1A2B4A]" : "text-gray-400 hover:text-gray-600"}`}>
            印章管理 <Lock size={9} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === "overview" ? (
            <div className="p-4">
              {user.draw_count > 0 ? (
                <DrawHistory lineUserId={user.line_user_id} />
              ) : (
                <p className="py-12 text-center text-sm text-gray-400 italic">尚無抽獎紀錄</p>
              )}
            </div>
          ) : (
            <StampPanel user={user} onRefresh={onRefresh} verified={superVerified} onVerify={onSuperVerify} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function UserRow({ user, onRefresh, superVerified, onSuperVerify }: {
  user: AdminUser; onRefresh: () => void; superVerified: boolean; onSuperVerify: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3.5 border border-gray-100 rounded-2xl bg-white hover:shadow-sm transition-shadow text-left">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1A2B4A] to-[#3B82C4] flex items-center justify-center text-white text-xs font-bold shrink-0">
          {user.display_name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 truncate">
            {superVerified ? user.display_name : maskName(user.display_name)}
          </p>
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
        <ChevronRight size={14} className="text-gray-300 shrink-0" />
      </button>
      <UserSheet user={user} open={open} onOpenChange={setOpen}
        onRefresh={onRefresh} superVerified={superVerified} onSuperVerify={onSuperVerify} />
    </>
  );
}

export default function UsersPage() {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading]   = useState(true);
  const [users, setUsers]               = useState<AdminUser[]>([]);
  const [loading, setLoading]           = useState(false);
  const [search, setSearch]             = useState("");
  const [superVerified, setSuperVerified] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem("super_admin_verified") === "1"
  );

  const handleSuperVerify = () => {
    sessionStorage.setItem("super_admin_verified", "1");
    setSuperVerified(true);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), (user) => {
      if (!user) router.push("/admin");
      else setFirebaseUser(user);
      setAuthLoading(false);
    });
    return () => unsub();
  }, [router]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (firebaseUser) loadUsers();
  }, [firebaseUser, loadUsers]);

  const filteredUsers = users.filter(u =>
    u.display_name.toLowerCase().includes(search.toLowerCase()) ||
    u.line_user_id.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading) return (
    <div className="flex min-h-svh items-center justify-center bg-[#0F172A]">
      <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link href="/admin" className="text-gray-400 hover:text-gray-700 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="font-bold text-sm text-gray-800 flex-1">使用者管理</h1>
        <button onClick={loadUsers} disabled={loading} className="text-gray-400 hover:text-gray-600 transition-colors">
          <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5 space-y-3">
        <div className="flex items-center gap-3">
          {superVerified ? (
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input placeholder="搜尋名稱或 LINE ID…" value={search} onChange={e => setSearch(e.target.value)}
                className="pl-8 h-10 bg-white rounded-full" />
            </div>
          ) : (
            <div className="flex-1 flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-3 h-10">
              <Lock size={13} className="text-purple-400 shrink-0" />
              <p className="text-xs text-purple-400">進階解鎖後可搜尋全名</p>
            </div>
          )}
          <p className="text-xs text-gray-400 shrink-0">{filteredUsers.length} / {users.length}</p>
        </div>

        {filteredUsers.length === 0 && !loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">尚無使用者資料</div>
        ) : (
          <div className="space-y-2">
            {filteredUsers.map(u => (
              <UserRow key={u.id} user={u} onRefresh={loadUsers}
                superVerified={superVerified} onSuperVerify={handleSuperVerify} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
