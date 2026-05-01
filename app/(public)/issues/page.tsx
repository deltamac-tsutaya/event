import Link from "next/link";
import { mockIssues } from "@/lib/mockData";
import { formatMonth, formatMonthFull } from "@/lib/formatting";
import { Divider } from "@/components/common/Divider";
import { Card } from "@/components/common/Card";

export const metadata = {
  title: "月刊總覽｜À LA PAGE",
  description: "瀏覽 À LA PAGE 所有期數的月刊內容，探索每月的生活風格策展。",
};

export default function IssuesPage() {
  // Sort issues by month descending (newest first)
  const sortedIssues = [...mockIssues].sort((a, b) =>
    b.month.localeCompare(a.month)
  );

  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <section className="py-16 md:py-24 px-4 bg-black text-cream">
        <div className="container mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-widest mb-4 opacity-60">
            月刊總覽
          </p>
          <h1 className="text-h1-sm md:text-h1-md font-serif font-bold mb-6">
            每月一期的策展時刊
          </h1>
          <Divider variant="gold" spacing="md" fullWidth={true} />
          <p className="text-body mt-8 text-gray-light">
            À LA PAGE 每月發行一期，策展食物、書籍、電影與生活提案。從這裡開始，探索您感興趣的月份。
          </p>
        </div>
      </section>

      {/* Issues Grid */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedIssues.map((issue) => (
              <Link
                key={issue.id}
                href={`/issues/${issue.month}`}
                className="group"
              >
                <Card
                  className="h-full hover:border-green-ink transition overflow-hidden"
                  variant="default"
                >
                  {/* Issue Thumbnail */}
                  <div className="w-full aspect-[3/4] bg-gray-light overflow-hidden -m-6 mb-6 relative">
                    <img
                      src={issue.coverImage.url}
                      alt={issue.coverImage.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <span className="text-cream font-bold text-base">
                        閱讀月刊 →
                      </span>
                    </div>

                    {/* Month Badge */}
                    <div className="absolute top-4 left-4 bg-black text-cream px-4 py-2 text-sm font-bold">
                      {formatMonth(issue.month)}
                    </div>

                    {/* Issue Number */}
                    <div className="absolute bottom-4 right-4 bg-cream text-black px-3 py-1 text-xs font-bold">
                      第 {issue.issue_number} 期
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-6 pb-6">
                    {/* Title */}
                    <h3 className="text-h3-md font-serif font-bold text-black mb-3 line-clamp-2 group-hover:text-green-ink transition">
                      {issue.theme}
                    </h3>

                    {/* Meta */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-light">
                      <p className="text-sm text-gray-dark">
                        {formatMonthFull(issue.month)}
                      </p>
                      {issue.eventCount && (
                        <p className="text-xs uppercase tracking-widest text-green-ink font-bold">
                          {issue.eventCount} 個活動
                        </p>
                      )}
                    </div>

                    {/* Description Preview */}
                    <p className="text-sm text-gray-dark line-clamp-2 mb-4">
                      {issue.editorNote.text}
                    </p>

                    {/* Arrow CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-light">
                      <span className="text-xs text-gray-dark uppercase tracking-widest">
                        策展內容
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

      {/* Statistics */}
      <section className="py-16 md:py-20 px-4 bg-cream">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-h2-md font-serif font-bold text-black mb-2">
                {sortedIssues.length}
              </p>
              <p className="text-sm text-gray-dark uppercase tracking-widest">
                期月刊
              </p>
            </div>
            <div>
              <p className="text-h2-md font-serif font-bold text-black mb-2">
                {sortedIssues.reduce((sum, i) => sum + (i.eventCount || 0), 0)}
              </p>
              <p className="text-sm text-gray-dark uppercase tracking-widest">
                個活動
              </p>
            </div>
            <div>
              <p className="text-h2-md font-serif font-bold text-black mb-2">
                {sortedIssues.reduce((sum, i) => sum + (i.viewCount || 0), 0)}
              </p>
              <p className="text-sm text-gray-dark uppercase tracking-widest">
                次瀏覽
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
