import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const PRIZE_COUNT = 8;
const PRIZE_NAME  = "WIRED TOKYO 雙人和牛牛排套餐";
// 2026-05-24 20:00 Asia/Taipei = 12:00 UTC
const DRAW_TIME = new Date("2026-05-24T12:00:00Z");

export async function POST(request: NextRequest) {
  const { force } = await request.json().catch(() => ({}));

  // Prevent re-execution
  const { data: state } = await supabaseAdmin
    .from("bonus_lottery_state")
    .select("executed_at")
    .eq("id", 1)
    .maybeSingle();

  if (state?.executed_at) {
    return NextResponse.json({ success: false, error: "已執行過開獎，不可重複執行" }, { status: 409 });
  }

  if (!force && new Date() < DRAW_TIME) {
    return NextResponse.json({ success: false, error: "開獎時間未到（2026/5/24 20:00 Taipei）" }, { status: 400 });
  }

  // Fetch all eligible users (tickets_count > 0)
  const { data: users, error: usersError } = await supabaseAdmin
    .from("users")
    .select("id, line_user_id, display_name, tickets_count")
    .gt("tickets_count", 0);

  if (usersError || !users || users.length === 0) {
    return NextResponse.json({ success: false, error: "無符合資格的參賽者" }, { status: 400 });
  }

  // Build weighted ticket pool
  const pool: string[] = [];
  for (const u of users) {
    for (let i = 0; i < (u.tickets_count ?? 1); i++) pool.push(u.id);
  }

  const totalTickets = pool.length;

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Pick de-duplicated winners
  const winnerSet = new Set<string>();
  for (const uid of pool) {
    winnerSet.add(uid);
    if (winnerSet.size >= PRIZE_COUNT) break;
  }
  const winnerIds = [...winnerSet];

  // Insert winners
  const { error: insertError } = await supabaseAdmin
    .from("bonus_lottery_results")
    .insert(winnerIds.map(uid => ({ user_id: uid, prize_name: PRIZE_NAME })));

  if (insertError) {
    return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
  }

  // Record state
  await supabaseAdmin.from("bonus_lottery_state").upsert({
    id: 1,
    executed_at: new Date().toISOString(),
    total_tickets: totalTickets,
    total_participants: users.length,
    winner_count: winnerIds.length,
  });

  // Send LINE notifications (fire-and-forget)
  const winners = users.filter(u => winnerIds.includes(u.id));
  import("@/lib/line-push")
    .then(({ sendWinnerNotification }) =>
      Promise.all(winners.map(w => sendWinnerNotification(w.line_user_id)))
    )
    .catch(err => console.error("[LINE push] Winner notification failed:", err));

  return NextResponse.json({
    success: true,
    totalTickets,
    totalParticipants: users.length,
    winnerCount: winnerIds.length,
    winners: winners.map(w => ({ id: w.id, name: w.display_name, tickets: w.tickets_count })),
  });
}
