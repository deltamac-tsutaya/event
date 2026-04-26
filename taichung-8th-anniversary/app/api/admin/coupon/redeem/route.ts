import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { writeLog } from "@/lib/log";

// POST /api/admin/coupon/redeem
// body: { drawId, pin?, adminOverride? }
// PIN is verified server-side against REDEEM_PIN env var.
// adminOverride:true skips PIN (used by admin panel which is Firebase-auth-gated).
export async function POST(request: NextRequest) {
  const { drawId, pin, staffName, adminOverride } = await request.json();
  if (!drawId) return NextResponse.json({ success: false, error: "drawId required" }, { status: 400 });

  // PIN verification
  if (!adminOverride) {
    const { data: setting } = await supabaseAdmin
      .from("app_settings")
      .select("value")
      .eq("id", "redeem_pin")
      .single();
    const correctPin = setting?.value ?? process.env.REDEEM_PIN;
    if (!correctPin) {
      return NextResponse.json({ success: false, error: "REDEEM_PIN not configured" }, { status: 500 });
    }
    if (!pin || String(pin) !== String(correctPin)) {
      return NextResponse.json({ success: false, error: "wrong_pin" }, { status: 403 });
    }
  }

  // Fetch the draw record
  const { data: draw, error: fetchError } = await supabaseAdmin
    .from("draws")
    .select("id, user_id, draw_date, is_used, reward_id")
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

  const { data: drawUser } = await supabaseAdmin
    .from("users").select("id, line_user_id, display_name").eq("id", draw.user_id).single();

  writeLog({
    event_type: "coupon_redeemed",
    user_id: draw.user_id,
    line_user_id: drawUser?.line_user_id,
    display_name: drawUser?.display_name,
    detail: { draw_id: drawId, reward_id: draw.reward_id, used_by: staffName ?? "staff" },
    actor: staffName ?? "staff",
  });

  return NextResponse.json({ success: true });
}
