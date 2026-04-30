export default function StoreQuickNav() {
  return (
    <section className="py-10 px-4 max-w-5xl mx-auto">
      <h2
        className="font-serif text-xl sm:text-2xl font-bold text-center mb-2"
        style={{ color: "#1C1410" }}
      >
        依門市查看優惠
      </h2>
      <p className="text-sm text-center mb-7" style={{ color: "#8B6F47" }}>
        部分優惠僅限特定門市，請確認後前往選購。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 台北信義店 */}
        <div
          className="rounded-xl p-6 flex flex-col gap-4"
          style={{ background: "#FDF8F2", border: "1px solid #E8D8D0" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: "#8B2E35", color: "#FDF8F2" }}
            >
              信
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: "#1C1410" }}>台北信義店</p>
              <p className="text-xs" style={{ color: "#A08060" }}>TSUTAYA BOOKSTORE 台北信義店</p>
            </div>
          </div>

          <ul className="flex flex-col gap-2 text-sm" style={{ color: "#5A4030" }}>
            <li className="flex items-center gap-2">
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#8B2E35", display: "inline-block", flexShrink: 0 }} />
              美珂媞歐 全品牌 7 折
            </li>
            <li className="flex items-center gap-2">
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#8B2E35", display: "inline-block", flexShrink: 0 }} />
              J-scent 任選 2 件 85 折
            </li>
            <li className="flex items-center gap-2 text-xs" style={{ color: "#A08060" }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#C8845E", display: "inline-block", flexShrink: 0 }} />
              雙店同步優惠同步適用
            </li>
          </ul>

          <a
            href="#store-specific"
            className="mt-auto block text-center py-2.5 rounded text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: "#8B2E35", color: "#FDF8F2" }}
            data-track="store_nav_xinyi"
          >
            查看台北信義店優惠
          </a>
        </div>

        {/* 台中市政店 */}
        <div
          className="rounded-xl p-6 flex flex-col gap-4"
          style={{ background: "#F4F8F6", border: "1px solid #C8DDD6" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: "#2D4A3E", color: "#FDF8F2" }}
            >
              中
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: "#1C1410" }}>台中市政店</p>
              <p className="text-xs" style={{ color: "#A08060" }}>TSUTAYA BOOKSTORE 台中市政店</p>
            </div>
          </div>

          <ul className="flex flex-col gap-2 text-sm" style={{ color: "#5A4030" }}>
            <li className="flex items-center gap-2">
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#2D4A3E", display: "inline-block", flexShrink: 0 }} />
              MAGBLOX 磁力片單盒 9 折
            </li>
            <li className="flex items-center gap-2">
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#2D4A3E", display: "inline-block", flexShrink: 0 }} />
              沃堤思世界茶莊園 盒裝茶任選 3 件 NT$990
            </li>
            <li className="flex items-center gap-2 text-xs" style={{ color: "#A08060" }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#C8845E", display: "inline-block", flexShrink: 0 }} />
              雙店同步優惠同步適用
            </li>
          </ul>

          <a
            href="#store-specific"
            className="mt-auto block text-center py-2.5 rounded text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: "#2D4A3E", color: "#FDF8F2" }}
            data-track="store_nav_taichung"
          >
            查看台中市政店優惠
          </a>
        </div>
      </div>
    </section>
  );
}
