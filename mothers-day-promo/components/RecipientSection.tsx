import SectionTitle from "./SectionTitle";

const recipientGroups = [
  {
    label: "送給重視保養的她",
    color: "#8B2E35",
    bg: "#FDF0EE",
    border: "#E8D0CC",
    brands: ["LASAI", "Panier des Sens 潘提香頌", "聖朵波緹", "茶寶", "覺萃"],
  },
  {
    label: "送給喜愛香氛的她",
    color: "#8B5030",
    bg: "#FDF4EE",
    border: "#E8D8C8",
    brands: ["J-scent", "EcoScential", "美珂媞歐", "郁郁"],
  },
  {
    label: "送給喜歡茶酒的她",
    color: "#6B1F25",
    bg: "#F8F0F0",
    border: "#DCCACC",
    brands: ["蒔年一晌", "覓梅酒", "沃堤思世界茶莊園"],
  },
  {
    label: "送給家庭與親子",
    color: "#2D4A3E",
    bg: "#EEF5F2",
    border: "#C0D8D0",
    brands: ["MAGBLOX", "SONNY ANGEL", "黑白小姐"],
  },
];

export default function RecipientSection() {
  return (
    <section className="py-12 px-4 max-w-5xl mx-auto" id="recipient">
      <SectionTitle
        title="依對象挑選"
        subtitle="依照收禮對象的喜好，快速找到最適合的選品。"
      />
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recipientGroups.map((group) => (
          <div
            key={group.label}
            className="rounded-xl overflow-hidden"
            style={{ border: `1px solid ${group.border}` }}
          >
            {/* Header */}
            <div
              className="px-4 py-3.5 text-sm font-semibold leading-snug"
              style={{ background: group.color, color: "#FDF8F2" }}
            >
              {group.label}
            </div>
            {/* Brand list */}
            <div
              className="px-4 py-4 flex flex-col gap-2.5"
              style={{ background: group.bg }}
            >
              {group.brands.map((brand) => (
                <div key={brand} className="flex items-center gap-2.5">
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: group.color,
                      opacity: 0.7,
                      flexShrink: 0,
                    }}
                  />
                  <span className="text-sm" style={{ color: "#3A2A20" }}>
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <a
          href="#mothers-day"
          className="inline-block px-7 py-3 rounded text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ background: "transparent", color: "#6B5040", border: "1px solid #C8A882" }}
          data-track="cta_recipient_browse"
        >
          查看母親節送禮推薦
        </a>
      </div>
    </section>
  );
}
