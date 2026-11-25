-- Supabase schema for the personal portfolio
-- Run this in the Supabase SQL Editor after creating a project.
-- The app works without Supabase; this enables persistence and the admin panel.

-- Enable the uuid extension
create extension if not exists "uuid-ossp";

-- Projects table
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  subtitle text not null,
  year text not null,
  role text not null,
  summary text not null,
  description text,
  tags text[] default '{}',
  stack text[] default '{}',
  href text,
  repo text,
  image_url text,
  featured boolean default true,
  published boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_projects_published on public.projects (published);
create index if not exists idx_projects_featured on public.projects (featured);
create index if not exists idx_projects_sort on public.projects (sort_order);

-- Contact requests table
create table if not exists public.contact_requests (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  company text,
  budget text,
  message text not null,
  status text default 'new' check (status in ('new', 'read', 'archived')),
  source text default 'portfolio',
  created_at timestamptz default now()
);

create index if not exists idx_contacts_status on public.contact_requests (status);
create index if not exists idx_contacts_created on public.contact_requests (created_at desc);

-- Enable Row Level Security
alter table public.projects enable row level security;
alter table public.contact_requests enable row level security;

-- Public read access for published projects
create policy "Public read published projects"
  on public.projects
  for select
  using (published = true);

-- Admin full access (service role bypasses RLS, but this allows authenticated admin users)
create policy "Admin full access projects"
  on public.projects
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Contact requests: only admins can read/write
create policy "Admin full access contacts"
  on public.contact_requests
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Storage bucket for project images
insert into storage.buckets (id, name, public) values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Public read for project images
create policy "Public read project images"
  on storage.objects
  for select
  using (bucket_id = 'project-images');

-- Admin write for project images
create policy "Admin write project images"
  on storage.objects
  for all
  using (bucket_id = 'project-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'project-images' and auth.role() = 'authenticated');