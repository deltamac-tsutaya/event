import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET /api/coupon/verify?id=[drawId]
// Public endpoint — staff scans QR → fetches coupon status before redeeming
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { data: draw, error } = await supabaseAdmin
    .from("draws")
    .select("id, draw_date, created_at, reward_id, is_used, used_at, used_by, user_id")
    .eq("id", id)
    .single();

  if (error || !draw) {
    return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
  }

  // Fetch reward separately (no FK constraint)
  const { data: reward } = await supabaseAdmin
    .from("rewards")
    .select("id, tier, provider, name, conditions, validity_days")
    .eq("id", draw.reward_id)
    .single();

  // Fetch user display name
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("display_name, line_user_id")
    .eq("id", draw.user_id)
    .single();

  const expiryDate = new Date(draw.draw_date);
  expiryDate.setDate(expiryDate.getDate() + (reward?.validity_days ?? 30));
  const isExpired = new Date() > expiryDate;

  return NextResponse.json({
    draw: {
      id: draw.id,
      draw_date: draw.draw_date,
      is_used: draw.is_used ?? false,
      used_at: draw.used_at,
      used_by: draw.used_by,
    },
    reward,
    user: { display_name: user?.display_name ?? "—" },
    isExpired,
    expiryDate: expiryDate.toISOString().split("T")[0],
  });
}
