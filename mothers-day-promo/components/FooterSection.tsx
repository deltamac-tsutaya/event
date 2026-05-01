export default function FooterSection() {
  return (
    <footer
      className="relative pt-12 pb-10 px-4 text-center overflow-hidden"
      style={{ background: "#1C1410", color: "#A08060" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, #C8845E 30%, #C8845E 70%, transparent)", opacity: 0.3 }}
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* CTA */}
        <p className="text-sm mb-5 leading-relaxed" style={{ color: "#C8A882" }}>
          活動商品數量依現場庫存為準，歡迎至 TSUTAYA BOOKSTORE
          <br className="hidden sm:block" />
          台北信義店與台中市政店選購。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <a
            href="#xinyi"
            className="px-6 py-2.5 rounded text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: "#8B2E35", color: "#FDF8F2" }}
          >
            台北信義店優惠
          </a>
          <a
            href="#taichung"
            className="px-6 py-2.5 rounded text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: "#2D4A3E", color: "#FDF8F2" }}
          >
            台中市政店優惠
          </a>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div style={{ width: 40, height: 1, background: "#3A2E28" }} />
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#6B5040" }} />
          <div style={{ width: 40, height: 1, background: "#3A2E28" }} />
        </div>

        <p className="font-serif text-lg font-bold mb-1 tracking-[0.1em]" style={{ color: "#FDF8F2" }}>
          TSUTAYA BOOKSTORE
        </p>
        <p className="text-sm mb-5 tracking-wider" style={{ color: "#7A6555" }}>
          台北信義店・台中市政店
        </p>
        <p className="text-xs tracking-wider mb-1" style={{ color: "#6B5040" }}>
          活動期間：2026 / 5 / 1 — 2026 / 5 / 31
        </p>
        <p className="text-xs" style={{ color: "#4A3A30" }}>
          部分品牌活動期間不同，以各活動說明及現場公告為準。
        </p>
      </div>
    </footer>
  );
}
