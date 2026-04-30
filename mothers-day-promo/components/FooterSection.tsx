export default function FooterSection() {
  return (
    <footer
      className="py-10 px-4 text-center"
      style={{ background: "#3D2B1F", color: "#C8A882" }}
    >
      <p className="text-lg font-bold mb-1" style={{ color: "#FDF8F2" }}>
        TSUTAYA BOOKSTORE
      </p>
      <p className="text-sm mb-4">台北信義店・台中市政店</p>
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs mb-6"
        style={{ background: "rgba(253,248,242,0.1)", color: "#E5CBA8" }}
      >
        活動期間：2026 / 5 / 1 — 2026 / 5 / 31
      </div>
      <p className="text-xs" style={{ color: "#8B6F47" }}>
        部分品牌活動期間不同，以各活動說明及現場公告為準。
      </p>
    </footer>
  );
}
