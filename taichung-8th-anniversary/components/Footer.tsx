export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-gray-50 py-6 text-center text-xs text-gray-500">
      <div className="mx-auto max-w-2xl space-y-2 px-4">
        <p className="font-semibold text-gray-700">
          TSUTAYA BOOKSTORE 台中市政店（含 WIRED TOKYO）
        </p>
        <p className="text-gray-400">
          地址：{/* TODO: 填入實際地址 */}
          <span className="italic text-gray-300">[地址待補]</span>
        </p>
        <p>
          活動期間：
          <span className="font-medium text-[#00694B]">
            2026/04/23 — 2026/05/13
          </span>
        </p>
        <nav className="flex justify-center gap-6 pt-1">
          <a
            href="#rules"
            className="underline-offset-2 hover:underline hover:text-[#00694B] transition-colors"
          >
            活動規則
          </a>
          <a
            href="#faq"
            className="underline-offset-2 hover:underline hover:text-[#00694B] transition-colors"
          >
            常見問題
          </a>
        </nav>
        <p className="pt-2 text-[10px] text-gray-300">
          © 2026 TSUTAYA BOOKSTORE. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
