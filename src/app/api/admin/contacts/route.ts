import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAdminSession } from "@/lib/auth/session";
import { supabaseEnv } from "@/lib/supabase/config";

export async function GET() {
  if (!supabaseEnv().adminConfigured) {
    return NextResponse.json({ contacts: [], configured: false });
  }

  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ contacts: [], configured: false });
  }

  const { data, error } = await admin
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ contacts: data ?? [] });
}

export async function PATCH(request: Request) {
  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const admin = createSupabaseAdminClient();
    if (!admin) {
      return NextResponse.json({ error: "Admin client not configured" }, { status: 503 });
    }

    const { error } = await admin
      .from("contact_requests")
      .update({ status: body.status })
      .eq("id", body.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}