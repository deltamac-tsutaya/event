import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { broadcastMessage, multicastMessage, buildTextMessage, buildAnnouncementCard } from "@/lib/line-message";

export async function GET(request: NextRequest) {
  // Vercel Cron 會在 Authorization header 帶 Bearer CRON_SECRET
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date().toISOString();

  // 撈取所有到期且待發送的排程訊息
  const { data: due, error } = await supabaseAdmin
    .from("scheduled_messages")
    .select("*")
    .eq("status", "pending")
    .lte("scheduled_at", now);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!due || due.length === 0) return NextResponse.json({ processed: 0 });

  let processed = 0;
  for (const msg of due) {
    try {
      const lineMsg = msg.message_type === "text"
        ? buildTextMessage(msg.body)
        : buildAnnouncementCard(msg.title, msg.body, msg.sub_title, msg.url, msg.url_label);

      if (msg.target === "broadcast") {
        await broadcastMessage([lineMsg]);
      } else {
        const { data: users } = await supabaseAdmin
          .from("users")
          .select("line_user_id")
          .not("line_user_id", "is", null);
        const ids = (users ?? []).map((u: { line_user_id: string }) => u.line_user_id).filter(Boolean);
        if (ids.length > 0) await multicastMessage(ids, [lineMsg]);
      }

      await supabaseAdmin
        .from("scheduled_messages")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", msg.id);

      processed++;
    } catch (err) {
      await supabaseAdmin
        .from("scheduled_messages")
        .update({
          status: "failed",
          result_detail: { error: err instanceof Error ? err.message : String(err) },
        })
        .eq("id", msg.id);
    }
  }

  return NextResponse.json({ processed });
}
