const brands = [
  "LASAI", "Panier des Sens", "聖朵波緹", "蒔年一晌",
  "J-scent", "EcoScential", "茶寶", "Handiin",
  "今治 TOWEL", "MAGBLOX", "SONNY ANGEL", "Yoreh 悠若",
];

export default function HeroSection() {
  return (
    <section className="relative" style={{ background: "var(--color-paper-deep, #F5EDE0)" }}>
      <div className="min-h-[90svh] sm:min-h-screen flex flex-col items-center justify-center px-6 pt-14 pb-16 sm:pt-20 text-center">
        <div className="max-w-2xl mx-auto w-full">
          {/* Eyebrow row */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="num-index">— Vol. 05 ／ 2026</span>
            <span style={{ height: 1, width: 48, background: "var(--color-rule, #C8B89A)", display: "inline-block" }} />
            <span className="eyebrow">Tsutaya Bookstore</span>
          </div>

          {/* Main heading */}
          <h1
            className="font-serif-tc text-[40px] sm:text-[56px] md:text-[72px] leading-[1.2] tracking-[0.06em] font-light"
            style={{ color: "var(--color-ink, #1C1410)" }}
          >
            為母親
            <br />
            <span
              className="font-display"
              style={{
                fontStyle: "italic",
                color: "var(--color-wine, #8B2E35)",
                fontSize: "0.8em",
              }}
            >
              préparer un cadeau
            </span>
            <br />
            挑一份心意
          </h1>

          {/* Rule */}
          <div className="flex items-center justify-center gap-4 my-8">
            <div style={{ width: 48, height: 1, background: "var(--color-rule, #C8B89A)" }} />
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-wine, #8B2E35)", opacity: 0.5 }} />
            <div style={{ width: 48, height: 1, background: "var(--color-rule, #C8B89A)" }} />
          </div>

          {/* Description */}
          <p
            className="text-sm sm:text-base leading-[2.1] mb-7 max-w-lg mx-auto"
            style={{ color: "var(--color-ink-soft, #6B5040)" }}
          >
            精選溫馨母親節禮物，搭配淡雅香氛、細膩保養、茶韻酒香禮盒及點綴生活的日常小物，
            為心意注入詩意與美感。
          </p>

          {/* Period / Stores */}
          <div className="flex items-center justify-center gap-8 text-sm mb-10">
            <div>
              <p className="eyebrow">Period</p>
              <p className="mt-1 font-serif-tc tracking-widest" style={{ color: "var(--color-ink, #1C1410)" }}>
                5 ／ 1 — 5 ／ 31
              </p>
            </div>
            <span style={{ width: 1, height: 40, background: "var(--color-rule, #C8B89A)", display: "inline-block" }} />
            <div>
              <p className="eyebrow">Stores</p>
              <p className="mt-1 font-serif-tc tracking-widest" style={{ color: "var(--color-ink, #1C1410)" }}>
                信義 ・ 市政
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a
              href="#mothers-day"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 text-sm tracking-[0.2em] transition-opacity hover:opacity-80"
              style={{ background: "var(--color-ink, #1C1410)", color: "var(--color-paper, #FDF8F2)" }}
              data-track="hero_cta_mothers_day"
            >
              <span className="font-serif-tc">送禮推薦</span>
              <span className="font-display" style={{ fontStyle: "italic" }}>→</span>
            </a>
            <a
              href="#xinyi"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 text-sm tracking-[0.2em] transition-opacity hover:opacity-80"
              style={{ border: "1px solid #8B2E35", color: "#8B2E35" }}
              data-track="hero_cta_xinyi"
            >
              <span className="font-serif-tc">台北信義店</span>
            </a>
            <a
              href="#taichung"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 text-sm tracking-[0.2em] transition-opacity hover:opacity-80"
              style={{ border: "1px solid #2D4A3E", color: "#2D4A3E" }}
              data-track="hero_cta_taichung"
            >
              <span className="font-serif-tc">台中市政店</span>
            </a>
          </div>
        </div>
      </div>

      {/* Marquee brand strip */}
      <div
        style={{
          borderTop: "1px solid var(--color-rule, #C8B89A)",
          borderBottom: "1px solid var(--color-rule, #C8B89A)",
          overflow: "hidden",
          background: "var(--color-paper, #FDF8F2)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "3rem",
            padding: "0.875rem 0",
            whiteSpace: "nowrap",
            animation: "marquee 40s linear infinite",
          }}
        >
          {[0, 1].map((k) => (
            <div key={k} style={{ display: "flex", gap: "3rem", flexShrink: 0 }}>
              {brands.map((b) => (
                <span key={b + k} className="eyebrow" style={{ opacity: 0.6 }}>
                  ✦ {b}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="pointer-events-none">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 48L360 24C720 0 1080 24 1440 24V48H0Z"
            fill="var(--color-paper, #FDF8F2)"
          />
        </svg>
      </div>

      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </section>
  );
}
