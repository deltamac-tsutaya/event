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
}

export interface Reward {
  id: string;
  name: string;
  conditions: string;
  validity_days: number;
  probability?: number;
  daily_limit?: number | null;
}

export interface DrawHistory {
  draw_date: string;
  created_at: string;
  rewards: Reward;
}
