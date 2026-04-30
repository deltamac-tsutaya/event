import SectionTitle from "./SectionTitle";

const budgetGroups = [
  {
    label: "NT$600 以下",
    color: "#2D6050",
    items: [
      { brand: "聖朵波緹", name: "身體乳液＋沐浴膠組合", price: "NT$599", highlight: "44 折" },
      { brand: "EcoScential", name: "環境香氛噴霧", price: "NT$499", highlight: "新品上市" },
    ],
  },
  {
    label: "NT$1,000 以下",
    color: "#8B5030",
    items: [
      { brand: "Betterology", name: "指定商品單盒 95 折", price: "95 折", highlight: "95 折" },
      { brand: "EcoScential", name: "手工大豆蠟燭", price: "NT$699", highlight: "新品上市" },
      { brand: "EcoScential", name: "無火蘆葦擴香", price: "NT$699", highlight: "新品上市" },
    ],
  },
  {
    label: "NT$1,500 左右",
    color: "#8B2E35",
    items: [
      { brand: "LASAI", name: "母親節限定身體套組", price: "NT$1,470", highlight: "母親節限定" },
      { brand: "覓梅酒", name: "不能梅柚你組合", price: "NT$1,280", highlight: "組合優惠" },
    ],
  },
  {
    label: "NT$3,000 以上",
    color: "#4A3530",
    items: [
      { brand: "蒔年一晐", name: "品味歐洲三國品酒組", price: "NT$5,200", highlight: "組合優惠" },
    ],
  },
];

const highlightColor: Record<string, string> = {
  "母親節限定": "#C4607A",
  "新品上市":   "#2D6050",
  "組合優惠":   "#8B5030",
  "44 折":      "#8B5030",
  "95 折":      "#8B5030",
};

export default function BudgetSection() {
  return (
    <section className="py-12 px-4 max-w-5xl mx-auto" id="budget">
      <SectionTitle
        title="依預算挑選"
        subtitle="依照心中的預算，快速找到合適的母親節禮物。"
      />
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {budgetGroups.map((group) => (
          <div
            key={group.label}
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid #EDE6DF" }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 text-sm font-bold"
              style={{ background: group.color, color: "#FDF8F2" }}
            >
              {group.label}
            </div>
            {/* Items */}
            <div className="bg-white flex flex-col divide-y divide-[#EDE6DF]">
              {group.items.map((item, i) => (
                <div key={i} className="px-4 py-3 flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: group.color }}>
                      {item.brand}
                    </span>
                    <span
                      className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded"
                      style={{
                        background: highlightColor[item.highlight] ?? "#8B5030",
                        color: "#FDF8F2",
                      }}
                    >
                      {item.highlight}
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-snug" style={{ color: "#1C1410" }}>
                    {item.name}
                  </p>
                  <p className="text-xs font-bold" style={{ color: group.color }}>
                    {item.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-center mt-5" style={{ color: "#A08060" }}>
        ＊價格依各品牌活動為準，詳見各商品說明。
      </p>
    </section>
  );
}
