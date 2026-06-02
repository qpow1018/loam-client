create table if not exists public.main_character_specs (
  id uuid primary key default gen_random_uuid(),
  anonymous_client_id text not null,
  user_id uuid null references auth.users(id) on delete set null,
  character_name text not null,
  server_name text null,
  character_class text null,
  item_level text null,
  summary jsonb not null default '{}'::jsonb,
  raw_payload jsonb not null default '{}'::jsonb,
  section_status jsonb not null default '{}'::jsonb,
  saved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint main_character_specs_anonymous_character_key
    unique (anonymous_client_id, character_name)
);

create index if not exists main_character_specs_anonymous_client_id_idx
  on public.main_character_specs (anonymous_client_id);

alter table public.main_character_specs enable row level security;
