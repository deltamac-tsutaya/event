"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
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
];

export default function FaqAccordion() {
  return (
    <section id="faq" className="space-y-2">
      <h2 className="text-base font-bold text-gray-800">常見問題</h2>
      <Accordion>
        {FAQ_ITEMS.map((item) => (
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
