import { Issue } from "@/lib/types";
import { formatMonth } from "@/lib/formatting";

interface MagazineCoverProps {
  issue: Issue;
}

export function MagazineCover({ issue }: MagazineCoverProps) {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-black overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={issue.coverImage.url}
          alt={issue.coverImage.alt}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <div className="mb-6">
          <p className="text-cream text-xs md:text-sm uppercase tracking-widest mb-4">
            {formatMonth(issue.month)}
          </p>
          <h1 className="text-h1-sm md:text-h1-md text-cream font-serif font-bold mb-4">
            {issue.theme}
          </h1>
        </div>

        {/* Issue Number Badge */}
        <div className="inline-block border border-cream px-6 py-3">
          <p className="text-cream text-sm font-sans">
            第 {issue.issue_number} 期 · {issue.year} 年
          </p>
        </div>
      </div>

      {/* Photo Credit */}
      {issue.coverImage.credit && (
        <div className="absolute bottom-4 right-4 text-cream text-xs opacity-60">
          {issue.coverImage.credit}
        </div>
      )}
    </div>
  );
}

export default MagazineCover;
