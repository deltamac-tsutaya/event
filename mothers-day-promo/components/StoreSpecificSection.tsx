import SectionTitle from "./SectionTitle";

const xinyiBrands = [
  { brand: "美珂媞歐", detail: "全品牌 7 折", icon: "💄" },
  { brand: "J-scent", detail: "任選 2 件 85 折", icon: "🌸" },
];

const taichungBrands = [
  { brand: "MAGBLOX", detail: "磁力片單盒 9 折", icon: "🧩" },
  { brand: "沃堤思世界茶莊園", detail: "盒裝茶任選 3 件 NT$990", icon: "🍵" },
];

const bothStoresBrands = [
  "Yoreh 悠若",
  "Betterology",
  "Handiin",
  "LASAI",
  "覺萃",
  "茶寶",
  "聖朵波緹",
  "蒔年一晌",
  "Panier des Sens 潘提香頌",
  "今治 / Matsukan / MIYAZAKI TOWEL",
  "覓梅酒",
  "EcoScential",
  "SONNY ANGEL",
  "黑白小姐",
];

export default function StoreSpecificSection() {
  return (
    <section className="py-12 px-4 max-w-5xl mx-auto" id="store-specific">
      <SectionTitle
        icon="📍"
        title="門市限定 & 適用範圍"
        subtitle="部分品牌優惠僅限特定門市，出發前請確認適用門市。"
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Xinyi Store */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "#FBF0F1", border: "1px solid #E8A5A0" }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: "#8B2E35", color: "#FDF8F2" }}
            >
              信
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: "#3D2B1F" }}>
                台北信義店限定
              </p>
              <p className="text-xs" style={{ color: "#A08060" }}>
                TSUTAYA BOOKSTORE 台北信義店
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {xinyiBrands.map((item) => (
              <div
                key={item.brand}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "#FDF8F2" }}
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#3D2B1F" }}>
                    {item.brand}
                  </p>
                  <p className="text-xs" style={{ color: "#8B6F47" }}>
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Taichung Store */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "#EEF5F2", border: "1px solid #7AA898" }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: "#2D4A3E", color: "#FDF8F2" }}
            >
              中
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: "#3D2B1F" }}>
                台中市政店限定
              </p>
              <p className="text-xs" style={{ color: "#A08060" }}>
                TSUTAYA BOOKSTORE 台中市政店
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {taichungBrands.map((item) => (
              <div
                key={item.brand}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "#FDF8F2" }}
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#3D2B1F" }}>
                    {item.brand}
                  </p>
                  <p className="text-xs" style={{ color: "#8B6F47" }}>
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Both stores */}
      <div
        className="mt-6 rounded-2xl p-6"
        style={{ background: "#FDF4EE", border: "1px solid #E5A882" }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="flex -space-x-1.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white"
              style={{ background: "#8B2E35", color: "#FDF8F2" }}
            >
              信
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white"
              style={{ background: "#2D4A3E", color: "#FDF8F2" }}
            >
              中
            </div>
          </div>
          <div>
            <p className="font-bold text-base" style={{ color: "#3D2B1F" }}>
              雙店同步適用
            </p>
            <p className="text-xs" style={{ color: "#A08060" }}>
              台北信義店 + 台中市政店
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {bothStoresBrands.map((brand) => (
            <span
              key={brand}
              className="px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ background: "#FDF8F2", color: "#3D2B1F", border: "1px solid #E5A882" }}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Store info IDs for CTA links */}
      <div className="mt-0">
        <span id="xinyi" className="block h-0" />
        <span id="taichung" className="block h-0" />
      </div>
    </section>
  );
}
