export default function FooterSection() {
  return (
    <footer
      className="relative pt-14 pb-10 px-4 text-center overflow-hidden"
      style={{ background: "#2A1F18", color: "#C8A882" }}
    >
      {/* Subtle top border gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, #C8845E 30%, #C8845E 70%, transparent)", opacity: 0.4 }}
      />

      {/* Decorative circle */}
      <div
        className="absolute top-[-80px] right-[-60px] w-[260px] h-[260px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,132,94,0.08), transparent 70%)" }}
      />

      <div className="relative z-10">
        {/* Logo / name */}
        <p
          className="font-serif text-xl sm:text-2xl font-bold mb-1 tracking-[0.12em]"
          style={{ color: "#FDF8F2" }}
        >
          TSUTAYA BOOKSTORE
        </p>
        <p className="text-sm tracking-widest mb-6" style={{ color: "#A08060", letterSpacing: "0.15em" }}>
          台北信義店・台中市政店
        </p>

        {/* Ornamental divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div style={{ width: 60, height: 1, background: "linear-gradient(to left, #C8845E, transparent)", opacity: 0.4 }} />
          <span style={{ color: "#C8845E", opacity: 0.5, fontSize: 10 }}>◆</span>
          <div style={{ width: 60, height: 1, background: "linear-gradient(to right, #C8845E, transparent)", opacity: 0.4 }} />
        </div>

        {/* Date */}
        <div
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs mb-6"
          style={{
            background: "rgba(200,132,94,0.12)",
            color: "#E5CBA8",
            border: "1px solid rgba(200,132,94,0.2)",
            letterSpacing: "0.06em",
          }}
        >
          <span style={{ opacity: 0.6 }}>◇</span>
          活動期間：2026 / 5 / 1 — 2026 / 5 / 31
          <span style={{ opacity: 0.6 }}>◇</span>
        </div>

        <p className="text-xs" style={{ color: "#6B5040" }}>
          部分品牌活動期間不同，以各活動說明及現場公告為準。
        </p>
      </div>
    </footer>
  );
}
