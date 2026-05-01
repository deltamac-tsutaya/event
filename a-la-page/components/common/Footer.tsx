import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-cream mt-20 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">À LA PAGE</h3>
            <p className="text-sm text-gray-light mb-6">
              TSUTAYA BOOKSTORE × WIRED TOKYO 的數位第三空間，策展食物、書籍與生活的故事。
            </p>
            <div className="flex gap-4">
              <a
                href="https://line.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center border border-gray-light hover:border-cream hover:text-cream transition text-sm"
                aria-label="LINE"
              >
                L
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center border border-gray-light hover:border-cream hover:text-cream transition text-sm"
                aria-label="Instagram"
              >
                I
              </a>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center border border-gray-light hover:border-cream hover:text-cream transition text-sm"
                aria-label="Facebook"
              >
                F
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-sans font-bold mb-4 uppercase tracking-widest text-gray-light">
              導航
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-gray-light hover:text-cream transition">
                  首頁
                </Link>
              </li>
              <li>
                <Link href="/issues" className="text-sm text-gray-light hover:text-cream transition">
                  月刊總覽
                </Link>
              </li>
              <li>
                <Link href="/stores" className="text-sm text-gray-light hover:text-cream transition">
                  店舖
                </Link>
              </li>
              <li>
                <Link href="/collaboration" className="text-sm text-gray-light hover:text-cream transition">
                  合作申請
                </Link>
              </li>
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="text-sm font-sans font-bold mb-4 uppercase tracking-widest text-gray-light">
              資訊
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-sm text-gray-light hover:text-cream transition">
                  聯絡資訊
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-light hover:text-cream transition">
                  常見問題
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-light hover:text-cream transition">
                  隱私政策
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-light hover:text-cream transition">
                  使用條款
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-sans font-bold mb-4 uppercase tracking-widest text-gray-light">
              聯絡我們
            </h4>
            <ul className="space-y-3 text-sm text-gray-light">
              <li>
                電話：<a href="tel:+886" className="hover:text-cream transition">+886-2-XXXX-XXXX</a>
              </li>
              <li>
                信箱：<a href="mailto:info@a-la-page.tw" className="hover:text-cream transition">
                  info@a-la-page.tw
                </a>
              </li>
              <li>
                地址：
                <br />
                台北市信義區信義路五段 100 號 3F
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-dark py-8">
          {/* Brand Partners */}
          <div className="mb-8">
            <p className="text-xs text-gray-light mb-4 uppercase tracking-widest">
              合作品牌
            </p>
            <div className="flex gap-6 flex-wrap">
              <div className="text-sm text-gray-light">TSUTAYA BOOKSTORE</div>
              <div className="text-sm text-gray-light">WIRED TOKYO</div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-light">
            <p>© 2025 À LA PAGE. All rights reserved.</p>
            <p className="mt-2">
              A Digital Third Space by TSUTAYA BOOKSTORE × WIRED TOKYO
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
