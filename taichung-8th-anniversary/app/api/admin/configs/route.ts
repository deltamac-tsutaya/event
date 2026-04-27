import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";

    // 1. 取得點位 (依參數決定是否過濾 active)
    let query = supabaseAdmin.from("stamp_configs").select("*");
    if (!showAll) {
      query = query.eq("is_active", true);
    }
    
    const { data: configs, error: fetchError } = await query;
    if (fetchError) {
      console.error("Supabase Fetch Error:", fetchError);
      throw fetchError;
    }

    return NextResponse.json({
      success: true,
      count: configs?.length || 0,
      configs: configs || [],
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error",
        debug: error
      },
      { status: 500 }
    );
  }
}
