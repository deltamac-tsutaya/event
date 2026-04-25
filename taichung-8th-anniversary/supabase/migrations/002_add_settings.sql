-- App-level settings (key-value)
CREATE TABLE IF NOT EXISTS public.app_settings (
  id         TEXT        PRIMARY KEY,
  value      TEXT        NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default redeem PIN (change via admin panel after creation)
INSERT INTO public.app_settings (id, value)
VALUES ('redeem_pin', '0000')
ON CONFLICT (id) DO NOTHING;
