import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { writeLog } from "@/lib/log";

function getTaipeiDateString(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

export async function POST(request: NextRequest) {
  const { userId } = await request.json();
  if (!userId) return NextResponse.json({ success: false, error: "userId required" }, { status: 400 });

  const today = getTaipeiDateString();

  // Fetch user info for log
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("line_user_id, display_name")
    .eq("id", userId)
    .single();

  // Count before deleting (for log detail)
  const { count } = await supabaseAdmin
    .from("stamps")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("stamp_date", today);

  const { error } = await supabaseAdmin
    .from("stamps")
    .delete()
    .eq("user_id", userId)
    .eq("stamp_date", today);

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  writeLog({
    event_type: "admin_reset_daily",
    user_id: userId,
    line_user_id: user?.line_user_id,
    display_name: user?.display_name,
    detail: { stamp_date: today, deleted_count: count ?? 0 },
  });

  return NextResponse.json({ success: true, deleted: count ?? 0 });
}
