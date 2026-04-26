-- Migration: Activity log table for audit/dispute resolution
-- Run once in Supabase SQL Editor before deploying.

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date     DATE        NOT NULL,
  log_time     TIMESTAMPTZ DEFAULT NOW(),
  event_type   TEXT        NOT NULL,
  user_id      UUID        REFERENCES public.users(id) ON DELETE SET NULL,
  line_user_id TEXT,
  display_name TEXT,
  detail       JSONB       DEFAULT '{}',
  actor        TEXT        DEFAULT 'system'
);

CREATE INDEX IF NOT EXISTS idx_logs_date  ON public.activity_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_logs_user  ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_event ON public.activity_logs(event_type);
