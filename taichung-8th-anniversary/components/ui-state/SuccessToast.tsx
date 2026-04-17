"use client";

import { toast } from "sonner";

export function showStampSuccess(stampId: string) {
  const stampNames: Record<string, string> = {
    "01": "入口主題陳列區",
    "02": "生活雜貨區",
    "03": "文具選品牆",
    "04": "兒童繪本區",
    "05": "後方深處書櫃",
    "06": "WIRED TOKYO 吧檯區",
    "07": "WIRED TOKYO 座位區",
    "08": "結帳櫃檯旁",
  };
  const name = stampNames[stampId] ?? `印章 ${stampId}`;
  toast.success("蓋印成功", {
    description: `已收集：${name}`,
    duration: 3000,
  });
}

export function showDrawSuccess(rewardName: string) {
  toast.success("抽獎成功", {
    description: `您獲得：${rewardName}`,
    duration: 5000,
  });
}
