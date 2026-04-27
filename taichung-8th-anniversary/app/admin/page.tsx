"use client";

import { useState, useEffect, useCallback } from "react";
import { type User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";
import QRCode from "react-qr-code";
import {
  LogOut, RefreshCcw, Users, Trophy, Ticket, QrCode,
  BarChart3, ShieldCheck, Search, RotateCcw, Plus, Percent,
  ChevronRight, Zap, CheckCircle, AlertCircle,
  X, Printer, FileText, Send, Layers, ScrollText, CalendarX,
  KeyRound, Eye, EyeOff, SlidersHorizontal, Lock, BadgeCheck, Minus,
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

function maskName(name: string) {
  if (!name) return "—";
  const chars = [...name];
  if (chars.length === 1) return chars[0];
  return chars[0] + "○".repeat(chars.length - 2) + chars[chars.length - 1];
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

// ── 使用者列 ───────────────────────────────────────────────────────────────
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

// ── 印章管理（進階授權後操作）────────────────────────────────────────────────
function StampPanel({ user, onRefresh, verified, onVerify }: {
  user: AdminUser; onRefresh: () => void; verified: boolean; onVerify: () => void;
}) {
  const [busy, setBusy]       = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pin, setPin]         = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyErr, setVerifyErr] = useState("");
  const [tickets, setTickets] = useState(user.tickets_count);

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
      const res = await fetch("/api/admin/rewards/verify", {
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

// ── 用戶抽屜（右側 Sheet）──────────────────────────────────────────────────
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

// ── 核銷 PIN 設定 ──────────────────────────────────────────────────────────
function PinSettings() {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin,     setNewPin]     = useState("");
  const [showPin,    setShowPin]    = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [msg,        setMsg]        = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings/pin")
      .then(r => r.json())
      .then(d => { setCurrentPin(d.pin ?? ""); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!newPin.trim() || newPin.trim().length < 4) {
      setMsg({ type: "err", text: "PIN 至少需要 4 位數" });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const res  = await fetch("/api/admin/settings/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: newPin.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentPin(newPin.trim());
        setNewPin("");
        setMsg({ type: "ok", text: "PIN 已更新" });
      } else {
        setMsg({ type: "err", text: data.error ?? "更新失敗" });
      }
    } catch {
      setMsg({ type: "err", text: "網路錯誤" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-sm">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound size={16} className="text-[#1A2B4A]" />
          <h3 className="font-bold text-sm text-[#1A2B4A]">核銷密碼管理</h3>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">目前 PIN</p>
          {loading ? (
            <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-10 bg-gray-50 border border-gray-200 rounded-xl px-3 flex items-center font-mono text-sm tracking-widest">
                {showPin ? currentPin : "●".repeat(currentPin.length || 4)}
              </div>
              <button
                onClick={() => setShowPin(v => !v)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">設定新 PIN</p>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={newPin}
            onChange={e => { setNewPin(e.target.value); setMsg(null); }}
            placeholder="輸入新密碼（4 位以上）"
            className="w-full h-10 border border-gray-200 rounded-xl px-3 font-mono text-sm tracking-widest focus:outline-none focus:border-[#1A2B4A]"
          />
        </div>

        {msg && (
          <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${msg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
            {msg.type === "ok" ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
            {msg.text}
          </div>
        )}

        <button
          onClick={save}
          disabled={saving || !newPin.trim()}
          className="w-full h-10 bg-[#1A2B4A] hover:bg-[#1A2B4A]/90 disabled:opacity-50 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          {saving ? <RefreshCcw size={13} className="animate-spin" /> : <CheckCircle size={13} />}
          儲存 PIN
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-[11px] text-amber-700 space-y-1">
        <p className="font-bold">使用說明</p>
        <p>· 店員在客人手機上點擊「向店員核銷」</p>
        <p>· 跳出密碼框後由店員輸入此 PIN 確認核銷</p>
        <p>· 修改 PIN 即時生效，無需重新部署</p>
      </div>
    </div>
  );
}

// ── QR 點位分頁（進階授權門禁）────────────────────────────────────────────────
function ConfigsTab({ configs, superVerified, onSuperVerify, onSelectQR, onRefresh }: {
  configs: StampConfig[]; superVerified: boolean; onSuperVerify: () => void;
  onSelectQR: (c: StampConfig) => void; onRefresh: () => void;
}) {
  const [pin, setPin]           = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyErr, setVerifyErr] = useState("");
  const [rotating, setRotating] = useState<string | null>(null);

  const handleVerify = async () => {
    setVerifying(true); setVerifyErr("");
    try {
      const res = await fetch("/api/admin/rewards/verify", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.success) onSuperVerify();
      else setVerifyErr("授權碼錯誤");
    } catch { setVerifyErr("網路錯誤"); }
    setVerifying(false);
  };

  const rotateQR = async (stampId: string) => {
    setRotating(stampId);
    try {
      const res = await fetch("/api/admin/configs/rotate", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stampId }),
      });
      const data = await res.json();
      if (data.success) onRefresh();
    } finally { setRotating(null); }
  };

  if (!superVerified) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="text-center py-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3">
              <Lock size={20} className="text-purple-600" />
            </div>
            <p className="font-bold text-gray-800 text-sm">進階授權</p>
            <p className="text-xs text-gray-400 mt-1">查看及管理 QR 點位需要授權碼</p>
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
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="bg-orange-50 px-5 py-3.5 border-b border-orange-100 flex items-center justify-between">
          <h2 className="text-orange-800 font-bold text-sm flex items-center gap-2">
            <RefreshCcw size={14} /> 輪替點位
          </h2>
          <span className="text-[10px] bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full font-bold">手動更換</span>
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
                <Button size="sm" variant="ghost" onClick={() => rotateQR(c.stamp_id)}
                  disabled={rotating === c.stamp_id}
                  className="rounded-full h-8 px-3 text-[10px] gap-1 text-orange-700 hover:bg-orange-100">
                  {rotating === c.stamp_id ? <RefreshCcw size={10} className="animate-spin" /> : <RotateCcw size={10} />} 更換 QR
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onSelectQR(c)} className="rounded-full h-8 w-8 p-0">
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
            <button key={c.uuid} onClick={() => onSelectQR(c)}
              className="border border-gray-100 rounded-xl p-3 text-center hover:border-purple-400 hover:bg-purple-50 transition-all active:scale-95">
              <p className="font-black text-base text-[#1A2B4A]">{c.stamp_id}</p>
            </button>
          ))}
        </div>
      </Card>
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
            <Link href="/admin/print/materials" className="block">
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

  const [activeTab, setActiveTab]   = useState<"users" | "configs" | "settings">("users");
  const [users, setUsers]           = useState<AdminUser[]>([]);
  const [configs, setConfigs]       = useState<StampConfig[]>([]);
  const [stats, setStats]           = useState<DashboardStats | null>(null);
  const [loading, setLoading]       = useState(false);
  const [search, setSearch]         = useState("");
  const [selectedQR, setSelectedQR] = useState<StampConfig | null>(null);
  const [superVerified, setSuperVerified] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem("super_admin_verified") === "1"
  );
  const handleSuperVerify = () => {
    sessionStorage.setItem("super_admin_verified", "1");
    setSuperVerified(true);
  };

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
    { id: "users"    as const, icon: <Users size={18} />,    label: "使用者" },
    { id: "configs"  as const, icon: <QrCode size={18} />,   label: "QR 點位" },
    { id: "settings" as const, icon: <KeyRound size={18} />, label: "設定" },
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { icon: <Users size={18} className="text-blue-600" />,    label: "總人數",        text: (stats?.totalUsers ?? 0).toLocaleString() },
            { icon: <QrCode size={18} className="text-green-600" />,  label: "今日集印",      text: (stats?.todayStamps ?? 0).toLocaleString() },
            { icon: <Trophy size={18} className="text-orange-500" />, label: "今日抽獎",      text: (stats?.todayDraws ?? 0).toLocaleString() },
            { icon: <Ticket size={18} className="text-purple-600" />, label: "獎券池",        text: (stats?.totalTickets ?? 0).toLocaleString() },
            { icon: <Ticket size={18} className="text-indigo-500" />, label: "∞ 累積券數",    text: (stats?.totalTickets ?? 0).toLocaleString() },
            { icon: <Percent size={18} className="text-amber-500" />, label: "∞ 中獎率",      text: stats?.totalTickets ? (8 / stats.totalTickets * 100).toFixed(1) + '%' : '—' },
          ].map(({ icon, label, text }) => (
            <Card key={label} className="border-none shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-50 shrink-0">{icon}</div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-xl font-black text-gray-900 leading-none mt-0.5">{text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 快速工具 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Link href="/admin/print/materials" className="block">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4 hover:shadow-md hover:border-[#C9A84C]/40 transition-all group">
              <div className="p-3 rounded-xl bg-[#C9A84C]/10 text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-white transition-colors shrink-0">
                <Layers size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-800">文宣 &amp; 列印</p>
                <p className="text-[10px] text-gray-400 mt-0.5">設計稿 · QR 批次列印</p>
              </div>
            </div>
          </Link>
          <Link href="/admin/manual" className="block">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4 hover:shadow-md hover:border-[#1A2B4A]/20 transition-all group">
              <div className="p-3 rounded-xl bg-[#1A2B4A]/5 text-[#1A2B4A] group-hover:bg-[#1A2B4A] group-hover:text-white transition-colors shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-800">活動操作手冊</p>
                <p className="text-[10px] text-gray-400 mt-0.5">員工操作指引 · 核銷說明</p>
              </div>
            </div>
          </Link>
          <Link href="/admin/logs" className="block">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4 hover:shadow-md hover:border-emerald-200 transition-all group">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                <ScrollText size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-800">活動日誌</p>
                <p className="text-[10px] text-gray-400 mt-0.5">集章 · 抽獎 · 核銷紀錄</p>
              </div>
            </div>
          </Link>
          <Link href="/admin/rewards" className="block">
            <div className="bg-white rounded-2xl border border-[#C9A84C]/30 shadow-sm px-5 py-4 flex items-center gap-4 hover:shadow-md hover:border-[#C9A84C]/60 transition-all group">
              <div className="p-3 rounded-xl bg-[#C9A84C]/10 text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-white transition-colors shrink-0">
                <SlidersHorizontal size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-sm text-gray-800">獎項機率</p>
                  <span className="text-[8px] bg-[#C9A84C]/10 text-[#C9A84C] font-bold px-1.5 py-0.5 rounded-full border border-[#C9A84C]/20 leading-none">進階</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">權重 · 每日上限調整</p>
              </div>
            </div>
          </Link>
          <Link href="/admin/redeem" className="block">
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm px-5 py-4 flex items-center gap-4 hover:shadow-md hover:border-emerald-300 transition-all group">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                <BadgeCheck size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-800">前往核銷</p>
                <p className="text-[10px] text-gray-400 mt-0.5">現場核銷優惠券</p>
              </div>
            </div>
          </Link>
        </div>

        {/* 使用者 */}
        {activeTab === "users" && (
          <div className="space-y-3">
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
                  <UserRow key={u.id} user={u} onRefresh={fetchAllData}
                    superVerified={superVerified} onSuperVerify={handleSuperVerify} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* QR 點位 */}
        {activeTab === "configs" && (
          <ConfigsTab configs={configs} superVerified={superVerified} onSuperVerify={handleSuperVerify}
            onSelectQR={setSelectedQR} onRefresh={fetchAllData} />
        )}

        {/* 設定 */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-700">系統設定</h2>
            <PinSettings />
            <Link href="/admin/rewards" className="block">
              <div className="bg-white rounded-2xl border border-[#C9A84C]/30 shadow-sm px-5 py-4 flex items-center gap-4 hover:shadow-md hover:border-[#C9A84C]/60 transition-all group">
                <div className="p-3 rounded-xl bg-[#C9A84C]/10 text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-white transition-colors shrink-0">
                  <Lock size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-sm text-gray-800">進階設定</p>
                    <span className="text-[8px] bg-[#C9A84C]/10 text-[#C9A84C] font-bold px-1.5 py-0.5 rounded-full border border-[#C9A84C]/20 leading-none">進階</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">獎項機率 · 每日上限 · 授權碼管理</p>
                </div>
                <ChevronRight size={14} className="text-gray-300 shrink-0" />
              </div>
            </Link>
          </div>
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
