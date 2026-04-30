import SectionTitle from "./SectionTitle";
import PromoCard from "./PromoCard";

const giftPicks = [
  {
    brand: "LASAI",
    headline: "母親節限定身體套組 NT$1,470",
    description:
      "母親節限定身體套組優惠價 NT$1,470。以香氣與肌膚保養傳遞心意。",
    period: "2026/4/1 — 2026/5/10",
    stores: ["台北信義店", "台中市政店"],
    highlight: "母親節限定",
    accent: "rose" as const,
  },
  {
    brand: "聖朵波緹",
    headline: "身體保養組合 NT$599",
    description:
      "身體乳液＋沐浴膠組合，原價 NT$1,079，活動價 NT$599。",
    period: "2026/4/1 — 2026/6/30",
    stores: ["台北信義店", "台中市政店"],
    highlight: "44 折",
    accent: "rose" as const,
  },
  {
    brand: "Panier des Sens 潘提香頌",
    headline: "全系列 75 折",
    description:
      "潘提香頌全系列 75 折。精選法式香氛、身體清潔與護手保養。",
    period: "即期品除外",
    stores: ["台北信義店", "台中市政店"],
    highlight: "75 折",
    accent: "apricot" as const,
  },
  {
    brand: "蒔年一晌 茶 ／ 私咖啡",
    headline: "茶咖禮盒單件 88 折",
    description:
      "咖啡禮盒與蒔年一晌茶品系列，單件即享 88 折。",
    period: "2026/4/1 — 2026/5/31",
    stores: ["台北信義店", "台中市政店"],
    highlight: "88 折",
    accent: "wine" as const,
  },
  {
    brand: "黑白小姐",
    headline: "消費滿 NT$200 贈母親節卡片",
    description:
      "消費黑白小姐商品滿 NT$200，即贈母親節卡片乙張。",
    period: "數量有限，不累送",
    stores: ["台北信義店", "台中市政店"],
    highlight: "滿額贈",
    accent: "apricot" as const,
  },
  {
    brand: "Betterology",
    headline: "書店消費滿額贈體驗組",
    description:
      "書店消費滿 NT$1,200，即贈 Betterology 體驗組乙份，數量有限，贈完為止。",
    period: "不累贈",
    stores: ["台北信義店", "台中市政店"],
    highlight: "滿額贈",
    accent: "forest" as const,
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
