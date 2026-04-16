"use client";

import Link from "next/link";
import StepFlow from "@/components/StepFlow";
import StaffRedeemNotice from "@/components/StaffRedeemNotice";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TROUBLESHOOT = [
  {
    id: "t1",
    q: "顧客掃不到 QR code",
    a: "確認鏡頭對焦，可協助顧客調整手機角度或與 QR code 的距離（建議 10–30 公分）。若仍無法掃描，請洽現場負責人員手動協助蓋印。",
  },
  {
    id: "t2",
    q: "顧客無法登入 LINE",
    a: "確認 LINE App 已更新至最新版本。若帳號遭鎖定，請顧客至 LINE 官方管道申請解鎖，活動無法協助處理帳號問題。",
  },
  {
    id: "t3",
    q: "網路不穩定",
    a: "引導顧客移動至諮詢台或 WIRED TOKYO 吧檯附近，訊號較強。亦可提示顧客連接店內 Wi-Fi。",
  },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-bold text-[#00694B] uppercase tracking-widest border-b border-[#00694B]/20 pb-1">
      {children}
    </h2>
  );
}

export default function HelpPage() {
  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      {/* Staff page header — no user avatar needed */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-[#00694B]">
            ← 返回
          </Link>
          <span className="text-sm font-bold text-gray-800">
            現場服務指南（店員專用）
          </span>
          <div className="w-8" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-6">
        {/* ── 集章流程說明 ─────────────────────────────────────── */}
        <section className="space-y-3">
          <SectionTitle>集章流程說明</SectionTitle>
          <StepFlow />
          <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-800">
            <span className="font-semibold">重要：</span>
            請顧客使用自己的手機開啟 LINE 並掃描 QR code，
            <span className="font-semibold">店員不需操作顧客手機</span>。
          </div>
        </section>

        {/* ── 常見問題排解 ─────────────────────────────────────── */}
        <section className="space-y-3">
          <SectionTitle>常見問題排解</SectionTitle>
          <Accordion>
            {TROUBLESHOOT.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-sm font-medium text-gray-800">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.a}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* ── 獎券核銷流程 ─────────────────────────────────────── */}
        <section className="space-y-3">
          <SectionTitle>獎券核銷流程</SectionTitle>
          <ol className="space-y-3">
            {[
              "請顧客開啟 LINE → 錢包 → 優惠券，找到對應獎券",
              "由核銷人員（店員）點擊獎券上的「核銷」按鈕",
              "畫面確認後，顧客向店員展示「已核銷」畫面，完成兌換",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#00694B] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700 leading-relaxed pt-0.5">
                  {step}
                </span>
              </li>
            ))}
          </ol>

          {/* Enlarged notice */}
          <div className="mt-2 text-base">
            <StaffRedeemNotice />
          </div>
        </section>
      </main>
    </div>
  );
}
