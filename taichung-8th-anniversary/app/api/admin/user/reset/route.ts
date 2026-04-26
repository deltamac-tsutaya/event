import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { writeLog } from "@/lib/log";

export async function POST(request: NextRequest) {
  const { userId } = await request.json();
  if (!userId) return NextResponse.json({ success: false, error: "userId required" }, { status: 400 });

  const { data: user } = await supabaseAdmin.from("users").select("line_user_id, display_name").eq("id", userId).single();

  const [{ count: stampsDeleted }, { count: drawsDeleted }] = await Promise.all([
    supabaseAdmin.from("stamps").delete().eq("user_id", userId).select("*", { count: "exact", head: true }),
    supabaseAdmin.from("draws").delete().eq("user_id", userId).select("*", { count: "exact", head: true }),
  ]);
  await supabaseAdmin.from("users").update({ tickets_count: 0 }).eq("id", userId);

  writeLog({
    event_type: "admin_reset_full",
    user_id: userId,
    line_user_id: user?.line_user_id,
    display_name: user?.display_name,
    detail: { stamps_deleted: stampsDeleted ?? 0, draws_deleted: drawsDeleted ?? 0 },
  });

  return NextResponse.json({ success: true });
}
