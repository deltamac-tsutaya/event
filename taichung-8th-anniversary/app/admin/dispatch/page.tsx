"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronDown, ChevronRight, Lock, RefreshCcw, Send, Search } from "lucide-react";

interface AdminUser {
  id: string;
  line_user_id: string;
  display_name: string;
  draw_count: number;
  tickets_count: number;
}

interface DrawRecord {
  id: string;
  draw_date: string;
  reward_id: string;
  rewards: { name: string; tier: string; provider: string } | null;
  is_used: boolean;
  used_at: string | null;
  used_by: string | null;
}

const TIER_BADGE: Record<string, string> = {
  S: "bg-yellow-100 text-yellow-700 border-yellow-200",
  A: "bg-blue-100 text-blue-700 border-blue-200",
  B: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function DispatchPage() {
  const [verified, setVerified]           = useState(false);
  const [pin, setPin]                     = useState("");
  const [verifying, setVerifying]         = useState(false);
  const [verifyErr, setVerifyErr]         = useState("");

  const [users, setUsers]                 = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers]   = useState(false);
  const [search, setSearch]               = useState("");

  const [expandedId, setExpandedId]       = useState<string | null>(null);
  const [draws, setDraws]                 = useState<Record<string, DrawRecord[]>>({});
  const [loadingDraws, setLoadingDraws]   = useState<string | null>(null);

  // key = drawId, value = send state
  const [sendStatus, setSendStatus]       = useState<Record<string, "sending" | "ok" | "err">>({});

  const handleVerify = async () => {
    if (!pin) return;
    setVerifying(true);
    setVerifyErr("");
    try {
      const res  = await fetch("/api/admin/rewards/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.success) {
        setVerified(true);
      } else {
        setVerifyErr(data.error === "wrong_pin" ? "PIN 錯誤，請再試一次" : data.error ?? "驗證失敗");
      }
    } catch {
      setVerifyErr("網路錯誤");
    } finally {
      setVerifying(false);
    }
  };

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res  = await fetch("/api/admin/users");
      const data = await res.json();
      const list: AdminUser[] = (data.users ?? []).filter((u: AdminUser) => u.draw_count > 0);
      setUsers(list);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (verified) loadUsers();
  }, [verified, loadUsers]);

  const toggleUser = async (user: AdminUser) => {
    if (expandedId === user.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(user.id);
    if (draws[user.id]) return;

    setLoadingDraws(user.id);
    try {
      const res  = await fetch(`/api/reward/history?lineUserId=${encodeURIComponent(user.line_user_id)}`);
      const data = await res.json();
      setDraws(prev => ({ ...prev, [user.id]: data.history ?? [] }));
    } finally {
      setLoadingDraws(null);
    }
  };

  const sendCoupon = async (userId: string, drawId: string) => {
    setSendStatus(prev => ({ ...prev, [drawId]: "sending" }));
    try {
      const res  = await fetch("/api/admin/user/push-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, drawId }),
      });
      const data = await res.json();
      setSendStatus(prev => ({ ...prev, [drawId]: data.success ? "ok" : "err" }));
      if (data.success) {
        setTimeout(() => setSendStatus(prev => {
          const next = { ...prev };
          delete next[drawId];
          return next;
        }), 3000);
      }
    } catch {
      setSendStatus(prev => ({ ...prev, [drawId]: "err" }));
    }
  };

  const filtered = users.filter(u =>
    u.display_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link href="/admin" className="text-gray-400 hover:text-gray-700 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="font-bold text-sm text-gray-800">派券管理</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* PIN verification */}
        {!verified ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Lock size={16} />
              <p className="font-bold text-sm">進階授權</p>
            </div>
            <p className="text-xs text-gray-400">輸入後台管理 PIN 以進行派券操作</p>
            <Input
              type="password"
              placeholder="輸入 PIN"
              value={pin}
              onChange={e => { setPin(e.target.value); setVerifyErr(""); }}
              onKeyDown={e => e.key === "Enter" && pin && handleVerify()}
              className="h-10 text-sm"
            />
            {verifyErr && <p className="text-xs text-red-500">{verifyErr}</p>}
            <Button
              onClick={handleVerify}
              disabled={verifying || !pin}
              className="h-9 w-full text-xs gap-1.5 bg-[#1A2B4A] hover:bg-[#1A2B4A]/90"
            >
              {verifying ? <RefreshCcw size={13} className="animate-spin" /> : <Lock size={13} />}
              確認授權
            </Button>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="搜尋用戶姓名…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 h-10 text-sm bg-white"
              />
            </div>

            {/* User list */}
            {loadingUsers ? (
              <div className="py-12 flex items-center justify-center gap-2 text-gray-400 text-xs">
                <RefreshCcw size={14} className="animate-spin" /> 載入中…
              </div>
            ) : filtered.length === 0 ? (
              <p className="py-12 text-center text-sm text-gray-400 italic">
                {search ? "找不到符合的用戶" : "目前尚無抽獎紀錄"}
              </p>
            ) : (
              <div className="space-y-2">
                {filtered.map(user => (
                  <div key={user.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* User row */}
                    <button
                      onClick={() => toggleUser(user)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1A2B4A] to-[#3B82C4] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user.display_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-800 truncate">{user.display_name}</p>
                        <p className="text-[10px] text-gray-400">{user.draw_count} 筆抽獎紀錄</p>
                      </div>
                      {expandedId === user.id
                        ? <ChevronDown size={14} className="text-gray-400 shrink-0" />
                        : <ChevronRight size={14} className="text-gray-300 shrink-0" />
                      }
                    </button>

                    {/* Draw records */}
                    {expandedId === user.id && (
                      <div className="border-t border-gray-50 px-3 pb-3 pt-2 space-y-2">
                        {loadingDraws === user.id ? (
                          <div className="py-4 flex items-center justify-center gap-1.5 text-gray-400 text-xs">
                            <RefreshCcw size={12} className="animate-spin" /> 載入紀錄…
                          </div>
                        ) : (draws[user.id] ?? []).length === 0 ? (
                          <p className="py-3 text-center text-xs text-gray-400">無抽獎紀錄</p>
                        ) : (
                          (draws[user.id] ?? []).map(d => {
                            const status = sendStatus[d.id];
                            return (
                              <div key={d.id} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${TIER_BADGE[d.rewards?.tier ?? "B"]}`}>
                                  {d.rewards?.tier ?? "?"}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-700 truncate">{d.rewards?.name ?? d.reward_id}</p>
                                  <p className="text-[10px] text-gray-400">{d.draw_date}</p>
                                </div>
                                {status === "ok" ? (
                                  <span className="text-[10px] font-bold text-green-600 shrink-0">已發送 ✓</span>
                                ) : status === "err" ? (
                                  <span className="text-[10px] font-bold text-red-500 shrink-0">發送失敗</span>
                                ) : (
                                  <button
                                    onClick={() => sendCoupon(user.id, d.id)}
                                    disabled={status === "sending"}
                                    className="flex items-center gap-1 text-[10px] font-bold text-blue-700 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded px-2 py-0.5 shrink-0 transition-colors disabled:opacity-50"
                                  >
                                    {status === "sending"
                                      ? <RefreshCcw size={9} className="animate-spin" />
                                      : <Send size={9} />
                                    }
                                    派發
                                  </button>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
