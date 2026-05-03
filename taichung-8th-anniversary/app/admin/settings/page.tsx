"use client";

import { useState, useEffect } from "react";
import { type User, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirebaseAuth } from "@/lib/firebase";
import Link from "next/link";
import {
  ChevronLeft, RefreshCcw, KeyRound, CheckCircle, AlertCircle, Eye, EyeOff, ChevronRight, Lock,
} from "lucide-react";

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
    <div className="space-y-4">
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
              <button onClick={() => setShowPin(v => !v)} className="text-gray-400 hover:text-gray-600 p-2">
                {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">設定新 PIN</p>
          <input
            type="text" inputMode="numeric" pattern="[0-9]*"
            value={newPin} onChange={e => { setNewPin(e.target.value); setMsg(null); }}
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
          onClick={save} disabled={saving || !newPin.trim()}
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

export default function SettingsPage() {
  const router = useRouter();
  const [, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), (user) => {
      if (!user) router.push("/admin");
      else setFirebaseUser(user);
      setAuthLoading(false);
    });
    return () => unsub();
  }, [router]);

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
        <h1 className="font-bold text-sm text-gray-800">系統設定</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
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
    </div>
  );
}
