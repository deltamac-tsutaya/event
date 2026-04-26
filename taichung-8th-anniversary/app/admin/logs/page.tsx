"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Search, ChevronLeft as Prev, ChevronRight as Next } from "lucide-react";

interface LogEntry {
  id: string;
  log_time: string;
  event_type: string;
  line_user_id: string | null;
  display_name: string | null;
  detail: Record<string, unknown>;
  actor: string;
}

const EVENT_FILTERS = [
  { key: "", label: "全部" },
  { key: "stamp_collected", label: "集章" },
  { key: "draw_completed", label: "抽獎" },
  { key: "coupon_redeemed", label: "核銷" },
  { key: "admin_stamp_add,admin_stamp_delete,admin_reset_daily,admin_reset_full", label: "後台操作" },
];

const EVENT_META: Record<string, { label: string; color: string }> = {
  stamp_collected:  { label: "集章",     color: "bg-blue-100 text-blue-700" },
  draw_completed:   { label: "抽獎",     color: "bg-amber-100 text-amber-700" },
  coupon_redeemed:  { label: "核銷",     color: "bg-emerald-100 text-emerald-700" },
  admin_stamp_add:  { label: "補印章",   color: "bg-orange-100 text-orange-700" },
  admin_stamp_delete:{ label: "刪印章",  color: "bg-orange-100 text-orange-700" },
  admin_reset_daily:{ label: "重置今日", color: "bg-orange-100 text-orange-700" },
  admin_reset_full: { label: "全部重置", color: "bg-red-100 text-red-700" },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("zh-TW", {
    timeZone: "Asia/Taipei", hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function DetailSummary({ type, detail }: { type: string; detail: Record<string, unknown> }) {
  if (type === "stamp_collected")
    return <span>點位 <b>{String(detail.stamp_id ?? "")}</b>，今日第 {String(detail.total_today ?? "")} 枚</span>;
  if (type === "draw_completed")
    return <span><b>{String(detail.reward_name ?? "")}</b>（{String(detail.tier ?? "")} 級）</span>;
  if (type === "coupon_redeemed")
    return <span>獎項 {String(detail.reward_id ?? "")}，核銷人：{String(detail.used_by ?? "")}</span>;
  if (type === "admin_stamp_add")
    return <span>新增點位 <b>{String(detail.stamp_id ?? "")}</b></span>;
  if (type === "admin_stamp_delete")
    return <span>移除點位 <b>{String(detail.stamp_id ?? "")}</b></span>;
  if (type === "admin_reset_daily")
    return <span>清除今日 {String(detail.deleted_count ?? 0)} 枚印章</span>;
  if (type === "admin_reset_full")
    return <span>刪除 {String(detail.stamps_deleted ?? 0)} 枚印章、{String(detail.draws_deleted ?? 0)} 筆抽獎</span>;
  return <span className="text-gray-400 text-xs">{JSON.stringify(detail)}</span>;
}

function todayString() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

export default function LogsPage() {
  const [date, setDate] = useState(todayString());
  const [eventFilter, setEventFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ date, page: String(page) });
      if (eventFilter) params.set("event", eventFilter.split(",")[0]); // single filter; multi handled client-side
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/logs?${params}`);
      const data = await res.json();
      if (data.success) setLogs(data.logs);
    } finally {
      setLoading(false);
    }
  }, [date, eventFilter, search, page]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // Client-side multi-event filter
  const shown = eventFilter
    ? logs.filter(l => eventFilter.split(",").includes(l.event_type))
    : logs;

  return (
    <div className="min-h-svh bg-[#F8FAFC]">
      <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="rounded-full w-9 h-9"><ChevronLeft size={18} /></Button>
          </Link>
          <p className="font-bold text-[#1A2B4A] text-sm flex-1">活動日誌</p>
          <input
            type="date"
            value={date}
            onChange={e => { setDate(e.target.value); setPage(1); }}
            className="text-xs border rounded-lg px-2 py-1.5 text-gray-700 bg-white"
          />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-5 space-y-4">

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 flex-wrap">
            {EVENT_FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => { setEventFilter(f.key); setPage(1); }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  eventFilter === f.key
                    ? "bg-[#1A2B4A] text-white"
                    : "bg-white border text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative ml-auto">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜尋名稱…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-7 h-8 text-xs w-44 rounded-full bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-sm text-gray-400">載入中…</div>
          ) : shown.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">此日期無紀錄</div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-500">
                  <th className="text-left px-4 py-2.5 font-medium w-20">時間</th>
                  <th className="text-left px-3 py-2.5 font-medium w-24">事件</th>
                  <th className="text-left px-3 py-2.5 font-medium">使用者</th>
                  <th className="text-left px-3 py-2.5 font-medium">內容</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {shown.map(log => {
                  const meta = EVENT_META[log.event_type] ?? { label: log.event_type, color: "bg-gray-100 text-gray-600" };
                  return (
                    <tr key={log.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-2.5 font-mono text-gray-400 whitespace-nowrap">{formatTime(log.log_time)}</td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${meta.color}`}>{meta.label}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <p className="font-medium text-gray-800 truncate max-w-[120px]">{log.display_name ?? "—"}</p>
                        {log.line_user_id && (
                          <p className="text-[10px] font-mono text-gray-300 truncate max-w-[120px]">{log.line_user_id}</p>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-gray-600">
                        <DetailSummary type={log.event_type} detail={log.detail} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-full h-8 w-8 p-0">
            <Prev size={14} />
          </Button>
          <span className="text-xs text-gray-500">第 {page} 頁</span>
          <Button variant="outline" size="sm" disabled={shown.length < 50} onClick={() => setPage(p => p + 1)} className="rounded-full h-8 w-8 p-0">
            <Next size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
