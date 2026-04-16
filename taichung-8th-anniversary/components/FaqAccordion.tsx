"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ_ITEMS = [
  {
    id: "q1",
    question: "掃描後沒有蓋印，怎麼辦？",
    answer:
      "請確認您已透過 LINE 帳號登入本活動頁面。若顯示錯誤，請重新整理頁面後再試一次。若問題持續，請洽現場工作人員協助。",
  },
  {
    id: "q2",
    question: "重複掃描同一個 QR code 會怎樣？",
    answer:
      "每個集印點每人限蓋 1 次。重複掃描同一個 QR code 系統將提示「已蓋印」，不會重複累計點數。",
  },
  {
    id: "q3",
    question: "今天已經抽過獎了，可以再抽嗎？",
    answer:
      "每個帳號每天可抽 1 次獎，午夜 00:00（Asia/Taipei 時區）後重新開放，隔日再次集滿即可再抽。",
  },
  {
    id: "q4",
    question: "獎券在哪裡查看？",
    answer:
      "抽獎結果將自動存入您的 LINE 優惠券夾，請開啟 LINE → 錢包 → 優惠券 查看。",
  },
  {
    id: "q5",
    question: "獎券可以轉讓給其他人嗎？",
    answer:
      "獎券綁定個人 LINE 帳號，無法轉讓或轉移給他人使用，亦不可兌換現金。",
  },
  {
    id: "q6",
    question: "現場網路不穩定，掃描失敗怎麼辦？",
    answer:
      "請移動至諮詢台或 WIRED TOKYO 吧檯附近，該區域訊號較佳。亦可連接店內 Wi-Fi 後再試。",
  },
  {
    id: "q7",
    question: "QR code 掃不到怎麼辦？",
    answer:
      "請確認鏡頭對焦正確，保持 10–30 公分距離並保持穩定。若仍無法掃描，請洽現場工作人員以手動協助蓋印。",
  },
  {
    id: "q8",
    question: "活動何時開始、何時結束？",
    answer:
      "活動期間為 2026/04/23（週四）— 2026/05/13（週三），共 21 天。活動結束後，集章與抽獎功能將自動停用。",
  },
  {
    id: "q9",
    question: "一個帳號可以集章幾次？",
    answer:
      "每個集印點每人限蓋 1 次，店內共有 8 個集印點。因此每位使用者最多可累積 8 枚印章。",
  },
  {
    id: "q10",
    question: "獎項核銷後還能再使用嗎？",
    answer:
      "每張獎券限使用 1 次，一旦由工作人員核銷即視同已使用，無法撤回或再次使用。",
  },
];

interface FaqAccordionProps {
  items?: typeof FAQ_ITEMS;
}

export default function FaqAccordion({ items = FAQ_ITEMS }: FaqAccordionProps) {
  return (
    <section id="faq" className="space-y-2">
      <h2 className="text-base font-bold text-gray-800">常見問題</h2>
      <Accordion>
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-sm font-medium text-gray-800">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.answer}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
