import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const [usersRes, stateRes, winnersRes] = await Promise.all([
    supabaseAdmin
      .from("users")
      .select("id, display_name, tickets_count")
      .gt("tickets_count", 0)
      .order("tickets_count", { ascending: false }),
    supabaseAdmin
      .from("bonus_lottery_state")
      .select("*")
      .eq("id", 1)
      .maybeSingle(),
    supabaseAdmin
      .from("bonus_lottery_results")
      .select("user_id, prize_name, drawn_at, users(display_name, line_user_id)"),
  ]);

  const users = usersRes.data ?? [];
  const totalTickets = users.reduce((s, u) => s + (u.tickets_count ?? 0), 0);

  return NextResponse.json({
    success: true,
    totalTickets,
    totalParticipants: users.length,
    executed: !!stateRes.data?.executed_at,
    executedAt: stateRes.data?.executed_at ?? null,
    winnerCount: stateRes.data?.winner_count ?? 0,
    winners: winnersRes.data ?? [],
    topHolders: users.slice(0, 10),
  });
}
