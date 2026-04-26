-- Migration: Daily stamp reset
-- Stamps now reset each day: UNIQUE(user_id, stamp_id, stamp_date)
-- Run once in Supabase SQL editor.

-- 1. Add stamp_date column (nullable to allow backfill)
ALTER TABLE public.stamps ADD COLUMN IF NOT EXISTS stamp_date DATE;

-- 2. Backfill existing rows from collected_at (Taipei timezone)
UPDATE public.stamps
SET stamp_date = (collected_at AT TIME ZONE 'Asia/Taipei')::DATE
WHERE stamp_date IS NULL;

-- 3. Make NOT NULL
ALTER TABLE public.stamps ALTER COLUMN stamp_date SET NOT NULL;
ALTER TABLE public.stamps ALTER COLUMN stamp_date SET DEFAULT CURRENT_DATE;

-- 4. Drop old unique constraint (one stamp per lifetime)
ALTER TABLE public.stamps DROP CONSTRAINT IF EXISTS stamps_user_id_stamp_id_key;

-- 5. Add new constraint (one stamp per day per point)
ALTER TABLE public.stamps ADD CONSTRAINT stamps_user_id_stamp_id_date_key
  UNIQUE(user_id, stamp_id, stamp_date);

-- 6. Index for daily queries
CREATE INDEX IF NOT EXISTS idx_stamps_date ON public.stamps(stamp_date);
