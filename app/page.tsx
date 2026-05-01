import { Suspense } from "react";
import { mockIssues, mockEvents } from "@/lib/mockData";
import { getEventsByIssue } from "@/lib/utils";
import {
  MagazineCover,
  CoverStory,
  EditorNote,
  TableOfContents,
  FeatureStories,
  RegularColumns,
  Shortlist,
  Archive,
} from "@/components/magazine";

export const metadata = {
  title: "À LA PAGE｜數位第三空間",
  description:
    "每月一期的生活風格月刊。策展食物、書籍與電影，探索第三空間的無限可能。",
};

export default function Home() {
  // Get current issue (latest)
  const currentIssue = mockIssues[0];
  if (!currentIssue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">未找到月刊</h1>
          <p className="text-gray-dark">請稍後再訪問。</p>
        </div>
      </div>
    );
  }

  // Get events for current month
  const issueEvents = getEventsByIssue(mockEvents, currentIssue.id);
  const coverStoryEvent = issueEvents.find((e) => e.placement === "coverStory");

  return (
    <main className="w-full">
      {/* Magazine Cover */}
      <Suspense fallback={<div className="h-96 bg-gray-light animate-pulse" />}>
        <MagazineCover issue={currentIssue} />
      </Suspense>

      {/* Cover Story */}
      <Suspense fallback={<div className="h-96 bg-white" />}>
        <CoverStory issue={currentIssue} event={coverStoryEvent} />
      </Suspense>

      {/* Editor's Note */}
      <Suspense fallback={<div className="h-48 bg-cream" />}>
        <EditorNote issue={currentIssue} />
      </Suspense>

      {/* Table of Contents */}
      <Suspense fallback={<div className="h-96 bg-white" />}>
        <TableOfContents month={currentIssue.month} events={issueEvents} />
      </Suspense>

      {/* Feature Stories */}
      <Suspense fallback={<div className="h-96 bg-white" />}>
        <FeatureStories month={currentIssue.month} events={issueEvents} maxEvents={3} />
      </Suspense>

      {/* Regular Columns */}
      <Suspense fallback={<div className="h-96 bg-white" />}>
        <RegularColumns month={currentIssue.month} events={issueEvents} />
      </Suspense>

      {/* Shortlist */}
      <Suspense fallback={<div className="h-96 bg-cream" />}>
        <Shortlist month={currentIssue.month} events={issueEvents} />
      </Suspense>

      {/* Archive */}
      <Suspense fallback={<div className="h-96 bg-white" />}>
        <Archive issues={mockIssues} currentMonth={currentIssue.month} />
      </Suspense>
    </main>
  );
}
