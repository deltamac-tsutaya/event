export default function FooterSection() {
  const links = [
    ["#mothers-day", "送禮推薦"],
    ["#store-specific", "依門市挑選"],
    ["#fragrance", "香氛保養"],
    ["#tea-wine", "茶咖酒禮盒"],
    ["#lifestyle", "生活配件"],
    ["#kids", "親子選品"],
  ] as const;

  return (
    <footer
      style={{
        marginTop: "6rem",
        borderTop: "1px solid var(--color-rule, #C8B89A)",
        background: "var(--color-paper-deep, #F5EDE0)",
      }}
    >
      <div className="mx-auto max-w-5xl px-5 md:px-10 py-14 md:py-20">
        <div className="grid md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <p className="eyebrow">Tsutaya Bookstore</p>
            <h3
              className="mt-4 font-serif-tc text-2xl tracking-[0.2em]"
              style={{ color: "var(--color-ink, #1C1410)" }}
            >
              母 親 節 特 輯
            </h3>
            <p
              className="mt-5 max-w-md text-sm leading-[2]"
              style={{ color: "var(--color-ink-soft, #6B5040)" }}
            >
              精選溫馨母親節禮物，搭配淡雅香氛、細膩保養、茶韻酒香禮盒及點綴生活的日常小物，為心意注入詩意與美感。
            </p>
            <p
              className="mt-5 font-display text-sm"
              style={{ fontStyle: "italic", color: "var(--color-wine, #8B2E35)", letterSpacing: "0.2em" }}
            >
              Promotional in May 2026 ・ 5/1 — 5/31
            </p>
          </div>

          {/* Stores */}
          <div className="md:col-span-3">
            <p className="eyebrow">Stores</p>
            <div className="mt-4 space-y-3">
              <a
                href="#xinyi"
                className="block px-4 py-2.5 text-sm font-semibold tracking-wide transition-opacity hover:opacity-80"
                style={{ background: "#8B2E35", color: "#FDF8F2" }}
              >
                台北信義店優惠
              </a>
              <a
                href="#taichung"
                className="block px-4 py-2.5 text-sm font-semibold tracking-wide transition-opacity hover:opacity-80"
                style={{ background: "#2D4A3E", color: "#FDF8F2" }}
              >
                台中市政店優惠
              </a>
            </div>
          </div>

          {/* Index */}
          <div className="md:col-span-4">
            <p className="eyebrow">Index</p>
            <ul
              className="mt-4 grid grid-cols-2 gap-y-2 font-serif-tc text-sm"
              style={{ color: "var(--color-ink, #1C1410)" }}
            >
              {links.map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="hover:opacity-60 transition-opacity">
                    ・{label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom rule */}
        <div
          className="mt-14 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          style={{ borderTop: "1px solid var(--color-rule, #C8B89A)" }}
        >
          <p className="text-xs tracking-widest" style={{ color: "var(--color-ink-soft, #6B5040)" }}>
            © {new Date().getFullYear()} TSUTAYA BOOKSTORE Taiwan. 未滿十八歲請勿飲酒。
          </p>
          <p
            className="font-display text-xs tracking-[0.3em]"
            style={{ fontStyle: "italic", color: "var(--color-wine, #8B2E35)" }}
          >
            Edited with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
