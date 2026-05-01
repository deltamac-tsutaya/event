import Link from "next/link";
import { Event } from "@/lib/types";
import { Card } from "@/components/common/Card";
import { Divider } from "@/components/common/Divider";

interface ShortlistProps {
  month: string;
  events: Event[];
}

export function Shortlist({ month, events }: ShortlistProps) {
  const shortlist = events.filter((e) => e.placement === "shortlist");

  if (shortlist.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-4 bg-cream">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-h2-md font-serif font-bold text-black mb-2">
          策展選輯
        </h2>
        <p className="text-sm text-gray-dark mb-8">
          編輯精選的月度主題集合
        </p>
        <Divider variant="black" spacing="lg" fullWidth={true} />

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {shortlist.map((event) => (
            <Link
              key={event.id}
              href={`/issues/${month}/${event.slug}`}
              className="group"
            >
              <Card
                className="h-full hover:border-green-ink transition text-center"
                variant="light"
                size="sm"
              >
                {/* Image */}
                {event.image && (
                  <div className="w-full aspect-square bg-gray-light overflow-hidden mb-4 -m-4 mb-4">
                    <img
                      src={event.image.url}
                      alt={event.image.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                )}

                {/* Title */}
                <h4 className="text-sm font-bold text-black mb-2 line-clamp-2 group-hover:text-green-ink transition">
                  {event.title}
                </h4>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {event.tags.slice(0, 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs text-cream bg-green-ink px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <p className="text-xs text-gray-dark group-hover:text-black transition">
                  查看 →
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Shortlist;
