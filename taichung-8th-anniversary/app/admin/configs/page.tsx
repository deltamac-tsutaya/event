"use client";

import { useState, useEffect, useCallback } from "react";
import { type User, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirebaseAuth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import QRCode from "react-qr-code";
import {
  ChevronLeft, RefreshCcw, Lock, RotateCcw, QrCode, CheckCircle, X, Printer,
} from "lucide-react";

interface StampConfig {
  uuid: string; stamp_id: string; variant_id: number; is_active: boolean; area_name?: string;
}

function QRModal({ config, onClose }: { config: StampConfig; onClose: () => void }) {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const url  = `${base}/stamp?id=${config.uuid}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-gray-900/80 backdrop-blur-md p-0 sm:p-4">
      <Card className="w-full sm:max-w-sm animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 border-none shadow-2xl overflow-hidden rounded-t-3xl sm:rounded-3xl">
        <div className="bg-[#1A2B4A] text-white px-5 py-4 flex items-center justify-between">
          <p className="font-bold text-sm leading-tight">點位 {config.stamp_id}</p>
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

function ConfigsContent({ configs, superVerified, onSuperVerify, onSelectQR, onRefresh }: {
  configs: StampConfig[]; superVerified: boolean; onSuperVerify: () => void;
  onSelectQR: (c: StampConfig) => void; onRefresh: () => void;
}) {
  const [pin, setPin]             = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyErr, setVerifyErr] = useState("");
  const [rotating, setRotating]   = useState<string | null>(null);

  const handleVerify = async () => {
    setVerifying(true); setVerifyErr("");
    try {
      const res  = await fetch("/api/admin/rewards/verify", {
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
      const res  = await fetch("/api/admin/configs/rotate", {
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

export default function ConfigsPage() {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading]   = useState(true);
  const [configs, setConfigs]           = useState<StampConfig[]>([]);
  const [loading, setLoading]           = useState(false);
  const [selectedQR, setSelectedQR]     = useState<StampConfig | null>(null);
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

  const loadConfigs = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/configs");
      const data = await res.json();
      if (data.success) setConfigs(data.configs);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (firebaseUser) loadConfigs();
  }, [firebaseUser, loadConfigs]);

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
        <h1 className="font-bold text-sm text-gray-800 flex-1">QR 點位管理</h1>
        <button onClick={loadConfigs} disabled={loading} className="text-gray-400 hover:text-gray-600 transition-colors">
          <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5">
        <ConfigsContent
          configs={configs}
          superVerified={superVerified}
          onSuperVerify={handleSuperVerify}
          onSelectQR={setSelectedQR}
          onRefresh={loadConfigs}
        />
      </div>

      {selectedQR && <QRModal config={selectedQR} onClose={() => setSelectedQR(null)} />}
    </div>
  );
}
