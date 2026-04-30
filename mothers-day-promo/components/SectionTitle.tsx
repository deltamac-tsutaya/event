interface SectionTitleProps {
  id?: string;
  icon?: string;
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ id, icon, title, subtitle }: SectionTitleProps) {
  return (
    <div id={id} className="pt-4 pb-2 scroll-mt-20">
      <div className="ornament mb-4 justify-center">
        <span
          className="font-serif flex items-center gap-2.5 text-2xl font-bold whitespace-nowrap"
          style={{ color: "#3D2B1F" }}
        >
          {icon && (
            <span className="text-xl leading-none">{icon}</span>
          )}
          {title}
        </span>
      </div>
      {subtitle && (
        <p
          className="text-sm text-center max-w-xl mx-auto leading-relaxed mt-3"
          style={{ color: "#8B6F47" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
