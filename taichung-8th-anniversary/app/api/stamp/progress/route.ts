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
      ticketsCount: 0,
      isFirstTime: false,
    });
  }

  // Check if user is first-time: created today (in Taipei timezone)
  const userCreatedDate = new Date(user.created_at);
  const userCreatedDateStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(userCreatedDate);
  const isFirstTime = userCreatedDateStr === today;

  // If first time, automatically add stamp "01" for today
  if (isFirstTime) {
    const { error: insertError } = await supabaseAdmin
      .from("stamps")
      .insert({
        user_id: user.id,
        stamp_id: "01",
        stamp_date: today,
      });
    // Ignore duplicate key error (in case it was already added)
    if (insertError && !insertError.message.includes("duplicate")) {
      console.error("Failed to insert first-time stamp:", insertError);
    }
  }

  // Get today's stamps only (daily reset)
  const { data: stamps, error: stampsError } = await supabaseAdmin
    .from("stamps")
    .select("stamp_id, collected_at")
    .eq("user_id", user.id)
    .eq("stamp_date", today);

  if (stampsError) {
    return NextResponse.json(
      { error: "Failed to fetch stamps", detail: stampsError.message },
      { status: 500 }
    );
  }

  // 排除 A, B, C 隱藏成就點，不計入每日 8 枚進度
  const achievementIds = ["A", "B", "C"];
  const mainStampsCount = stamps?.filter(s => !achievementIds.includes(s.stamp_id)).length ?? 0;

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
    isFirstTime,
  });
}
