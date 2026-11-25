import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "./config";

/** Service-role client. Server only. Never import from a Client Component. */
export function createSupabaseAdminClient() {
  const { url, serviceRoleKey, adminConfigured } = supabaseEnv();
  if (!adminConfigured || !url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
