import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data: users, error } = await supabaseAdmin
    .from("users")
    .select("id, line_user_id, display_name, tickets_count, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  // 批次取得每位使用者的集印數和抽獎數
  const ids = (users ?? []).map((u) => u.id);

  const [{ data: stampCounts }, { data: drawCounts }] = await Promise.all([
    supabaseAdmin.from("stamps").select("user_id").in("user_id", ids),
    supabaseAdmin.from("draws").select("user_id").in("user_id", ids),
  ]);

  const stampMap: Record<string, number> = {};
  const drawMap: Record<string, number> = {};
  stampCounts?.forEach((s) => { stampMap[s.user_id] = (stampMap[s.user_id] ?? 0) + 1; });
  drawCounts?.forEach((d) => { drawMap[d.user_id] = (drawMap[d.user_id] ?? 0) + 1; });

  const result = (users ?? []).map((u) => ({
    ...u,
    stamp_count: stampMap[u.id] ?? 0,
    draw_count:  drawMap[u.id]  ?? 0,
  }));

  return NextResponse.json({ success: true, users: result });
}
