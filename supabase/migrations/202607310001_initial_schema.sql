create extension if not exists pgcrypto;

create table if not exists public.quote_enquiries (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  postcode text not null,
  interest text not null,
  message text,
  source text not null default 'website',
  status text not null default 'new'
    check (status in ('new', 'contacted', 'quoted', 'won', 'lost', 'spam')),
  created_at timestamptz not null default now()
);

create index if not exists quote_enquiries_created_at_idx
  on public.quote_enquiries (created_at desc);

alter table public.quote_enquiries enable row level security;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  suburb text not null,
  postcode text,
  project_type text not null
    check (project_type in ('residential', 'commercial', 'battery')),
  system_size_kw numeric(8,2),
  completed_year integer,
  latitude numeric(10,7),
  longitude numeric(10,7),
  location_precision text not null default 'suburb'
    check (location_precision in ('suburb', 'approximate', 'exact')),
  summary text,
  image_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "Published projects are publicly readable"
  on public.projects
  for select
  to anon, authenticated
  using (is_published = true);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  customer_name text,
  suburb text,
  rating smallint not null check (rating between 1 and 5),
  review_text text not null,
  source text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Published reviews are publicly readable"
  on public.reviews
  for select
  to anon, authenticated
  using (is_published = true);
