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

  // Fetch draw history with reward info, ordered by created_at desc
  const { data: history, error: historyError } = await supabaseAdmin
    .from("draws")
    .select(
      `
      draw_date,
      created_at,
      rewards (
        id,
        name,
        conditions,
        validity_days,
        probability,
        daily_limit
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (historyError) {
    return NextResponse.json(
      { error: "Failed to fetch history", detail: historyError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ history: history ?? [] });
}
