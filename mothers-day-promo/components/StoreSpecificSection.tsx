import SectionTitle from "./SectionTitle";

const xinyiOnlyBrands = [
  { brand: "美珂媞歐", detail: "全品牌 7 折" },
  { brand: "J-scent", detail: "任選 2 件 85 折" },
];

const taichungOnlyBrands = [
  { brand: "MAGBLOX", detail: "磁力片單盒 9 折" },
  { brand: "沃堤思世界茶莊園", detail: "盒裝茶任選 3 件 NT$990" },
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
        title="門市限定與適用範圍"
        subtitle="部分品牌優惠僅限特定門市，出發前請確認適用門市。"
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Xinyi */}
        <div
          className="rounded-xl p-5"
          style={{ background: "#FDF8F2", border: "1px solid #E8D8D0" }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "#8B2E35", color: "#FDF8F2" }}
            >
              信
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#1C1410" }}>
                台北信義店限定
              </p>
              <p className="text-xs" style={{ color: "#A08060" }}>
                TSUTAYA BOOKSTORE 台北信義店
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {xinyiOnlyBrands.map((item) => (
              <div
                key={item.brand}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                style={{ background: "#FFFFFF", border: "1px solid #EDE0D8" }}
              >
                <p className="font-medium text-sm" style={{ color: "#1C1410" }}>
                  {item.brand}
                </p>
                <p className="text-xs font-semibold" style={{ color: "#8B2E35" }}>
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Taichung */}
        <div
          className="rounded-xl p-5"
          style={{ background: "#F4F8F6", border: "1px solid #C8DDD6" }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "#2D4A3E", color: "#FDF8F2" }}
            >
              中
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#1C1410" }}>
                台中市政店限定
              </p>
              <p className="text-xs" style={{ color: "#A08060" }}>
                TSUTAYA BOOKSTORE 台中市政店
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {taichungOnlyBrands.map((item) => (
              <div
                key={item.brand}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                style={{ background: "#FFFFFF", border: "1px solid #C8DDD6" }}
              >
                <p className="font-medium text-sm" style={{ color: "#1C1410" }}>
                  {item.brand}
                </p>
                <p className="text-xs font-semibold" style={{ color: "#2D4A3E" }}>
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Both stores */}
      <div
        className="mt-5 rounded-xl p-5"
        style={{ background: "#FDF8F2", border: "1px solid #E8D8C8" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex -space-x-1">
            <div
              className="w-7 h-7 rounded flex items-center justify-center text-[11px] font-bold ring-2 ring-white"
              style={{ background: "#8B2E35", color: "#FDF8F2" }}
            >信</div>
            <div
              className="w-7 h-7 rounded flex items-center justify-center text-[11px] font-bold ring-2 ring-white"
              style={{ background: "#2D4A3E", color: "#FDF8F2" }}
            >中</div>
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: "#1C1410" }}>雙店同步適用</p>
            <p className="text-xs" style={{ color: "#A08060" }}>台北信義店 + 台中市政店</p>
          </div>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {bothStoresBrands.map((b) => (
            <div
              key={b.name}
              className="px-3 py-2.5 rounded-lg"
              style={{ background: "#FFFFFF", border: "1px solid #EDE0D8" }}
            >
              <p className="font-medium text-sm leading-snug" style={{ color: "#1C1410" }}>
                {b.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#8B6F47" }}>
                {b.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      <span id="xinyi" className="block h-0 -mt-20 pt-20" />
      <span id="taichung" className="block h-0" />
    </section>
  );
}
