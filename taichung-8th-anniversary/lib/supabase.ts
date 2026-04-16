import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL      ?? "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const svc  = process.env.SUPABASE_SERVICE_ROLE_KEY     ?? "";

// ── Lazy singletons ──────────────────────────────────────────────────────────
// Clients are created on first call, never at module-import time.
// This prevents "supabaseUrl is required" errors during Next.js build
// when env vars are absent (Vercel build-time environment).

let _client: SupabaseClient | null = null;
let _admin:  SupabaseClient | null = null;

/** 前端用（anon key） */
export function getSupabase(): SupabaseClient {
  if (!_client) _client = createClient(url, anon);
  return _client;
}

/** 後端用（service_role key）— 僅限 API Routes */
export function getSupabaseAdmin(): SupabaseClient {
  if (!_admin)
    _admin = createClient(url, svc, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  return _admin;
}

// Named re-exports so existing `import { supabaseAdmin }` in routes keep working
export const supabase      = new Proxy({} as SupabaseClient, { get: (_, p) => getSupabase()[p as keyof SupabaseClient] });
export const supabaseAdmin = new Proxy({} as SupabaseClient, { get: (_, p) => getSupabaseAdmin()[p as keyof SupabaseClient] });
