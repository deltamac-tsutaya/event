"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft, BookOpen, QrCode, Users, Gift, AlertTriangle,
  CheckCircle, MapPin, Smartphone, Send, RotateCcw, Zap,
  Info, ChevronDown, ChevronRight, Phone, Clock, Shield,
} from "lucide-react";

// ── 資料 ──────────────────────────────────────────────────────────────────

const STAMP_LOCATIONS = [
  { id: "01", floor: "2F", area: "入口主題陳列區",  element: "♾️ 無限",     hint: "入口右側大型主題陳列旁，掃描貼紙高度約 150cm。" },
  { id: "02", floor: "2F", area: "職人雜貨區",      element: "陶杯",        hint: "職人雜貨選品陳列中，請留意貨架側面。每日輪替×3。" },
  { id: "03", floor: "3F", area: "戶外座位區",      element: "風",          hint: "戶外座位區玻璃門旁或欄杆處。" },
  { id: "04", floor: "3F", area: "兒童繪本書櫃",    element: "橡實",        hint: "低矮書架側邊，約兒童視線高度，90cm 以下。" },
  { id: "05", floor: "3F", area: "樓梯書牆",        element: "書",          hint: "樓梯旁高書牆，需走進去才能看到。每日輪替×3。" },
  { id: "06", floor: "2F", area: "吧檯區",          element: "咖啡",        hint: "吧檯點餐台正面或側邊。每日輪替×3。" },
  { id: "07", floor: "3F", area: "天井吊燈區",      element: "光點",        hint: "天井吊燈下方展示台或柱子。" },
  { id: "08", floor: "1F", area: "告示牌",          element: "花朵",        hint: "1F 告示牌附近，貼近顧客視線處。" },
  { id: "A",  floor: "—",  area: "員工身上（隨機）", element: "墨鏡-松鼠", hint: "彩蛋點：由特定員工隨身佩戴，主動詢問 Nexus Life 服務人員。", hidden: true },
  { id: "B",  floor: "3F", area: "戶外座位桌上",    element: "墨鏡-小鳥",  hint: "彩蛋點：戶外座位某張桌面上，需留心觀察。", hidden: true },
  { id: "C",  floor: "—",  area: "電梯告示",        element: "墨鏡-小鹿",  hint: "彩蛋點：電梯告示位置，往往被忽略的角落。", hidden: true },
];

interface Prize { no: number; shop: "WIRED TOKYO" | "TSUTAYA BOOKSTORE"; name: string; rules: string[]; }
interface RewardTier { tier: string; label: string; color: string; note: string; prizes: Prize[]; }

const REWARD_TIERS: RewardTier[] = [
  {
    tier: "S", label: "S 級獎項", color: "text-yellow-800 bg-yellow-50 border-yellow-300",
    note: "共 2 種，有效期至 2026/5/30。",
    prizes: [
      { no: 1, shop: "WIRED TOKYO", name: "雙人套餐 188 元抵用券",
        rules: ["憑券於 WIRED TOKYO 台中市政店點購雙人套餐，現折 188 元。","每份套餐限用 1 張。","限內用，不得外帶。","結帳時出示券碼，由店員掃碼核銷。","無法與其他優惠券、折扣等活動合併使用。"] },
      { no: 2, shop: "TSUTAYA BOOKSTORE", name: "88 元現金抵用券",
        rules: ["於 TSUTAYA BOOKSTORE 台中市政店結帳時出示券碼，折抵消費 88 元。","不限品項，不設最低消費門檻。","單筆交易限用 1 張。","無法與其他優惠券、折扣等活動合併使用。"] },
    ],
  },
  {
    tier: "A", label: "A 級獎項", color: "text-blue-700 bg-blue-50 border-blue-200",
    note: "共 4 種體驗券，有效期至 2026/5/30。",
    prizes: [
      { no: 3, shop: "WIRED TOKYO", name: "法式巧克力香蕉聖代 體驗券",
        rules: ["憑券於 WIRED TOKYO 台中市政店兌換法式巧克力香蕉聖代 1 份（原價 230 元）。","需搭配任一餐點或飲品同桌消費。","單筆消費限用 1 張。","限內用，點餐時出示券碼，由店員掃碼核銷。","無法與其他優惠券、折扣等活動合併使用。"] },
      { no: 4, shop: "WIRED TOKYO", name: "松露薯條 體驗券",
        rules: ["憑券於 WIRED TOKYO 台中市政店兌換松露薯條 1 份（原價 360 元）。","需搭配任一餐點或飲品同桌消費。","單筆消費限用 1 張。","限內用，點餐時出示券碼，由店員掃碼核銷。","無法與其他優惠券、折扣等活動合併使用。"] },
      { no: 5, shop: "TSUTAYA BOOKSTORE", name: "伯爵茶巴斯克 體驗券",
        rules: ["憑券於 WIRED TOKYO 台中市政店兌換伯爵茶巴斯克 1 份（原價 220 元）。","需搭配任一餐點或飲品同桌消費。","單筆消費限用 1 張。","限內用，點餐時出示券碼，由店員掃碼核銷。","無法與其他優惠券、折扣等活動合併使用。"] },
      { no: 6, shop: "TSUTAYA BOOKSTORE", name: "WIRED 招牌水果茶 體驗券",
        rules: ["憑券於 WIRED TOKYO 台中市政店兌換招牌水果茶（熱／冰）1 杯（原價 180 元）。","需搭配任一餐點或飲品同桌消費。","單筆消費限用 1 張。","限內用，點餐時出示券碼，由店員掃碼核銷。","無法與其他優惠券、折扣等活動合併使用。"] },
    ],
  },
  {
    tier: "B", label: "B 級獎項", color: "text-gray-600 bg-gray-50 border-gray-200",
    note: "共 8 種，保底獎項，100% 中獎，有效期至 2026/5/30。",
    prizes: [
      { no: 7, shop: "WIRED TOKYO", name: "雙人套餐 88 折",
        rules: ["憑券於 WIRED TOKYO 台中市政店點購雙人套餐，套餐總金額享 88 折。","每份套餐限用 1 張。","限內用，結帳時出示券碼，由店員掃碼核銷。","無法與其他優惠券、折扣等活動合併使用。"] },
      { no: 8, shop: "WIRED TOKYO", name: "Brunch 套餐 88 折",
        rules: ["憑券於 WIRED TOKYO 台中市政店點購 Brunch 套餐，套餐總金額享 88 折。","限 Brunch 供應時段使用。","每份套餐限用 1 張。","限內用，點餐時出示券碼，由店員掃碼核銷。","無法與其他優惠券、折扣等活動合併使用。"] },
      { no: 9, shop: "WIRED TOKYO", name: "草莓煉乳抹茶法式吐司 加碼體驗券",
        rules: ["憑券加購草莓煉乳抹茶法式吐司 1 份，優惠價 288 元（原價 360 元）。","需搭配任一餐點同桌消費。","單筆消費限用 1 張。","限內用，點餐時出示券碼由店員確認。","無法與其他優惠券、折扣等活動合併使用。"] },
      { no: 10, shop: "WIRED TOKYO", name: "外帶飲品 買一送一",
        rules: ["憑券外帶飲品買一送一，贈品限同品項且價格相同或較低者。","單筆消費限用 1 張。","點餐時出示券碼，由店員掃碼核銷。","無法與其他優惠券、折扣等活動合併使用。"] },
      { no: 11, shop: "TSUTAYA BOOKSTORE", name: "文具雜貨 88 折",
        rules: ["於 TSUTAYA BOOKSTORE 台中市政店選購文具雜貨，單筆結帳享 88 折。","特價品及指定品牌除外。","單筆交易限用 1 張。","結帳前出示券碼，由店員掃碼核銷。","無法與其他優惠券、折扣等活動合併使用。"] },
      { no: 12, shop: "TSUTAYA BOOKSTORE", name: "書籍雜誌 88 折",
        rules: ["於 TSUTAYA BOOKSTORE 台中市政店選購書籍與雜誌，單筆結帳享 88 折。","限正價商品。","單筆交易限用 1 張。","結帳前出示券碼，由店員掃碼核銷。","無法與其他優惠券、折扣等活動合併使用。"] },
      { no: 13, shop: "TSUTAYA BOOKSTORE", name: "88 元抵用券",
        rules: ["於 TSUTAYA BOOKSTORE 或 WIRED TOKYO 台中市政店，單筆消費滿 888 元現折 88 元。","書店與餐廳消費皆可使用。","單筆交易限用 1 張。","結帳前出示券碼，由店員掃碼核銷。","無法與其他優惠券、折扣等活動合併使用。"] },
      { no: 14, shop: "TSUTAYA BOOKSTORE", name: "8% off",
        rules: ["於 TSUTAYA BOOKSTORE 或 WIRED TOKYO 台中市政店單筆消費享 92 折。","不限品項，不設最低消費門檻。","單筆交易限用 1 張。","無法與其他優惠券、折扣等活動合併使用。"] },
    ],
  },
];

const ADMIN_OPS = [
  {
    action: "補齊 8 枚印章",
    when: "顧客確認有到場但 QR Code 故障，印章無法正常蓋上",
    steps: [
      "在後台使用者列表搜尋顧客名稱或 LINE ID",
      "展開該用戶，點擊「補齊 8 枚」",
      "向顧客確認補章完成，請其回到首頁確認進度",
    ],
    icon: <CheckCircle size={16} className="text-blue-500" />,
  },
  {
    action: "手動新增/移除單枚印章",
    when: "需要精確補蓋特定點位（如某區 QR Code 故障）",
    steps: [
      "展開用戶後，找到印章操作區",
      "點擊「+印章 ID」補蓋，點擊「−」移除",
      "每個印章 ID 對應一個實體點位",
    ],
    icon: <QrCode size={16} className="text-green-500" />,
  },
  {
    action: "強制抽獎",
    when: "顧客已集滿但抽獎功能無法正常觸發",
    steps: [
      "確認顧客集印數 ≥ 8",
      "展開用戶，點擊「強制抽獎」",
      "系統自動執行抽獎並寫入紀錄",
      "點擊「發送優惠券」確保 LINE 訊息寄出",
    ],
    icon: <Zap size={16} className="text-purple-500" />,
  },
  {
    action: "補發優惠券 LINE 訊息",
    when: "顧客抽獎後未收到 LINE 通知，或通知發送失敗",
    steps: [
      "搜尋並展開該用戶",
      "確認「抽」的次數 > 0",
      "點擊「發送優惠券」，系統重發最新一筆抽獎紀錄",
      "請顧客檢查 LINE 訊息（可能需稍等 10 秒）",
    ],
    icon: <Send size={16} className="text-green-500" />,
  },
  {
    action: "重置用戶資料",
    when: "測試帳號清除、或顧客強烈要求重新參與（需主管授權）",
    steps: [
      "⚠️ 此操作不可逆，請向主管確認後執行",
      "展開用戶，點擊「全部重置」",
      "輸入確認後所有印章、抽獎、獎券紀錄將清除",
    ],
    icon: <RotateCcw size={16} className="text-red-500" />,
  },
];

const FAQS = [
  {
    q: "顧客掃描 QR Code 後進入一般瀏覽器，不是 LINE",
    a: "頁面會顯示「用 LINE 開啟集章」按鈕，點擊後自動跳轉到 LINE 並帶入印章 ID，請指引顧客點擊該按鈕。",
  },
  {
    q: "顧客說掃了但沒有成功蓋章",
    a: "請確認：1) 是否在 LINE 內開啟、2) 是否已登入 LINE、3) 同一印章每人限一次，可能已蓋過。在後台查詢確認印章數量。",
  },
  {
    q: "QR Code 掃不起來",
    a: "確認 QR Code 標籤是否完整未損壞。如損壞，聯繫管理員列印新的（後台 → 工具 → 列印 QR Code）。",
  },
  {
    q: "顧客集滿 8 枚但看不到抽獎按鈕",
    a: "請顧客重新整理頁面。若仍無法，在後台確認用戶集印數是否確實為 8，可使用「強制抽獎」協助。",
  },
  {
    q: "顧客抽獎後沒收到 LINE 訊息",
    a: "在後台找到該用戶，點擊「發送優惠券」補發。請顧客確認 LINE 官方帳號未被封鎖。",
  },
  {
    q: "優惠券如何核銷",
    a: "顧客出示 LINE 中的優惠券訊息，或在 App 優惠券匣查看。店員核對品牌、獎項名稱、有效期限後手動核銷（目前無掃碼核銷系統）。",
  },
  {
    q: "隱藏印章顧客找到了，但掃描後說系統無效",
    a: "確認 QR Code 是否為最新版本，若 UUID 已過期請更新。可在後台 QR 點位頁查看目前有效 UUID。",
  },
];

// ── 元件 ──────────────────────────────────────────────────────────────────

function PrizeRow({ prize }: { prize: Prize }) {
  const [open, setOpen] = useState(false);
  const isWired = prize.shop === "WIRED TOKYO";
  return (
    <div className="rounded-xl bg-white/70 border border-white/80 overflow-hidden">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-white/80 transition-colors">
        <span className="text-[9px] font-mono text-gray-400 w-5 shrink-0">#{prize.no}</span>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${isWired ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
          {isWired ? "WIRED" : "TSUTAYA"}
        </span>
        <span className="text-xs font-semibold text-gray-800 flex-1 leading-tight">{prize.name}</span>
        {open ? <ChevronDown size={12} className="shrink-0 text-gray-400" /> : <ChevronRight size={12} className="shrink-0 text-gray-400" />}
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-1 border-t border-white/60">
          {prize.rules.map((rule, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600 mt-1">
              <span className="text-gray-300 shrink-0">·</span>
              <span className="leading-relaxed">{rule}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Section({ id, icon, title, children }: {
  id: string; icon: React.ReactNode; title: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-[#1A2B4A]/8 flex items-center justify-center text-[#1A2B4A]">
          {icon}
        </div>
        <h2 className="text-base font-black text-[#1A2B4A] tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-[#C9A84C] font-black text-sm shrink-0 mt-0.5">Q</span>
        <span className="text-sm font-medium text-gray-800 flex-1">{q}</span>
        {open ? <ChevronDown size={14} className="shrink-0 mt-0.5 text-gray-400" /> : <ChevronRight size={14} className="shrink-0 mt-0.5 text-gray-400" />}
      </button>
      {open && (
        <div className="px-4 pb-4 flex gap-3">
          <span className="text-blue-500 font-black text-sm shrink-0">A</span>
          <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

const NAV_ITEMS = [
  { id: "overview",  label: "活動概述" },
  { id: "locations", label: "集印點位" },
  { id: "flow",      label: "顧客流程" },
  { id: "ops",       label: "後台操作" },
  { id: "rewards",   label: "獎項說明" },
  { id: "faq",       label: "常見問題" },
  { id: "emergency", label: "緊急處理" },
];

// ── 頁面 ──────────────────────────────────────────────────────────────────

export default function ManualPage() {
  return (
    <div className="min-h-svh bg-[#F8FAFC]">

      {/* 頂部列 */}
      <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="mx-auto max-w-4xl px-4 h-14 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
              <ChevronLeft size={18} />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-[#1A2B4A]" />
            <h1 className="font-bold text-[#1A2B4A] text-sm">活動操作手冊</h1>
          </div>
          <span className="ml-auto text-[10px] font-mono text-gray-400">Nexus Life 8th · 2026/04/25–05/24</span>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6 flex gap-6">

        {/* 側邊導覽（桌機） */}
        <aside className="hidden lg:block w-44 shrink-0">
          <nav className="sticky top-20 space-y-1">
            {NAV_ITEMS.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block text-xs font-medium text-gray-500 hover:text-[#1A2B4A] py-1.5 px-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* 主內容 */}
        <main className="flex-1 space-y-10 min-w-0">

          {/* ── 活動概述 ── */}
          <Section id="overview" icon={<Info size={16} />} title="活動概述">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["活動名稱", "Nexus Life｜無限日常 ∞ 連結生活"],
                  ["活動期間", "2026/04/25（六）— 2026/05/24（日）"],
                  ["主辦品牌", "TSUTAYA BOOKSTORE × WIRED TOKYO 台中市政店"],
                  ["集章點位", "8 個主要點位 + 3 個隱藏點位"],
                  ["抽獎資格", "集滿 8 枚印章，每日可抽一次"],
                  ["獎項等級", "S / A / B 三級，共 14 種獎品，100% 中獎，有效期至 2026/5/30"],
                ].map(([k, v]) => (
                  <div key={k} className="space-y-0.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{k}</p>
                    <p className="text-xs text-gray-700 leading-relaxed">{v}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 flex gap-2">
                <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  同一印章點位每人每次活動只能掃描一次。每日抽獎資格跨日重置，已集滿 8 枚者每日均可抽。所有獎項有效期統一至 2026/5/30，核銷時請確認有效期。
                </p>
              </div>
            </div>
          </Section>

          {/* ── 集印點位 ── */}
          <Section id="locations" icon={<MapPin size={16} />} title="集印點位配置">
            <div className="space-y-2">
              {STAMP_LOCATIONS.filter(s => !s.hidden).map(s => (
                <div key={s.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1A2B4A] text-white flex items-center justify-center font-black text-xs shrink-0">
                    {s.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-800">{s.area}</p>
                      <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{s.floor}</span>
                      <span className="text-[10px] text-[#C9A84C] font-medium">{s.element}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.hint}</p>
                  </div>
                </div>
              ))}
              <div className="mt-3 rounded-xl bg-[#1A2B4A]/5 border border-[#1A2B4A]/10 p-4">
                <p className="text-xs font-bold text-[#1A2B4A] mb-2 flex items-center gap-1.5">
                  <Shield size={12} /> 隱藏印章（A / B / C）
                </p>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  不在活動說明中公開，讓顧客自行探索。位置較隱蔽，QR Code 尺寸較小，建議貼在顧客視線不易直接接觸但可尋找到的地方。
                </p>
                <div className="space-y-1.5">
                  {STAMP_LOCATIONS.filter(s => s.hidden).map(s => (
                    <div key={s.id} className="flex items-start gap-2">
                      <span className="font-black text-[#C9A84C] text-xs w-4 shrink-0">{s.id}</span>
                      <p className="text-xs text-gray-600">{s.hint}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* ── 顧客流程 ── */}
          <Section id="flow" icon={<Smartphone size={16} />} title="顧客參與流程">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="space-y-0">
                {[
                  { step: "1", title: "掃描 QR Code", desc: "用手機相機掃描店內 QR Code，若跳出「用 LINE 開啟」提示，點擊按鈕即可。" },
                  { step: "2", title: "LINE 登入", desc: "首次使用需同意個資授權，之後自動識別帳號。" },
                  { step: "3", title: "集章", desc: "成功後顯示蓋章動畫，印章計數 +1。每個點位每人限一次。" },
                  { step: "4", title: "集滿 8 枚", desc: "解鎖每日抽獎按鈕，回到首頁即可看到。" },
                  { step: "5", title: "每日抽獎", desc: "系統依機率隨機抽出 S / A / B 獎項，抽完即時發送 LINE 訊息。" },
                  { step: "6", title: "核銷優惠券", desc: "顧客出示 LINE 訊息或 App 優惠券匣，店員人工核對後兌換。" },
                ].map((item, i, arr) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-[#1A2B4A] text-white flex items-center justify-center text-xs font-black shrink-0">
                        {item.step}
                      </div>
                      {i < arr.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1" />}
                    </div>
                    <div className="pb-5">
                      <p className="text-sm font-bold text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ── 後台操作 ── */}
          <Section id="ops" icon={<Users size={16} />} title="後台操作說明">
            <div className="space-y-3">
              {ADMIN_OPS.map((op, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    {op.icon}
                    <h3 className="text-sm font-bold text-gray-800">{op.action}</h3>
                  </div>
                  <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 mb-3">
                    <p className="text-xs text-blue-700">
                      <span className="font-bold">適用情境：</span>{op.when}
                    </p>
                  </div>
                  <ol className="space-y-1.5">
                    {op.steps.map((s, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="font-bold text-gray-400 shrink-0 w-4">{j + 1}.</span>
                        <span className="leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </Section>

          {/* ── 獎項說明 ── */}
          <Section id="rewards" icon={<Gift size={16} />} title="獎項等級與核銷說明">
            <div className="space-y-3">
              {REWARD_TIERS.map(rt => (
                <div key={rt.tier} className={`rounded-2xl border p-5 ${rt.color}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-black">{rt.label}</span>
                  </div>
                  <p className="text-xs mb-3 opacity-75">{rt.note}</p>
                  <div className="space-y-1.5">
                    {rt.prizes.map(prize => (
                      <PrizeRow key={prize.no} prize={prize} />
                    ))}
                  </div>
                </div>
              ))}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
                <p className="text-xs font-bold text-gray-700">核銷注意事項</p>
                {[
                  "優惠券由顧客出示 LINE 訊息截圖或 App 內頁面，目前無自動掃碼核銷。",
                  "請核對品牌（WIRED TOKYO / TSUTAYA BOOKSTORE）、獎項名稱、有效期限。",
                  "每張優惠券限使用一次，核銷後請告知顧客已使用。",
                  "如對優惠券真偽有疑慮，可在後台查詢顧客抽獎紀錄確認。",
                ].map((note, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-gray-300 shrink-0">·</span>
                    <span className="leading-relaxed">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ── 常見問題 ── */}
          <Section id="faq" icon={<Info size={16} />} title="常見問題 FAQ">
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <Accordion key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </Section>

          {/* ── 緊急處理 ── */}
          <Section id="emergency" icon={<AlertTriangle size={16} />} title="緊急處理流程">
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5 space-y-4">
                <p className="text-xs font-bold text-red-700 flex items-center gap-2">
                  <AlertTriangle size={14} /> 系統無法連線 / 整體停擺
                </p>
                <ol className="space-y-2">
                  {[
                    "立即通知現場主管與系統負責人。",
                    "暫停推廣集章活動，向排隊顧客說明系統維護中。",
                    "記錄已到場顧客資訊（LINE 顯示名稱），待系統恢復後手動補章。",
                    "系統恢復後以後台「手動新增印章」補充，並發送優惠券通知。",
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-red-700">
                      <span className="font-bold shrink-0 w-4">{i + 1}.</span>
                      <span className="leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 space-y-3">
                <p className="text-xs font-bold text-orange-700 flex items-center gap-2">
                  <Clock size={14} /> QR Code 損壞 / 無法掃描
                </p>
                <ol className="space-y-1.5">
                  {[
                    "在後台「工具 → 列印 QR Code」批次列印新標籤。",
                    "或直接在後台「QR 點位」找到該點位，點擊 QR 圖示查看並截圖補用。",
                    "張貼新標籤時請確保 UUID 與原點位一致（同一 stamp_id）。",
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-orange-700">
                      <span className="font-bold shrink-0 w-4">{i + 1}.</span>
                      <span className="leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-bold text-gray-700 flex items-center gap-2 mb-3">
                  <Phone size={14} /> 問題升級流程
                </p>
                <div className="space-y-2">
                  {[
                    { level: "店員無法處理", action: "聯繫現場主管協助判斷" },
                    { level: "後台功能異常", action: "聯繫系統管理員（技術窗口）" },
                    { level: "資料庫錯誤", action: "截圖錯誤訊息回報，暫停相關操作" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300" />
                      <span className="text-gray-500 w-28 shrink-0">{item.level}</span>
                      <span className="text-gray-700">→ {item.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* 頁尾 */}
          <div className="py-6 text-center">
            <p className="text-[10px] font-mono text-gray-300 tracking-widest">
              NEXUS LIFE 8TH ANNIVERSARY · STAFF MANUAL · 2026
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}
