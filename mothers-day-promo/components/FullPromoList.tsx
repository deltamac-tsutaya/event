import SectionTitle from "./SectionTitle";
import PromoCard from "./PromoCard";

const fragrancePromos = [
  {
    brand: "美珂媞歐",
    headline: "全品牌 7 折",
    description:
      "美珂媞歐香氛商品全品牌 7 折。挑選一款香氣，留給自己或送給重要的人。",
    period: "台北信義店限定",
    stores: ["台北信義店"],
    highlight: "7 折",
    note: "台北信義店限定",
    accent: "rose" as const,
  },
  {
    brand: "J-scent",
    headline: "任選 2 件 85 折",
    description: "J-scent 香氛商品任選 2 件 85 折。把日本氣味收藏進日常。",
    period: "台北信義店限定",
    stores: ["台北信義店"],
    highlight: "85 折",
    note: "台北信義店限定",
    accent: "rose" as const,
  },
  {
    brand: "EcoScential",
    headline: "新品牌上市優惠",
    description:
      "環保香氛手工大豆蠟燭 NT$699，無火蘆葦擴香 NT$699，環境香氛噴霧 NT$499。",
    period: "2026/4/1 — 2026/6/30",
    stores: ["台北信義店", "台中市政店"],
    highlight: "新品牌",
    accent: "apricot" as const,
  },
  {
    brand: "郁郁",
    headline: "任選 2 件 95 折",
    description:
      "郁郁品牌商品任選 2 件 95 折。精選日常生活香氣與保養選品。",
    period: "長期活動",
    stores: ["台北信義店", "台中市政店"],
    highlight: "95 折",
    accent: "apricot" as const,
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
    brand: "聖朵波緹",
    headline: "身體乳液＋沐浴膠組合 NT$599",
    description:
      "身體乳液＋沐浴膠組合，原價 NT$1,079，活動價 NT$599。",
    period: "2026/4/1 — 2026/6/30",
    stores: ["台北信義店", "台中市政店"],
    highlight: "44 折",
    accent: "rose" as const,
  },
  {
    brand: "聖朵波緹",
    headline: "指定商品 1 件 8 折、2 件 7 折",
    description:
      "身體乳液、沐浴膠除外，指定商品任選 1 件 8 折、2 件 7 折。消費滿 NT$800 再贈品牌擦手巾。",
    period: "2026/4/24 — 2026/6/30",
    stores: ["台北信義店", "台中市政店"],
    note: "身體乳液、沐浴膠除外",
    accent: "rose" as const,
  },
  {
    brand: "聖朵波緹",
    headline: "購買香水贈香氛皂",
    description:
      "購買聖朵波緹香水或淡香精，即贈經典法式男士香氛皂乙份。",
    period: "贈品數量依現場為準",
    stores: ["台北信義店", "台中市政店"],
    highlight: "贈品",
    note: "贈品數量有限，贈完為止",
    accent: "rose" as const,
  },
  {
    brand: "覺萃",
    headline: "全品項單品 9 折",
    description:
      "覺萃全品項單品 9 折。從居家清潔到身體照護，打造安心生活節奏。",
    period: "2026/4/1 — 2026/5/10",
    stores: ["台北信義店", "台中市政店"],
    highlight: "9 折",
    accent: "forest" as const,
  },
  {
    brand: "茶寶",
    headline: "全品項單品 9 折",
    description:
      "茶寶全品項單品 9 折。以茶籽保養，照顧日常肌膚與髮絲。",
    period: "2026/4/1 — 2026/5/10",
    stores: ["台北信義店", "台中市政店"],
    highlight: "9 折",
    accent: "forest" as const,
  },
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
    brand: "Hellome",
    headline: "無花果護唇精華上市價 NT$590",
    description:
      "Hellome 無花果護唇精華新品上市，活動價 NT$590，原價 NT$680。",
    period: "2026/3/28 — 2026/4/5",
    stores: ["台北信義店", "台中市政店"],
    highlight: "新品",
    accent: "apricot" as const,
  },
];

const lifestylePromos = [
  {
    brand: "Yoreh 悠若",
    headline: "母親節指定傘款 9 折",
    description:
      "指定晴雨傘單支 9 折。為日常通勤與送禮準備一把實用好傘。",
    period: "2026/5/1 — 2026/5/31",
    stores: ["台北信義店", "台中市政店"],
    highlight: "9 折",
    accent: "forest" as const,
  },
  {
    brand: "Betterology",
    headline: "單盒 95 折",
    description:
      "Betterology 指定商品單盒 95 折。每日營養補給，從日常開始。",
    period: "2026/4/1 — 2026/5/10",
    stores: ["台北信義店", "台中市政店"],
    highlight: "95 折",
    accent: "apricot" as const,
  },
  {
    brand: "Betterology",
    headline: "書店消費滿 NT$1,200 贈體驗組",
    description:
      "書店消費滿 NT$1,200，即贈 Betterology 體驗組乙份，數量有限，贈完為止。",
    period: "不累贈",
    stores: ["台北信義店", "台中市政店"],
    highlight: "滿額贈",
    accent: "apricot" as const,
  },
  {
    brand: "Handiin",
    headline: "全品牌 88 折",
    description:
      "Handiin 全品牌商品 88 折。精選皮件與隨身配件，升級日常使用質感。",
    period: "2026/4/1 — 2026/5/10",
    stores: ["台北信義店", "台中市政店"],
    highlight: "88 折",
    accent: "apricot" as const,
  },
  {
    brand: "今治 / Matsukan / MIYAZAKI TOWEL",
    headline: "日本生活選品兩件 9 折",
    description:
      "今治、Matsukan、MIYAZAKI TOWEL 品牌商品任選兩件 9 折。",
    period: "2026/4/1 — 2026/5/10",
    stores: ["台北信義店", "台中市政店"],
    highlight: "兩件 9 折",
    accent: "forest" as const,
  },
  {
    brand: "KIND BAG",
    headline: "清倉 3 折",
    description:
      "KIND BAG 品牌商品單件 3 折。環保袋款限量出清，6 月初下架還貨。",
    period: "6 月初下架",
    stores: ["台北信義店", "台中市政店"],
    highlight: "3 折",
    note: "限量出清",
    accent: "forest" as const,
  },
];

const teaWinePromos = [
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
    brand: "蒔年一晌 酒品",
    headline: "酒品全品項 8 折",
    description:
      "蒔年一晌酒品全品項 8 折。精選歐洲酒款，適合節慶餐桌與送禮。",
    period: "2026/4/17 — 2026/5/11",
    stores: ["台北信義店", "台中市政店"],
    highlight: "8 折",
    note: "未滿 18 歲請勿飲酒",
    accent: "wine" as const,
  },
  {
    brand: "蒔年一晌",
    headline: "品味歐洲三國品酒組 NT$5,200",
    description:
      "精選比利時、匈牙利、斯洛伐克三國酒款，組合優惠價 NT$5,200，原價 NT$7,097。",
    period: "2026/4/17 — 2026/5/11",
    stores: ["台北信義店", "台中市政店"],
    highlight: "NT$5,200",
    note: "未滿 18 歲請勿飲酒",
    accent: "wine" as const,
  },
  {
    brand: "覓梅酒",
    headline: "不能梅柚你組合 NT$1,280",
    description:
      "⑤醺甜釀＋月神柚子酒組合優惠價 NT$1,280，原價 NT$1,800。",
    period: "2026/4/1 — 2026/5/10",
    stores: ["台北信義店", "台中市政店"],
    highlight: "NT$1,280",
    note: "未滿 18 歲請勿飲酒",
    accent: "apricot" as const,
  },
  {
    brand: "沃堤思世界茶莊園",
    headline: "盒裝茶任選 3 件 NT$990",
    description:
      "沃堤思世界茶莊園品牌盒裝茶，任選 3 件 NT$990。",
    period: "台中市政店活動",
    stores: ["台中市政店"],
    note: "台中市政店限定",
    accent: "forest" as const,
  },
];

const kidsPromos = [
  {
    brand: "MAGBLOX",
    headline: "磁力片單盒 9 折",
    description:
      "MAGBLOX 磁力片單盒 9 折。陪孩子用積木探索形狀、色彩與建構力。",
    period: "台中市政店限定",
    stores: ["台中市政店"],
    highlight: "9 折",
    note: "台中市政店限定",
    accent: "forest" as const,
  },
  {
    brand: "SONNY ANGEL",
    headline: "購買滿三件贈限量書籤",
    description:
      "SONNY ANGEL 系列商品購物滿三件，即贈限量書籤乙枚。",
    period: "數量有限，不累贈",
    stores: ["台北信義店", "台中市政店"],
    highlight: "滿三件贈",
    accent: "rose" as const,
  },
  {
    brand: "黑白小姐",
    headline: "消費滿 NT$200 贈母親節卡片",
    description:
      "消費黑白小姐商品滿 NT$200，即贈母親節卡片乙張。台灣原創設計，充滿創意與溫度。",
    period: "數量有限，不累送",
    stores: ["台北信義店", "台中市政店"],
    highlight: "母親節限定",
    accent: "apricot" as const,
  },
];

interface SubSectionProps {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  items: Parameters<typeof PromoCard>[0][];
}

function SubSection({ id, icon, title, subtitle, items }: SubSectionProps) {
  return (
    <section className="py-12 px-4 max-w-5xl mx-auto" id={id}>
      <SectionTitle icon={icon} title={title} subtitle={subtitle} />
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <PromoCard key={i} {...item} />
        ))}
      </div>
    </section>
  );
}

export default function FullPromoList() {
  return (
    <>
      <SubSection
        id="fragrance"
        icon="🧴"
        title="香氛保養"
        subtitle="讓日常護膚成為生活中的小確幸，為自己或送給重要的她。"
        items={fragrancePromos}
      />

      <SubSection
        id="lifestyle"
        icon="🏠"
        title="生活選品"
        subtitle="從包包到晴雨傘，每件都是值得納入日常的好物。"
        items={lifestylePromos}
      />

      <SubSection
        id="tea-wine"
        icon="🍵"
        title="茶酒禮盒"
        subtitle="一杯好茶、一瓶好酒，讓味覺成為連結彼此的橋樑。"
        items={teaWinePromos}
      />

      <SubSection
        id="kids"
        icon="🧩"
        title="親子選品"
        subtitle="療癒、創意、有趣，送給一同成長的孩子與大人。"
        items={kidsPromos}
      />
    </>
  );
}
