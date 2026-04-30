interface SectionTitleProps {
  id?: string;
  icon?: string;
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ id, icon, title, subtitle }: SectionTitleProps) {
  return (
    <div id={id} className="pt-4 pb-2 scroll-mt-20">
      <div className="ornament mb-5">
        <span
          className="flex items-center gap-2 text-xl font-bold whitespace-nowrap"
          style={{ color: "#3D2B1F" }}
        >
          {icon && <span>{icon}</span>}
          {title}
        </span>
      </div>
      {subtitle && (
        <p className="text-sm text-center max-w-xl mx-auto leading-relaxed" style={{ color: "#8B6F47" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
