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
  isFirstTime?: boolean; // 用户首次参加活动
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
  is_used: boolean;
  used_at: string | null;
  used_by: string | null;
}

export interface ActivityLog {
  id: string;
  log_date: string;
  log_time: string;
  event_type: string;
  user_id: string | null;
  line_user_id: string | null;
  display_name: string | null;
  detail: Record<string, unknown>;
  actor: string;
}

export interface InfinityDayStats {
  totalTickets: number;
  userTickets: number;
  probability: number; // 預估中獎機率
  status: "countdown" | "processing" | "revealed";
}
