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

const accentColors = {
  rose: { bg: "#FDF0EE", border: "#E8A5A0", badge: "#D4827C", text: "#8B2E35" },
  forest: { bg: "#EEF5F2", border: "#7AA898", badge: "#2D4A3E", text: "#1E3329" },
  wine: { bg: "#F5EEF0", border: "#C4849A", badge: "#8B2E35", text: "#6B1F25" },
  apricot: { bg: "#FDF4EE", border: "#E5A882", badge: "#C8845E", text: "#8B5030" },
};

const storeColors: Record<string, { bg: string; text: string }> = {
  "台北信義店": { bg: "#8B2E35", text: "#FDF8F2" },
  "台中市政店": { bg: "#2D4A3E", text: "#FDF8F2" },
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
  const colors = accentColors[accent];

  return (
    <div
      className="promo-card rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Brand + highlight */}
      <div className="flex items-start justify-between gap-2">
        <span
          className="text-xs font-semibold tracking-wider uppercase"
          style={{ color: colors.badge }}
        >
          {brand}
        </span>
        {highlight && (
          <span
            className="tag-badge text-xs flex-shrink-0"
            style={{ background: colors.badge, color: "#FDF8F2" }}
          >
            {highlight}
          </span>
        )}
      </div>

      {/* Headline */}
      <h3
        className="text-lg font-bold leading-snug"
        style={{ color: "#3D2B1F" }}
      >
        {headline}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed" style={{ color: "#6B5040" }}>
        {description}
      </p>

      {/* Divider */}
      <div style={{ height: "1px", background: `${colors.border}` }} />

      {/* Period */}
      <div className="flex items-center gap-2 text-xs" style={{ color: "#8B6F47" }}>
        <span>📅</span>
        <span className="font-medium">{period}</span>
      </div>

      {/* Stores */}
      <div className="flex flex-wrap gap-1.5">
        {stores.map((store) => {
          const sc = storeColors[store] ?? { bg: "#8B6F47", text: "#FDF8F2" };
          return (
            <span
              key={store}
              className="tag-badge"
              style={{ background: sc.bg, color: sc.text }}
            >
              {store}
            </span>
          );
        })}
      </div>

      {/* Note */}
      {note && (
        <p className="text-xs italic" style={{ color: "#A08060" }}>
          ＊{note}
        </p>
      )}
    </div>
  );
}
