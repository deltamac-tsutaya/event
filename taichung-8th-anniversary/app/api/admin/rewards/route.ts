import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("rewards")
    .select("id, tier, provider, name, probability, daily_limit, validity_days")
    .order("tier")
    .order("id");

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, rewards: data });
}

export async function PATCH(request: NextRequest) {
  const { id, probability, daily_limit } = await request.json();
  if (!id) return NextResponse.json({ success: false, error: "id required" }, { status: 400 });
  if (typeof probability !== "number" || probability < 0) {
    return NextResponse.json({ success: false, error: "機率須為非負整數" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("rewards")
    .update({ probability, daily_limit: daily_limit ?? null })
    .eq("id", id);

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
