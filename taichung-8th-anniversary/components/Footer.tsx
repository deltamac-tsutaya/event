export default function Footer() {
  return (
    <footer className="w-full bg-[#1A2B4A] py-8 text-center text-xs text-white/70">
      <div className="mx-auto max-w-2xl space-y-2 px-4">
        <div className="flex items-center justify-center gap-2 max-w-full">
          <img
            src="/tsutaya-logo.svg"
            alt="TSUTAYA BOOKSTORE"
            className="h-3 w-auto brightness-0 invert opacity-80"
          />
          <span className="text-[10px] font-mono text-white/40 shrink-0">×</span>
          <img
            src="/wired-tokyo-logo.svg"
            alt="WIRED TOKYO"
            className="h-4 w-auto brightness-0 invert opacity-50"
          />
        </div>
        <p className="font-semibold text-white/70 text-xs">台中市政店</p>
        <p className="text-white/50 italic text-[11px]">∞ Connecting Life, Living in Stride.</p>
        <p className="font-mono text-[10px] text-white/40 tracking-wide">
          2,922 Days&nbsp;&nbsp;Est. 2018
        </p>
        <p className="text-[10px] text-white/20 pt-2">
          © 2026 TSUTAYA BOOKSTORE. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
