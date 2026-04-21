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
    const today = getTaipeiDateString();

    // 1. 取得目前所有 active 的點位
    let { data: configs, error: fetchError } = await supabaseAdmin
      .from("stamp_configs")
      .select("*")
      .eq("is_active", true);

    if (fetchError) throw fetchError;

    // 2. 檢查是否需要重新抽選 (這裡簡易判斷：如果 configs 為空，或某些欄位遺失)
    // 實務上建議在 DB 建立一張 `daily_rotation_logs` 表紀錄今日是否已執行
    // 這裡我們檢查輪替點位是否存在
    const rotatingIds = ["02", "05", "06"];
    const activeRotating = configs?.filter(c => rotatingIds.includes(c.stamp_id)) || [];

    if (activeRotating.length < 3) {
      console.log("Triggering daily rotation...");
      
      // 先將所有輪替點位設為 inactive
      await supabaseAdmin
        .from("stamp_configs")
        .update({ is_active: false })
        .in("stamp_id", rotatingIds);

      // 針對 02, 05, 06 各自隨機選一個變體設為 active
      for (const id of rotatingIds) {
        // 取得該點位的所有變體 (1, 2, 3)
        const { data: variants } = await supabaseAdmin
          .from("stamp_configs")
          .select("uuid")
          .eq("stamp_id", id);
        
        if (variants && variants.length > 0) {
          const randomIndex = Math.floor(Math.random() * variants.length);
          const selectedUuid = variants[randomIndex].uuid;
          
          await supabaseAdmin
            .from("stamp_configs")
            .update({ is_active: true })
            .eq("uuid", selectedUuid);
        }
      }

      // 重新取得最新狀態
      const { data: updatedConfigs } = await supabaseAdmin
        .from("stamp_configs")
        .select("*")
        .eq("is_active", true);
      
      configs = updatedConfigs;
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
