import Link from "next/link";
import { Event } from "@/lib/types";
import { formatDate } from "@/lib/formatting";
import { Card } from "@/components/common/Card";
import { Divider } from "@/components/common/Divider";

interface RegularColumnsProps {
  month: string;
  events: Event[];
}

export function RegularColumns({ month, events }: RegularColumnsProps) {
  // Group events by category (excluding coverStory and feature)
  const columns = ["course", "dining", "member", "collaboration"];

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      course: "課程與工作坊",
      dining: "餐飲優惠",
      member: "會員任務",
      collaboration: "合作企劃",
    };
    return labels[category] || category;
  };

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-h2-md font-serif font-bold text-black mb-2">
          固定欄目
        </h2>
        <Divider variant="gold" spacing="lg" fullWidth={true} />

        <div className="mt-12 space-y-16 md:space-y-20">
          {columns.map((category) => {
            const columnEvents = events.filter(
              (e) => e.category === category && e.placement === "column"
            );

            if (columnEvents.length === 0) return null;

            return (
              <div key={category}>
                {/* Column Title */}
                <h3 className="text-h3-md font-serif font-bold text-black mb-8 pb-4 border-b-2 border-gold-champagne">
                  {getCategoryLabel(category)}
                </h3>

                {/* Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {columnEvents.slice(0, 3).map((event) => (
                    <Link
                      key={event.id}
                      href={`/issues/${month}/${event.slug}`}
                      className="group"
                    >
                      <Card
                        className="h-full hover:border-green-ink transition"
                        variant="light"
                        size="md"
                      >
                        {/* Image */}
                        {event.image && (
                          <div className="w-full h-40 bg-gray-light overflow-hidden mb-4">
                            <img
                              src={event.image.url}
                              alt={event.image.alt}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <h4 className="text-base font-bold text-black mb-2 group-hover:text-green-ink transition line-clamp-2">
                          {event.title}
                        </h4>

                        {/* Date */}
                        <p className="text-xs text-gray-dark mb-3">
                          {formatDate(event.startDate)}
                        </p>

                        {/* Summary */}
                        <p className="text-xs text-gray-dark line-clamp-2 mb-4">
                          {event.summary}
                        </p>

                        {/* Price & Arrow */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-light text-xs">
                          {event.price ? (
                            <span className="font-bold text-black">{event.price}</span>
                          ) : (
                            <span className="text-gray-dark">免費</span>
                          )}
                          <span className="text-black font-bold group-hover:translate-x-1 transition">
                            →
                          </span>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default RegularColumns;
