interface Props {
  index: string;
  en: string;
  zh: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHead({ index, en, zh, description, align = "left" }: Props) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <header className={`max-w-3xl ${alignCls}`}>
      <div
        className={`flex items-center gap-4 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="num-index">— No. {index}</span>
        <span className="h-px w-12 bg-rule" />
        <span className="eyebrow">{en}</span>
      </div>
      <h2 className="mt-5 font-serif-tc text-3xl md:text-5xl font-light tracking-[0.18em] text-ink leading-[1.4]">
        {zh}
      </h2>
      {description && (
        <p
          className={`mt-5 text-sm md:text-base leading-[2] text-ink-soft ${
            align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      )}
    </header>
  );
}
