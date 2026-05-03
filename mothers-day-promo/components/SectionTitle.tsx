interface SectionTitleProps {
  id?: string;
  index?: string;   // e.g. "01"
  en?: string;      // English eyebrow
  title: string;    // zh heading
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionTitle({
  id,
  index,
  en,
  title,
  subtitle,
  align = "center",
}: SectionTitleProps) {
  const center = align === "center";
  return (
    <header
      id={id}
      className={`scroll-mt-16 pt-4 pb-2 ${center ? "text-center" : "text-left"}`}
    >
      {(index || en) && (
        <div className={`flex items-center gap-4 mb-5 ${center ? "justify-center" : ""}`}>
          {index && <span className="num-index">— No. {index}</span>}
          {index && en && (
            <span style={{ height: 1, width: 40, background: "var(--color-rule, #C8B89A)", display: "inline-block" }} />
          )}
          {en && <span className="eyebrow">{en}</span>}
        </div>
      )}
      <h2
        className={`font-serif-tc text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.15em] leading-[1.4] ${
          center ? "" : "max-w-2xl"
        }`}
        style={{ color: "var(--color-ink, #1C1410)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-sm leading-[2] ${center ? "max-w-lg mx-auto" : "max-w-2xl"}`}
          style={{ color: "var(--color-ink-soft, #6B5040)" }}
        >
          {subtitle}
        </p>
      )}
      <div className={`flex items-center gap-3 mt-5 ${center ? "justify-center" : ""}`}>
        <div style={{ width: 32, height: 1, background: "var(--color-rule, #C8B89A)" }} />
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--color-wine, #8B2E35)", opacity: 0.5 }} />
        <div style={{ width: 32, height: 1, background: "var(--color-rule, #C8B89A)" }} />
      </div>
    </header>
  );
}
