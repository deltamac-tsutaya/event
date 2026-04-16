"use client";

import Image from "next/image";

interface HeaderProps {
  pictureUrl?: string;
  displayName?: string;
}

export default function Header({ pictureUrl, displayName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold tracking-widest text-[#00694B] uppercase leading-tight">
            TSUTAYA
            <br />
            BOOKSTORE
          </span>
        </div>

        {/* Center: Event title */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <p className="text-[11px] font-semibold leading-tight tracking-tight text-gray-800">
            台中市政店 8 週年
          </p>
          <p className="text-[9px] text-gray-500 tracking-tight hidden sm:block">
            Nexus Life × 無限日常 ∞
          </p>
        </div>

        {/* Right: User avatar */}
        <div className="flex items-center">
          {pictureUrl ? (
            <div className="relative size-8 overflow-hidden rounded-full ring-2 ring-[#00694B]/30">
              <Image
                src={pictureUrl}
                alt={displayName ?? "使用者"}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
          ) : (
            <div className="size-8" />
          )}
        </div>
      </div>
    </header>
  );
}
