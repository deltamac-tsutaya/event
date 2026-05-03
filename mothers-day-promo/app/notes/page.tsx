import type { Metadata } from "next";
import Layout from "@/components/site/Layout";
import SectionHead from "@/components/site/SectionHead";

export const metadata: Metadata = {
  title: "活動須知",
  description: "母親節活動注意事項與相關規範。",
  openGraph: {
    title: "活動須知 ・ 母親節特輯",
    description: "活動商品、折扣與贈品依現場庫存為準。",
  },
};

const items = [
  "活動商品、折扣與贈品數量依現場庫存為準，售完為止。",
  "優惠不得與其他折扣、折價券及會員優惠合併使用，另有規定者依現場公告為準。",
  "贈品數量有限，送完為止，恕不另行通知。",
  "酒類商品請依門市販售規範購買。未滿十八歲請勿飲酒，禁止酒駕。",
];

export default function NotesPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-[1100px] px-5 md:px-10 pt-16 md:pt-24 pb-24 md:pb-32">
        <SectionHead
          index="06"
          en="Important Notes"
          zh="活 動 注 意 事 項"
          description="完整閱讀以下說明，以利在門市挑選商品時順利享有所有活動優惠。"
        />

        <ol className="mt-14 space-y-0">
          {items.map((t, i) => (
            <li key={i} className="grid grid-cols-12 gap-4 py-8 border-b border-rule">
              <div className="col-span-2 md:col-span-1">
                <span className="num-index">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <p className="col-span-10 md:col-span-11 font-serif-tc text-base md:text-lg leading-[2] tracking-wider text-ink">
                {t}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-16 border border-wine/40 p-6 md:p-10 bg-wine/5">
          <p className="eyebrow text-wine">Reminder</p>
          <p className="mt-4 font-serif-tc text-lg tracking-widest text-wine">
            未 滿 十 八 歲 請 勿 飲 酒 ・ 禁 止 酒 駕
          </p>
          <p className="mt-3 text-sm text-ink-soft leading-loose">
            如對活動內容有任何疑問，歡迎前往 TSUTAYA BOOKSTORE 台北信義店或台中市政店現場洽詢。
          </p>
        </div>
      </section>
    </Layout>
  );
}
