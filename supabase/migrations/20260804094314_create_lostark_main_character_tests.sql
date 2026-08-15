create table public.lostark_main_characters_test (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  character_name text not null,
  character_class text not null,
  item_level text not null,
  sort_order integer not null default 0,
  summary jsonb not null default '{}'::jsonb,
  raw_payload jsonb null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lostark_main_characters_test_user_character_name_key
    unique (user_id, character_name)
);

create index lostark_main_characters_test_user_id_sort_order_idx
  on public.lostark_main_characters_test (user_id, sort_order);

create trigger set_lostark_main_characters_test_updated_at
  before update on public.lostark_main_characters_test
  for each row
  execute function public.set_updated_at();

alter table public.lostark_main_characters_test enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete
  on public.lostark_main_characters_test
  to authenticated;

create policy "Users can view their own Lost Ark main character tests"
  on public.lostark_main_characters_test
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own Lost Ark main character tests"
  on public.lostark_main_characters_test
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own Lost Ark main character tests"
  on public.lostark_main_characters_test
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own Lost Ark main character tests"
  on public.lostark_main_characters_test
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
