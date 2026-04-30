import SectionTitle from "./SectionTitle";

const xinyiOnlyBrands = [
  { brand: "美珂媞歐", detail: "全品牌 7 折", icon: "🌹" },
  { brand: "J-scent", detail: "任選 2 件 85 折", icon: "🌸" },
];

const taichungOnlyBrands = [
  { brand: "MAGBLOX", detail: "磁力片單盒 9 折", icon: "🧩" },
  { brand: "沃堤思世界茶莊園", detail: "盒裝茶任選 3 件 NT$990", icon: "🍵" },
];

const bothStoresBrands = [
  { name: "Yoreh 悠若", detail: "指定傘款 9 折" },
  { name: "Betterology", detail: "單盒 95 折 ＋ 滿額贈" },
  { name: "Handiin", detail: "全品牌 88 折" },
  { name: "LASAI", detail: "母親節套組 NT$1,470" },
  { name: "覺萃", detail: "全品項 9 折" },
  { name: "茶寶", detail: "全品項 9 折" },
  { name: "聖朵波緹", detail: "多項優惠" },
  { name: "蒔年一晌", detail: "茶咖 88 折 ／ 酒品 8 折" },
  { name: "Panier des Sens 潘提香頌", detail: "全系列 75 折" },
  { name: "今治 / Matsukan / MIYAZAKI TOWEL", detail: "兩件 9 折" },
  { name: "覓梅酒", detail: "組合 NT$1,280" },
  { name: "EcoScential", detail: "新品牌上市" },
  { name: "SONNY ANGEL", detail: "滿三件贈書籤" },
  { name: "黑白小姐", detail: "滿 NT$200 贈卡片" },
  { name: "KIND BAG", detail: "清倉 3 折" },
  { name: "郁郁", detail: "兩件 95 折" },
  { name: "Hellome", detail: "新品 NT$590" },
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
        {/* Xinyi */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "#FBF0F1", border: "1px solid #E8A5A0" }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
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
            {xinyiOnlyBrands.map((item) => (
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

        {/* Taichung */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "#EEF5F2", border: "1px solid #7AA898" }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
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
            {taichungOnlyBrands.map((item) => (
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
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {bothStoresBrands.map((b) => (
            <div
              key={b.name}
              className="rounded-xl px-3 py-2.5"
              style={{ background: "#FDF8F2", border: "1px solid #E5A882" }}
            >
              <p className="font-semibold text-sm leading-snug" style={{ color: "#3D2B1F" }}>
                {b.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#8B6F47" }}>
                {b.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Anchor targets for Hero CTA */}
      <span id="xinyi" className="block h-0 -mt-20 pt-20" />
      <span id="taichung" className="block h-0" />
    </section>
  );
}
