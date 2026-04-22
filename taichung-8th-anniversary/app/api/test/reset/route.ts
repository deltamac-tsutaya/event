import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lineUserId = searchParams.get("lineUserId");

  if (!lineUserId) return NextResponse.json({ success: false, error: "lineUserId required" }, { status: 400 });

  // 1. 查找用戶
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("line_user_id", lineUserId)
    .single();

  if (!user) return NextResponse.json({ success: false, error: "User not found" });

  // 2. 刪除該用戶的所有集印紀錄與抽獎紀錄
  await supabaseAdmin.from("stamps").delete().eq("user_id", user.id);
  await supabaseAdmin.from("draws").delete().eq("user_id", user.id);
  
  // 3. 重設券數
  await supabaseAdmin.from("users").update({ tickets_count: 0 }).eq("id", user.id);

  return NextResponse.json({ success: true });
}
