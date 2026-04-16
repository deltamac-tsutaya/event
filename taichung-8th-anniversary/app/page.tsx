import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StampCard from "@/components/StampCard";
import RewardCard from "@/components/RewardCard";
import FaqAccordion from "@/components/FaqAccordion";
import StepFlow from "@/components/StepFlow";
import StaffRedeemNotice from "@/components/StaffRedeemNotice";
import EmptyState from "@/components/ui-state/EmptyState";
import ErrorState from "@/components/ui-state/ErrorState";

// ── Dev-only preview data ─────────────────────────────────────────
const MOCK_STAMPS = [
  { stamp_id: "01", collected_at: "2026-04-23T10:05:00+08:00" },
  { stamp_id: "03", collected_at: "2026-04-23T10:12:00+08:00" },
  { stamp_id: "06", collected_at: "2026-04-23T10:25:00+08:00" },
];

const MOCK_REWARD = {
  id: "R03",
  name: "買一送一飲品券",
  conditions: "限飲品區使用，每人限一次，不與其他優惠併用",
  validity_days: 7,
};
// ─────────────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b pb-1">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      <Header
        pictureUrl="https://profile.line-scdn.net/0hGMRMPMDX"
        displayName="Dev User"
      />

      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-6">
        {/* DEV banner */}
        {process.env.NODE_ENV === "development" && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-xs text-amber-700 font-medium">
            🛠️ Dev Preview — 各元件展示用頁面
          </div>
        )}

        <Section title="StepFlow">
          <StepFlow />
        </Section>

        <Section title="StampCard — 3/8 已收集">
          <StampCard stamps={MOCK_STAMPS} totalStamps={3} />
        </Section>

        <Section title="StampCard — 集章完成（8/8）">
          <StampCard
            stamps={[
              { stamp_id: "01", collected_at: "2026-04-23T10:05:00+08:00" },
              { stamp_id: "02", collected_at: "2026-04-23T10:07:00+08:00" },
              { stamp_id: "03", collected_at: "2026-04-23T10:12:00+08:00" },
              { stamp_id: "04", collected_at: "2026-04-23T10:15:00+08:00" },
              { stamp_id: "05", collected_at: "2026-04-23T10:19:00+08:00" },
              { stamp_id: "06", collected_at: "2026-04-23T10:25:00+08:00" },
              { stamp_id: "07", collected_at: "2026-04-23T10:28:00+08:00" },
              { stamp_id: "08", collected_at: "2026-04-23T10:30:00+08:00" },
            ]}
            totalStamps={8}
          />
        </Section>

        <Section title="RewardCard">
          <RewardCard reward={MOCK_REWARD} drawDate="2026-04-23" />
        </Section>

        <Section title="StaffRedeemNotice">
          <StaffRedeemNotice />
        </Section>

        <Section title="EmptyState">
          <EmptyState message="尚無抽獎紀錄" icon="🎫" />
        </Section>

        <Section title="ErrorState（含重試）">
          {/* onRetry must be wired in a Client Component in real usage */}
          <ErrorState message="載入失敗，請稍候再試" />
        </Section>

        <div id="faq">
          <Section title="FaqAccordion">
            <FaqAccordion />
          </Section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
