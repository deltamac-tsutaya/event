import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(request: NextRequest) {
  const { userId, delta } = await request.json();
  if (!userId || delta == null) {
    return NextResponse.json({ success: false, error: "userId and delta required" }, { status: 400 });
  }

  const { data: user, error: fetchErr } = await supabaseAdmin
    .from("users")
    .select("tickets_count")
    .eq("id", userId)
    .single();

  if (fetchErr || !user) {
    return NextResponse.json({ success: false, error: "user not found" }, { status: 404 });
  }

  const newCount = Math.max(0, (user.tickets_count ?? 0) + delta);

  const { error: updateErr } = await supabaseAdmin
    .from("users")
    .update({ tickets_count: newCount })
    .eq("id", userId);

  if (updateErr) {
    return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, tickets_count: newCount });
}
