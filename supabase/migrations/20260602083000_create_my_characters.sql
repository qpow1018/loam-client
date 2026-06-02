create table if not exists public.my_characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null,
  class_name text not null,
  item_level text not null,
  is_main boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint my_characters_user_nickname_key unique (user_id, nickname)
);

create index if not exists my_characters_user_id_sort_order_idx
  on public.my_characters (user_id, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_my_characters_updated_at on public.my_characters;

create trigger set_my_characters_updated_at
  before update on public.my_characters
  for each row
  execute function public.set_updated_at();

alter table public.my_characters enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.my_characters to authenticated;

create policy "Users can view their own characters"
  on public.my_characters
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own characters"
  on public.my_characters
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own characters"
  on public.my_characters
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own characters"
  on public.my_characters
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
