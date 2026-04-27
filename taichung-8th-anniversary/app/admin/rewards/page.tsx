"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft, Lock, RefreshCcw, SlidersHorizontal,
  ShieldCheck, AlertCircle, CheckCircle, Eye, EyeOff, Save,
} from "lucide-react";

interface Reward {
  id: string;
  tier: string;
  provider: string;
  name: string;
  probability: number;
  daily_limit: number | null;
  validity_days: number;
}

const SESSION_KEY = "super_admin_verified";

const TIER_STYLE: Record<string, { badge: string; header: string }> = {
  S: { badge: "bg-amber-100 text-amber-700 border border-amber-200", header: "bg-amber-50 border-amber-100" },
  A: { badge: "bg-blue-100 text-blue-700 border border-blue-200",   header: "bg-blue-50 border-blue-100" },
  B: { badge: "bg-gray-100 text-gray-600 border border-gray-200",   header: "bg-gray-50 border-gray-100" },
};

// ── PIN 驗證畫面 ────────────────────────────────────────────────────────────
function PinGate({ onVerified }: { onVerified: () => void }) {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setError("");
    try {
      const res = await fetch("/api/admin/rewards/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem(SESSION_KEY, "1");
        onVerified();
      } else {
        setError(data.error === "wrong_pin" ? "授權碼錯誤" : (data.error ?? "驗證失敗"));
      }
    } catch {
      setError("網路錯誤，請稍後再試");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-svh bg-[#0A1628] flex flex-col items-center justify-center p-4">
      <form onSubmit={verify} className="w-full max-w-sm space-y-6">
        {/* Icon */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-[#1A2B4A] rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(201,168,76,0.15)]">
            <Lock size={32} className="text-[#C9A84C]" />
          </div>
          <div>
            <h1 className="text-white font-black text-xl tracking-tight">進階管理員驗證</h1>
            <p className="text-white/30 text-xs mt-1.5 tracking-wide">此功能需要更高級別的授權碼</p>
          </div>
        </div>

        {/* Input card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 backdrop-blur-sm">
          <div className="relative">
            <input
              type={showPin ? "text" : "password"}
              inputMode="numeric"
              value={pin}
              onChange={e => { setPin(e.target.value); setError(""); }}
              placeholder="輸入管理授權碼"
              className="w-full h-12 bg-white/8 border border-white/10 rounded-xl px-4 pr-11 font-mono tracking-widest text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPin(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
            >
              {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 px-3 py-2 rounded-lg">
              <AlertCircle size={12} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={verifying || !pin.trim()}
            className="w-full h-12 bg-[#C9A84C] hover:bg-[#D4B558] disabled:opacity-40 text-[#1A2B4A] font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            {verifying
              ? <><RefreshCcw size={15} className="animate-spin" /> 驗證中…</>
              : <><ShieldCheck size={15} /> 確認授權</>
            }
          </button>
        </div>

        <Link href="/admin" className="block text-center text-white/25 text-xs hover:text-white/45 transition-colors">
          ← 返回後台首頁
        </Link>
      </form>
    </div>
  );
}

// ── 主頁面 ──────────────────────────────────────────────────────────────────
export default function RewardsPage() {
  const [verified, setVerified] = useState<boolean | null>(null); // null = 初始化中
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [edited, setEdited] = useState<Record<string, { probability?: number; daily_limit?: number | null }>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    setVerified(sessionStorage.getItem(SESSION_KEY) === "1");
  }, []);

  useEffect(() => {
    if (verified) fetchRewards();
  }, [verified]);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rewards");
      const data = await res.json();
      if (data.success) { setRewards(data.rewards); setEdited({}); }
    } finally {
      setLoading(false);
    }
  };

  const setField = (id: string, field: string, value: number | null) => {
    setEdited(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
    setMsg(null);
  };

  const totalWeight = rewards.reduce((sum, r) => {
    return sum + (edited[r.id]?.probability ?? r.probability);
  }, 0);

  const dirtyIds = Object.keys(edited).filter(id => Object.keys(edited[id]).length > 0);

  const saveAll = async () => {
    if (dirtyIds.length === 0) return;
    setSaving(true);
    setMsg(null);
    try {
      for (const id of dirtyIds) {
        const base = rewards.find(r => r.id === id)!;
        const probability = edited[id].probability ?? base.probability;
        const daily_limit = "daily_limit" in edited[id] ? edited[id].daily_limit : base.daily_limit;
        const res = await fetch("/api/admin/rewards", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, probability, daily_limit }),
        });
        if (!res.ok) throw new Error(`更新 ${id} 失敗`);
      }
      await fetchRewards();
      setMsg({ type: "ok", text: `已儲存 ${dirtyIds.length} 個獎項的設定` });
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "儲存失敗" });
    } finally {
      setSaving(false);
    }
  };

  // 初始化中（避免閃爍）
  if (verified === null) return null;

  // 未驗證 → 顯示 PIN gate
  if (!verified) return <PinGate onVerified={() => setVerified(true)} />;

  // 按 tier 分組
  const byTier: Record<string, Reward[]> = {};
  for (const r of rewards) {
    (byTier[r.tier] ??= []).push(r);
  }

  return (
    <div className="min-h-svh bg-[#F8FAFC]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="mx-auto max-w-4xl px-4 h-14 flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
              <ChevronLeft size={18} />
            </Button>
          </Link>
          <SlidersHorizontal size={16} className="text-[#C9A84C]" />
          <p className="font-bold text-[#1A2B4A] text-sm flex-1">獎項機率管理</p>
          <span className="text-[9px] bg-[#C9A84C]/10 text-[#C9A84C] font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-[#C9A84C]/20">
            <Lock size={8} /> 進階授權
          </span>
          <Button variant="ghost" size="icon" className="rounded-full w-9 h-9" onClick={fetchRewards} disabled={loading}>
            <RefreshCcw size={15} className={loading ? "animate-spin text-gray-400" : "text-gray-400"} />
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-5 space-y-5">

        {/* 說明 banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-[11px] text-amber-700 space-y-1">
          <p className="font-bold flex items-center gap-1.5"><AlertCircle size={12} /> 操作說明</p>
          <p>· <b>權重</b>欄位為相對比值，非百分比。系統依各獎項權重比例隨機抽出</p>
          <p>· <b>每日上限</b>留空表示無限制；填 0 可暫停該獎項發放</p>
          <p>· 調整後請點「儲存所有變更」才會生效，不影響已發出的獎券</p>
        </div>

        {/* 訊息 */}
        {msg && (
          <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-2xl border ${
            msg.type === "ok"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-600 border-red-200"
          }`}>
            {msg.type === "ok" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
            {msg.text}
          </div>
        )}

        {/* 總覽卡 */}
        {rewards.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">總權重合計</p>
              <p className="text-2xl font-black text-[#1A2B4A] mt-0.5 tabular-nums">{totalWeight.toLocaleString()}</p>
            </div>
            <div className="flex gap-4">
              {["S", "A", "B"].map(tier => {
                const tw = (byTier[tier] ?? []).reduce(
                  (s, r) => s + (edited[r.id]?.probability ?? r.probability), 0
                );
                return (
                  <div key={tier} className="text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TIER_STYLE[tier]?.badge}`}>{tier}</span>
                    <p className="text-xs font-bold text-gray-600 mt-1 tabular-nums">
                      {totalWeight > 0 ? ((tw / totalWeight) * 100).toFixed(1) : "0.0"}%
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 各 Tier 獎項表格 */}
        {["S", "A", "B"].map(tier => {
          const tierRewards = byTier[tier] ?? [];
          if (tierRewards.length === 0) return null;
          const tierTotal = tierRewards.reduce(
            (s, r) => s + (edited[r.id]?.probability ?? r.probability), 0
          );
          const style = TIER_STYLE[tier]!;

          return (
            <div key={tier} className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${style.badge}`}>{tier} 級獎項</span>
                <span className="text-[10px] text-gray-400">共 {tierRewards.length} 種 · 權重小計 {tierTotal}</span>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Table header */}
                <div className={`grid grid-cols-[1fr_80px_90px_90px] border-b px-4 py-2.5 ${style.header}`}>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">獎項名稱</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">機率</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">權重</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">每日上限</p>
                </div>

                {/* Rows */}
                {tierRewards.map((r, i) => {
                  const weight = edited[r.id]?.probability ?? r.probability;
                  const limit: number | null | undefined =
                    "daily_limit" in (edited[r.id] ?? {})
                      ? edited[r.id]!.daily_limit
                      : r.daily_limit;
                  const pct = totalWeight > 0 ? ((weight / totalWeight) * 100).toFixed(2) : "0.00";
                  const isDirty = r.id in edited;

                  return (
                    <div
                      key={r.id}
                      className={`grid grid-cols-[1fr_80px_90px_90px] items-center px-4 py-3 ${
                        i < tierRewards.length - 1 ? "border-b border-gray-50" : ""
                      } ${isDirty ? "bg-amber-50/60" : "hover:bg-gray-50/60"} transition-colors`}
                    >
                      {/* 名稱 */}
                      <div>
                        <p className="font-semibold text-gray-800 text-xs leading-snug">{r.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{r.provider} · {r.id}</p>
                      </div>

                      {/* 實際機率 */}
                      <div className="text-right">
                        <span className="font-black text-[#1A2B4A] text-sm tabular-nums">{pct}%</span>
                      </div>

                      {/* 權重輸入 */}
                      <div className="flex justify-center">
                        <input
                          type="number"
                          min={0}
                          value={weight}
                          onChange={e =>
                            setField(r.id, "probability", Math.max(0, parseInt(e.target.value) || 0))
                          }
                          className="w-16 h-8 text-center border border-gray-200 rounded-lg font-mono text-xs focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30 transition-colors"
                        />
                      </div>

                      {/* 每日上限輸入 */}
                      <div className="flex justify-center">
                        <input
                          type="number"
                          min={0}
                          value={limit ?? ""}
                          placeholder="∞"
                          onChange={e => {
                            const v = e.target.value === "" ? null : Math.max(0, parseInt(e.target.value) || 0);
                            setField(r.id, "daily_limit", v);
                          }}
                          className="w-16 h-8 text-center border border-gray-200 rounded-lg font-mono text-xs focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30 transition-colors placeholder-gray-300"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* 儲存按鈕（sticky bottom） */}
        {rewards.length > 0 && (
          <div className="sticky bottom-4 pt-2">
            <button
              onClick={saveAll}
              disabled={saving || dirtyIds.length === 0}
              className="w-full h-13 py-3.5 rounded-2xl bg-[#1A2B4A] hover:bg-[#1A2B4A]/90 disabled:opacity-40 font-bold text-white text-sm shadow-lg shadow-[#1A2B4A]/20 flex items-center justify-center gap-2 transition-all"
            >
              {saving
                ? <><RefreshCcw size={16} className="animate-spin" /> 儲存中…</>
                : dirtyIds.length > 0
                  ? <><Save size={16} /> 儲存所有變更（{dirtyIds.length} 項）</>
                  : <><Save size={16} /> 尚無變更</>
              }
            </button>
          </div>
        )}

        {/* 空狀態 */}
        {!loading && rewards.length === 0 && (
          <div className="py-20 text-center text-gray-400 text-sm">
            資料庫中尚無獎項設定
          </div>
        )}
      </div>
    </div>
  );
}
