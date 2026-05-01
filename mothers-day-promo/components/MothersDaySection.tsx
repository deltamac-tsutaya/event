import SectionTitle from "./SectionTitle";
import PromoCard from "./PromoCard";

const giftPicks = [
  {
    brand: "LASAI",
    headline: "母親節限定身體套組 NT$1,470",
    description: "母親節限定身體套組優惠價 NT$1,470，包含日常身體保養品項，適合送給重視香氣與肌膚照護的對象。",
    period: "4/1 至 5/10",
    stores: ["台北信義店", "台中市政店"],
    highlight: "母親節限定",
    giftTag: "適合送給重視保養的她",
    accent: "rose" as const,
  },
  {
    brand: "聖朵波緹",
    headline: "身體保養組合 NT$599",
    description: "身體乳液＋沐浴膠組合，原價 NT$1,079，活動價 NT$599。",
    period: "4/1 至 6/30",
    stores: ["台北信義店", "台中市政店"],
    highlight: "折扣優惠",
    giftTag: "適合送給喜愛身體保養的她",
    accent: "rose" as const,
  },
  {
    brand: "Panier des Sens 潘提香頌",
    headline: "全系列 75 折",
    description: "潘提香頌全系列 75 折。精選法式香氛、身體清潔與護手保養。",
    period: "即期品除外",
    stores: ["台北信義店", "台中市政店"],
    highlight: "折扣優惠",
    giftTag: "適合送給喜愛香氛的她",
    accent: "apricot" as const,
  },
  {
    brand: "蒔年一晌 茶 ／ 私咖啡",
    headline: "茶咖禮盒單件 88 折",
    description: "咖啡禮盒與蒔年一晌茶品系列，單件即享 88 折。",
    period: "4/1 至 5/31",
    stores: ["台北信義店", "台中市政店"],
    highlight: "折扣優惠",
    giftTag: "適合送給愛茶愛咖啡的她",
    accent: "wine" as const,
  },
  {
    brand: "黑白小姐",
    headline: "消費滿 NT$200 贈母親節卡片",
    description: "購買黑白小姐商品滿 NT$200，即贈母親節卡片乙張，可搭配禮品作為節日心意。",
    period: "數量有限，不累送",
    stores: ["台北信義店", "台中市政店"],
    highlight: "滿額贈",
    giftTag: "適合搭配其他禮品",
    accent: "apricot" as const,
  },
  {
    brand: "Betterology",
    headline: "書店消費滿額贈體驗組",
    description: "活動期間於書店消費滿 NT$1,200，即贈 Betterology 體驗組乙份。贈品數量有限，送完為止。",
    period: "不累贈",
    stores: ["台北信義店", "台中市政店"],
    highlight: "滿額贈",
    giftTag: "適合送給注重健康的她",
    accent: "forest" as const,
  },
];

export default function MothersDaySection() {
  return (
    <section className="py-12 px-4 max-w-5xl mx-auto" id="mothers-day">
      <SectionTitle
        title="母親節送禮推薦"
        subtitle="從香氛、身體保養、茶咖酒禮盒到日常配件，挑選一份能融入生活的禮物。"
      />
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {giftPicks.map((item, i) => (
          <PromoCard key={i} {...item} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <a
          href="#store-specific"
          className="inline-block px-7 py-3.5 rounded text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ background: "#8B2E35", color: "#FDF8F2" }}
          data-track="cta_mothers_day_store"
        >
          前往門市挑選母親節禮物
        </a>
      </div>
    </section>
  );
}
