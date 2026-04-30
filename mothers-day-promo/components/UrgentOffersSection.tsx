import PromoCard from "./PromoCard";
import SectionTitle from "./SectionTitle";

const urgentItems = [
  {
    brand: "LASAI",
    headline: "母親節限定身體套組 NT$1,470",
    description: "母親節限定身體套組優惠價 NT$1,470，包含日常身體保養品項。",
    period: "4/1 至 5/10",
    stores: ["台北信義店", "台中市政店"],
    highlight: "母親節限定",
    accent: "rose" as const,
  },
  {
    brand: "覺萃",
    headline: "全品項單品 9 折",
    description: "覺萃全品項單品 9 折。從居家清潔到身體照護，打造安心生活節奏。",
    period: "4/1 至 5/10",
    stores: ["台北信義店", "台中市政店"],
    highlight: "折扣優惠",
    accent: "forest" as const,
  },
  {
    brand: "茶寶",
    headline: "全品項單品 9 折",
    description: "茶寶全品項單品 9 折。以茶籽保養，照顧日常肌膚與髮絲。",
    period: "4/1 至 5/10",
    stores: ["台北信義店", "台中市政店"],
    highlight: "折扣優惠",
    accent: "forest" as const,
  },
  {
    brand: "Betterology",
    headline: "單盒 95 折",
    description: "Betterology 指定商品單盒 95 折。每日營養補給，從日常開始。",
    period: "4/1 至 5/10",
    stores: ["台北信義店", "台中市政店"],
    highlight: "折扣優惠",
    accent: "apricot" as const,
  },
  {
    brand: "Handiin",
    headline: "全品牌 88 折",
    description: "Handiin 全品牌商品 88 折。精選皮件與隨身配件，升級日常使用質感。",
    period: "4/1 至 5/10",
    stores: ["台北信義店", "台中市政店"],
    highlight: "折扣優惠",
    accent: "apricot" as const,
  },
  {
    brand: "今治 / Matsukan / MIYAZAKI TOWEL",
    headline: "日本生活選品兩件 9 折",
    description: "今治、Matsukan、MIYAZAKI TOWEL 品牌商品任選兩件 9 折。",
    period: "4/1 至 5/10",
    stores: ["台北信義店", "台中市政店"],
    highlight: "折扣優惠",
    accent: "forest" as const,
  },
  {
    brand: "覓梅酒",
    headline: "不能梅柚你組合 NT$1,280",
    description: "⑤醺甜釀＋月神柚子酒組合優惠價 NT$1,280，原價 NT$1,800。",
    period: "4/1 至 5/10",
    stores: ["台北信義店", "台中市政店"],
    highlight: "組合優惠",
    note: "未滿 18 歲請勿飲酒",
    accent: "wine" as const,
  },
];

export default function UrgentOffersSection() {
  return (
    <section className="py-12 px-4 max-w-5xl mx-auto" id="limited-time">
      <SectionTitle
        title="5/10 前限時優惠"
        subtitle="以下優惠於 5/10 結束，把握時間選購。"
      />

      {/* Deadline banner */}
      <div
        className="mt-5 flex items-center justify-center gap-2 py-2.5 px-4 rounded text-sm font-medium"
        style={{ background: "#FDF0EE", color: "#8B2E35", border: "1px solid #E8A5A0" }}
      >
        <span
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#8B2E35",
            flexShrink: 0,
          }}
        />
        優惠截止：2026 年 5 月 10 日
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {urgentItems.map((item, i) => (
          <PromoCard key={i} {...item} />
        ))}
      </div>
    </section>
  );
}
