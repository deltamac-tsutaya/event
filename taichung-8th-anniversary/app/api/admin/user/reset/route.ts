import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const { userId } = await request.json();
  if (!userId) return NextResponse.json({ success: false, error: "userId required" }, { status: 400 });

  await Promise.all([
    supabaseAdmin.from("stamps").delete().eq("user_id", userId),
    supabaseAdmin.from("draws").delete().eq("user_id", userId),
  ]);
  await supabaseAdmin.from("users").update({ tickets_count: 0 }).eq("id", userId);

  return NextResponse.json({ success: true });
}
