export default function FooterSection() {
  return (
    <footer
      className="py-12 px-4 text-center"
      style={{ background: "#1C1410", color: "#A08060" }}
    >
      <p
        className="font-serif text-lg font-bold mb-1 tracking-[0.1em]"
        style={{ color: "#FDF8F2" }}
      >
        TSUTAYA BOOKSTORE
      </p>
      <p className="text-sm mb-6 tracking-wider" style={{ color: "#7A6555" }}>
        台北信義店・台中市政店
      </p>

      <div className="flex items-center justify-center gap-4 mb-6">
        <div style={{ width: 40, height: 1, background: "#3A2E28" }} />
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#6B5040" }} />
        <div style={{ width: 40, height: 1, background: "#3A2E28" }} />
      </div>

      <p className="text-xs tracking-wider mb-1" style={{ color: "#6B5040" }}>
        活動期間：2026 / 5 / 1 — 2026 / 5 / 31
      </p>
      <p className="text-xs" style={{ color: "#4A3A30" }}>
        部分品牌活動期間不同，以各活動說明及現場公告為準。
      </p>
    </footer>
  );
}
