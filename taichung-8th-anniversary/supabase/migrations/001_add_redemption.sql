-- Migration: Add coupon redemption tracking to draws table
ALTER TABLE public.draws ADD COLUMN IF NOT EXISTS is_used   BOOLEAN     DEFAULT FALSE;
ALTER TABLE public.draws ADD COLUMN IF NOT EXISTS used_at   TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.draws ADD COLUMN IF NOT EXISTS used_by   TEXT        DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_draws_is_used ON public.draws(is_used);
