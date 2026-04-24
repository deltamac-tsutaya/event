"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Home, BookOpen, HelpCircle, FileText, Shield, Wallet } from "lucide-react";

const NAV_ITEMS = [
  { href: "/",        label: "主畫面",          icon: Home,       desc: "回到活動首頁" },
  { href: "/coupons", label: "優惠券匣",          icon: Wallet,     desc: "查看所有抽獎優惠券" },
  { href: "/help",    label: "活動規則",          icon: BookOpen,   desc: "集章與抽獎流程說明" },
  { href: "/faq",     label: "常見問題",          icon: HelpCircle, desc: "掃描、抽獎常見疑問" },
  { href: "/terms",   label: "活動參與條款",       icon: FileText,   desc: "完整活動條款說明" },
  { href: "/privacy", label: "個人資料保護聲明",   icon: Shield,     desc: "個資蒐集與使用方式" },
];

interface SideDrawerProps {
  triggerClassName?: string;
}

export default function SideDrawer({ triggerClassName }: SideDrawerProps) {
  const [open, setOpen] = useState(false);

  // 鎖定 body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // ESC 關閉
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* ── Hamburger 按鈕 ── */}
      <button
        aria-label="開啟選單"
        onClick={() => setOpen(true)}
        className={triggerClassName ?? "flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-[#1A2B4A] hover:bg-white/30 transition-colors"}
      >
        <Menu size={20} />
      </button>

      {/* ── Overlay ── */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── Drawer Panel ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="導覽選單"
        className={`fixed top-0 right-0 z-50 flex h-full w-72 flex-col bg-[#1A2B4A] shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 頂部 */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <div>
            <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Nexus Life</p>
            <p className="text-sm font-bold text-white">台中市政店 8 週年</p>
          </div>
          <button
            aria-label="關閉選單"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 導覽項目 */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 rounded-xl px-4 py-3.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors group"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 group-hover:bg-[#C9A84C]/20 transition-colors">
                <Icon size={18} className="group-hover:text-[#C9A84C] transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">{label}</p>
                <p className="text-[10px] text-white/40 mt-0.5 truncate">{desc}</p>
              </div>
            </Link>
          ))}
        </nav>

        {/* 底部 */}
        <div className="px-6 py-5 border-t border-white/10">
          <div className="flex items-center gap-2 opacity-40">
            <img src="/tsutaya-logo.svg" alt="TSUTAYA" className="h-3 w-auto brightness-0 invert" />
            <span className="text-[8px] font-mono text-white">×</span>
            <img src="/wired-tokyo-logo.svg" alt="WIRED" className="h-3.5 w-auto brightness-0 invert" />
          </div>
          <p className="mt-1.5 text-[9px] font-mono text-white/30 tracking-wide">
            2026/04/25 — 2026/05/24
          </p>
        </div>
      </div>
    </>
  );
}
