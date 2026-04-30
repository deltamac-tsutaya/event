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
  rose:    { bg: "linear-gradient(145deg, #FDF0EE 0%, #F9E8E6 100%)", border: "#E8A5A0", badge: "#D4827C", badgeBg: "linear-gradient(135deg, #D4827C, #C06870)", text: "#8B2E35" },
  forest:  { bg: "linear-gradient(145deg, #EEF5F2 0%, #E6F0EC 100%)", border: "#7AA898", badge: "#2D4A3E", badgeBg: "linear-gradient(135deg, #2D4A3E, #3A6050)", text: "#1E3329" },
  wine:    { bg: "linear-gradient(145deg, #F5EEF0 0%, #F0E6E8 100%)", border: "#C4849A", badge: "#8B2E35", badgeBg: "linear-gradient(135deg, #8B2E35, #A83840)", text: "#6B1F25" },
  apricot: { bg: "linear-gradient(145deg, #FDF4EE 0%, #F9EBE0 100%)", border: "#E5A882", badge: "#C8845E", badgeBg: "linear-gradient(135deg, #C8845E, #E09470)", text: "#8B5030" },
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
      className="promo-card rounded-2xl flex flex-col gap-0 overflow-hidden"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: colors.badgeBg }} />

      <div className="p-5 flex flex-col gap-3">
        {/* Brand + highlight */}
        <div className="flex items-start justify-between gap-2">
          <span
            className="text-[11px] font-semibold tracking-[0.15em] uppercase"
            style={{ color: colors.badge }}
          >
            {brand}
          </span>
          {highlight && (
            <span
              className="flex-shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide text-white"
              style={{ background: colors.badgeBg }}
            >
              {highlight}
            </span>
          )}
        </div>

        {/* Headline */}
        <h3
          className="text-base font-bold leading-snug"
          style={{ color: "#3D2B1F" }}
        >
          {headline}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed flex-1" style={{ color: "#6B5040" }}>
          {description}
        </p>

        {/* Divider */}
        <div style={{ height: "1px", background: `${colors.border}`, opacity: 0.6 }} />

        {/* Period */}
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "#8B6F47" }}>
          <svg width="11" height="12" viewBox="0 0 11 12" fill="none" style={{ opacity: 0.6, flexShrink: 0 }}>
            <rect x="0.5" y="1.5" width="10" height="10" rx="2" stroke="currentColor"/>
            <path d="M3 0.5V2.5" stroke="currentColor" strokeLinecap="round"/>
            <path d="M8 0.5V2.5" stroke="currentColor" strokeLinecap="round"/>
            <path d="M0.5 5H10.5" stroke="currentColor"/>
          </svg>
          <span className="font-medium">{period}</span>
        </div>

        {/* Stores */}
        <div className="flex flex-wrap gap-1.5">
          {stores.map((store) => {
            const sc = storeColors[store] ?? { bg: "#8B6F47", text: "#FDF8F2" };
            return (
              <span
                key={store}
                className="tag-badge text-[11px]"
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
    </div>
  );
}
