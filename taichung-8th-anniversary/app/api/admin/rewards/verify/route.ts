import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const { pin } = await request.json();
  if (!pin) return NextResponse.json({ success: false, error: "PIN required" }, { status: 400 });

  const { data: setting } = await supabaseAdmin
    .from("app_settings")
    .select("value")
    .eq("id", "super_admin_pin")
    .single();

  const correctPin = setting?.value ?? process.env.SUPER_ADMIN_PIN;
  if (!correctPin) {
    return NextResponse.json({ success: false, error: "super_admin_pin 尚未設定，請先至後台設定頁配置" }, { status: 500 });
  }

  if (String(pin) !== String(correctPin)) {
    return NextResponse.json({ success: false, error: "wrong_pin" }, { status: 403 });
  }

  return NextResponse.json({ success: true });
}
