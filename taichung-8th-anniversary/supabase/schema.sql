-- Database Schema for Taichung 8th Anniversary Event

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    line_user_id TEXT UNIQUE NOT NULL,
    display_name TEXT,
    tickets_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Stamp Configs Table (Master data for QR codes)
CREATE TABLE IF NOT EXISTS public.stamp_configs (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stamp_id TEXT NOT NULL, -- 01, 02, ..., 08, A, B, C
    variant_id INTEGER DEFAULT 1, -- For rotating stamps 02, 05, 06
    area_name TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Stamps Table (Collection records — resets daily)
CREATE TABLE IF NOT EXISTS public.stamps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    stamp_id TEXT NOT NULL,
    stamp_date DATE NOT NULL DEFAULT CURRENT_DATE, -- Taipei date; enables daily reset
    collected_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, stamp_id, stamp_date) -- One stamp per point per day
);

-- 4. Draws Table (Reward records)
CREATE TABLE IF NOT EXISTS public.draws (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reward_id TEXT NOT NULL REFERENCES public.rewards(id),
    draw_date DATE NOT NULL, -- YYYY-MM-DD
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMPTZ DEFAULT NULL,
    used_by TEXT DEFAULT NULL        -- staff name / identifier
);

-- 5. Rewards Table (Dynamic reward management)
CREATE TABLE IF NOT EXISTS public.rewards (
    id TEXT PRIMARY KEY,
    tier TEXT, -- S, A, B
    provider TEXT, -- WIRED, TSUTAYA
    name TEXT NOT NULL,
    conditions TEXT,
    probability INTEGER,
    daily_limit INTEGER,
    validity_days INTEGER DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_stamps_user_id ON public.stamps(user_id);
CREATE INDEX IF NOT EXISTS idx_stamps_date ON public.stamps(stamp_date);
CREATE INDEX IF NOT EXISTS idx_draws_user_id ON public.draws(user_id);
CREATE INDEX IF NOT EXISTS idx_draws_date ON public.draws(draw_date);
CREATE INDEX IF NOT EXISTS idx_stamp_configs_id_active ON public.stamp_configs(stamp_id, is_active);

-- 6. Activity Logs Table (audit trail for dispute resolution)
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

-- 7. App Settings Table (key-value store for admin configuration)
CREATE TABLE IF NOT EXISTS public.app_settings (
  id         TEXT        PRIMARY KEY,
  value      TEXT        NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default PINs
INSERT INTO public.app_settings (id, value) VALUES ('redeem_pin', '0000') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.app_settings (id, value) VALUES ('super_admin_pin', '0000') ON CONFLICT (id) DO NOTHING;

-- Enable RLS (Row Level Security)
-- Note: Currently the API uses service_role, but it's good practice to have RLS.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stamp_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Simple policies (Can be refined based on requirements)
CREATE POLICY "Public read for configs" ON public.stamp_configs FOR SELECT USING (true);
