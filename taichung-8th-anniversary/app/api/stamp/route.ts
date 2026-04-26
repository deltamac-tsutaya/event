import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const ACHIEVEMENT_IDS = ["A", "B", "C"];

function getTaipeiDateString(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

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

  // ── UUID 查表驗證 ────────────────────────────────────────────────────────
  // 透過前端傳入的 UUID (此處變數仍命名為 stampId) 尋找對應且生效中的點位編號
  const { data: config, error: configError } = await supabaseAdmin
    .from("stamp_configs")
    .select("stamp_id")
    .eq("uuid", stampId)
    .eq("is_active", true)
    .single();

  if (configError || !config) {
    return NextResponse.json(
      { success: false, reason: "invalid_qr", detail: "此 QR code 已失效或無效" },
      { status: 403 }
    );
  }

  const realStampId = config.stamp_id;
  const today = getTaipeiDateString();

  // Insert stamp (UNIQUE(user_id, stamp_id, stamp_date) 防當日重複)
  const { error: stampError } = await supabaseAdmin.from("stamps").insert({
    user_id: user.id,
    stamp_id: realStampId,
    stamp_date: today,
  });

  if (stampError) {
    if (stampError.code === "23505") {
      return NextResponse.json({ success: false, reason: "already_stamped" });
    }
    return NextResponse.json(
      { success: false, reason: "stamp_error", detail: stampError.message },
      { status: 500 }
    );
  }

  // Count today's main stamps (exclude hidden achievements)
  const { data: todayStamps, error: countError } = await supabaseAdmin
    .from("stamps")
    .select("stamp_id")
    .eq("user_id", user.id)
    .eq("stamp_date", today);

  if (countError) {
    return NextResponse.json(
      { success: false, reason: "count_error", detail: countError.message },
      { status: 500 }
    );
  }

  const totalStamps = todayStamps?.filter(s => !ACHIEVEMENT_IDS.includes(s.stamp_id)).length ?? 0;

  return NextResponse.json({ success: true, stampId: realStampId, totalStamps });
}
