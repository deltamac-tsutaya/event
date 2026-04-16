import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { lineUserId, displayName, stampId } = body;

  if (!lineUserId || !displayName || !stampId) {
    return NextResponse.json(
      { success: false, reason: "missing_fields" },
      { status: 400 }
    );
  }

  // Upsert user
  const { data: user, error: userError } = await supabaseAdmin
    .from("users")
    .upsert(
      { line_user_id: lineUserId, display_name: displayName },
      { onConflict: "line_user_id" }
    )
    .select("id")
    .single();

  if (userError || !user) {
    return NextResponse.json(
      { success: false, reason: "user_error", detail: userError?.message },
      { status: 500 }
    );
  }

  // Insert stamp (UNIQUE(user_id, stamp_id) 防重複)
  const { error: stampError } = await supabaseAdmin.from("stamps").insert({
    user_id: user.id,
    stamp_id: stampId,
  });

  if (stampError) {
    // Postgres unique violation code: 23505
    if (stampError.code === "23505") {
      return NextResponse.json({ success: false, reason: "already_stamped" });
    }
    return NextResponse.json(
      { success: false, reason: "stamp_error", detail: stampError.message },
      { status: 500 }
    );
  }

  // Count total stamps
  const { count, error: countError } = await supabaseAdmin
    .from("stamps")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) {
    return NextResponse.json(
      { success: false, reason: "count_error", detail: countError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, totalStamps: count ?? 0 });
}
