interface PromoCardProps {
  brand: string;
  headline: string;
  description: string;
  period: string;
  stores: string[];
  note?: string;
  highlight?: string;
  accent?: "rose" | "forest" | "wine" | "apricot";
}

const accentText = {
  rose:    "#8B2E35",
  forest:  "#2D4A3E",
  wine:    "#6B1F25",
  apricot: "#8B5030",
};

const storeBadge: Record<string, { bg: string; color: string }> = {
  "台北信義店": { bg: "#8B2E35", color: "#FDF8F2" },
  "台中市政店": { bg: "#2D4A3E", color: "#FDF8F2" },
};

export default function PromoCard({
  brand,
  headline,
  description,
  period,
  stores,
  note,
  highlight,
  accent = "apricot",
}: PromoCardProps) {
  const color = accentText[accent];

  return (
    <div
      className="promo-card bg-white rounded-xl p-5 flex flex-col gap-3"
      style={{ border: "1px solid #EDE6DF" }}
    >
      {/* Brand + highlight */}
      <div className="flex items-start justify-between gap-2">
        <span
          className="text-[11px] font-semibold tracking-[0.12em] uppercase"
          style={{ color }}
        >
          {brand}
        </span>
        {highlight && (
          <span
            className="flex-shrink-0 text-[11px] font-bold px-2.5 py-0.5 rounded"
            style={{ background: color, color: "#FDF8F2" }}
          >
            {highlight}
          </span>
        )}
      </div>

      {/* Headline */}
      <h3 className="text-base font-bold leading-snug" style={{ color: "#1C1410" }}>
        {headline}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed flex-1" style={{ color: "#6B5040" }}>
        {description}
      </p>

      {/* Divider */}
      <div style={{ height: 1, background: "#EDE6DF" }} />

      {/* Period */}
      <p className="text-xs" style={{ color: "#A08060" }}>
        {period}
      </p>

      {/* Stores */}
      <div className="flex flex-wrap gap-1.5">
        {stores.map((store) => {
          const badge = storeBadge[store] ?? { bg: "#8B6F47", color: "#FDF8F2" };
          return (
            <span
              key={store}
              className="tag-badge"
              style={{ background: badge.bg, color: badge.color }}
            >
              {store}
            </span>
          );
        })}
      </div>

      {/* Note */}
      {note && (
        <p className="text-xs italic" style={{ color: "#B09070" }}>
          ＊{note}
        </p>
      )}
    </div>
  );
}
