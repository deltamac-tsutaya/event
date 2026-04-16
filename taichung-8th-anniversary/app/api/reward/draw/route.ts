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

interface Reward {
  id: string;
  name: string;
  probability: number;
  daily_limit: number | null;
  validity_days: number;
  conditions: string;
}

function weightedRandom(rewards: Reward[]): Reward {
  const total = rewards.reduce((sum, r) => sum + r.probability, 0);
  let rand = Math.random() * total;
  for (const reward of rewards) {
    rand -= reward.probability;
    if (rand <= 0) return reward;
  }
  return rewards[rewards.length - 1];
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { lineUserId } = body;

  if (!lineUserId) {
    return NextResponse.json(
      { success: false, error: "lineUserId is required" },
      { status: 400 }
    );
  }

  // Find user
  const { data: user, error: userError } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("line_user_id", lineUserId)
    .single();

  if (userError || !user) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 }
    );
  }

  // Check total stamps >= 8
  const { count: stampCount, error: stampError } = await supabaseAdmin
    .from("stamps")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (stampError) {
    return NextResponse.json(
      { success: false, error: "Failed to count stamps" },
      { status: 500 }
    );
  }

  if ((stampCount ?? 0) < 8) {
    return NextResponse.json(
      { success: false, error: "Not enough stamps" },
      { status: 403 }
    );
  }

  const today = getTaipeiDateString();

  // Check if already drawn today
  const { data: existingDraw } = await supabaseAdmin
    .from("draws")
    .select("id")
    .eq("user_id", user.id)
    .eq("draw_date", today)
    .maybeSingle();

  if (existingDraw) {
    return NextResponse.json(
      { success: false, error: "Already drawn today" },
      { status: 409 }
    );
  }

  // Fetch all rewards
  const { data: allRewards, error: rewardsError } = await supabaseAdmin
    .from("rewards")
    .select("id, name, probability, daily_limit, validity_days, conditions");

  if (rewardsError || !allRewards || allRewards.length === 0) {
    return NextResponse.json(
      { success: false, error: "No rewards available" },
      { status: 500 }
    );
  }

  // Filter rewards that have reached their daily limit
  const availableRewards: Reward[] = [];
  for (const reward of allRewards as Reward[]) {
    if (reward.daily_limit === null) {
      availableRewards.push(reward);
      continue;
    }
    const { count: todayDrawCount } = await supabaseAdmin
      .from("draws")
      .select("*", { count: "exact", head: true })
      .eq("reward_id", reward.id)
      .eq("draw_date", today);

    if ((todayDrawCount ?? 0) < reward.daily_limit) {
      availableRewards.push(reward);
    }
  }

  if (availableRewards.length === 0) {
    return NextResponse.json(
      { success: false, error: "All rewards exhausted for today" },
      { status: 503 }
    );
  }

  // Weighted random draw
  const selected = weightedRandom(availableRewards);

  // Insert draw record
  const { error: drawInsertError } = await supabaseAdmin.from("draws").insert({
    user_id: user.id,
    reward_id: selected.id,
    draw_date: today,
  });

  if (drawInsertError) {
    // Unique violation — already drawn today (race condition guard)
    if (drawInsertError.code === "23505") {
      return NextResponse.json(
        { success: false, error: "Already drawn today" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to record draw", detail: drawInsertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    reward: {
      id: selected.id,
      name: selected.name,
      conditions: selected.conditions,
      validity_days: selected.validity_days,
    },
  });
}
