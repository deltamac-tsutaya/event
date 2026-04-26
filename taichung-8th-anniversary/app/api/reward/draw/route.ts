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

  // 3. 驗證今日已集滿 8 枚主印章（每日重置機制）
  const { data: todayStamps } = await supabaseAdmin
    .from("stamps")
    .select("stamp_id")
    .eq("user_id", user.id)
    .eq("stamp_date", today);
  const todayMainCount = todayStamps?.filter(s => !["A", "B", "C"].includes(s.stamp_id)).length ?? 0;
  if (todayMainCount < 8) return NextResponse.json({ success: false, error: "Not enough stamps today" }, { status: 403 });

  // 4. 獲取動態獎項池與今日發放統計
  const { data: rewardsPool, error: rewardsError } = await supabaseAdmin.from("rewards").select("*");
  if (rewardsError || !rewardsPool) throw new Error("Failed to fetch rewards pool");

  const { data: todayDraws, error: statsError } = await supabaseAdmin
    .from("draws")
    .select("reward_id")
    .eq("draw_date", today);
  
  if (statsError) throw new Error("Failed to fetch today's stats");

  // 計算今日各獎項已發放數量
  const counts: Record<string, number> = {};
  todayDraws?.forEach(d => {
    counts[d.reward_id] = (counts[d.reward_id] || 0) + 1;
  });

  // 過濾掉超過上限的獎項
  const availableRewards = rewardsPool.filter(reward => {
    if (reward.daily_limit === null) return true;
    return (counts[reward.id] || 0) < reward.daily_limit;
  });

  // 5. 執行權重抽獎 (若無可用獎項，保底最後一個)
  const selected = weightedRandom(availableRewards.length > 0 ? availableRewards : [rewardsPool[rewardsPool.length - 1]]);

  // 5. 寫入抽獎紀錄並「累積加碼獎券」
  const { error: drawError } = await supabaseAdmin.from("draws").insert({
    user_id: user.id,
    reward_id: selected.id,
    draw_date: today,
  });

  if (drawError) return NextResponse.json({ success: false, error: "Draw failed" }, { status: 500 });

  // 關鍵邏輯：今日首次抽獎完成，加碼獎券 +1
  await supabaseAdmin.from("users").update({ tickets_count: (user.tickets_count || 0) + 1 }).eq("id", user.id);

  // 發送 LINE 優惠券訊息（非同步，不影響抽獎回傳）
  import("@/lib/line-push")
    .then(({ sendCouponMessage }) => sendCouponMessage(lineUserId, selected))
    .catch(err => console.error("[LINE push] 發送失敗:", err));

  return NextResponse.json({
    success: true,
    reward: selected,
    ticketAdded: true,
    totalTickets: (user.tickets_count || 0) + 1
  });
}
