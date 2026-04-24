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

  // 指定 drawId 或取最新一筆抽獎
  const query = supabase
    .from("draws")
    .select("id, rewards(*)")
    .eq("user_id", userId);

  const { data: draws } = drawId
    ? await query.eq("id", drawId)
    : await query.order("draw_date", { ascending: false }).limit(1);

  const draw = draws?.[0];
  if (!draw?.rewards) return NextResponse.json({ success: false, error: "No draw found" }, { status: 404 });

  try {
    await sendCouponMessage(user.line_user_id, draw.rewards as unknown as Parameters<typeof sendCouponMessage>[1]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Send failed" }, { status: 500 });
  }
}
