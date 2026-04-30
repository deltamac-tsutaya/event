export default function HeroSection() {
  return (
    <section className="hero-gradient min-h-[96vh] flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center relative overflow-hidden">
      {/* Soft background blobs */}
      <div
        className="absolute top-[-140px] right-[-100px] w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(232,165,160,0.22), transparent 68%)" }}
      />
      <div
        className="absolute bottom-[-120px] left-[-80px] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,132,94,0.18), transparent 68%)" }}
      />
      <div
        className="absolute top-[30%] left-[-60px] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,110,71,0.1), transparent 70%)" }}
      />

      {/* Decorative floral SVG — top right */}
      <svg
        className="absolute top-8 right-8 opacity-10 pointer-events-none hidden md:block"
        width="180" height="180" viewBox="0 0 180 180" fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="90" cy="90" r="60" stroke="#C8845E" strokeWidth="1"/>
        <circle cx="90" cy="90" r="40" stroke="#C8845E" strokeWidth="0.5"/>
        {[0,45,90,135,180,225,270,315].map((deg, i) => (
          <ellipse
            key={i}
            cx="90" cy="90"
            rx="6" ry="16"
            fill="#C8845E"
            transform={`rotate(${deg} 90 90) translate(0,-44)`}
            opacity="0.6"
          />
        ))}
        <circle cx="90" cy="90" r="7" fill="#C8845E" opacity="0.5"/>
      </svg>

      {/* Decorative floral SVG — bottom left */}
      <svg
        className="absolute bottom-16 left-8 opacity-8 pointer-events-none hidden md:block"
        width="120" height="120" viewBox="0 0 120 120" fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="60" cy="60" r="40" stroke="#8B2E35" strokeWidth="0.8"/>
        {[0,60,120,180,240,300].map((deg, i) => (
          <ellipse
            key={i}
            cx="60" cy="60"
            rx="5" ry="14"
            fill="#8B2E35"
            transform={`rotate(${deg} 60 60) translate(0,-28)`}
            opacity="0.4"
          />
        ))}
        <circle cx="60" cy="60" r="5" fill="#8B2E35" opacity="0.4"/>
      </svg>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Event tag */}
        <div className="fade-in-up mb-7 flex justify-center">
          <span
            className="tag-badge px-5 py-1.5 text-xs tracking-widest uppercase font-medium"
            style={{
              background: "rgba(200,132,94,0.12)",
              color: "#8B6F47",
              border: "1px solid rgba(200,132,94,0.35)",
              letterSpacing: "0.18em",
            }}
          >
            2026 五月特惠活動
          </span>
        </div>

        {/* Brand name */}
        <p
          className="fade-in-up fade-in-up-delay-1 font-serif text-base sm:text-lg tracking-[0.22em] uppercase mb-3"
          style={{ color: "#8B6F47" }}
        >
          TSUTAYA BOOKSTORE
        </p>

        {/* Main heading */}
        <h1
          className="fade-in-up fade-in-up-delay-2 font-serif text-5xl sm:text-6xl md:text-7xl font-bold mb-5 leading-tight"
        >
          <span className="gradient-text-wine">五月</span>
          <span style={{ color: "#3D2B1F" }}>，</span>
          <span style={{ color: "#3D2B1F" }}>特惠</span>
          <br />
          <span
            className="font-serif italic font-normal text-3xl sm:text-4xl md:text-5xl"
            style={{ color: "#6B5040" }}
          >
            為日常挑選一份剛好的心意
          </span>
        </h1>

        {/* Divider */}
        <div className="fade-in-up fade-in-up-delay-2 flex items-center justify-center gap-4 my-6">
          <div style={{ flex: 1, maxWidth: 80, height: 1, background: "linear-gradient(to left, #C8845E, transparent)", opacity: 0.5 }} />
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1 C9 1 11 5 11 9 C11 13 9 17 9 17 C9 17 7 13 7 9 C7 5 9 1 9 1Z" fill="#C8845E" opacity="0.6"/>
            <path d="M1 9 C1 9 5 7 9 7 C13 7 17 9 17 9 C17 9 13 11 9 11 C5 11 1 9 1 9Z" fill="#C8845E" opacity="0.6"/>
          </svg>
          <div style={{ flex: 1, maxWidth: 80, height: 1, background: "linear-gradient(to right, #C8845E, transparent)", opacity: 0.5 }} />
        </div>

        {/* Description */}
        <p
          className="fade-in-up fade-in-up-delay-3 text-base sm:text-lg font-light mb-2 max-w-xl mx-auto leading-relaxed"
          style={{ color: "#8B6F47" }}
        >
          精選香氛保養、茶酒禮盒、生活配件與親子選品，
          <br className="hidden sm:block" />
          推出期間限定優惠。無論送禮或日常補貨，書店皆有合適選擇。
        </p>

        {/* Date badge */}
        <div className="fade-in-up fade-in-up-delay-3 mt-7 flex flex-col items-center gap-2">
          <div
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full text-sm font-medium"
            style={{
              background: "#3D2B1F",
              color: "#FDF8F2",
              letterSpacing: "0.04em",
            }}
          >
            <span style={{ opacity: 0.7 }}>◇</span>
            <span>活動期間：2026 / 5 / 1 — 2026 / 5 / 31</span>
            <span style={{ opacity: 0.7 }}>◇</span>
          </div>
          <p className="text-xs" style={{ color: "#A08060" }}>
            適用門市：台北信義店・台中市政店｜部分品牌活動期間依現場公告為準
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="fade-in-up fade-in-up-delay-4 flex flex-col sm:flex-row gap-3 justify-center items-center mt-10">
          <a
            href="#xinyi"
            className="px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 hover:opacity-90 hover:scale-[1.03] hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #8B2E35 0%, #A8363E 100%)",
              color: "#FDF8F2",
              boxShadow: "0 4px 16px rgba(139,46,53,0.3)",
            }}
          >
            查看信義店優惠
          </a>
          <a
            href="#taichung"
            className="px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 hover:opacity-90 hover:scale-[1.03] hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #2D4A3E 0%, #3A6050 100%)",
              color: "#FDF8F2",
              boxShadow: "0 4px 16px rgba(45,74,62,0.3)",
            }}
          >
            查看台中市政店優惠
          </a>
          <a
            href="#mothers-day"
            className="px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 hover:bg-rose-50"
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
        <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 72L80 60C160 48 320 24 480 16C640 8 800 16 960 22C1120 28 1280 30 1360 30L1440 30V72H0Z"
            fill="#FDF8F2"
          />
        </svg>
      </div>
    </section>
  );
}
