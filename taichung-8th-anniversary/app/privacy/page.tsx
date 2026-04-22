"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    title: "一、適用範圍",
    content:
      "本聲明適用於「TSUTAYA BOOKSTORE 台中市政店（得利影視股份有限公司）8 週年｜Nexus Life × 無限日常 ∞ 連結生活」活動網站（以下簡稱「本活動網站」）。您透過本活動網站參與集印抽獎活動時，即表示同意本聲明所述之個人資料蒐集與使用方式。",
  },
  {
    title: "二、蒐集之個人資料項目",
    intro: "本活動網站於您透過 LINE 登入並參與活動時，將蒐集以下資料：",
    items: [
      "LINE 顯示名稱與頭像",
      "LINE 使用者 UID（線上識別碼）",
      "活動參與紀錄：集印時間、掃描點位、抽獎結果、加碼獎券累積數量與 Infinity Day 開獎結果",
      "必要之設備與連線資訊（瀏覽器類型、作業系統、IP 位址），限用於偵測異常行為與防止作弊",
    ],
  },
  {
    title: "三、資料利用目的與期間",
    intro: "上述資料之利用範圍限於：",
    items: [
      "活動執行（集印驗證、每日抽獎、加碼獎券發放與 Infinity Day 開獎）",
      "LINE 優惠券發送與核銷管理",
      "顧客服務與客訴處理",
      "活動數據統計分析（以匿名化或彙總方式呈現，不涉及特定個人）",
    ],
    footer:
      "資料保存期間至活動結束後 30 日（即 2026/06/12）；屆期後將予以刪除或匿名化處理。",
  },
  {
    title: "四、資料之保護",
    content:
      "本活動網站採用 HTTPS 加密傳輸，伺服器端設有存取控制機制，僅授權人員可接觸活動資料。後台帳號採 Firebase Auth 身分驗證，分 staff 與 admin 兩種權限層級管理。如因業務需要委託第三方廠商協助執行時，將要求其遵守相同之保密義務。",
  },
  {
    title: "五、跨境資料傳輸",
    content:
      "本活動網站後台服務使用 Firebase（Google LLC），伺服器可能位於美國或其他境外地區。相關個人資料於傳輸過程中均採 HTTPS 加密保護，並依 Google 隱私權政策辦理。如您對跨境傳輸有疑慮，可透過第八條所列管道提出查詢。",
  },
  {
    title: "六、資料之不共用原則",
    intro: "蒐集之個人資料不會提供、出租或出售給任何第三方，但下列情形不在此限：",
    items: [
      "經您明確同意",
      "法律明文規定",
      "為保護您或他人之生命、身體、自由或財產安全",
    ],
  },
  {
    title: "七、Cookie 與技術識別碼",
    content:
      "本活動網站使用 Cookie 及 LINE UID 等技術識別碼，以維持您的登入狀態、記錄集印進度與抽獎資格。若您拒絕 Cookie，部分功能（如自動登入、進度保存）將無法正常運作。",
  },
  {
    title: "八、您的權利",
    intro:
      "依個人資料保護法，您可就本活動所蒐集之個人資料行使查閱、更正或刪除等權利，請透過以下管道提出申請：",
    items: [
      "TSUTAYA BOOKSTORE 台中市政店（得利影視股份有限公司）",
      "電話：(04)22587-3636",
    ],
  },
  {
    title: "九、條款修訂",
    content:
      "TSUTAYA BOOKSTORE 台中市政店（得利影視股份有限公司）保有修正本聲明之權利；修正後內容將於本活動網站公告，並以公告日為生效日。",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-svh bg-[#F5F2ED] pb-10">
      <header className="sticky top-0 z-30 flex items-center gap-4 bg-white/80 px-4 py-4 backdrop-blur-md">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft />
          </Button>
        </Link>
        <h1 className="text-lg font-bold text-[#1A2B4A]">個人資料保護聲明</h1>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-5">
        {SECTIONS.map((s) => (
          <section key={s.title} className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
              {s.title}
            </h2>
            {"intro" in s && s.intro && (
              <p className="text-sm text-gray-700 leading-relaxed">{s.intro}</p>
            )}
            {"items" in s && s.items && (
              <ul className="space-y-2">
                {s.items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A84C]" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {"footer" in s && s.footer && (
              <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-2 mt-2">{s.footer}</p>
            )}
            {"content" in s && s.content && (
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
