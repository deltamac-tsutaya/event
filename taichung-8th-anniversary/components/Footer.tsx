export default function Footer() {
  return (
    <footer className="w-full bg-[#1A2B4A] py-8 text-center text-xs text-white/70">
      <div className="mx-auto max-w-2xl space-y-2 px-4">
        <div className="flex items-center justify-center gap-2">
          <img
            src="/tsutaya-logo.svg"
            alt="TSUTAYA BOOKSTORE"
            className="h-6 w-auto brightness-0 invert opacity-80"
          />
          <span className="text-[10px] font-mono text-white/40">×</span>
          <img
            src="/wired-tokyo-logo.svg"
            alt="WIRED TOKYO"
            className="h-6 w-auto brightness-0 invert opacity-50"
          />
        </div>
        <p className="font-semibold text-white/70 text-xs">
          台中市政店
        </p>
        <p className="text-white/50 italic text-[11px]">
          ∞ Connecting Life, Living in Stride.
        </p>
        <p className="font-mono text-[10px] text-white/40 tracking-wide">
          2,922 Days&nbsp;&nbsp;Est. 2018
        </p>
        <p>
          活動期間：
          <span className="font-medium text-[#3B82C4]">
            2026/04/23 — 2026/05/13
          </span>
        </p>
        <nav className="flex justify-center gap-6 pt-1">
          <a
            href="#rules"
            className="underline-offset-2 hover:underline hover:text-white transition-colors"
          >
            活動規則
          </a>
          <a
            href="#faq"
            className="underline-offset-2 hover:underline hover:text-white transition-colors"
          >
            常見問題
          </a>
        </nav>
        <p className="pt-2 text-[10px] text-white/20">
          © 2026 TSUTAYA BOOKSTORE. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
