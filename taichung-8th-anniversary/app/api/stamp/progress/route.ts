import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function getTaipeiDateString(): string {
  // 以 Asia/Taipei (UTC+8) 取得今日日期字串 YYYY-MM-DD
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now); // "YYYY-MM-DD"
}

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
    .select("id, tickets_count")
    .eq("line_user_id", lineUserId)
    .single();

  if (userError || !user) {
    // User not found — return empty state
    return NextResponse.json({
      stamps: [],
      totalStamps: 0,
      canDraw: false,
      drawnToday: false,
    });
  }

  // Get all stamps
  const { data: stamps, error: stampsError } = await supabaseAdmin
    .from("stamps")
    .select("stamp_id, collected_at")
    .eq("user_id", user.id);

  if (stampsError) {
    return NextResponse.json(
      { error: "Failed to fetch stamps", detail: stampsError.message },
      { status: 500 }
    );
  }

  // ── 過濾進度計數 ────────────────────────────────────────────────────────
  // 排除 A, B, C 這類不計入主進度的成就點
  const achievementIds = ["A", "B", "C"];
  const mainStampsCount = stamps?.filter(s => !achievementIds.includes(s.stamp_id)).length ?? 0;
  
  const today = getTaipeiDateString();

  // Check if already drawn today
  const { data: drawToday, error: drawError } = await supabaseAdmin
    .from("draws")
    .select("id")
    .eq("user_id", user.id)
    .eq("draw_date", today)
    .maybeSingle();

  if (drawError) {
    return NextResponse.json(
      { error: "Failed to check draw status", detail: drawError.message },
      { status: 500 }
    );
  }

  const drawnToday = !!drawToday;
  const canDraw = mainStampsCount >= 8 && !drawnToday;

  return NextResponse.json({
    stamps: stamps ?? [],
    totalStamps: mainStampsCount, // 回傳過濾後的數量
    canDraw,
    drawnToday,
    ticketsCount: user.tickets_count ?? 0,
  });
}
