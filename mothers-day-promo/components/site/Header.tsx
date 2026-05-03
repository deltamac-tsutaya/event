"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/", label: "首頁", en: "Index" },
  { href: "/gifts", label: "送禮推薦", en: "Gifts" },
  { href: "/stores", label: "依門市", en: "Stores" },
  { href: "/xinyi", label: "信義店", en: "Xinyi" },
  { href: "/taichung", label: "市政店", en: "Taichung" },
  { href: "/notes", label: "活動須知", en: "Notes" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur-md border-b border-rule">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="group flex items-baseline gap-3">
            <span className="font-display italic text-[15px] tracking-[0.3em] text-wine">
              Mother&rsquo;s
            </span>
            <span className="font-serif-tc text-base md:text-lg font-medium tracking-widest text-ink">
              母 親 節 特 輯
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {nav.map((n) => {
              const isActive = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`group flex flex-col items-center text-[13px] transition-colors ${
                    isActive ? "text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <span className="font-display italic text-[11px] tracking-[0.25em] text-wine/70 group-hover:text-wine transition-colors">
                    {n.en}
                  </span>
                  <span className="font-serif-tc tracking-[0.2em] mt-0.5">{n.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            aria-label="menu"
            className="lg:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setOpen((o) => !o)}
          >
            <span
              className={`h-px w-6 bg-ink transition-transform ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-ink transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-px w-6 bg-ink transition-transform ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-rule bg-paper">
          <nav className="px-6 py-6 grid gap-4">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between border-b border-rule/60 pb-3"
              >
                <span className="font-serif-tc text-base tracking-[0.25em]">{n.label}</span>
                <span className="font-display italic text-xs tracking-[0.25em] text-wine">
                  {n.en}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
