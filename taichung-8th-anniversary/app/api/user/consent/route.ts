import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const { lineUserId, displayName } = await request.json();

  if (!lineUserId || !displayName) {
    return NextResponse.json({ success: false, reason: "missing_fields" }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin()
    .from("users")
    .upsert(
      {
        line_user_id: lineUserId,
        display_name: displayName,
        consented_at: new Date().toISOString(),
      },
      { onConflict: "line_user_id" }
    );

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
