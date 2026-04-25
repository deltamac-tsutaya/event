import type { Reward } from "@/lib/types";

const LINE_API = "https://api.line.me/v2/bot/message/push";

function buildCouponMessage(reward: Reward): object {
  const tierLabel: Record<string, string> = { S: "★★★ S 級", A: "★★ A 級", B: "★ B 級" };
  const providerLabel: Record<string, string> = { WIRED: "WIRED TOKYO", TSUTAYA: "TSUTAYA BOOKSTORE" };

  return {
    type: "flex",
    altText: `🎉 恭喜！您抽到「${reward.name}」`,
    contents: {
      type: "bubble",
      styles: { header: { backgroundColor: "#1A2B4A" }, body: { backgroundColor: "#FAFAFA" } },
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          { type: "text", text: "♾️ Nexus Life 8 週年慶典", color: "#FFFFFF", size: "xs", weight: "bold" },
          { type: "text", text: "您的專屬優惠券", color: "#AABBCC", size: "xxs" },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          { type: "text", text: tierLabel[reward.tier] ?? reward.tier, color: "#C8A86B", size: "sm", weight: "bold" },
          { type: "text", text: reward.name, size: "lg", weight: "bold", wrap: true, color: "#1A2B4A" },
          { type: "separator" },
          {
            type: "box",
            layout: "vertical",
            spacing: "xs",
            contents: [
              { type: "text", text: `品牌：${providerLabel[reward.provider] ?? reward.provider}`, size: "xs", color: "#666666" },
              { type: "text", text: `條件：${reward.conditions}`, size: "xs", color: "#666666", wrap: true },
            ],
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#1A2B4A",
            action: { type: "uri", label: "查看我的獎券", uri: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://taichung-8th-anniversary.vercel.app"}/coupons` },
          },
        ],
      },
    },
  };
}

export async function sendCouponMessage(lineUserId: string, reward: Reward): Promise<void> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) throw new Error("LINE_CHANNEL_ACCESS_TOKEN not set");

  const res = await fetch(LINE_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ to: lineUserId, messages: [buildCouponMessage(reward)] }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LINE API error ${res.status}: ${body}`);
  }
}
