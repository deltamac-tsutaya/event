import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lineUserId = searchParams.get("lineUserId");

  if (!lineUserId) {
    return NextResponse.json(
      { error: "lineUserId is required" },
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
    return NextResponse.json({ history: [] });
  }

  // Fetch draw records (without auto-join — draws.reward_id has no FK constraint)
  const { data: draws, error: historyError } = await supabaseAdmin
    .from("draws")
    .select("id, draw_date, created_at, reward_id, is_used, used_at, used_by")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (historyError) {
    return NextResponse.json(
      { error: "Failed to fetch history", detail: historyError.message },
      { status: 500 }
    );
  }

  if (!draws || draws.length === 0) {
    return NextResponse.json({ history: [] });
  }

  // Fetch reward details for the unique reward IDs found in draws
  const rewardIds = [...new Set(draws.map((d) => d.reward_id))];
  const { data: rewards, error: rewardsError } = await supabaseAdmin
    .from("rewards")
    .select("id, tier, provider, name, conditions, validity_days, probability, daily_limit")
    .in("id", rewardIds);

  if (rewardsError) {
    return NextResponse.json(
      { error: "Failed to fetch rewards", detail: rewardsError.message },
      { status: 500 }
    );
  }

  const rewardMap = Object.fromEntries((rewards ?? []).map((r) => [r.id, r]));

  const history = draws.map((d) => ({
    id: d.id,
    draw_date: d.draw_date,
    created_at: d.created_at,
    reward_id: d.reward_id,
    rewards: rewardMap[d.reward_id] ?? null,
    is_used: d.is_used ?? false,
    used_at: d.used_at ?? null,
    used_by: d.used_by ?? null,
  }));

  return NextResponse.json({ history });
}
