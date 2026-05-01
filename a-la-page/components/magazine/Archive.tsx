import Link from "next/link";
import { Issue } from "@/lib/types";
import { formatMonth, formatMonthFull } from "@/lib/formatting";
import { Card } from "@/components/common/Card";
import { Divider } from "@/components/common/Divider";

interface ArchiveProps {
  issues: Issue[];
  currentMonth?: string;
}

export function Archive({ issues, currentMonth }: ArchiveProps) {
  // Get past issues (excluding current month)
  const pastIssues = issues
    .filter((i) => !currentMonth || i.month !== currentMonth)
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 12);

  if (pastIssues.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-h2-md font-serif font-bold text-black mb-2">
          期刊存檔
        </h2>
        <p className="text-sm text-gray-dark mb-8">
          瀏覽過往月份的完整內容
        </p>
        <Divider variant="gold" spacing="lg" fullWidth={true} />

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pastIssues.map((issue) => (
            <Link
              key={issue.id}
              href={`/issues/${issue.month}`}
              className="group"
            >
              <Card
                className="h-full hover:border-green-ink transition overflow-hidden"
                variant="default"
                size="sm"
              >
                {/* Archive Thumbnail */}
                <div className="w-full aspect-[3/4] bg-gray-light overflow-hidden mb-4 -m-4 mb-4 relative">
                  {issue.coverImage && (
                    <img
                      src={issue.coverImage.url}
                      alt={issue.coverImage.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  )}

                  {/* Overlay Info */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="text-cream font-bold text-sm">
                      查看月刊 →
                    </span>
                  </div>

                  {/* Month Badge */}
                  <div className="absolute top-3 left-3 bg-black text-cream px-3 py-1 text-xs font-bold">
                    {formatMonth(issue.month)}
                  </div>
                </div>

                {/* Issue Info */}
                <div className="p-3">
                  <p className="text-xs uppercase tracking-widest text-gray-dark mb-2">
                    第 {issue.issue_number} 期
                  </p>
                  <h4 className="text-sm font-bold text-black line-clamp-2 group-hover:text-green-ink transition mb-3">
                    {issue.theme}
                  </h4>
                  <p className="text-xs text-gray-dark">
                    {formatMonthFull(issue.month)}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-12 text-center">
          <Link
            href="/issues"
            className="inline-block px-8 py-3 border border-black text-black hover:bg-black hover:text-cream transition font-bold"
          >
            查看所有月刊
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Archive;
