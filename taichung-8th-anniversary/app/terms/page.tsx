"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    title: "活動聲明",
    content:
      "本活動由得利影視股份有限公司主辦，旗下 TSUTAYA BOOKSTORE 台中市政店與 WIRED TOKYO 台中市政店共同參與執行。凡參與「Nexus Life｜無限日常 ∞ 連結生活（台中市政店 8 週年）」活動者，視同同意本條款。",
  },
  {
    title: "活動期間與效期",
    items: [
      "活動期間：2026/04/23 00:00 至 2026/05/13 23:59。",
      "Infinity Day 加碼獎開獎時間：2026/05/13 20:00。",
      "一般 LINE 優惠券有效期：統一至 2026/05/30，逾期自動失效。",
      "Infinity Day 加碼獎券有效期：至 2026/06/12（自 2026/05/13 開獎後 30 日內），須於期限內致電或至 WIRED TOKYO 台中市政店預約用餐。",
    ],
  },
  {
    title: "參加資格",
    content:
      "本活動開放所有到店顧客參加，不需具備會員身分，但須具備可登入之 LINE 個人帳號。本活動限台灣地區參加。未滿 18 歲之未成年人參加本活動，視同已取得法定監護人之同意。",
  },
  {
    title: "集印方式",
    content:
      "顧客至 TSUTAYA BOOKSTORE 台中市政店或 WIRED TOKYO 台中市政店（均由得利影視股份有限公司營運），掃描店內指定集印點位之 QR Code，即可累積印章。每次到店限集印 1 枚；集滿 8 枚後方可參與每日抽獎。",
  },
  {
    title: "抽獎規則",
    items: [
      "集滿 8 枚印章後，每日可抽獎 1 次；每日 00:00 重置抽獎機會。",
      "Infinity Day 加碼獎採全池模式，需於當日完成每日抽獎方可累積加碼獎券，並於 2026/05/13 20:00 全池隨機抽出 8 份 WIRED TOKYO 雙人和牛牛排套餐。同一用戶至多得獎 1 份；若有剩餘名額，將持續自獎池抽取至發滿 8 份。",
    ],
  },
  {
    title: "獎品使用規則",
    content:
      "Infinity Day 加碼獎（WIRED TOKYO 雙人和牛牛排套餐）須提前致電或至現場預約，每人限用 1 張，不得拆分使用或由他人代為使用。獎品不得兌換現金，亦不得轉讓他人。套餐適用規則以現場公告為準。",
  },
  {
    title: "兌換與使用限制",
    items: [
      "所有 LINE 優惠券須由店內同仁掃碼核銷，顧客請勿自行操作。",
      "優惠券一經核銷即視為「已使用」，不得再次使用；如因顧客誤按而致「已使用」，亦恕不補發。",
      "優惠券不得與其他優惠券、折扣或活動合併使用。",
      "部分商品或服務不適用優惠券內容；常見不適用項目包含酒精飲料、特價商品與指定品牌商品，詳以各券券面條款為準。",
      "優惠券不得要求兌換現金或找零。",
      "LINE 優惠券綁定個人帳號，無法轉讓、截圖或二次流通。",
      "Infinity Day 加碼獎券須提前預約，每人限用 1 張。",
    ],
  },
  {
    title: "免責聲明",
    content:
      "因天災、網路中斷、系統維護或其他不可抗力事由導致活動暫停、延誤或資料遺失，主辦方不負賠償責任，並保有調整活動時程之權利。如有惡意刷票、異常操作或違反本條款之行為，主辦方有權取消該用戶之參加資格及獎項，不另行通知。",
  },
  {
    title: "變更權利與準據法",
    content:
      "TSUTAYA BOOKSTORE 台中市政店（得利影視股份有限公司）保有隨時修正、暫停或終止本活動之權利，並就本活動辦法保有最終解釋權。如有未盡事宜，以現場公告為準。本活動依中華民國法律解釋；如有爭議，以台灣台北地方法院為第一審管轄法院。",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-svh bg-[#F5F2ED] pb-10">
      <header className="sticky top-0 z-30 flex items-center gap-4 bg-white/80 px-4 py-4 backdrop-blur-md">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft />
          </Button>
        </Link>
        <h1 className="text-lg font-bold text-[#1A2B4A]">活動參與條款</h1>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-5">
        {SECTIONS.map((s) => (
          <section key={s.title} className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
              {s.title}
            </h2>
            {"items" in s && s.items ? (
              <ul className="space-y-2">
                {s.items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A84C]" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-700 leading-relaxed">{s.content}</p>
            )}
          </section>
        ))}

        <p className="text-center text-[10px] text-gray-400 pt-2">最後更新：2026 / 04 / 23</p>
      </main>

      <Footer />
    </div>
  );
}
