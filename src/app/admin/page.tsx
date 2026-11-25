"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Database,
  Loader2,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContactRequest, Project } from "@/content/projects";

type ProjectFormState = {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  role: string;
  summary: string;
  description: string;
  tags: string;
  stack: string;
  href: string;
  repo: string;
  image_url: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
};

const emptyForm: ProjectFormState = {
  slug: "",
  title: "",
  subtitle: "",
  year: String(new Date().getFullYear()),
  role: "",
  summary: "",
  description: "",
  tags: "",
  stack: "",
  href: "",
  repo: "",
  image_url: "",
  featured: true,
  published: true,
  sort_order: 0,
};

function formFromProject(project: Project): ProjectFormState {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    subtitle: project.subtitle,
    year: project.year,
    role: project.role,
    summary: project.summary,
    description: project.description ?? "",
    tags: project.tags.join(", "),
    stack: project.stack.join(", "),
    href: project.href ?? "",
    repo: project.repo ?? "",
    image_url: project.image_url ?? "",
    featured: project.featured,
    published: project.published,
    sort_order: project.sort_order,
  };
}

export default function AdminPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [source, setSource] = useState<"database" | "seed">("seed");
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [viewingContact, setViewingContact] = useState<ContactRequest | null>(null);

  async function signOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // The cookie still expires on its own; send the visitor to the form anyway.
    }
    router.replace("/admin/login");
    router.refresh();
  }

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsResponse, contactsResponse] = await Promise.all([
        fetch("/api/admin/projects"),
        fetch("/api/admin/contacts"),
      ]);

      const projectsData = (await projectsResponse.json().catch(() => ({}))) as {
        projects?: Project[];
        source?: "database" | "seed";
        configured?: boolean;
        error?: string;
      };
      const contactsData = (await contactsResponse.json().catch(() => ({}))) as {
        contacts?: ContactRequest[];
      };

      setConfigured(projectsData.configured ?? projectsResponse.status !== 401);
      setProjects(projectsData.projects ?? []);
      setSource(projectsData.source ?? "seed");
      setContacts(contactsData.contacts ?? []);

      if (!projectsResponse.ok) {
        setError(projectsData.error ?? "Failed to load projects.");
      } else if (projectsData.error) {
        setError(projectsData.error);
      }
    } catch {
      setError("Network error loading admin data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch on mount. The loader owns its own state transitions.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  useEffect(() => {
    if (!viewingContact && !deleting) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setViewingContact(null);
        setDeleting(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewingContact, deleting]);

  function openNew() {
    setForm({ ...emptyForm });
    setFormError(null);
    setEditing("new");
  }

  function openEdit(project: Project) {
    setForm(formFromProject(project));
    setFormError(null);
    setEditing(project.id);
  }

  function closeEditor() {
    setEditing(null);
    setForm({ ...emptyForm });
    setFormError(null);
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const existing = Boolean(form.id);

    setSaving(true);
    setFormError(null);

    try {
      const response = await fetch("/api/admin/projects", {
        method: existing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setFormError(data.error ?? "Save failed.");
        return;
      }

      closeEditor();
      await load();
    } catch {
      setFormError("Network error. The project was not saved.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(id: string) {
    setDeleting(null);
    try {
      const response = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Delete failed.");
        return;
      }
      await load();
    } catch {
      setError("Network error. The project was not deleted.");
    }
  }

  async function togglePublish(id: string, published: boolean) {
    try {
      const response = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, published }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Could not update the project.");
        return;
      }
      await load();
    } catch {
      setError("Network error. The project was not updated.");
    }
  }

  async function archiveContact(id: string) {
    try {
      const response = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "archived" }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Could not archive the message.");
        return;
      }
      setContacts((current) => current.filter((contact) => contact.id !== id));
      setViewingContact(null);
    } catch {
      setError("Network error. The message was not archived.");
    }
  }

  if (editing) {
    return (
      <main className="flex min-h-svh flex-col gap-8 px-6 py-16 md:px-10">
        <header className="flex flex-wrap items-center justify-between gap-6 border-b border-[var(--line)] pb-6">
          <div>
            <button
              type="button"
              onClick={closeEditor}
              className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-ivory"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <h1 className="display-md mt-2">
              {form.id ? "Edit project" : "New project"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={closeEditor} className="btn btn-quiet">
              Cancel
            </button>
            <button
              type="submit"
              form="project-form"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  Saving
                  <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                </>
              ) : form.id ? (
                "Save changes"
              ) : (
                "Create project"
              )}
            </button>
          </div>
        </header>

        <form
          id="project-form"
          onSubmit={submitForm}
          className="flex w-full max-w-3xl flex-1 flex-col gap-5"
        >
          {formError && (
            <p
              role="alert"
              className="rounded-xl border border-[rgba(255,71,151,0.4)] bg-[rgba(255,71,151,0.08)] px-4 py-3 text-sm text-[#ff9bc3]"
            >
              {formError}
            </p>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="slug">Slug *</label>
              <input
                id="slug"
                required
                value={form.slug}
                onChange={(event) => setForm({ ...form, slug: event.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                required
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="subtitle">Subtitle *</label>
              <input
                id="subtitle"
                required
                value={form.subtitle}
                onChange={(event) => setForm({ ...form, subtitle: event.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="year">Year *</label>
              <input
                id="year"
                required
                value={form.year}
                onChange={(event) => setForm({ ...form, year: event.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="role">Role *</label>
              <input
                id="role"
                required
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="sort_order">Sort order</label>
              <input
                id="sort_order"
                type="number"
                value={form.sort_order}
                onChange={(event) =>
                  setForm({ ...form, sort_order: Number(event.target.value) })
                }
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="summary">Summary *</label>
            <textarea
              id="summary"
              required
              rows={3}
              value={form.summary}
              onChange={(event) => setForm({ ...form, summary: event.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="description">Description (Markdown)</label>
            <textarea
              id="description"
              rows={6}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                id="tags"
                value={form.tags}
                onChange={(event) => setForm({ ...form, tags: event.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="stack">Stack (comma separated)</label>
              <input
                id="stack"
                value={form.stack}
                onChange={(event) => setForm({ ...form, stack: event.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="href">Live URL</label>
              <input
                id="href"
                type="url"
                value={form.href}
                onChange={(event) => setForm({ ...form, href: event.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="repo">Repo URL</label>
              <input
                id="repo"
                type="url"
                value={form.repo}
                onChange={(event) => setForm({ ...form, repo: event.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="image_url">Image URL</label>
            <input
              id="image_url"
              type="url"
              value={form.image_url}
              onChange={(event) => setForm({ ...form, image_url: event.target.value })}
            />
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => setForm({ ...form, featured: event.target.checked })}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(event) => setForm({ ...form, published: event.target.checked })}
              />
              Published
            </label>
          </div>
        </form>
      </main>
    );
  }

  if (!loading && !configured) {
    return (
      <main className="shell flex min-h-svh flex-col justify-center py-20">
        <div className="max-w-3xl">
          <p className="mono-label">Admin setup</p>
          <h1 className="display-lg mt-4">Connect Supabase to start editing.</h1>
          <p className="body-lg mt-5 max-w-xl">
            The site is running on seed projects, so nothing is broken. Add the
            environment variables below in Vercel, run the schema in Supabase, then
            reload this page.
          </p>

          <ol className="mt-10 grid gap-4">
            {[
              {
                title: "Create a Supabase project",
                detail:
                  "Copy the project URL, the anon key and the service role key from Project Settings, API.",
              },
              {
                title: "Add the environment variables",
                detail:
                  "NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SITE_URL.",
              },
              {
                title: "Run supabase/schema.sql",
                detail:
                  "It creates the projects and contact_requests tables, row level security, and the media bucket.",
              },
              {
                title: "Set the admin login",
                detail:
                  "Add ADMIN_EMAIL and ADMIN_PASSWORD, then sign in at /admin/login.",
              },
            ].map((step, index) => (
              <li key={step.title} className="card flex gap-4 p-5">
                <span className="mono-label mt-0.5">0{index + 1}</span>
                <div>
                  <h2 className="font-display text-lg tracking-tight">{step.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/" className="btn btn-primary">
              Back to the site
              <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
            </Link>
            <a href="/admin/login" className="btn btn-ghost">
              Try the login screen
            </a>
          </div>

          <div className="mt-14 border-t border-[var(--line)] pt-6">
            <div className="flex items-center gap-2">
              <Database size={15} className="text-violet" aria-hidden="true" />
              <p className="mono-label">Seed projects on the live site</p>
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {projects.map((project) => (
                <li key={project.id} className="text-sm text-ivory/75">
                  <span className="text-muted">{project.year}</span>{" "}
                  {project.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-svh flex-col gap-8 px-6 py-16 md:px-10">
      <header className="flex flex-wrap items-center justify-between gap-6 border-b border-[var(--line)] pb-6">
        <div>
          <p className="mono-label">Admin panel</p>
          <h1 className="display-lg mt-2">Projects and contacts</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {source === "seed" && (
            <span className="tag border-violet/50 text-violet">Seed data</span>
          )}
          <Link href="/" className="btn btn-quiet">
            View site
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
          <button type="button" onClick={signOut} className="btn btn-quiet">
            Sign out
            <LogOut size={14} aria-hidden="true" />
          </button>
          <button type="button" onClick={openNew} className="btn btn-primary">
            <Plus size={16} aria-hidden="true" /> New project
          </button>
        </div>
      </header>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-[rgba(255,71,151,0.4)] bg-[rgba(255,71,151,0.08)] px-4 py-3 text-sm text-[#ff9bc3]"
        >
          {error}
        </p>
      )}

      <div className="grid flex-1 gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)]">
        <section aria-labelledby="projects-heading">
          <h2 id="projects-heading" className="mb-4 font-display text-xl tracking-tight">
            Projects
          </h2>

          {loading ? (
            <div className="card flex h-64 items-center justify-center">
              <Loader2 size={24} className="animate-spin text-violet" aria-hidden="true" />
            </div>
          ) : (
            <ul className="space-y-3">
              {projects.map((project) => (
                <li key={project.id} className="card flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-3">
                      <h3 className="truncate font-display text-lg tracking-tight">
                        {project.title}
                      </h3>
                      <span className="tag">{project.year}</span>
                      {project.featured && (
                        <span className="tag border-violet/50 text-violet">Featured</span>
                      )}
                      {!project.published && (
                        <span className="tag border-muted/50 text-muted">Draft</span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-sm text-muted">{project.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => togglePublish(project.id, !project.published)}
                      className="rounded-lg p-2 transition-colors hover:bg-[rgba(243,241,234,0.06)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
                      aria-label={project.published ? "Unpublish project" : "Publish project"}
                    >
                      {project.published ? (
                        <Check size={16} className="text-violet" aria-hidden="true" />
                      ) : (
                        <Check size={16} className="text-muted" aria-hidden="true" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(project)}
                      className="rounded-lg p-2 transition-colors hover:bg-[rgba(243,241,234,0.06)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
                      aria-label={`Edit ${project.title}`}
                    >
                      <Pencil size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(project.id)}
                      className="rounded-lg p-2 transition-colors hover:bg-[rgba(255,71,151,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta"
                      aria-label={`Delete ${project.title}`}
                    >
                      <Trash2 size={16} className="text-[rgba(255,71,151,0.75)]" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
              {projects.length === 0 && (
                <li className="card p-8 text-center text-muted">
                  No projects yet. Create one to start.
                </li>
              )}
            </ul>
          )}
        </section>

        <section aria-labelledby="contacts-heading">
          <h2 id="contacts-heading" className="mb-4 font-display text-xl tracking-tight">
            Contact requests
          </h2>

          {loading ? (
            <div className="card flex h-64 items-center justify-center">
              <Loader2 size={24} className="animate-spin text-violet" aria-hidden="true" />
            </div>
          ) : (
            <ul className="space-y-3">
              {contacts.map((contact) => (
                <li key={contact.id} className="card p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-3">
                        <h3 className="truncate font-display text-lg tracking-tight">
                          {contact.name}
                        </h3>
                        <span className="tag">{contact.status}</span>
                        <span className="mono-label">
                          {new Date(contact.created_at).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm text-muted">{contact.email}</p>
                      {contact.company && (
                        <p className="mt-1 text-xs text-muted/80">{contact.company}</p>
                      )}
                      {contact.budget && (
                        <p className="mt-1 text-xs text-muted/80">Budget: {contact.budget}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewingContact(contact)}
                      className="rounded-lg p-2 transition-colors hover:bg-[rgba(243,241,234,0.06)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet"
                      aria-label={`Read the message from ${contact.name}`}
                    >
                      <Mail size={16} aria-hidden="true" />
                    </button>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-ivory/70">{contact.message}</p>
                </li>
              ))}
              {contacts.length === 0 && (
                <li className="card p-8 text-center text-muted">
                  No contact requests yet. New messages appear here.
                </li>
              )}
            </ul>
          )}
        </section>
      </div>

      {viewingContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/85 p-4 backdrop-blur"
          role="presentation"
          onClick={() => setViewingContact(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-dialog-title"
            className="card max-h-[80vh] w-full max-w-2xl overflow-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-[var(--line)] p-5">
              <h3 id="contact-dialog-title" className="font-display text-lg">
                Message from {viewingContact.name}
              </h3>
              <button
                type="button"
                onClick={() => setViewingContact(null)}
                className="rounded-lg p-2 hover:bg-[rgba(243,241,234,0.06)]"
                aria-label="Close message"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>
            <div className="space-y-3 p-5">
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
                <dt className="text-muted">Email</dt>
                <dd>
                  <a href={`mailto:${viewingContact.email}`} className="link-line">
                    {viewingContact.email}
                  </a>
                </dd>
                {viewingContact.company && (
                  <>
                    <dt className="text-muted">Company</dt>
                    <dd>{viewingContact.company}</dd>
                  </>
                )}
                {viewingContact.budget && (
                  <>
                    <dt className="text-muted">Budget</dt>
                    <dd>{viewingContact.budget}</dd>
                  </>
                )}
                <dt className="text-muted">Received</dt>
                <dd>{new Date(viewingContact.created_at).toLocaleString("en-GB")}</dd>
                <dt className="text-muted">Source</dt>
                <dd className="mono-label">{viewingContact.source}</dd>
              </dl>
              <div className="border-t border-[var(--line)] pt-4">
                <p className="mono-label mb-2">Message</p>
                <p className="whitespace-pre-wrap">{viewingContact.message}</p>
              </div>
              {viewingContact.status !== "archived" && (
                <button
                  type="button"
                  onClick={() => archiveContact(viewingContact.id)}
                  className="btn btn-quiet mt-4 self-start"
                >
                  Archive
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/85 p-4 backdrop-blur"
          role="presentation"
          onClick={() => setDeleting(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="card w-full max-w-md p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="delete-dialog-title" className="mb-2 font-display text-lg">
              Delete project?
            </h3>
            <p className="mb-5 text-sm text-muted">This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setDeleting(null)} className="btn btn-ghost">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteProject(deleting)}
                className={cn("btn bg-magenta text-obsidian hover:bg-[#ff6aa9]")}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
