import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function weightedRandom(rewards: any[]) {
  const total = rewards.reduce((sum, r) => sum + r.probability, 0);
  let rand = Math.random() * total;
  for (const reward of rewards) {
    rand -= reward.probability;
    if (rand <= 0) return reward;
  }
  return rewards[rewards.length - 1];
}

function getTaipeiDateString(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

// 強制觸發抽獎（跳過今日已抽限制，供測試用）
export async function POST(request: NextRequest) {
  const { userId, forceDate } = await request.json();
  if (!userId) return NextResponse.json({ success: false, error: "userId required" }, { status: 400 });

  const today = forceDate ?? getTaipeiDateString();

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, tickets_count")
    .eq("id", userId)
    .single();

  if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

  const { data: rewardsPool } = await supabaseAdmin.from("rewards").select("*");
  if (!rewardsPool?.length) return NextResponse.json({ success: false, error: "No rewards" }, { status: 500 });

  const selected = weightedRandom(rewardsPool);

  await supabaseAdmin.from("draws").insert({
    user_id: user.id,
    reward_id: selected.id,
    draw_date: today,
  });

  await supabaseAdmin
    .from("users")
    .update({ tickets_count: (user.tickets_count ?? 0) + 1 })
    .eq("id", user.id);

  return NextResponse.json({ success: true, reward: selected });
}
