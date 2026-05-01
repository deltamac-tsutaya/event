interface SectionTitleProps {
  id?: string;
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ id, title, subtitle }: SectionTitleProps) {
  return (
    <div id={id} className="pt-4 pb-2 scroll-mt-16">
      <h2
        className="font-serif text-2xl sm:text-3xl font-bold text-center mb-3"
        style={{ color: "#1C1410" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-sm text-center max-w-lg mx-auto leading-relaxed"
          style={{ color: "#8B6F47" }}
        >
          {subtitle}
        </p>
      )}
      <div className="flex items-center justify-center gap-3 mt-4">
        <div style={{ width: 32, height: 1, background: "#C8845E", opacity: 0.4 }} />
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#C8845E", opacity: 0.5 }} />
        <div style={{ width: 32, height: 1, background: "#C8845E", opacity: 0.4 }} />
      </div>
    </div>
  );
}
