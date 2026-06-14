insert into public.maplestory_union_characters (
  class_name,
  union_effect,
  link_effect,
  group_key,
  default_sort_order
)
values ('레테', '올스탯 증가', '소환 시 데미지', 'luk', 7)
on conflict (class_name) do update
set
  union_effect = excluded.union_effect,
  link_effect = excluded.link_effect,
  group_key = excluded.group_key,
  default_sort_order = excluded.default_sort_order;
