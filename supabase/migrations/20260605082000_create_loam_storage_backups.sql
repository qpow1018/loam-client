create table if not exists public.loam_storage_backups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  schema_version integer not null default 1,
  backed_up_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint loam_storage_backups_user_id_key unique (user_id)
);

drop trigger if exists set_loam_storage_backups_updated_at
  on public.loam_storage_backups;

create trigger set_loam_storage_backups_updated_at
  before update on public.loam_storage_backups
  for each row
  execute function public.set_updated_at();

alter table public.loam_storage_backups enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.loam_storage_backups to authenticated;

create policy "Users can view their own LoaM storage backups"
  on public.loam_storage_backups
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own LoaM storage backups"
  on public.loam_storage_backups
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own LoaM storage backups"
  on public.loam_storage_backups
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own LoaM storage backups"
  on public.loam_storage_backups
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
