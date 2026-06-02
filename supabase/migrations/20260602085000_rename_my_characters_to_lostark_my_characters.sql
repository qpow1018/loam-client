alter table public.my_characters
  rename to lostark_my_characters;

alter table public.lostark_my_characters
  rename constraint my_characters_user_nickname_key
  to lostark_my_characters_user_nickname_key;

alter index if exists public.my_characters_user_id_sort_order_idx
  rename to lostark_my_characters_user_id_sort_order_idx;

alter trigger set_my_characters_updated_at
  on public.lostark_my_characters
  rename to set_lostark_my_characters_updated_at;

alter policy "Users can view their own characters"
  on public.lostark_my_characters
  rename to "Users can view their own Lost Ark characters";

alter policy "Users can insert their own characters"
  on public.lostark_my_characters
  rename to "Users can insert their own Lost Ark characters";

alter policy "Users can update their own characters"
  on public.lostark_my_characters
  rename to "Users can update their own Lost Ark characters";

alter policy "Users can delete their own characters"
  on public.lostark_my_characters
  rename to "Users can delete their own Lost Ark characters";
