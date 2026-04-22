import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function getTaipeiDateString(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now);
}

export async function GET(request: NextRequest) {
  const today = getTaipeiDateString();

  try {
    // 1. 總參與人數 (users)
    const { count: totalUsers } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true });

    // 2. 今日集印總數
    const { count: todayStamps } = await supabaseAdmin
      .from("stamps")
      .select("*", { count: "exact", head: true })
      .gte("collected_at", `${today}T00:00:00Z`);

    // 3. 今日抽獎總數
    const { count: todayDraws } = await supabaseAdmin
      .from("draws")
      .select("*", { count: "exact", head: true })
      .eq("draw_date", today);

    // 4. 加碼獎池總券數
    const { data: ticketData } = await supabaseAdmin
      .from("users")
      .select("tickets_count");
    
    const totalTickets = ticketData?.reduce((sum, u) => sum + (u.tickets_count || 0), 0) || 0;

    // 5. 獎項發放分布 (今日)
    const { data: drawsDistribution } = await supabaseAdmin
      .from("draws")
      .select("reward_id")
      .eq("draw_date", today);
    
    const distribution: Record<string, number> = {};
    drawsDistribution?.forEach(d => {
      distribution[d.reward_id] = (distribution[d.reward_id] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: totalUsers || 0,
        todayStamps: todayStamps || 0,
        todayDraws: todayDraws || 0,
        totalTickets,
        distribution
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Stats fetch failed" }, { status: 500 });
  }
}
