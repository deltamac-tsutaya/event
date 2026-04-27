import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { writeLog } from "@/lib/log";

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

  // Find the most recent draw to determine current session boundary
  const { data: latestDraw } = await supabaseAdmin
    .from("draws")
    .select("draw_date")
    .eq("user_id", user.id)
    .order("draw_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const lastDrawDate = latestDraw?.draw_date ?? null;
  const drawnToday = lastDrawDate === today;

  // Check for duplicate within current session
  // - Never drew → check all stamps ever collected
  // - Drew before today → check stamps after that draw date
  // - Drew today → check today's stamps only (UNIQUE constraint also protects same-day)
  let dupQuery = supabaseAdmin
    .from("stamps")
    .select("id")
    .eq("user_id", user.id)
    .eq("stamp_id", realStampId);

  if (lastDrawDate && lastDrawDate < today) {
    dupQuery = dupQuery.gt("stamp_date", lastDrawDate);
  } else if (drawnToday) {
    dupQuery = dupQuery.eq("stamp_date", today);
  }

  const { data: existingStamp } = await dupQuery.maybeSingle();

  if (existingStamp) {
    return NextResponse.json({ success: false, reason: "already_stamped" });
  }

  // Insert stamp
  const { error: stampError } = await supabaseAdmin.from("stamps").insert({
    user_id: user.id,
    stamp_id: realStampId,
    stamp_date: today,
  });

  if (stampError) {
    // Fallback: catch DB-level unique constraint violation
    if (stampError.code === "23505") {
      return NextResponse.json({ success: false, reason: "already_stamped" });
    }
    return NextResponse.json(
      { success: false, reason: "stamp_error", detail: stampError.message },
      { status: 500 }
    );
  }

  // Count current session's main stamps (for response)
  let countQuery = supabaseAdmin
    .from("stamps")
    .select("stamp_id")
    .eq("user_id", user.id);

  if (lastDrawDate && lastDrawDate < today) {
    countQuery = countQuery.gt("stamp_date", lastDrawDate);
  } else if (drawnToday) {
    countQuery = countQuery.eq("stamp_date", today);
  }

  const { data: sessionStamps, error: countError } = await countQuery;

  if (countError) {
    return NextResponse.json(
      { success: false, reason: "count_error", detail: countError.message },
      { status: 500 }
    );
  }

  const totalStamps = sessionStamps?.filter(s => !ACHIEVEMENT_IDS.includes(s.stamp_id)).length ?? 0;

  writeLog({
    event_type: "stamp_collected",
    user_id: user.id,
    line_user_id: lineUserId,
    display_name: displayName,
    detail: { stamp_id: realStampId, stamp_date: today, total_session: totalStamps },
  });

  return NextResponse.json({ success: true, stampId: realStampId, totalStamps });
}
