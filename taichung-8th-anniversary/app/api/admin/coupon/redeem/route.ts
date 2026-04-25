import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// POST /api/admin/coupon/redeem
// body: { drawId: string, staffName?: string }
export async function POST(request: NextRequest) {
  const { drawId, staffName } = await request.json();
  if (!drawId) return NextResponse.json({ success: false, error: "drawId required" }, { status: 400 });

  // Fetch the draw record
  const { data: draw, error: fetchError } = await supabaseAdmin
    .from("draws")
    .select("id, draw_date, is_used, reward_id")
    .eq("id", drawId)
    .single();

  if (fetchError || !draw) {
    return NextResponse.json({ success: false, error: "Coupon not found" }, { status: 404 });
  }

  if (draw.is_used) {
    return NextResponse.json({ success: false, error: "already_redeemed" }, { status: 409 });
  }

  // Check expiry
  const { data: reward } = await supabaseAdmin
    .from("rewards")
    .select("validity_days")
    .eq("id", draw.reward_id)
    .single();

  const expiryDate = new Date(draw.draw_date);
  expiryDate.setDate(expiryDate.getDate() + (reward?.validity_days ?? 30));
  if (new Date() > expiryDate) {
    return NextResponse.json({ success: false, error: "expired" }, { status: 410 });
  }

  // Mark as used
  const { error: updateError } = await supabaseAdmin
    .from("draws")
    .update({
      is_used: true,
      used_at: new Date().toISOString(),
      used_by: staffName ?? "staff",
    })
    .eq("id", drawId);

  if (updateError) {
    return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
