export type SupabaseEnv = {
  url: string | null;
  anonKey: string | null;
  serviceRoleKey: string | null;
  configured: boolean;
  adminConfigured: boolean;
};

/**
 * Supabase is optional. The site must build and render without keys, so every
 * caller checks `configured` before touching the client.
 */
export function supabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || null;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || null;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null;

  return {
    url,
    anonKey,
    serviceRoleKey,
    configured: Boolean(url && anonKey),
    adminConfigured: Boolean(url && serviceRoleKey),
  };
}

export type ContactChannel = "supabase" | "resend" | "formspree" | "none";

export function contactChannel(): ContactChannel {
  const { configured } = supabaseEnv();
  if (configured) return "supabase";
  if (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL) return "resend";
  if (process.env.FORMSPREE_FORM_ID) return "formspree";
  return "none";
}

export function contactIsConfigured() {
  return contactChannel() !== "none";
}
