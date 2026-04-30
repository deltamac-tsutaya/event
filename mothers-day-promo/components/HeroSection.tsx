export default function HeroSection() {
  return (
    <section className="hero-gradient min-h-[92vh] flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center relative overflow-hidden">
      {/* Decorative background circles */}
      <div
        className="absolute top-[-120px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #E8A5A0, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-100px] left-[-60px] w-[350px] h-[350px] rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C8845E, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Event tag */}
        <span
          className="tag-badge mb-6 inline-flex"
          style={{
            background: "rgba(200,132,94,0.15)",
            color: "#8B6F47",
            border: "1px solid rgba(200,132,94,0.3)",
          }}
        >
          2026 五月特惠活動
        </span>

        {/* Main heading */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight"
          style={{ color: "#3D2B1F" }}
        >
          TSUTAYA BOOKSTORE
          <br />
          <span style={{ color: "#8B2E35" }}>5 月特惠活動</span>
        </h1>

        {/* Sub heading */}
        <p
          className="text-xl sm:text-2xl font-light mb-6"
          style={{ color: "#6B5040" }}
        >
          五月，為日常挑選一份剛好的心意。
        </p>

        {/* Description */}
        <p
          className="text-base sm:text-lg font-light mb-3 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "#8B6F47" }}
        >
          精選香氛保養、茶酒禮盒、生活配件與親子選品，推出期間限定優惠。
          <br className="hidden sm:block" />
          無論是母親節送禮、日常補貨，都能在書店找到合適選擇。
        </p>

        {/* Date badge */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-2 text-sm font-medium"
          style={{ background: "#3D2B1F", color: "#FDF8F2" }}
        >
          <span>📅</span>
          <span>活動期間：2026 / 5 / 1 — 2026 / 5 / 31</span>
        </div>

        <p className="text-xs mt-2 mb-10" style={{ color: "#A08060" }}>
          適用門市：台北信義店・台中市政店｜部分品牌活動期間依現場公告為準
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a
            href="#xinyi"
            className="px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-105"
            style={{ background: "#8B2E35", color: "#FDF8F2" }}
          >
            查看信義店優惠
          </a>
          <a
            href="#taichung"
            className="px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-105"
            style={{ background: "#2D4A3E", color: "#FDF8F2" }}
          >
            查看台中市政店優惠
          </a>
          <a
            href="#mothers-day"
            className="px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              background: "transparent",
              color: "#8B2E35",
              border: "1.5px solid #8B2E35",
            }}
          >
            母親節送禮推薦 ↓
          </a>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z"
            fill="#FDF8F2"
          />
        </svg>
      </div>
    </section>
  );
}
