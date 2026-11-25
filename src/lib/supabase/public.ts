import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "./config";

/** Anonymous, cookie-free client for public reads that can be cached. */
export function createSupabasePublicClient() {
  const { url, anonKey, configured } = supabaseEnv();
  if (!configured || !url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
