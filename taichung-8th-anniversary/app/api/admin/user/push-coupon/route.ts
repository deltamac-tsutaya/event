import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendCouponMessage } from "@/lib/line-push";

export async function POST(request: NextRequest) {
  const { userId, drawId } = await request.json();
  if (!userId) return NextResponse.json({ success: false, error: "userId required" }, { status: 400 });

  const supabase = getSupabaseAdmin();

  const { data: user } = await supabase
    .from("users")
    .select("line_user_id")
    .eq("id", userId)
    .single();

  if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

  // Fetch draw record (without FK auto-join — draws.reward_id has no FK constraint)
  const drawQuery = supabase
    .from("draws")
    .select("id, reward_id")
    .eq("user_id", userId);

  const { data: draws } = drawId
    ? await drawQuery.eq("id", drawId)
    : await drawQuery.order("draw_date", { ascending: false }).limit(1);

  const draw = draws?.[0];
  if (!draw) return NextResponse.json({ success: false, error: "No draw found" }, { status: 404 });

  // Fetch reward separately
  const { data: reward } = await supabase
    .from("rewards")
    .select("id, tier, provider, name, conditions, validity_days, probability, daily_limit")
    .eq("id", draw.reward_id)
    .single();

  if (!reward) return NextResponse.json({ success: false, error: "Reward not found" }, { status: 404 });

  try {
    await sendCouponMessage(user.line_user_id, reward as Parameters<typeof sendCouponMessage>[1]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Send failed" }, { status: 500 });
  }
}
