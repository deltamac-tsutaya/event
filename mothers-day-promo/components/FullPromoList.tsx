import SectionTitle from "./SectionTitle";
import PromoCard from "./PromoCard";

const fragrancePromos = [
  {
    brand: "J-scent",
    headline: "任選 2 件 85 折",
    description: "把日本氣味收藏進日常。香氛系列多款選擇，任選兩件享 85 折優惠。",
    period: "2026/4/1 — 2026/5/10",
    stores: ["台北信義店"],
    highlight: "85 折",
    note: "台北信義店限定",
    accent: "rose" as const,
  },
  {
    brand: "EcoScential",
    headline: "精選香氛系列優惠",
    description: "天然素材香氛，友善環境，呵護感官。適合送給注重生活品質的她。",
    period: "2026/5/1 — 2026/5/31",
    stores: ["台北信義店", "台中市政店"],
    accent: "apricot" as const,
  },
  {
    brand: "聖朵波緹",
    headline: "身體保養組合特惠",
    description: "精緻身體乳液搭配沐浴膠，原價 NT$1,079 現折活動價 NT$599。",
    period: "2026/4/1 — 2026/6/30",
    stores: ["台北信義店", "台中市政店"],
    highlight: "4.7 折",
    accent: "rose" as const,
  },
  {
    brand: "Panier des Sens 潘提香頌",
    headline: "全系列 75 折",
    description: "法式香氛、身體清潔與護手保養，法國品牌優雅質感。",
    period: "2026/4/1 — 2026/5/10",
    stores: ["台北信義店", "台中市政店"],
    note: "即期品除外",
    accent: "apricot" as const,
  },
];

const lifestylePromos = [
  {
    brand: "Handiin",
    headline: "全品牌 88 折",
    description: "精選皮件與隨身配件，升級日常使用質感。輕薄設計，實用百搭。",
    period: "2026/4/1 — 2026/5/10",
    stores: ["台北信義店", "台中市政店"],
    highlight: "88 折",
    accent: "apricot" as const,
  },
  {
    brand: "Yoreh 悠若",
    headline: "指定晴雨傘單支 9 折",
    description: "為日常通勤與送禮準備一把實用好傘。晴雨兩用，精緻有型。",
    period: "2026/5/1 — 2026/5/31",
    stores: ["台北信義店", "台中市政店"],
    highlight: "9 折",
    accent: "forest" as const,
  },
  {
    brand: "今治 / Matsukan / MIYAZAKI TOWEL",
    headline: "日本今治毛巾系列優惠",
    description: "日本今治認證，柔軟吸水，品質保證。實用又不失質感的生活選品。",
    period: "2026/5/1 — 2026/5/31",
    stores: ["台北信義店", "台中市政店"],
    accent: "apricot" as const,
  },
  {
    brand: "KIND BAG",
    headline: "環保袋系列優惠",
    description: "由回收寶特瓶製成的環保購物袋，時尚又友善地球。",
    period: "2026/5/1 — 2026/5/31",
    stores: ["台北信義店", "台中市政店"],
    accent: "forest" as const,
  },
  {
    brand: "Betterology",
    headline: "精選生活選品優惠",
    description: "從設計視角出發的生活提案，每件都是值得使用的好物。",
    period: "2026/5/1 — 2026/5/31",
    stores: ["台北信義店", "台中市政店"],
    accent: "apricot" as const,
  },
];

const teaWinePromos = [
  {
    brand: "蒔年一晌",
    headline: "茶咖禮盒單件 88 折",
    description: "咖啡禮盒與茶品系列，單件即享 88 折。品味生活，從一杯好茶開始。",
    period: "2026/4/1 — 2026/5/31",
    stores: ["台北信義店", "台中市政店"],
    highlight: "88 折",
    accent: "wine" as const,
  },
  {
    brand: "覓梅酒",
    headline: "梅酒系列限時優惠",
    description: "精釀梅酒，滋味層次豐富，適合作為節慶禮物或日常享用。",
    period: "2026/5/1 — 2026/5/31",
    stores: ["台北信義店", "台中市政店"],
    note: "購買酒類需年滿 18 歲",
    accent: "wine" as const,
  },
  {
    brand: "沃堤思世界茶莊園",
    headline: "盒裝茶任選 3 件 NT$990",
    description: "來自世界各地的精選茶葉，盒裝茶任選 3 件特惠價 NT$990。",
    period: "2026/5/1 — 2026/5/31",
    stores: ["台中市政店"],
    note: "台中市政店限定",
    accent: "forest" as const,
  },
  {
    brand: "覺萃",
    headline: "台灣精選茶品優惠",
    description: "台灣在地茶品，茶農直送，細緻風味值得品味。",
    period: "2026/5/1 — 2026/5/31",
    stores: ["台北信義店", "台中市政店"],
    accent: "forest" as const,
  },
  {
    brand: "茶寶",
    headline: "精選茶品特惠",
    description: "多款台灣在地茶品，送禮自用兩相宜。",
    period: "2026/5/1 — 2026/5/31",
    stores: ["台北信義店", "台中市政店"],
    accent: "forest" as const,
  },
];

const kidsPromos = [
  {
    brand: "MAGBLOX",
    headline: "磁力片單盒 9 折",
    description: "創意磁力積木，啟發孩子邏輯思維與空間想像力。安全認證，家長放心。",
    period: "2026/5/1 — 2026/5/31",
    stores: ["台中市政店"],
    highlight: "9 折",
    note: "台中市政店限定",
    accent: "forest" as const,
  },
  {
    brand: "SONNY ANGEL",
    headline: "精選公仔系列優惠",
    description: "療癒系小天使，收集系玩具，大人小孩都喜歡的可愛角色。",
    period: "2026/5/1 — 2026/5/31",
    stores: ["台北信義店", "台中市政店"],
    accent: "rose" as const,
  },
  {
    brand: "黑白小姐",
    headline: "台灣原創繪本與選品",
    description: "台灣原創設計，充滿創意與溫度的親子選品，適合送給喜愛插畫的大小朋友。",
    period: "2026/5/1 — 2026/5/31",
    stores: ["台北信義店", "台中市政店"],
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
