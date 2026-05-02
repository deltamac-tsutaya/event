import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { broadcastMessage, multicastMessage, buildTextMessage, buildAnnouncementCard } from "@/lib/line-message";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("scheduled_messages")
    .select("*")
    .order("scheduled_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, messages: data ?? [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, body: msgBody, subTitle, url, urlLabel, target, messageType, scheduledAt } = body;

  if (!title || !msgBody || !target || !messageType || !scheduledAt) {
    return NextResponse.json({ success: false, error: "缺少必填欄位" }, { status: 400 });
  }

  // 判斷是立即發送還是排程
  const sendAt = new Date(scheduledAt);
  const now = new Date();
  const immediate = sendAt <= now;

  if (immediate) {
    // 立即發送
    const lineMsg = messageType === "text"
      ? buildTextMessage(msgBody)
      : buildAnnouncementCard(title, msgBody, subTitle, url, urlLabel);

    try {
      if (target === "broadcast") {
        await broadcastMessage([lineMsg]);
      } else {
        const { data: users } = await supabaseAdmin
          .from("users")
          .select("line_user_id")
          .not("line_user_id", "is", null);
        const ids = (users ?? []).map(u => u.line_user_id).filter(Boolean);
        if (ids.length > 0) await multicastMessage(ids, [lineMsg]);
      }

      // 記錄已發送
      await supabaseAdmin.from("scheduled_messages").insert({
        title, body: msgBody, sub_title: subTitle, url, url_label: urlLabel,
        target, message_type: messageType,
        scheduled_at: sendAt.toISOString(),
        sent_at: new Date().toISOString(),
        status: "sent",
      });

      return NextResponse.json({ success: true, sent: true });
    } catch (err) {
      return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "發送失敗" }, { status: 500 });
    }
  }

  // 儲存排程
  const { data, error } = await supabaseAdmin.from("scheduled_messages").insert({
    title, body: msgBody, sub_title: subTitle, url, url_label: urlLabel,
    target, message_type: messageType,
    scheduled_at: sendAt.toISOString(),
    status: "pending",
  }).select().single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, sent: false, message: data });
}
