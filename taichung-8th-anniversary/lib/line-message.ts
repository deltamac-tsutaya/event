const LINE_PUSH_API       = "https://api.line.me/v2/bot/message/push";
const LINE_BROADCAST_API  = "https://api.line.me/v2/bot/message/broadcast";
const LINE_MULTICAST_API  = "https://api.line.me/v2/bot/message/multicast";

function getToken(): string {
  const t = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!t) throw new Error("LINE_CHANNEL_ACCESS_TOKEN not set");
  return t;
}

async function linePost(url: string, body: object): Promise<void> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`LINE API error ${res.status}: ${await res.text()}`);
}

// ── Message builders ──────────────────────────────────────────────────────────

export function buildTextMessage(text: string): object {
  return { type: "text", text };
}

export function buildAnnouncementCard(
  title: string,
  body: string,
  subTitle?: string,
  url?: string,
  urlLabel?: string,
): object {
  const bodyContents: object[] = [
    { type: "text", text: title, size: "lg", weight: "bold", color: "#FFFFFF", wrap: true },
  ];
  if (subTitle) {
    bodyContents.push({ type: "text", text: subTitle, size: "xs", color: "#AABBCC", wrap: true, margin: "xs" });
  }
  bodyContents.push({ type: "separator", margin: "md", color: "#FFFFFF20" });
  bodyContents.push({ type: "text", text: body, size: "sm", color: "#E8EDF2", wrap: true, margin: "md" });

  const footerContents: object[] = url
    ? [{
        type: "button",
        style: "primary",
        color: "#C9A84C",
        action: { type: "uri", label: urlLabel ?? "了解更多", uri: url },
      }]
    : [];

  return {
    type: "flex",
    altText: title,
    contents: {
      type: "bubble",
      styles: { body: { backgroundColor: "#1A2B4A" } },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        paddingAll: "xl",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              { type: "text", text: "♾️", size: "xxs", color: "#C9A84C", flex: 0 },
              { type: "text", text: "Nexus Life 8 週年慶典", size: "xxs", color: "#C9A84C", margin: "sm", weight: "bold", tracking: "wider" },
            ],
          },
          ...bodyContents,
        ],
      },
      ...(footerContents.length > 0
        ? { footer: { type: "box", layout: "vertical", contents: footerContents } }
        : {}),
    },
  };
}

// ── Send functions ────────────────────────────────────────────────────────────

/** 推播給單一用戶 */
export async function pushMessage(lineUserId: string, messages: object[]): Promise<void> {
  await linePost(LINE_PUSH_API, { to: lineUserId, messages });
}

/** LINE Broadcast — 送給所有加好友的人，不需要個別 lineUserId */
export async function broadcastMessage(messages: object[]): Promise<void> {
  await linePost(LINE_BROADCAST_API, { messages });
}

/** Multicast — 送給最多 500 人，超過自動分批 */
export async function multicastMessage(lineUserIds: string[], messages: object[]): Promise<void> {
  const CHUNK = 500;
  for (let i = 0; i < lineUserIds.length; i += CHUNK) {
    const chunk = lineUserIds.slice(i, i + CHUNK);
    await linePost(LINE_MULTICAST_API, { to: chunk, messages });
  }
}
