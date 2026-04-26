import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { writeLog } from "@/lib/log";

function getTaipeiDateString(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

async function getUser(userId: string) {
  const { data } = await supabaseAdmin.from("users").select("line_user_id, display_name").eq("id", userId).single();
  return data;
}

// 新增當日指定印章給使用者（忽略重複）
export async function POST(request: NextRequest) {
  const { userId, stampId } = await request.json();
  if (!userId || !stampId) {
    return NextResponse.json({ success: false, error: "userId and stampId required" }, { status: 400 });
  }

  const today = getTaipeiDateString();
  const { error } = await supabaseAdmin.from("stamps").insert({ user_id: userId, stamp_id: stampId, stamp_date: today });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ success: false, error: "already_stamped" });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const user = await getUser(userId);
  writeLog({
    event_type: "admin_stamp_add",
    user_id: userId,
    line_user_id: user?.line_user_id,
    display_name: user?.display_name,
    detail: { stamp_id: stampId, stamp_date: today },
  });

  return NextResponse.json({ success: true });
}

// 刪除當日指定印章
export async function DELETE(request: NextRequest) {
  const { userId, stampId } = await request.json();
  if (!userId || !stampId) {
    return NextResponse.json({ success: false, error: "userId and stampId required" }, { status: 400 });
  }

  const today = getTaipeiDateString();
  const { error } = await supabaseAdmin.from("stamps").delete()
    .eq("user_id", userId)
    .eq("stamp_id", stampId)
    .eq("stamp_date", today);

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  const user = await getUser(userId);
  writeLog({
    event_type: "admin_stamp_delete",
    user_id: userId,
    line_user_id: user?.line_user_id,
    display_name: user?.display_name,
    detail: { stamp_id: stampId, stamp_date: today },
  });

  return NextResponse.json({ success: true });
}
