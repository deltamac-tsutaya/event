import Link from "next/link";
import { notFound } from "next/navigation";
import { mockIssues, mockEvents } from "@/lib/mockData";
import { formatMonth } from "@/lib/formatting";
import { getEventsByIssue, sortByOrder } from "@/lib/utils";
import { Divider } from "@/components/common/Divider";
import Button from "@/components/common/Button";
import { Card, CardTitle, CardDescription } from "@/components/common/Card";
import {
  MagazineCover,
  CoverStory,
  EditorNote,
  FeatureStories,
  RegularColumns,
  Shortlist,
} from "@/components/magazine";

interface IssueDetailPageProps {
  params: Promise<{
    "yyyy-mm": string;
  }>;
}

export async function generateMetadata(props: IssueDetailPageProps) {
  const params = await props.params;
  const month = params["yyyy-mm"];
  const issue = mockIssues.find((i) => i.month === month);

  if (!issue) {
    return {
      title: "月刊未找到｜À LA PAGE",
      description: "此月份的月刊不存在。",
    };
  }

  return {
    title: `${issue.seoTitle}`,
    description: issue.seoDescription,
    openGraph: {
      title: issue.seoTitle,
      description: issue.seoDescription,
      images: [issue.coverImage.url],
    },
  };
}

export async function generateStaticParams() {
  return mockIssues.map((issue) => ({
    "yyyy-mm": issue.month,
  }));
}

export default async function IssueDetailPage(
  props: IssueDetailPageProps
) {
  const params = await props.params;
  const month = params["yyyy-mm"];

  // Find the issue
  const issue = mockIssues.find((i) => i.month === month);
  if (!issue) {
    notFound();
  }

  // Get events for this issue
  const issueEvents = getEventsByIssue(mockEvents, issue.id);
  const coverStoryEvent = issueEvents.find((e) => e.placement === "coverStory");

  // Get navigation
  const issueIndex = mockIssues.findIndex((i) => i.id === issue.id);
  const prevIssue = issueIndex < mockIssues.length - 1 ? mockIssues[issueIndex + 1] : null;
  const nextIssue = issueIndex > 0 ? mockIssues[issueIndex - 1] : null;

  return (
    <main className="w-full">
      {/* Magazine Cover */}
      <MagazineCover issue={issue} />

      {/* Breadcrumb & Navigation */}
      <div className="bg-cream border-b border-gray-light">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-dark">
              <Link href="/issues" className="hover:text-black transition">
                月刊
              </Link>
              <span className="text-gray-light">/</span>
              <span className="font-bold">{formatMonth(issue.month)}</span>
            </div>
            <Link
              href="/issues"
              className="text-sm text-gray-dark hover:text-black transition underline"
            >
              返回列表
            </Link>
          </div>
        </div>
      </div>

      {/* Cover Story */}
      <CoverStory issue={issue} event={coverStoryEvent} />

      {/* Editor's Note */}
      <EditorNote issue={issue} />

      {/* Feature Stories */}
      <FeatureStories month={month} events={issueEvents} maxEvents={3} />

      {/* Regular Columns */}
      <RegularColumns month={month} events={issueEvents} />

      {/* Shortlist */}
      <Shortlist month={month} events={issueEvents} />

      {/* All Events Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-h2-md font-serif font-bold text-black mb-2">
            本月全部活動
          </h2>
          <Divider variant="gold" spacing="lg" fullWidth={true} />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {sortByOrder(issueEvents).map((event) => (
              <Link
                key={event.id}
                href={`/issues/${month}/${event.slug}`}
                className="group"
              >
                <Card
                  className="h-full hover:border-green-ink transition"
                  variant="default"
                >
                  {event.image && (
                    <div className="w-full h-40 bg-gray-light overflow-hidden mb-4 -m-6 mb-4">
                      <img
                        src={event.image.url}
                        alt={event.image.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="mb-3 inline-block">
                      <span className="text-xs uppercase tracking-widest text-green-ink font-bold bg-cream px-3 py-1">
                        {event.category === "course"
                          ? "課程"
                          : event.category === "dining"
                          ? "餐飲"
                          : event.category === "event"
                          ? "活動"
                          : "企劃"}
                      </span>
                    </div>

                    <CardTitle className="text-h3-md font-serif font-bold text-black mb-2 group-hover:text-green-ink transition line-clamp-2">
                      {event.title}
                    </CardTitle>

                    <CardDescription className="text-sm text-gray-dark mb-4 line-clamp-2">
                      {event.summary}
                    </CardDescription>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-light">
                      <span className="text-xs text-gray-dark">
                        {event.startDate}
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

      {/* Issue Navigation */}
      <section className="py-16 md:py-24 px-4 bg-cream">
        <div className="container mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-widest text-gray-dark mb-8 text-center">
            更多月刊
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Previous Issue */}
            {prevIssue ? (
              <Link href={`/issues/${prevIssue.month}`} className="group">
                <Card
                  className="h-full hover:border-green-ink transition text-center"
                  variant="light"
                >
                  <p className="text-xs text-gray-dark uppercase tracking-widest mb-3">
                    上一期
                  </p>
                  <p className="text-h3-md font-serif font-bold text-black group-hover:text-green-ink transition mb-2">
                    {formatMonth(prevIssue.month)}
                  </p>
                  <p className="text-sm text-gray-dark line-clamp-2 mb-4">
                    {prevIssue.theme}
                  </p>
                  <p className="text-xs text-black font-bold">返回 →</p>
                </Card>
              </Link>
            ) : (
              <div />
            )}

            {/* Next Issue */}
            {nextIssue ? (
              <Link href={`/issues/${nextIssue.month}`} className="group">
                <Card
                  className="h-full hover:border-green-ink transition text-center"
                  variant="light"
                >
                  <p className="text-xs text-gray-dark uppercase tracking-widest mb-3">
                    下一期
                  </p>
                  <p className="text-h3-md font-serif font-bold text-black group-hover:text-green-ink transition mb-2">
                    {formatMonth(nextIssue.month)}
                  </p>
                  <p className="text-sm text-gray-dark line-clamp-2 mb-4">
                    {nextIssue.theme}
                  </p>
                  <p className="text-xs text-black font-bold">前往 →</p>
                </Card>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-12 px-4 text-center">
        <Button href="/" asChild size="lg" variant="ghost">
          返回首頁
        </Button>
      </section>
    </main>
  );
}
