"use client";

import { ChevronDown } from "lucide-react";
import { DynamicHero } from "@/components/DynamicHero";
import SideDrawer from "@/components/SideDrawer";

interface HeroSectionProps {
  compact: boolean;
  bitmask: number;
  onToggle: () => void;
  user: {
    displayName?: string;
    pictureUrl?: string;
  } | null;
  infinityMode?: boolean;
}

export default function HeroSection({
  compact,
  bitmask,
  onToggle,
  user,
  infinityMode,
}: HeroSectionProps) {
  return (
    <section
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`relative z-10 flex flex-col justify-end overflow-hidden w-full transition-[height] duration-500 ease-in-out cursor-pointer active:scale-[0.995] ${
        compact ? "h-[42svh]" : "h-[100svh]"
      }`}
    >
      <DynamicHero bitmask={bitmask} compact={compact} infinityMode={infinityMode} />

      {/* Side Drawer trigger at Top Left */}
      <div className="absolute top-6 left-6 z-20">
        <SideDrawer />
      </div>

      {/* User Profile Pill at Top Right */}
      {user && (
        <div
          className={`absolute top-6 right-6 z-20 flex items-center gap-2 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm transition-colors duration-700 ${
            infinityMode
              ? "bg-white/10 border border-[#C9A84C]/30"
              : "bg-white/20 border border-white/10"
          }`}
        >
          {user.pictureUrl ? (
            <img src={user.pictureUrl} alt={user.displayName} className="w-6 h-6 rounded-full object-cover border border-white/40" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#1A2B4A]/40 flex items-center justify-center text-[10px] text-white font-bold border border-white/40">
              {user.displayName?.charAt(0) || "U"}
            </div>
          )}
          <span
            className={`text-[10px] font-bold tracking-wider truncate max-w-[80px] transition-colors duration-700 ${
              infinityMode ? "text-white" : "text-[#1A2B4A]"
            }`}
          >
            {user.displayName}
          </span>
        </div>
      )}

      <div className={`relative z-10 px-6 flex flex-col transition-[padding,gap] duration-300 ${compact || infinityMode ? "pt-20" : ""} ${infinityMode ? "gap-2.5" : "gap-4"} pb-12`}>
        <div className="flex items-center gap-2">
          <img
            src="/tsutaya-logo.svg"
            alt="TSUTAYA"
            className={`h-4 w-auto transition-[filter,opacity] duration-700 ${
              infinityMode ? "opacity-50 brightness-0 invert" : "opacity-80"
            }`}
          />
          <span
            className={`font-mono text-[10px] transition-colors duration-700 ${
              infinityMode ? "text-[#C9A84C]/40" : "text-[#1A2B4A]/20"
            }`}
          >
            ×
          </span>
          <img
            src="/wired-tokyo-logo.svg"
            alt="WIRED"
            className={`h-5 w-auto transition-[filter,opacity] duration-700 ${
              infinityMode ? "opacity-40 brightness-0 invert" : "opacity-70"
            }`}
          />
        </div>

        <div onClick={(e) => { e.stopPropagation(); onToggle(); }}>
          <p
            className={`brand-mono-label mb-1 font-bold tracking-widest text-[10px] transition-colors duration-700 ${
              infinityMode ? "text-[#C9A84C]" : "text-[#8A6F5C]"
            }`}
          >
            {infinityMode ? "INFINITY DAY · 5 / 24 20:00" : "台中市政店 8 週年"}
          </p>
          <h1
            className={`font-heading font-semibold leading-[1.1] tracking-tight transition-colors duration-700 ${
              infinityMode ? "text-white" : "text-[#1A2B4A]"
            }`}
            style={{ fontSize: "clamp(2.4rem, 10vw, 4rem)" }}
          >
            {infinityMode ? "Infinity Day" : "Nexus Life"}
            <br />
            <span
              className={`text-[0.65em] font-normal transition-colors duration-700 ${
                infinityMode ? "text-[#E5C97D] opacity-90" : "text-[#1A2B4A] opacity-80"
              }`}
            >
              {infinityMode ? "∞ 加碼抽獎倒數中" : "無限日常 ∞ 連結生活"}
            </span>
          </h1>
        </div>

        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${compact ? "max-h-0 opacity-0" : "max-h-40 opacity-100"}`}>
          <div className="mt-2 space-y-4">
            <p
              className={`text-sm font-medium transition-colors duration-700 ${
                infinityMode ? "text-white/75" : "text-[#1A2B4A]/70"
              }`}
            >
              {infinityMode
                ? "累積券數愈多，中獎機率愈高"
                : "找出店內 8 個印記，集滿抽獎，每天一次機會"}
            </p>
            <div
              className={`flex items-center gap-3 text-[10px] font-mono tracking-widest transition-colors duration-700 ${
                infinityMode ? "text-[#C9A84C]/70" : "text-[#8A6F5C]/60"
              }`}
            >
              <span>2,922 Days</span>
              <span
                className={`w-px h-3 transition-colors duration-700 ${
                  infinityMode ? "bg-[#C9A84C]/20" : "bg-[#1A2B4A]/10"
                }`}
              />
              <span>Est. 2018</span>
              <span
                className={`w-px h-3 transition-colors duration-700 ${
                  infinityMode ? "bg-[#C9A84C]/20" : "bg-[#1A2B4A]/10"
                }`}
              />
              <span
                className={`font-bold transition-colors duration-700 ${
                  infinityMode ? "text-[#E5C97D]" : "text-[#2B5CE6]/80"
                }`}
              >
                2026 / 04 / 25 — 05 / 24
              </span>
            </div>
          </div>
        </div>

        <div className={`h-5 flex items-center justify-center gap-1.5 transition-opacity duration-500 ${compact ? "opacity-50" : "opacity-0"}`}>
          <span
            className={`text-[9px] font-bold tracking-widest transition-colors duration-700 ${
              infinityMode ? "text-white/60" : "text-[#1A2B4A]/60"
            }`}
          >
            點擊展開
          </span>
          <ChevronDown
            size={10}
            className={`transition-colors duration-700 ${
              infinityMode ? "text-white/50" : "text-[#1A2B4A]/50"
            }`}
          />
        </div>
      </div>
    </section>
  );
}
