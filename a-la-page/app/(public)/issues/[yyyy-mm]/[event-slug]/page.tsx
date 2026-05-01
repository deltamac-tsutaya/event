import Link from "next/link";
import { notFound } from "next/navigation";
import { mockEvents, mockIssues } from "@/lib/mockData";
import { formatDate, getCategoryLabel } from "@/lib/formatting";
import Button from "@/components/common/Button";
import { Divider } from "@/components/common/Divider";
import { Card, CardTitle } from "@/components/common/Card";

interface EventDetailPageProps {
  params: Promise<{
    "yyyy-mm": string;
    "event-slug": string;
  }>;
}

export async function generateMetadata(props: EventDetailPageProps) {
  const params = await props.params;
  const event = mockEvents.find((e) => e.slug === params["event-slug"]);

  if (!event) {
    return {
      title: "活動未找到｜À LA PAGE",
      description: "此活動不存在。",
    };
  }

  return {
    title: event.seoTitle,
    description: event.seoDescription,
    openGraph: {
      title: event.seoTitle,
      description: event.seoDescription,
      images: [event.image.url],
    },
  };
}

export async function generateStaticParams() {
  return mockEvents.flatMap((event) => ({
    "yyyy-mm": event.issue,
    "event-slug": event.slug,
  }));
}

export default async function EventDetailPage(props: EventDetailPageProps) {
  const params = await props.params;
  const month = params["yyyy-mm"];
  const eventSlug = params["event-slug"];

  // Find the event
  const event = mockEvents.find((e) => e.slug === eventSlug && e.issue === month);
  if (!event) {
    notFound();
  }

  // Find the issue
  const issue = mockIssues.find((i) => i.id === event.issue);
  if (!issue) {
    notFound();
  }

  // Get related events (same issue, different events)
  const relatedEvents = mockEvents
    .filter((e) => e.issue === month && e.id !== event.id)
    .slice(0, 3);

  return (
    <main className="w-full">
      {/* Breadcrumb */}
      <div className="bg-cream border-b border-gray-light">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-dark">
              <Link href="/issues" className="hover:text-black transition">
                月刊
              </Link>
              <span className="text-gray-light">/</span>
              <Link
                href={`/issues/${month}`}
                className="hover:text-black transition"
              >
                {month}
              </Link>
              <span className="text-gray-light">/</span>
              <span className="font-bold text-black">{event.title}</span>
            </div>
            <Link
              href={`/issues/${month}`}
              className="text-gray-dark hover:text-black transition underline"
            >
              返回月刊
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-96 md:h-[500px] bg-black overflow-hidden">
        <img
          src={event.image.url}
          alt={event.image.alt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <article className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            {/* Category Badge */}
            <div className="mb-6 inline-block">
              <span className="text-xs uppercase tracking-widest text-cream bg-green-ink px-4 py-2 font-bold">
                {getCategoryLabel(event.category)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-h1-sm md:text-h1-md font-serif font-bold text-black mb-6">
              {event.title}
            </h1>

            <Divider variant="gold" spacing="md" fullWidth={true} />

            {/* Meta Information */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Date */}
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-dark mb-2">
                  開始日期
                </p>
                <p className="text-lg font-bold text-black">
                  {formatDate(event.startDate)}
                </p>
              </div>

              {/* Location */}
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-dark mb-2">
                  地點
                </p>
                <p className="text-lg font-bold text-black">
                  {event.location.store === "taipei" ? "台北信義店" : "全店"}
                </p>
              </div>

              {/* Price */}
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-dark mb-2">
                  費用
                </p>
                <p className="text-lg font-bold text-black">
                  {event.price || "免費"}
                </p>
              </div>

              {/* Capacity */}
              {event.capacity && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-dark mb-2">
                    名額
                  </p>
                  <p className="text-lg font-bold text-black">
                    {event.capacity} 人
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="mb-12 pb-12 border-b border-gray-light">
            <p className="text-lg md:text-xl text-gray-dark leading-relaxed">
              {event.summary}
            </p>
          </div>

          {/* Full Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="whitespace-pre-wrap text-body text-gray-dark leading-relaxed">
              {event.content}
            </div>
          </div>

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="mb-12 pb-12 border-b border-gray-light">
              <p className="text-sm uppercase tracking-widest text-gray-dark mb-4">
                標籤
              </p>
              <div className="flex flex-wrap gap-3">
                {event.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-cream text-black px-4 py-2 border border-gray-light"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mb-16 p-8 md:p-12 bg-black text-cream">
            <p className="text-sm uppercase tracking-widest mb-4 opacity-60">
              準備好了嗎？
            </p>
            <h2 className="text-h2-md font-serif font-bold mb-6">
              {event.cta.text}
            </h2>
            <Button
              href={event.cta.url}
              asChild={event.cta.type === "internal"}
              size="lg"
              variant="primary"
            >
              {event.cta.text}
            </Button>
          </div>

          {/* Share */}
          <div className="flex items-center justify-between py-6 border-b border-gray-light mb-12">
            <p className="text-sm text-gray-dark">分享此活動</p>
            <div className="flex gap-4">
              <button className="text-sm text-gray-dark hover:text-black transition">
                Facebook
              </button>
              <button className="text-sm text-gray-dark hover:text-black transition">
                LINE
              </button>
              <button className="text-sm text-gray-dark hover:text-black transition">
                複製連結
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Events */}
      {relatedEvents.length > 0 && (
        <section className="py-16 md:py-24 px-4 bg-cream">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-h2-md font-serif font-bold text-black mb-12">
              同月其他活動
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedEvents.map((relatedEvent) => (
                <Link
                  key={relatedEvent.id}
                  href={`/issues/${month}/${relatedEvent.slug}`}
                  className="group"
                >
                  <Card
                    className="h-full hover:border-green-ink transition"
                    variant="default"
                  >
                    {relatedEvent.image && (
                      <div className="w-full h-48 bg-gray-light overflow-hidden mb-4 -m-6 mb-4">
                        <img
                          src={relatedEvent.image.url}
                          alt={relatedEvent.image.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      <CardTitle className="text-h3-md font-serif font-bold text-black mb-3 group-hover:text-green-ink transition line-clamp-2">
                        {relatedEvent.title}
                      </CardTitle>

                      <p className="text-sm text-gray-dark line-clamp-2 mb-4">
                        {relatedEvent.summary}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-light">
                        <span className="text-xs text-gray-dark">
                          {formatDate(relatedEvent.startDate)}
                        </span>
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
      )}

      {/* Back to Issue */}
      <section className="py-12 px-4 text-center">
        <Button href={`/issues/${month}`} asChild size="lg" variant="ghost">
          返回月刊
        </Button>
      </section>
    </main>
  );
}
