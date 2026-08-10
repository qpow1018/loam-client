alter table public.lostark_main_characters
  add column if not exists manual_metrics jsonb not null default
    '{"lopecScore": null, "braceletScore": null, "gemConversionLevel": null}'::jsonb;

update public.lostark_main_characters as main_character
set manual_metrics = test_character.manual_metrics
from public.lostark_main_characters_test as test_character
where main_character.user_id = test_character.user_id
  and main_character.character_name = test_character.character_name;

drop table public.lostark_main_characters_test;
