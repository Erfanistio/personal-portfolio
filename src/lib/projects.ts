import { cacheLife, cacheTag } from "next/cache";
import { seedProjects, type Project } from "@/content/projects";
import { createSupabasePublicClient } from "./supabase/public";
import { createSupabaseAdminClient } from "./supabase/admin";
import { createSupabaseServerClient } from "./supabase/server";

const seedPublished = () => seedProjects.filter((project) => project.published);

/**
 * Published projects for the public site. Cached and tagged so the admin can
 * invalidate it with updateTag("projects"). Falls back to seed data when
 * Supabase is not configured, so a fresh clone still renders a full gallery.
 */
export async function getPublishedProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("projects");

  const supabase = createSupabasePublicClient();
  if (!supabase) return seedPublished();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[projects] public query failed:", error.message);
    return seedPublished();
  }

  return (data ?? []) as Project[];
}

export type AdminProjectsResult = {
  projects: Project[];
  source: "database" | "seed";
  error?: string;
};

/** Every project, published or not. Admin only; callers must verify auth. */
export async function getAdminProjects(): Promise<AdminProjectsResult> {
  const supabase = createSupabaseAdminClient() ?? (await createSupabaseServerClient());
  if (!supabase) {
    return { projects: seedProjects, source: "seed" };
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return { projects: [], source: "database", error: error.message };
  }

  return { projects: (data ?? []) as Project[], source: "database" };
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = createSupabaseAdminClient() ?? (await createSupabaseServerClient());
  if (!supabase) return seedProjects.find((project) => project.id === id) ?? null;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return null;
  return (data as Project | null) ?? null;
}
