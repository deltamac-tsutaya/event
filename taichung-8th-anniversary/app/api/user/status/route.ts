import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const lineUserId = request.nextUrl.searchParams.get("lineUserId");
  if (!lineUserId) return NextResponse.json({ consented: false });

  const { data } = await getSupabaseAdmin()
    .from("users")
    .select("consented_at")
    .eq("line_user_id", lineUserId)
    .single();

  return NextResponse.json({ consented: !!data?.consented_at });
}
