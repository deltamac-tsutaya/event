"use client";

import Image from "next/image";

interface HeaderProps {
  pictureUrl?: string;
  displayName?: string;
}

export default function Header({ pictureUrl, displayName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#8A6F5C]/15 bg-[#F5F2ED]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="flex items-center">
          <img
            src="/tsutaya-logo.svg"
            alt="TSUTAYA BOOKSTORE"
            className="h-8 w-auto"
          />
        </div>

        {/* Center: Event title */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <p className="text-[11px] font-semibold leading-tight tracking-tight text-[#1A2B4A]">
            8th Anniversary
          </p>
          <p className="text-[9px] text-[#8A6F5C] tracking-tight hidden sm:block">
            無限日常 ∞ 連結生活
          </p>
        </div>

        {/* Right: User avatar */}
        <div className="flex items-center">
          {pictureUrl ? (
            <div className="relative size-8 overflow-hidden rounded-full ring-2 ring-[#8A6F5C]/30">
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
