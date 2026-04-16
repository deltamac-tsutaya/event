"use client";

import Link from "next/link";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    title: "參加資格",
    content: "凡持有效 LINE 帳號之顧客均可參加。活動期間需使用 LINE 帳號登入本活動頁面。",
  },
  {
    title: "活動期間",
    content: "2026/04/23（週四）— 2026/05/13（週三）。活動結束後，集章及抽獎功能將自動停用。",
  },
  {
    title: "集章規則",
    content:
      "店內共設有 8 個集印點，每個 QR code 每位顧客限掃描 1 次，不得重複蓋印。印章累計於個人帳號，不可轉讓。",
  },
  {
    title: "抽獎規則",
    content:
      "集滿 8 枚印章後，每個帳號每日可抽獎 1 次。抽獎機會於每日午夜 00:00（Asia/Taipei 時區）重置，跨日可再抽。抽獎結果即時產生，不可更改。",
  },
  {
    title: "獎券規則",
    content:
      "獎券發放後自動存入顧客 LINE 優惠券夾，有效期自發放日起計算（詳見各獎項說明）。獎券限本人使用，不得轉讓、轉賣或兌換現金。每張獎券限使用 1 次，核銷後即失效。",
  },
  {
    title: "核銷流程",
    content:
      "兌換獎券時，請出示 LINE 優惠券並由現場工作人員協助核銷。顧客請勿自行點擊核銷，誤點視同已使用，恕不補發。",
  },
  {
    title: "免責聲明",
    content:
      "TSUTAYA BOOKSTORE 台中市政店保有本活動最終解釋權，並得視情況修改或終止活動。如因不可抗力因素（天災、系統故障等）導致活動異常，本店不負相關責任。",
  },
  {
    title: "活動地點",
    content: (
      <>
        TSUTAYA BOOKSTORE 台中市政店（含 WIRED TOKYO）
        <br />
        地址：<span className="italic text-gray-400">[地址待補]</span>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-[#00694B]">
            ← 返回首頁
          </Link>
          <span className="text-sm font-bold text-gray-800">活動條款</span>
          <div className="w-8" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-1 px-4 py-6">
        <div id="rules" className="space-y-5">
          {SECTIONS.map((s) => (
            <section key={s.title} className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#00694B]">
                {s.title}
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {s.content}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-6 text-center text-[10px] text-gray-300">
          最後更新：2026 / 04 / 23
        </p>
      </main>

      <Footer />
    </div>
  );
}
