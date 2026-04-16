import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("rewards")
    .select("id, name, conditions, validity_days")
    .order("id");

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch rewards", detail: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ rewards: data ?? [] });
}
