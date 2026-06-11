create table if not exists public.maplestory_my_characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null,
  class_name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint maplestory_my_characters_user_nickname_key unique (user_id, nickname)
);

create index if not exists maplestory_my_characters_user_id_sort_order_idx
  on public.maplestory_my_characters (user_id, sort_order);

drop trigger if exists set_maplestory_my_characters_updated_at
  on public.maplestory_my_characters;

create trigger set_maplestory_my_characters_updated_at
  before update on public.maplestory_my_characters
  for each row
  execute function public.set_updated_at();

grant select, insert, update, delete
  on public.maplestory_my_characters
  to authenticated;

alter table public.maplestory_my_characters enable row level security;

create policy "Users can view their own MapleStory characters"
  on public.maplestory_my_characters
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own MapleStory characters"
  on public.maplestory_my_characters
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own MapleStory characters"
  on public.maplestory_my_characters
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own MapleStory characters"
  on public.maplestory_my_characters
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
