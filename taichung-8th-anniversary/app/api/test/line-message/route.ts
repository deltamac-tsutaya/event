import { NextRequest, NextResponse } from "next/server";
import { sendCouponMessage } from "@/lib/line-push";
import type { Reward } from "@/lib/types";

const MOCK_REWARD: Reward = {
  id: "B4",
  tier: "B",
  provider: "WIRED",
  name: "外帶飲品 買一送一",
  conditions: "限外帶使用，有效至 2026/5/30",
  validity_days: 30,
  probability: 10,
};

export async function POST(request: NextRequest) {
  const { lineUserId } = await request.json();
  if (!lineUserId) {
    return NextResponse.json({ success: false, error: "lineUserId is required" }, { status: 400 });
  }

  try {
    await sendCouponMessage(lineUserId, MOCK_REWARD);
    return NextResponse.json({ success: true, message: "測試優惠券已送出", sentTo: lineUserId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
