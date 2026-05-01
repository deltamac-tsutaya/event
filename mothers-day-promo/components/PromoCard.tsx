interface PromoCardProps {
  brand: string;
  headline: string;
  description: string;
  period: string;
  stores: string[];
  note?: string;
  highlight?: string;
  giftTag?: string;
  image?: string;
  accent?: "rose" | "forest" | "wine" | "apricot";
}

const accentText = {
  rose:    "#8B2E35",
  forest:  "#2D4A3E",
  wine:    "#6B1F25",
  apricot: "#8B5030",
};

const accentBar = {
  rose:    "#C4607A",
  forest:  "#2D4A3E",
  wine:    "#8B2E35",
  apricot: "#C8845E",
};

const storeBadge: Record<string, { bg: string; color: string }> = {
  "台北信義店": { bg: "#8B2E35", color: "#FDF8F2" },
  "台中市政店": { bg: "#2D4A3E", color: "#FDF8F2" },
};

const storeShort: Record<string, string> = {
  "台北信義店": "信義",
  "台中市政店": "台中",
};

function getHighlightStyle(highlight: string): { bg: string; color: string } {
  if (highlight.includes("母親節")) return { bg: "#C4607A", color: "#FDF8F2" };
  if (highlight === "滿額贈")       return { bg: "#C8700A", color: "#FDF8F2" };
  if (highlight === "新品上市")     return { bg: "#2D6050", color: "#FDF8F2" };
  if (highlight === "清倉優惠")     return { bg: "#3A3530", color: "#FDF8F2" };
  if (highlight === "門市限定")     return { bg: "#2D3A7A", color: "#FDF8F2" };
  if (highlight === "組合優惠")     return { bg: "#8B5030", color: "#FDF8F2" };
  if (highlight === "折扣優惠")     return { bg: "#6B5040", color: "#FDF8F2" };
  return { bg: "#6B5040", color: "#FDF8F2" };
}

export default function PromoCard({
  brand,
  headline,
  description,
  period,
  stores,
  note,
  highlight,
  giftTag,
  image,
  accent = "apricot",
}: PromoCardProps) {
  const color = accentText[accent];
  const hlStyle = highlight ? getHighlightStyle(highlight) : null;

  return (
    <div
      className="promo-card bg-white rounded-xl flex flex-col overflow-hidden"
      style={{ border: "1px solid #EDE6DF" }}
    >
      {/* Accent bar or product image */}
      {image ? (
        <img
          src={image}
          alt={headline}
          className="w-full object-cover"
          style={{ height: 160 }}
        />
      ) : (
        <div style={{ height: 4, background: accentBar[accent] }} />
      )}

      {/* Card header */}
      <div className="px-5 pt-4 pb-4 flex flex-col gap-2.5">
        {/* Row: brand + highlight badge */}
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-[11px] font-semibold tracking-[0.12em] uppercase"
            style={{ color }}
          >
            {brand}
          </span>
          {highlight && hlStyle && (
            <span
              className="flex-shrink-0 text-[11px] font-bold px-2.5 py-0.5 rounded"
              style={{ background: hlStyle.bg, color: hlStyle.color }}
            >
              {highlight}
            </span>
          )}
        </div>

        {/* Gift tag (送禮對象) */}
        {giftTag && (
          <p className="text-[11px]" style={{ color: "#A08060" }}>
            {giftTag}
          </p>
        )}

        {/* Headline */}
        <h3 className="text-base font-bold leading-snug" style={{ color: "#1C1410" }}>
          {headline}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed" style={{ color: "#6B5040" }}>
          {description}
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#EDE6DF" }} />

      {/* Card footer — period / stores / note */}
      <div className="px-5 py-3.5 flex flex-col gap-2 mt-auto">
        {/* Period */}
        <div className="flex items-baseline gap-1.5 text-xs">
          <span className="font-semibold flex-shrink-0" style={{ color: "#8B6F47" }}>
            活動期間
          </span>
          <span style={{ color: "#A08060" }}>{period}</span>
        </div>

        {/* Stores */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold flex-shrink-0" style={{ color: "#8B6F47" }}>
            適用門市
          </span>
          {/* Mobile: 雙店 or abbreviated name */}
          {stores.length >= 2 ? (
            <span
              className="tag-badge text-[11px] sm:hidden"
              style={{ background: "#6B5040", color: "#FDF8F2" }}
            >
              雙店
            </span>
          ) : (
            stores.map((store) => {
              const badge = storeBadge[store] ?? { bg: "#8B6F47", color: "#FDF8F2" };
              return (
                <span
                  key={`m-${store}`}
                  className="tag-badge text-[11px] sm:hidden"
                  style={{ background: badge.bg, color: badge.color }}
                >
                  {storeShort[store] ?? store}
                </span>
              );
            })
          )}
          {/* Desktop: full store names */}
          {stores.map((store) => {
            const badge = storeBadge[store] ?? { bg: "#8B6F47", color: "#FDF8F2" };
            return (
              <span
                key={`d-${store}`}
                className="tag-badge text-[11px] hidden sm:inline-flex"
                style={{ background: badge.bg, color: badge.color }}
              >
                {store}
              </span>
            );
          })}
        </div>

        {/* Note */}
        {note && (
          <div className="flex items-baseline gap-1.5 text-xs">
            <span className="font-semibold flex-shrink-0" style={{ color: "#8B6F47" }}>
              注意事項
            </span>
            <span className="italic" style={{ color: "#B09070" }}>{note}</span>
          </div>
        )}
      </div>
    </div>
  );
}
