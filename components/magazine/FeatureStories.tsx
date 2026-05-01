import Link from "next/link";
import { Event } from "@/lib/types";
import { formatDate } from "@/lib/formatting";
import { Card, CardTitle, CardDescription } from "@/components/common/Card";
import { Divider } from "@/components/common/Divider";

interface FeatureStoriesProps {
  month: string;
  events: Event[];
  maxEvents?: number;
}

export function FeatureStories({ month, events, maxEvents = 3 }: FeatureStoriesProps) {
  const featured = events.filter((e) => e.placement === "feature").slice(0, maxEvents);

  if (featured.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-h2-md font-serif font-bold text-black mb-2">
          專題報導
        </h2>
        <Divider variant="gold" spacing="lg" fullWidth={true} />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((event, index) => (
            <Link
              key={event.id}
              href={`/issues/${month}/${event.slug}`}
              className={`group ${index === 0 && featured.length > 1 ? "lg:col-span-2 md:row-span-2" : ""}`}
            >
              <Card
                className="h-full hover:border-green-ink transition overflow-hidden"
                variant="default"
              >
                {/* Image */}
                {event.image && (
                  <div className={`overflow-hidden bg-black ${index === 0 && featured.length > 1 ? "h-80" : "h-48"}`}>
                    <img
                      src={event.image.url}
                      alt={event.image.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 md:p-8">
                  {/* Category Badge */}
                  <div className="mb-4 inline-block">
                    <span className="text-xs uppercase tracking-widest text-green-ink font-bold bg-cream px-3 py-1">
                      {event.category === "course"
                        ? "課程"
                        : event.category === "dining"
                        ? "餐飲"
                        : event.category === "event"
                        ? "活動"
                        : "特別企劃"}
                    </span>
                  </div>

                  {/* Title */}
                  <CardTitle className="text-h3-md md:text-h2-sm font-serif font-bold text-black mb-3 group-hover:text-green-ink transition">
                    {event.title}
                  </CardTitle>

                  {/* Date & Location */}
                  <div className="flex items-center gap-4 text-sm text-gray-dark mb-4">
                    <span>{formatDate(event.startDate)}</span>
                    {event.location.store === "taipei" && (
                      <span className="text-xs uppercase tracking-widest">信義店</span>
                    )}
                  </div>

                  {/* Summary */}
                  <CardDescription className="text-sm text-gray-dark mb-6 line-clamp-3">
                    {event.summary}
                  </CardDescription>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-light">
                    {event.price && (
                      <span className="text-sm font-bold text-black">
                        {event.price}
                      </span>
                    )}
                    <span className="text-black font-bold group-hover:translate-x-1 transition">
                      →
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureStories;
