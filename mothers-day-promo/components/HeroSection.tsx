export default function HeroSection() {
  return (
    <section
      className="min-h-[100svh] sm:min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center relative"
      style={{ background: "linear-gradient(180deg, #F5EDE0 0%, #FDF8F2 100%)" }}
    >
      <div className="max-w-2xl mx-auto w-full">
        {/* Eyebrow */}
        <p
          className="text-xs tracking-[0.25em] uppercase mb-6 font-medium"
          style={{ color: "#8B6F47" }}
        >
          TSUTAYA BOOKSTORE &nbsp;·&nbsp; Promotional in May 2026
        </p>

        {/* Main heading */}
        <h1
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4"
          style={{ color: "#1C1410" }}
        >
          精選生活風格禮品
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div style={{ width: 48, height: 1, background: "#C8845E", opacity: 0.4 }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8845E", opacity: 0.5 }} />
          <div style={{ width: 48, height: 1, background: "#C8845E", opacity: 0.4 }} />
        </div>

        {/* Description */}
        <p
          className="text-sm sm:text-base leading-relaxed mb-3 max-w-lg mx-auto"
          style={{ color: "#6B5040" }}
        >
          精選溫馨母親節禮物，搭配淡雅香氛、細膩保養、茶韻酒香禮盒及點綴生活的日常小物，為心意注入詩意與美感。
        </p>

        {/* Date */}
        <p
          className="text-xs tracking-wider mb-2"
          style={{ color: "#A08060" }}
        >
          活動期間：2026 / 5 / 1 — 2026 / 5 / 31
        </p>
        <p className="text-xs mb-10" style={{ color: "#B89070" }}>
          台北信義店・台中市政店
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a
            href="#mothers-day"
            className="w-full sm:w-auto px-7 py-3 rounded text-sm font-semibold tracking-wide transition-opacity hover:opacity-80"
            style={{ background: "#8B2E35", color: "#FDF8F2" }}
          >
            看母親節送禮推薦
          </a>
          <a
            href="#xinyi"
            className="w-full sm:w-auto px-7 py-3 rounded text-sm font-semibold tracking-wide transition-opacity hover:opacity-80"
            style={{ background: "#2D4A3E", color: "#FDF8F2" }}
          >
            看台北信義店優惠
          </a>
          <a
            href="#taichung"
            className="w-full sm:w-auto px-7 py-3 rounded text-sm font-semibold tracking-wide transition-opacity hover:opacity-80"
            style={{ background: "transparent", color: "#1C1410", border: "1px solid #C8A882" }}
          >
            看台中市政店優惠
          </a>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 48L360 24C720 0 1080 24 1440 24V48H0Z" fill="#FDF8F2" />
        </svg>
      </div>
    </section>
  );
}
