import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// 2026-05-13 20:00 / 20:05 Asia/Taipei
const DRAW_TIME   = new Date("2026-05-13T12:00:00Z");
const REVEAL_TIME = new Date("2026-05-13T12:05:00Z");

function getLotteryStatus(): "countdown" | "processing" | "revealed" {
  const now = new Date();
  if (now < DRAW_TIME)   return "countdown";
  if (now < REVEAL_TIME) return "processing";
  return "revealed";
}

export async function GET(request: NextRequest) {
  const lineUserId = request.nextUrl.searchParams.get("lineUserId");
  const status = getLotteryStatus();

  if (status !== "revealed") {
    return NextResponse.json({ status, won: false, prize: null });
  }

  if (!lineUserId) {
    return NextResponse.json({ status, won: false, prize: null });
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("line_user_id", lineUserId)
    .single();

  if (!user) {
    return NextResponse.json({ status, won: false, prize: null });
  }

  const { data: result } = await supabaseAdmin
    .from("bonus_lottery_results")
    .select("prize_name, drawn_at")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({
    status,
    won: !!result,
    prize: result?.prize_name ?? null,
    drawnAt: result?.drawn_at ?? null,
  });
}
