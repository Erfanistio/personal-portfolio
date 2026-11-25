import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAdminSession } from "@/lib/auth/session";
import { supabaseEnv } from "@/lib/supabase/config";
import { seedProjects } from "@/content/projects";

export async function GET() {
  if (!supabaseEnv().adminConfigured) {
    return NextResponse.json({
      projects: seedProjects,
      source: "seed",
      configured: false,
    });
  }

  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({
      projects: seedProjects,
      source: "seed",
      configured: false,
      error: "Add SUPABASE_SERVICE_ROLE_KEY to manage projects.",
    });
  }

  const { data, error } = await admin
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    projects: data ?? [],
    source: "database",
    configured: true,
  });
}

export async function POST(request: Request) {
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

    const { data, error } = await admin
      .from("projects")
      .insert({
        slug: body.slug,
        title: body.title,
        subtitle: body.subtitle,
        year: body.year,
        role: body.role,
        summary: body.summary,
        description: body.description ?? null,
        tags: typeof body.tags === "string" ? body.tags.split(",").map((s: string) => s.trim()).filter(Boolean) : body.tags ?? [],
        stack: typeof body.stack === "string" ? body.stack.split(",").map((s: string) => s.trim()).filter(Boolean) : body.stack ?? [],
        href: body.href || null,
        repo: body.repo || null,
        image_url: body.image_url || null,
        featured: body.featured ?? true,
        published: body.published ?? true,
        sort_order: body.sort_order ?? 0,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ project: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
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

    const { data, error } = await admin
      .from("projects")
      .update({
        slug: body.slug,
        title: body.title,
        subtitle: body.subtitle,
        year: body.year,
        role: body.role,
        summary: body.summary,
        description: body.description ?? null,
        tags: typeof body.tags === "string" ? body.tags.split(",").map((s: string) => s.trim()).filter(Boolean) : body.tags ?? [],
        stack: typeof body.stack === "string" ? body.stack.split(",").map((s: string) => s.trim()).filter(Boolean) : body.stack ?? [],
        href: body.href || null,
        repo: body.repo || null,
        image_url: body.image_url || null,
        featured: body.featured ?? true,
        published: body.published ?? true,
        sort_order: body.sort_order ?? 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ project: data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
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
      .from("projects")
      .update({ published: body.published, updated_at: new Date().toISOString() })
      .eq("id", body.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const admin = createSupabaseAdminClient();
    if (!admin) {
      return NextResponse.json({ error: "Admin client not configured" }, { status: 503 });
    }

    const { error } = await admin.from("projects").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}