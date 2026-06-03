create table if not exists public.lostark_main_characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  character_name text not null,
  character_class text not null,
  item_level text not null,
  summary jsonb not null default '{}'::jsonb,
  raw_payload jsonb null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lostark_main_characters_user_character_name_key
    unique (user_id, character_name)
);

create index if not exists lostark_main_characters_user_id_idx
  on public.lostark_main_characters (user_id);

drop trigger if exists set_lostark_main_characters_updated_at
  on public.lostark_main_characters;

create trigger set_lostark_main_characters_updated_at
  before update on public.lostark_main_characters
  for each row
  execute function public.set_updated_at();

alter table public.lostark_main_characters enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.lostark_main_characters to authenticated;

create policy "Users can view their own Lost Ark main characters"
  on public.lostark_main_characters
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own Lost Ark main characters"
  on public.lostark_main_characters
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own Lost Ark main characters"
  on public.lostark_main_characters
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own Lost Ark main characters"
  on public.lostark_main_characters
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
