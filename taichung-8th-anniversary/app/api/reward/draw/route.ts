import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function getTaipeiDateString(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now);
}

// 根據企劃文件定義的 14 項獎項
const REWARDS_POOL = [
  { id: "S1", tier: "S", provider: "WIRED", name: "雙人套餐 188 元抵用券", conditions: "限店內使用，有效至 2026/5/30", probability: 1, daily_limit: 1, validity_days: 30 },
  { id: "S2", tier: "S", provider: "TSUTAYA", name: "88 元現金抵用券", conditions: "全館適用，有效至 2026/5/30", probability: 1, daily_limit: 1, validity_days: 30 },
  { id: "A1", tier: "A", provider: "WIRED", name: "法式巧克力香蕉聖代 體驗券", conditions: "店內兌換，有效至 2026/5/30", probability: 1, daily_limit: 1, validity_days: 30 },
  { id: "A2", tier: "A", provider: "WIRED", name: "松露薯條 體驗券", conditions: "店內兌換，有效至 2026/5/30", probability: 1, daily_limit: 1, validity_days: 30 },
  { id: "A3", tier: "A", provider: "TSUTAYA", name: "伯爵茶巴斯克 體驗券", conditions: "跨店兌換，有效至 2026/5/30", probability: 1, daily_limit: 1, validity_days: 30 },
  { id: "A4", tier: "A", provider: "TSUTAYA", name: "WIRED 招牌水果茶 體驗券", conditions: "跨店兌換，有效至 2026/5/30", probability: 1, daily_limit: 1, validity_days: 30 },
  { id: "B1", tier: "B", provider: "WIRED", name: "雙人套餐 88 折", conditions: "有效至 2026/5/30", probability: 3, daily_limit: 5, validity_days: 30 },
  { id: "B2", tier: "B", provider: "WIRED", name: "Brunch 套餐 88 折", conditions: "有效至 2026/5/30", probability: 3, daily_limit: null, validity_days: 30 },
  { id: "B3", tier: "B", provider: "WIRED", name: "草莓煉乳抹茶法式吐司 加碼體驗券", conditions: "需消費滿額使用，有效至 2026/5/30", probability: 3, daily_limit: 3, validity_days: 30 },
  { id: "B4", tier: "B", provider: "WIRED", name: "外帶飲品 買一送一", conditions: "限外帶使用，有效至 2026/5/30", probability: 10, daily_limit: null, validity_days: 30 },
  { id: "B5", tier: "B", provider: "TSUTAYA", name: "文具雜貨 88 折", conditions: "指定品項適用，有效至 2026/5/30", probability: 3, daily_limit: null, validity_days: 30 },
  { id: "B6", tier: "B", provider: "TSUTAYA", name: "書籍雜誌 88 折", conditions: "指定書籍適用，有效至 2026/5/30", probability: 3, daily_limit: null, validity_days: 30 },
  { id: "B7", tier: "B", provider: "TSUTAYA", name: "88 元抵用券 (滿 888)", conditions: "滿額折抵，有效至 2026/5/30", probability: 39, daily_limit: null, validity_days: 30 },
  { id: "B8", tier: "B", provider: "TSUTAYA", name: "92 折優惠券", conditions: "通用折扣，有效至 2026/5/30", probability: 30, daily_limit: null, validity_days: 30 },
];

function weightedRandom(rewards: any[]) {
  const total = rewards.reduce((sum, r) => sum + r.probability, 0);
  let rand = Math.random() * total;
  for (const reward of rewards) {
    rand -= reward.probability;
    if (rand <= 0) return reward;
  }
  return rewards[rewards.length - 1];
}

export async function POST(request: NextRequest) {
  const { lineUserId } = await request.json();
  if (!lineUserId) return NextResponse.json({ success: false, error: "lineUserId is required" }, { status: 400 });

  const today = getTaipeiDateString();

  // 1. 查找用戶並確認抽獎資格
  const { data: user } = await supabaseAdmin.from("users").select("id, tickets_count").eq("line_user_id", lineUserId).single();
  if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

  // 2. 檢查今日是否已抽過
  const { data: existingDraw } = await supabaseAdmin.from("draws").select("id").eq("user_id", user.id).eq("draw_date", today).maybeSingle();
  if (existingDraw) return NextResponse.json({ success: false, error: "Already drawn today" }, { status: 409 });

  // 3. 獲取當日已發放數量，過濾掉超過上限的獎項
  // 實務上這部分應該從 DB 動態抓取，這裡我們先做邏輯模擬或從 DB 獲取統計
  const availableRewards = [];
  for (const reward of REWARDS_POOL) {
    if (reward.daily_limit === null) {
      availableRewards.push(reward);
      continue;
    }
    const { count } = await supabaseAdmin.from("draws").select("*", { count: "exact", head: true }).eq("reward_id", reward.id).eq("draw_date", today);
    if ((count ?? 0) < reward.daily_limit) {
      availableRewards.push(reward);
    }
  }

  // 4. 執行權重抽獎
  const selected = weightedRandom(availableRewards.length > 0 ? availableRewards : [REWARDS_POOL[REWARDS_POOL.length - 1]]);

  // 5. 寫入抽獎紀錄並「累積加碼獎券」
  const { error: drawError } = await supabaseAdmin.from("draws").insert({
    user_id: user.id,
    reward_id: selected.id,
    draw_date: today,
  });

  if (drawError) return NextResponse.json({ success: false, error: "Draw failed" }, { status: 500 });

  // 關鍵邏輯：今日首次抽獎完成，加碼獎券 +1
  await supabaseAdmin.from("users").update({ tickets_count: (user.tickets_count || 0) + 1 }).eq("id", user.id);

  return NextResponse.json({
    success: true,
    reward: selected,
    ticketAdded: true,
    totalTickets: (user.tickets_count || 0) + 1
  });
}
