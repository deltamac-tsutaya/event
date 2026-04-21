"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Footer from "@/components/Footer";

const FAQS = [
  {
    q: "掃描後沒有蓋印？",
    a: "請確認已透過 LINE 登入活動頁面，重新整理後再試。若依然無法掃描，請洽詢現場工作人員尋求協助。"
  },
  {
    q: "重複掃描同一個 QR code？",
    a: "每個集印點每人限蓋 1 次，重複掃描不會累計。"
  },
  {
    q: "今天已經抽過獎了？",
    a: "每個帳號每天可抽 1 次。午夜 00:00 後系統將自動重置抽獎機會。"
  },
  {
    q: "獎券在哪裡查看？",
    a: "抽中的獎券會自動存入 LINE 優惠券夾，您可以從 LINE 主頁進入「優惠券」查看。"
  },
  {
    q: "獎券可以轉讓嗎？",
    a: "LINE 優惠券綁定個人帳號，無法轉讓、截圖或以任何形式二次流通。"
  },
  {
    q: "現場網路不穩定？",
    a: "請移動至諮詢台或 WIRED TOKYO 吧檯附近，該區域訊號較穩定。"
  },
  {
    q: "QR code 掃不到？",
    a: "請確認手機鏡頭對焦清晰，或確認手機已開啟相機權限。若仍有問題請洽現場同仁協助。"
  }
];

export default function FaqPage() {
  return (
    <div className="min-h-svh bg-[#F5F2ED] pb-10">
      <header className="sticky top-0 z-30 flex items-center gap-4 bg-white/80 px-4 py-4 backdrop-blur-md">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft />
          </Button>
        </Link>
        <h1 className="text-lg font-bold text-[#1A2B4A]">常見問題 FAQ</h1>
      </header>

      <main className="mx-auto max-w-2xl p-5 space-y-4">
        {FAQS.map((faq, i) => (
          <div key={i} className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-[#1A2B4A] mb-2 flex gap-2">
              <span className="text-[#C9A84C]">Q.</span>
              {faq.q}
            </h3>
            <p className="text-[13px] text-gray-500 leading-relaxed pl-6 border-l border-gray-100">
              {faq.a}
            </p>
          </div>
        ))}

        <div className="pt-8 text-center">
          <p className="text-xs text-gray-400">
            若以上資訊無法解決您的問題<br />
            請洽 TSUTAYA BOOKSTORE 台中市政店現場服務台
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
