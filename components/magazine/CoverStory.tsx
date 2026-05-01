import Button from "@/components/common/Button";
import { Divider } from "@/components/common/Divider";
import { Issue, Event } from "@/lib/types";

interface CoverStoryProps {
  issue: Issue;
  event?: Event;
}

export function CoverStory({ issue, event }: CoverStoryProps) {
  const story = issue.coverStory;

  return (
    <section className="py-16 md:py-24 lg:py-32 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Story Title */}
        <div className="mb-12">
          <p className="text-sm uppercase tracking-widest text-gray-dark mb-4">
            封面故事
          </p>
          <h2 className="text-h2-md md:text-h1-md font-serif font-bold text-black mb-6">
            {story.title}
          </h2>
          <p className="text-h3-md font-serif italic text-gray-dark mb-8">
            {story.subtitle}
          </p>
          <Divider variant="gold" spacing="md" fullWidth={true} />
        </div>

        {/* Story Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-body md:text-lg leading-relaxed text-gray-dark">
            {story.excerpt}
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            href={event?.cta.url || `#`}
            asChild={event?.cta.type === "internal"}
            size="lg"
            variant="primary"
          >
            {event?.cta.text || "閱讀全文"}
          </Button>
          <Button
            href={`/issues/${issue.month}`}
            asChild
            size="lg"
            variant="ghost"
          >
            查看完整月刊
          </Button>
        </div>

        {/* Story Meta */}
        <div className="mt-12 pt-8 border-t border-gray-light">
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <p className="text-gray-dark uppercase tracking-widest mb-2">
                分類
              </p>
              <p className="font-sans font-bold text-black">{story.category}</p>
            </div>
            {event && (
              <>
                <div>
                  <p className="text-gray-dark uppercase tracking-widest mb-2">
                    日期
                  </p>
                  <p className="font-sans font-bold text-black">
                    {event.startDate}
                  </p>
                </div>
                <div>
                  <p className="text-gray-dark uppercase tracking-widest mb-2">
                    地點
                  </p>
                  <p className="font-sans font-bold text-black">
                    {event.location.store === "taipei" ? "信義店" : "全店"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoverStory;
