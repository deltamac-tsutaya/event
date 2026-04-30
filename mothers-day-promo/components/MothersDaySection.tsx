import SectionTitle from "./SectionTitle";
import PromoCard from "./PromoCard";

const giftPicks = [
  {
    brand: "LASAI",
    headline: "母親節限定身體套組 NT$1,470",
    description:
      "以香氣與肌膚保養傳遞心意。母親節限定套組，質感包裝，直接送禮免煩惱。",
    period: "2026/4/1 — 2026/5/10",
    stores: ["台北信義店", "台中市政店"],
    highlight: "母親節推薦",
    accent: "rose" as const,
  },
  {
    brand: "聖朵波緹",
    headline: "身體乳液＋沐浴膠組合 NT$599",
    description:
      "原價 NT$1,079，活動價 NT$599。精選身體乳液搭配沐浴膠，呵護肌膚日常。",
    period: "2026/4/1 — 2026/6/30",
    stores: ["台北信義店", "台中市政店"],
    highlight: "4.7 折",
    accent: "rose" as const,
  },
  {
    brand: "Panier des Sens 潘提香頌",
    headline: "全系列 75 折",
    description:
      "精選法式香氛、身體清潔與護手保養，全系列 75 折。把法式生活提案帶回家。",
    period: "2026/4/1 — 2026/5/10",
    stores: ["台北信義店", "台中市政店"],
    note: "即期品除外",
    highlight: "75 折",
    accent: "apricot" as const,
  },
  {
    brand: "蒔年一晌",
    headline: "茶咖禮盒單件 88 折",
    description:
      "咖啡禮盒與茶品系列，單件即享 88 折。把好味道包裝成一份心意，適合送給懂得享受的她。",
    period: "2026/4/1 — 2026/5/31",
    stores: ["台北信義店", "台中市政店"],
    highlight: "88 折",
    accent: "wine" as const,
  },
  {
    brand: "覺萃",
    headline: "精選茶品系列優惠",
    description:
      "台灣特色茶品，細緻茶香融入日常。送給愛喝茶的媽媽，一份有溫度的禮物。",
    period: "2026/5/1 — 2026/5/31",
    stores: ["台北信義店", "台中市政店"],
    accent: "forest" as const,
  },
  {
    brand: "美珂媞歐",
    headline: "全品牌 7 折",
    description:
      "精緻保養品牌，以溫和成分守護肌膚。母親節最貼心的保養禮物。",
    period: "2026/5/1 — 2026/5/31",
    stores: ["台北信義店"],
    highlight: "7 折",
    note: "台北信義店限定",
    accent: "rose" as const,
  },
];

export default function MothersDaySection() {
  return (
    <section className="py-12 px-4 max-w-5xl mx-auto" id="mothers-day">
      <SectionTitle
        icon="🌸"
        title="母親節送禮推薦"
        subtitle="從香氛、身體保養、茶酒禮盒到日常配件，挑選一份能融入生活的禮物。"
      />
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {giftPicks.map((item, i) => (
          <PromoCard key={i} {...item} />
        ))}
      </div>
    </section>
  );
}
