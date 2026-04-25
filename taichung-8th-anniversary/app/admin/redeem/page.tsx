"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { type User, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  ShieldCheck, ChevronLeft, CheckCircle2, XCircle, Clock,
  AlertTriangle, RefreshCcw, BadgeCheck,
} from "lucide-react";

const TIER_LABEL: Record<string, string> = { S: "★★★ S 級", A: "★★ A 級", B: "★ B 級" };
const TIER_COLOR: Record<string, string> = {
  S: "text-yellow-700 bg-yellow-50 border-yellow-200",
  A: "text-blue-700 bg-blue-50 border-blue-200",
  B: "text-gray-600 bg-gray-50 border-gray-200",
};
const PROVIDER_LABEL: Record<string, string> = {
  WIRED: "WIRED TOKYO",
  TSUTAYA: "TSUTAYA BOOKSTORE",
};

interface CouponInfo {
  draw: { id: string; draw_date: string; is_used: boolean; used_at: string | null; used_by: string | null };
  reward: { id: string; tier: string; provider: string; name: string; conditions: string; validity_days: number } | null;
  user: { display_name: string };
  isExpired: boolean;
  expiryDate: string;
}

// ── 核銷內容元件 ─────────────────────────────────────────────────────────────

function RedeemContent({ firebaseUser }: { firebaseUser: User }) {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const urlId        = searchParams.get("id") ?? "";

  const [inputId,   setInputId]   = useState(urlId);
  const [coupon,    setCoupon]    = useState<CouponInfo | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [error,     setError]     = useState("");
  const [done,      setDone]      = useState(false);
  const [staffName, setStaffName] = useState("");

  const fetchCoupon = useCallback(async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError("");
    setCoupon(null);
    setDone(false);
    try {
      const res  = await fetch(`/api/coupon/verify?id=${encodeURIComponent(id.trim())}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "查無此券"); return; }
      setCoupon(data);
    } catch {
      setError("網路錯誤，請重試");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch when id is in URL
  useEffect(() => {
    if (urlId) fetchCoupon(urlId);
  }, [urlId, fetchCoupon]);

  const handleRedeem = async () => {
    if (!coupon) return;
    if (!confirm(`確定核銷「${coupon.reward?.name}」？此操作不可撤回。`)) return;
    setRedeeming(true);
    try {
      const res  = await fetch("/api/admin/coupon/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drawId: coupon.draw.id, staffName: staffName || firebaseUser.email }),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
        setCoupon(prev => prev ? { ...prev, draw: { ...prev.draw, is_used: true, used_at: new Date().toISOString() } } : prev);
      } else {
        setError(
          data.error === "already_redeemed" ? "此券已核銷過"
          : data.error === "expired"        ? "此券已失效"
          : data.error ?? "核銷失敗"
        );
      }
    } catch {
      setError("網路錯誤，請重試");
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="min-h-svh bg-[#F8FAFC] pb-10">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="mx-auto max-w-lg px-4 h-14 flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
              <ChevronLeft size={18} />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BadgeCheck size={18} className="text-[#1A2B4A]" />
            <h1 className="font-bold text-[#1A2B4A] text-sm">優惠券核銷站</h1>
          </div>
          <span className="ml-auto text-[10px] font-mono text-gray-400 truncate max-w-[120px]">
            {firebaseUser.email}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-5">

        {/* ID input */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">掃描 QR Code 或手動輸入券號</p>
          <div className="flex gap-2">
            <Input
              value={inputId}
              onChange={e => setInputId(e.target.value)}
              placeholder="貼上或輸入 Draw UUID"
              className="font-mono text-xs h-11"
              onKeyDown={e => e.key === "Enter" && fetchCoupon(inputId)}
            />
            <Button
              onClick={() => fetchCoupon(inputId)}
              disabled={loading || !inputId.trim()}
              className="h-11 px-5 bg-[#1A2B4A] shrink-0"
            >
              {loading ? <RefreshCcw size={14} className="animate-spin" /> : "查詢"}
            </Button>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">
              <XCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Coupon result */}
        {coupon && coupon.reward && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* Status banner */}
            {done || coupon.draw.is_used ? (
              <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4">
                <CheckCircle2 size={28} className="text-orange-500 shrink-0" />
                <div>
                  <p className="font-black text-orange-700">已核銷</p>
                  {coupon.draw.used_at && (
                    <p className="text-xs text-orange-500 mt-0.5">
                      {new Date(coupon.draw.used_at).toLocaleString("zh-TW", {
                        month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            ) : coupon.isExpired ? (
              <div className="flex items-center gap-3 bg-gray-100 border border-gray-200 rounded-2xl px-5 py-4">
                <Clock size={28} className="text-gray-400 shrink-0" />
                <div>
                  <p className="font-black text-gray-500">已失效</p>
                  <p className="text-xs text-gray-400 mt-0.5">有效期限 {coupon.expiryDate} 已過</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4">
                <CheckCircle2 size={28} className="text-emerald-500 shrink-0" />
                <div>
                  <p className="font-black text-emerald-700">有效優惠券</p>
                  <p className="text-xs text-emerald-600 mt-0.5">有效至 {coupon.expiryDate}</p>
                </div>
              </div>
            )}

            {/* Coupon detail card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#1A2B4A] px-5 py-3 flex items-center justify-between">
                <p className="text-white font-bold text-sm">{coupon.user.display_name}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${TIER_COLOR[coupon.reward.tier] ?? ""}`}>
                  {TIER_LABEL[coupon.reward.tier] ?? coupon.reward.tier}
                </span>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {PROVIDER_LABEL[coupon.reward.provider] ?? coupon.reward.provider}
                  </p>
                  <p className="text-base font-bold text-[#1A2B4A] mt-0.5">{coupon.reward.name}</p>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{coupon.reward.conditions}</p>
                <div className="flex justify-between text-[10px] text-gray-400 pt-2 border-t border-dashed border-gray-100">
                  <span>抽獎日：{coupon.draw.draw_date}</span>
                  <span>券號：{coupon.draw.id.slice(0, 8)}…</span>
                </div>
              </div>
            </div>

            {/* Staff name input + redeem button */}
            {!coupon.draw.is_used && !done && !coupon.isExpired && (
              <div className="space-y-3">
                <Input
                  value={staffName}
                  onChange={e => setStaffName(e.target.value)}
                  placeholder={`核銷人員（選填，預設：${firebaseUser.email}）`}
                  className="h-11 text-sm"
                />
                <Button
                  onClick={handleRedeem}
                  disabled={redeeming}
                  className="h-14 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-lg shadow-emerald-200 transition-all hover:scale-[1.01]"
                >
                  {redeeming
                    ? <><RefreshCcw size={16} className="animate-spin mr-2" /> 核銷中…</>
                    : "✓ 確認核銷"
                  }
                </Button>
                <div className="flex items-start gap-2 text-[11px] text-gray-400 px-1">
                  <AlertTriangle size={12} className="shrink-0 mt-0.5 text-amber-400" />
                  核銷後無法撤回，請確認品牌與獎項名稱無誤再執行
                </div>
              </div>
            )}

            {/* Done state */}
            {(done || (coupon.draw.is_used && !coupon.isExpired)) && (
              <Button
                onClick={() => { setCoupon(null); setInputId(""); setDone(false); router.replace("/admin/redeem"); }}
                className="h-12 w-full rounded-2xl bg-[#1A2B4A] font-bold"
              >
                核銷下一張
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ── Auth gate ────────────────────────────────────────────────────────────────

function RedeemPage() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading,  setAuthLoading]  = useState(true);
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [loginError,   setLoginError]   = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), (u) => {
      setFirebaseUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

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
      <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!firebaseUser) return (
    <div className="flex min-h-svh items-center justify-center bg-[#0F172A] p-4">
      <Card className="w-full max-w-sm shadow-2xl border-none">
        <CardHeader className="text-center pt-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <BadgeCheck size={32} />
          </div>
          <CardTitle className="text-2xl font-bold">核銷站登入</CardTitle>
          <p className="text-sm text-gray-400">請使用管理員帳號登入</p>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="管理員 Email" value={email} autoFocus required
              className="h-12 bg-gray-50 border-gray-200" onChange={e => setEmail(e.target.value)} />
            <Input type="password" placeholder="密碼" value={password} required
              className="h-12 bg-gray-50 border-gray-200" onChange={e => setPassword(e.target.value)} />
            {loginError && <p className="text-sm text-red-500 text-center">{loginError}</p>}
            <Button type="submit" disabled={loginLoading}
              className="h-12 w-full bg-emerald-600 hover:bg-emerald-700 shadow-lg font-bold">
              {loginLoading ? "登入中..." : "進入核銷站"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Suspense fallback={
      <div className="flex min-h-svh items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1A2B4A] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <RedeemContent firebaseUser={firebaseUser} />
    </Suspense>
  );
}

export default RedeemPage;
