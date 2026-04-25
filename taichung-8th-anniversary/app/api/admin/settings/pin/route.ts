import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data } = await supabaseAdmin
    .from("app_settings")
    .select("value")
    .eq("id", "redeem_pin")
    .single();

  const pin = data?.value ?? process.env.REDEEM_PIN ?? "";
  return NextResponse.json({ pin });
}

export async function POST(request: NextRequest) {
  const { pin } = await request.json();
  if (!pin || String(pin).trim().length < 4) {
    return NextResponse.json({ success: false, error: "PIN 至少需要 4 位數" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("app_settings")
    .upsert({ id: "redeem_pin", value: String(pin).trim(), updated_at: new Date().toISOString() });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
