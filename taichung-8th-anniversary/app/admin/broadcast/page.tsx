"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft, Send, Clock, Radio, Users,
  RefreshCcw, X, CheckCircle, AlertCircle, Hourglass,
} from "lucide-react";

interface ScheduledMessage {
  id: string;
  created_at: string;
  scheduled_at: string;
  sent_at: string | null;
  status: "pending" | "sent" | "failed" | "cancelled";
  target: "broadcast" | "all_users";
  message_type: "text" | "announcement";
  title: string;
  body: string;
  sub_title: string | null;
  url: string | null;
  url_label: string | null;
}

const STATUS_STYLE: Record<string, { cls: string; label: string; icon: React.ReactNode }> = {
  pending:   { cls: "bg-amber-50 text-amber-700 border-amber-200",  label: "待發送",   icon: <Hourglass size={10} /> },
  sent:      { cls: "bg-green-50 text-green-700 border-green-200",  label: "已發送",   icon: <CheckCircle size={10} /> },
  failed:    { cls: "bg-red-50 text-red-600 border-red-200",        label: "失敗",     icon: <AlertCircle size={10} /> },
  cancelled: { cls: "bg-gray-100 text-gray-400 border-gray-200",    label: "已取消",   icon: <X size={10} /> },
};

function toLocalDatetimeValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function BroadcastPage() {
  const [messages, setMessages]       = useState<ScheduledMessage[]>([]);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [flash, setFlash]             = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [cancelling, setCancelling]   = useState<string | null>(null);

  // Form state
  const [msgType, setMsgType]         = useState<"text" | "announcement">("announcement");
  const [target, setTarget]           = useState<"broadcast" | "all_users">("broadcast");
  const [title, setTitle]             = useState("");
  const [body, setBody]               = useState("");
  const [subTitle, setSubTitle]       = useState("");
  const [url, setUrl]                 = useState("");
  const [urlLabel, setUrlLabel]       = useState("");
  const [sendMode, setSendMode]       = useState<"now" | "schedule">("now");
  const [scheduledAt, setScheduledAt] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 30);
    return toLocalDatetimeValue(d);
  });

  const showFlash = (type: "ok" | "err", text: string) => {
    setFlash({ type, text });
    setTimeout(() => setFlash(null), 4000);
  };

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/messages");
      const data = await res.json();
      setMessages(data.messages ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      showFlash("err", "標題和內容為必填");
      return;
    }
    setSubmitting(true);
    try {
      const resolvedAt = sendMode === "now"
        ? new Date().toISOString()
        : new Date(scheduledAt).toISOString();

      const res  = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          subTitle: subTitle.trim() || undefined,
          url: url.trim() || undefined,
          urlLabel: urlLabel.trim() || undefined,
          target,
          messageType: msgType,
          scheduledAt: resolvedAt,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showFlash("ok", data.sent ? "訊息已立即發送！" : "排程已建立！");
        setTitle(""); setBody(""); setSubTitle(""); setUrl(""); setUrlLabel("");
        loadMessages();
      } else {
        showFlash("err", data.error ?? "建立失敗");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    setCancelling(id);
    try {
      const res  = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status: "cancelled" } : m));
      } else {
        showFlash("err", "取消失敗");
      }
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link href="/admin" className="text-gray-400 hover:text-gray-700 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="font-bold text-sm text-gray-800">訊息傳送中心</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Flash */}
        {flash && (
          <div className={`rounded-2xl border px-4 py-3 text-xs font-bold flex items-center gap-2 ${
            flash.type === "ok" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-600"
          }`}>
            {flash.type === "ok" ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
            {flash.text}
          </div>
        )}

        {/* Compose form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <p className="font-bold text-sm text-gray-800">建立訊息</p>

          {/* Message type */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">訊息格式</p>
            <div className="flex gap-2">
              {(["announcement", "text"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setMsgType(t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    msgType === t
                      ? "bg-[#1A2B4A] text-white border-[#1A2B4A]"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {t === "announcement" ? "公告卡片" : "純文字"}
                </button>
              ))}
            </div>
          </div>

          {/* Target */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">發送對象</p>
            <div className="flex gap-2">
              <button
                onClick={() => setTarget("broadcast")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  target === "broadcast"
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
              >
                <Radio size={11} /> LINE 廣播全體
              </button>
              <button
                onClick={() => setTarget("all_users")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  target === "all_users"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
              >
                <Users size={11} /> 資料庫全員
              </button>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              {target === "broadcast"
                ? "透過 LINE Broadcast API 傳送給所有加入官方帳號的用戶"
                : "傳送給資料庫中所有有 LINE ID 的參與者"}
            </p>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {msgType === "announcement" ? "卡片標題" : "管理標籤"}
            </p>
            <Input
              placeholder={msgType === "announcement" ? "例：Infinity Day 倒數提醒" : "僅供後台識別"}
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          {/* Sub title (announcement only) */}
          {msgType === "announcement" && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">副標題（選填）</p>
              <Input
                placeholder="例：5 / 24 · 20:00 開獎"
                value={subTitle}
                onChange={e => setSubTitle(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          )}

          {/* Body */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">訊息內容</p>
            <textarea
              placeholder={msgType === "announcement"
                ? "例：今天是最後一天！別忘記集滿 8 枚印章完成抽獎，加碼獎券數愈多，Infinity Day 中獎機率愈高。"
                : "輸入訊息文字…"}
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#1A2B4A]/30"
            />
          </div>

          {/* URL (announcement only) */}
          {msgType === "announcement" && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">按鈕連結（選填）</p>
                <Input placeholder="https://…" value={url} onChange={e => setUrl(e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">按鈕文字</p>
                <Input placeholder="了解更多" value={urlLabel} onChange={e => setUrlLabel(e.target.value)} className="h-9 text-sm" />
              </div>
            </div>
          )}

          {/* Send mode */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">發送時間</p>
            <div className="flex gap-2">
              {(["now", "schedule"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setSendMode(m)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    sendMode === m
                      ? "bg-[#1A2B4A] text-white border-[#1A2B4A]"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {m === "now" ? <><Send size={11} /> 立即發送</> : <><Clock size={11} /> 預約發送</>}
                </button>
              ))}
            </div>
            {sendMode === "schedule" && (
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1A2B4A]/30"
              />
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting || !title.trim() || !body.trim()}
            className="w-full h-10 text-xs font-bold gap-1.5 bg-[#1A2B4A] hover:bg-[#1A2B4A]/90 rounded-xl"
          >
            {submitting
              ? <><RefreshCcw size={13} className="animate-spin" /> 處理中…</>
              : sendMode === "now"
                ? <><Send size={13} /> 立即發送</>
                : <><Clock size={13} /> 建立排程</>
            }
          </Button>
        </div>

        {/* Message list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-bold text-sm text-gray-700">訊息紀錄</p>
            <button onClick={loadMessages} className="text-gray-400 hover:text-gray-600 transition-colors">
              <RefreshCcw size={14} />
            </button>
          </div>

          {loading ? (
            <div className="py-10 flex items-center justify-center gap-2 text-gray-400 text-xs">
              <RefreshCcw size={14} className="animate-spin" /> 載入中…
            </div>
          ) : messages.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400 italic">尚無訊息紀錄</p>
          ) : (
            <div className="space-y-2">
              {messages.map(m => {
                const st = STATUS_STYLE[m.status] ?? STATUS_STYLE.cancelled;
                return (
                  <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <p className="text-sm font-bold text-gray-800 truncate">{m.title}</p>
                        <p className="text-[10px] text-gray-400 truncate">{m.body}</p>
                      </div>
                      <span className={`flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${st.cls}`}>
                        {st.icon} {st.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400">
                      <span className="flex items-center gap-1">
                        {m.target === "broadcast" ? <><Radio size={9} /> 廣播</> : <><Users size={9} /> 資料庫全員</>}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={9} />
                        {new Date(m.scheduled_at).toLocaleString("zh-TW", { timeZone: "Asia/Taipei", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {m.status === "pending" && (
                        <>
                          <span>·</span>
                          <button
                            onClick={() => handleCancel(m.id)}
                            disabled={cancelling === m.id}
                            className="flex items-center gap-1 text-red-400 hover:text-red-600 font-bold transition-colors"
                          >
                            {cancelling === m.id ? <RefreshCcw size={9} className="animate-spin" /> : <X size={9} />}
                            取消
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
