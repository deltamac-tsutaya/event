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

-- 3. Stamps Table (Collection records)
CREATE TABLE IF NOT EXISTS public.stamps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    stamp_id TEXT NOT NULL,
    collected_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, stamp_id) -- Prevent duplicate stamps for the same point
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
CREATE INDEX IF NOT EXISTS idx_draws_user_id ON public.draws(user_id);
CREATE INDEX IF NOT EXISTS idx_draws_date ON public.draws(draw_date);
CREATE INDEX IF NOT EXISTS idx_stamp_configs_id_active ON public.stamp_configs(stamp_id, is_active);

-- Enable RLS (Row Level Security)
-- Note: Currently the API uses service_role, but it's good practice to have RLS.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stamp_configs ENABLE ROW LEVEL SECURITY;

-- Simple policies (Can be refined based on requirements)
CREATE POLICY "Public read for configs" ON public.stamp_configs FOR SELECT USING (true);
