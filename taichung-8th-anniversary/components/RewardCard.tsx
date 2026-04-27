import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Reward {
  id: string;
  name: string;
  conditions: string;
  validity_days: number;
}

interface RewardCardProps {
  reward: Reward;
  drawDate?: string; // ISO date string or "YYYY-MM-DD"
}

function getTierLabel(id: string): {
  label: string;
  className: string;
} {
  const num = id.replace(/\D/g, "");
  const n = parseInt(num, 10);
  if (n <= 2)  return { label: "頭獎", className: "bg-pink-100 text-pink-700 border-pink-200" };
  if (n <= 4)  return { label: "二獎", className: "bg-orange-100 text-orange-700 border-orange-200" };
  if (n <= 6)  return { label: "三獎", className: "bg-yellow-100 text-yellow-700 border-yellow-200" };
  return       { label: "普獎", className: "bg-green-100 text-green-700 border-green-200" };
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function RewardCard({ reward, drawDate = new Date().toISOString() }: RewardCardProps) {
  const tier = getTierLabel(reward.id);
  const expiryDate = addDays(drawDate, reward.validity_days);

  return (
    <Card className="overflow-hidden border-[#1A2B4A]/20 shadow-md">
      {/* Decorative top bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#1A2B4A] to-[#3B82C4]" />

      <CardHeader className="pb-1 pt-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-bold text-gray-900">
            {reward.name}
          </CardTitle>
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold ${tier.className}`}
          >
            {tier.label}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <p
          className="text-sm text-gray-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: reward.conditions }}
        />

        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs">
          <span className="text-gray-500">有效期限</span>
          <span className="font-semibold text-[#1A2B4A]">
            {expiryDate} 止
          </span>
        </div>

        <p className="text-[10px] text-gray-400 text-center">
          抽獎日期：{new Date(drawDate).toLocaleDateString("zh-TW")}
        </p>
      </CardContent>
    </Card>
  );
}
