import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Public Supabase config. The publishable (anon) key is designed to be shipped to clients;
// data access is governed by RLS policies. Env vars override these defaults when present.
const FALLBACK_URL = "https://oremxzbavdsviwjrblna.supabase.co";
const FALLBACK_KEY = "sb_publishable_VxAubqKippCTf6_szg0ISw_-sZc9fiy";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

export const supabaseEnabled = Boolean(url && key);

export const supabase: SupabaseClient | null = supabaseEnabled
  ? createClient(url, key, { auth: { persistSession: false } })
  : null;
