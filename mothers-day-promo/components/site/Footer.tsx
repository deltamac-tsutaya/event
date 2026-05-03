import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-rule bg-paper-deep/40">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10 py-14 md:py-20">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="eyebrow">Tsutaya Bookstore</p>
            <h3 className="mt-4 font-serif-tc text-2xl tracking-[0.2em] text-ink">
              母 親 節 特 輯
            </h3>
            <p className="mt-5 max-w-md text-sm leading-[2] text-ink-soft">
              精選溫馨母親節禮物，搭配淡雅香氛、細膩保養、茶韻酒香禮盒及點綴生活的日常小物，為心意注入詩意與美感。
            </p>
            <p className="mt-6 font-display italic text-sm text-wine">
              Promotional in May 2026 ・ 5/1 — 5/31
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow">Stores</p>
            <ul className="mt-4 space-y-2 font-serif-tc text-sm text-ink">
              <li>
                <Link href="/xinyi" className="hover:text-wine transition-colors">
                  ・台北信義店
                </Link>
              </li>
              <li>
                <Link href="/taichung" className="hover:text-wine transition-colors">
                  ・台中市政店
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow">Index</p>
            <ul className="mt-4 grid grid-cols-2 gap-y-2 font-serif-tc text-sm text-ink">
              <li>
                <Link href="/gifts" className="hover:text-wine">
                  送禮推薦
                </Link>
              </li>
              <li>
                <Link href="/stores" className="hover:text-wine">
                  依門市挑選
                </Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-wine">
                  活動須知
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-wine">
                  回首頁
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-rule flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-ink-soft tracking-widest">
            © {new Date().getFullYear()} TSUTAYA BOOKSTORE Taiwan. 未滿十八歲請勿飲酒。
          </p>
          <p className="font-display italic text-xs tracking-[0.3em] text-wine">
            Edited with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
