alter table public.lostark_main_characters
  add column if not exists sort_order integer;

with ordered_main_characters as (
  select
    id,
    row_number() over (
      partition by user_id
      order by created_at asc, id asc
    ) - 1 as next_sort_order
  from public.lostark_main_characters
)
update public.lostark_main_characters as character
set sort_order = ordered_main_characters.next_sort_order
from ordered_main_characters
where character.id = ordered_main_characters.id;

alter table public.lostark_main_characters
  alter column sort_order set default 0,
  alter column sort_order set not null;

create index if not exists lostark_main_characters_user_id_sort_order_idx
  on public.lostark_main_characters (user_id, sort_order);
