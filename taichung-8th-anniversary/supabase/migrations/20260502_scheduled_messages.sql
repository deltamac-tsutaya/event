-- scheduled_messages: 後台訊息排程表
CREATE TABLE IF NOT EXISTS public.scheduled_messages (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scheduled_at  TIMESTAMPTZ NOT NULL,
  sent_at       TIMESTAMPTZ,
  status        TEXT        NOT NULL DEFAULT 'pending', -- pending | sent | failed | cancelled
  target        TEXT        NOT NULL DEFAULT 'broadcast', -- broadcast | all_users
  message_type  TEXT        NOT NULL DEFAULT 'text',     -- text | announcement
  title         TEXT        NOT NULL,   -- admin 顯示標籤
  body          TEXT        NOT NULL,   -- 訊息主體內容
  sub_title     TEXT,                   -- announcement 副標題（選填）
  url           TEXT,                   -- announcement 按鈕連結（選填）
  url_label     TEXT,                   -- announcement 按鈕文字（選填）
  result_detail JSONB       DEFAULT '{}',
  created_by    TEXT        DEFAULT 'admin'
);

CREATE INDEX IF NOT EXISTS idx_scheduled_messages_status
  ON public.scheduled_messages (status, scheduled_at);
