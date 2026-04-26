import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function getTaipeiDateString(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

const PAGE_SIZE = 50;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || getTaipeiDateString();
  const event = searchParams.get("event") || "";
  const search = searchParams.get("search") || "";
  const page = Math.max(1, Number(searchParams.get("page") || "1"));

  let query = supabaseAdmin
    .from("activity_logs")
    .select("id, log_time, event_type, line_user_id, display_name, detail, actor")
    .eq("log_date", date)
    .order("log_time", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (event) query = query.eq("event_type", event);
  if (search) query = query.ilike("display_name", `%${search}%`);

  const { data, error } = await query;

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, logs: data ?? [], page, pageSize: PAGE_SIZE });
}
