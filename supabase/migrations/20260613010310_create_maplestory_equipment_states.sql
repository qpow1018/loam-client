create table if not exists public.maplestory_equipment_states (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.maplestory_my_characters(id) on delete cascade,
  slot_key text not null,
  item_name text,
  bonus_option text,
  starforce text,
  scroll text,
  potential text,
  additional_potential text,
  extra text,
  goal text,
  purchase_price text,
  is_highlighted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint maplestory_equipment_states_character_slot_key
    unique (character_id, slot_key)
);

create index if not exists maplestory_equipment_states_character_id_idx
  on public.maplestory_equipment_states (character_id);

drop trigger if exists set_maplestory_equipment_states_updated_at
  on public.maplestory_equipment_states;

create trigger set_maplestory_equipment_states_updated_at
  before update on public.maplestory_equipment_states
  for each row
  execute function public.set_updated_at();

grant select, insert, update, delete
  on public.maplestory_equipment_states
  to authenticated;

alter table public.maplestory_equipment_states enable row level security;

create policy "Users can view their own MapleStory equipment states"
  on public.maplestory_equipment_states
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.maplestory_my_characters
      where maplestory_my_characters.id = maplestory_equipment_states.character_id
        and maplestory_my_characters.user_id = (select auth.uid())
    )
  );

create policy "Users can insert their own MapleStory equipment states"
  on public.maplestory_equipment_states
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.maplestory_my_characters
      where maplestory_my_characters.id = maplestory_equipment_states.character_id
        and maplestory_my_characters.user_id = (select auth.uid())
    )
  );

create policy "Users can update their own MapleStory equipment states"
  on public.maplestory_equipment_states
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.maplestory_my_characters
      where maplestory_my_characters.id = maplestory_equipment_states.character_id
        and maplestory_my_characters.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.maplestory_my_characters
      where maplestory_my_characters.id = maplestory_equipment_states.character_id
        and maplestory_my_characters.user_id = (select auth.uid())
    )
  );

create policy "Users can delete their own MapleStory equipment states"
  on public.maplestory_equipment_states
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.maplestory_my_characters
      where maplestory_my_characters.id = maplestory_equipment_states.character_id
        and maplestory_my_characters.user_id = (select auth.uid())
    )
  );
