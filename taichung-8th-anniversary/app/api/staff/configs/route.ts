import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function getTaipeiDateString(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";
    const today = getTaipeiDateString();

    // 1. 取得點位 (依參數決定是否過濾 active)
    let query = supabaseAdmin.from("stamp_configs").select("*");
    if (!showAll) {
      query = query.eq("is_active", true);
    }
    
    let { data: configs, error: fetchError } = await query;
    if (fetchError) throw fetchError;

    // 2. 如果非全選模式且資料不足，執行每日輪替邏輯
    if (!showAll) {
      const rotatingIds = ["02", "05", "06"];
      const activeRotating = configs?.filter(c => rotatingIds.includes(c.stamp_id)) || [];

      if (activeRotating.length < 3) {
        // 先重設
        await supabaseAdmin.from("stamp_configs").update({ is_active: false }).in("stamp_id", rotatingIds);

        for (const id of rotatingIds) {
          const { data: variants } = await supabaseAdmin.from("stamp_configs").select("uuid").eq("stamp_id", id);
          if (variants && variants.length > 0) {
            const selectedUuid = variants[Math.floor(Math.random() * variants.length)].uuid;
            await supabaseAdmin.from("stamp_configs").update({ is_active: true }).eq("uuid", selectedUuid);
          }
        }

        // 重新取得
        const { data: updatedConfigs } = await supabaseAdmin.from("stamp_configs").select("*").eq("is_active", true);
        configs = updatedConfigs;
      }
    }

    return NextResponse.json({
      success: true,
      date: today,
      configs: configs || [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
