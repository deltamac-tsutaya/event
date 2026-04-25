import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function getTaipeiDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

const AREA_NAMES: Record<string, string> = {
  "01": "入口主題陳列區", "02": "職人雜貨區", "03": "戶外座位區",
  "04": "兒童繪本書櫃", "05": "樓梯書牆",   "06": "吧檯區",
  "07": "天井吊燈區",   "08": "告示牌",
  A: "員工（隨機）", B: "戶外座位桌上", C: "電梯告示",
};

export async function GET() {
  try {
    const today = getTaipeiDate();
    const todayStart = `${today}T00:00:00+08:00`;

    const [
      { count: totalUsers },
      { count: totalStamps },
      { count: todayStamps },
      { count: totalDraws },
      { data: todayStampRows },
      { data: allStampRows },
      { data: mainStampRows },
    ] = await Promise.all([
      supabaseAdmin.from("users").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("stamps").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("stamps").select("*", { count: "exact", head: true }).gte("collected_at", todayStart),
      supabaseAdmin.from("draws").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("stamps").select("user_id").gte("collected_at", todayStart),
      supabaseAdmin.from("stamps").select("stamp_id"),
      supabaseAdmin.from("stamps").select("user_id, stamp_id")
        .in("stamp_id", ["01","02","03","04","05","06","07","08"]),
    ]);

    // Unique users active today
    const todayActiveUsers = new Set(todayStampRows?.map(r => r.user_id) ?? []).size;

    // Users who completed all 8 main stamps
    const userStampSets: Record<string, Set<string>> = {};
    for (const { user_id, stamp_id } of mainStampRows ?? []) {
      (userStampSets[user_id] ??= new Set()).add(stamp_id);
    }
    const completedUsers = Object.values(userStampSets).filter(s => s.size >= 8).length;

    // Per-location counts
    const countMap: Record<string, number> = {};
    for (const { stamp_id } of allStampRows ?? []) {
      countMap[stamp_id] = (countMap[stamp_id] ?? 0) + 1;
    }

    const locationBreakdown = ["01","02","03","04","05","06","07","08"].map(id => ({
      stampId: id, areaName: AREA_NAMES[id], count: countMap[id] ?? 0,
    }));
    const eggBreakdown = ["A","B","C"].map(id => ({
      stampId: id, areaName: AREA_NAMES[id], count: countMap[id] ?? 0,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers:      totalUsers  ?? 0,
        totalStamps:     totalStamps ?? 0,
        todayStamps:     todayStamps ?? 0,
        todayActiveUsers,
        completedUsers,
        totalDraws:      totalDraws  ?? 0,
        locationBreakdown,
        eggBreakdown,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Stats fetch failed" }, { status: 500 });
  }
}
