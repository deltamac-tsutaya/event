import Link from "next/link";
import { Event } from "@/lib/types";
import { formatDate } from "@/lib/formatting";
import { Divider } from "@/components/common/Divider";

interface TableOfContentsProps {
  month: string;
  events: Event[];
}

export function TableOfContents({ month, events }: TableOfContentsProps) {
  // Sort events by sortOrder
  const sorted = [...events].sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      course: "課程",
      dining: "餐飲",
      event: "活動",
      collaboration: "合作",
      member: "會員",
    };
    return labels[category] || category;
  };

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-h2-md font-serif font-bold text-black mb-2">
          本月目錄
        </h2>
        <Divider variant="gold" spacing="lg" fullWidth={true} />

        <div className="mt-12 space-y-4">
          {sorted.map((event, index) => (
            <Link
              key={event.id}
              href={`/issues/${month}/${event.slug}`}
              className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-gray-light hover:bg-cream transition group"
            >
              {/* Title & Meta */}
              <div className="flex-1 mb-4 md:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-sans font-bold text-gray-dark">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-green-ink font-bold">
                    {getCategoryLabel(event.category)}
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-black group-hover:text-green-ink transition">
                  {event.title}
                </h3>
              </div>

              {/* Date & Arrow */}
              <div className="flex items-center gap-4 ml-5 md:ml-0">
                <p className="text-sm text-gray-dark whitespace-nowrap">
                  {formatDate(event.startDate)}
                </p>
                <span className="text-black group-hover:translate-x-1 transition">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-16 pt-8 border-t border-gray-light">
          <p className="text-xs uppercase tracking-widest text-gray-dark mb-4">
            圖例說明
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
            {["課程", "餐飲", "活動", "合作", "會員"].map((label) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-ink rounded"></span>
                <span className="text-gray-dark">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TableOfContents;
