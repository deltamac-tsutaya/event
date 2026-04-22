export interface LiffUser {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

export interface StampItem {
  stamp_id: string;
  collected_at: string;
}

export interface StampProgress {
  stamps: StampItem[];
  totalStamps: number;
  canDraw: boolean;
  drawnToday: boolean;
  ticketsCount: number; // 加碼獎券累積數量
}

export interface Reward {
  id: string;
  tier: "S" | "A" | "B";
  provider: "WIRED" | "TSUTAYA";
  name: string;
  conditions: string;
  validity_days: number;
  expiry_date?: string; // 統一至 2026/05/30
  daily_limit?: number | null;
  probability: number; // 百分比
}

export interface DrawHistory {
  id: string;
  draw_date: string;
  reward_id: string;
  rewards: Reward;
}

export interface InfinityDayStats {
  totalTickets: number;
  userTickets: number;
  probability: number; // 預估中獎機率
  status: "countdown" | "processing" | "revealed";
}
